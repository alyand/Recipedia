const Recipe = require("../models/Recipe");
const { getChannel } = require("../utils/rabbitmq");
const {
  EXCHANGES,
  ROUTING_KEYS,
  QUEUES,
} = require("/app/shared/rabbitmq/events.config.js");

const subscribe = async () => {
  const channel = await getChannel();

  // === 1. Assert exchanges (wajib agar sinkron) ===
  await channel.assertExchange(EXCHANGES.USER_EVENTS, "topic", {
    durable: true,
  });
  await channel.assertExchange(EXCHANGES.REVIEW_EVENTS, "topic", {
    durable: true,
  });

  // === 2. Declare durable queue for recipe-service ===
  const q = await channel.assertQueue(QUEUES.RECIPE_SERVICE, {
    durable: true,
  });

  // === 3. Bind queue ke semua event relevan ===
  const bindings = [
    { exchange: EXCHANGES.USER_EVENTS, key: ROUTING_KEYS.USER_DELETED },
    { exchange: EXCHANGES.REVIEW_EVENTS, key: ROUTING_KEYS.REVIEW_CREATED },
    { exchange: EXCHANGES.REVIEW_EVENTS, key: ROUTING_KEYS.REVIEW_DELETED },
  ];

  for (const { exchange, key } of bindings) {
    await channel.bindQueue(q.queue, exchange, key);
  }

  // === 4. Consume events ===
  channel.consume(q.queue, async (msg) => {
    try {
      const routingKey = msg.fields.routingKey;
      const data = JSON.parse(msg.content.toString());

      console.log(`[recipe-service] Received event: ${routingKey}`, data);

      switch (routingKey) {
        case ROUTING_KEYS.USER_DELETED:
          await Recipe.deleteMany({ userId: data.userId });
          break;

        case ROUTING_KEYS.REVIEW_CREATED:
          await Recipe.findByIdAndUpdate(data.recipeId, {
            $inc: { reviewCount: 1 },
            $set: {
              averageRating: await calculateNewAverageOnCreate(
                data.recipeId,
                data.rating
              ),
            },
          });
          break;

        case ROUTING_KEYS.REVIEW_DELETED:
          await handleReviewDeleted(data.recipeId, data.rating);
          break;
      }

      channel.ack(msg);
    } catch (err) {
      console.error("[recipe-service] Error processing message:", err.message);
      channel.nack(msg, false, false);
    }
  });
};

// === Helpers ===
const handleReviewDeleted = async (recipeId, oldRating) => {
  const recipe = await Recipe.findById(recipeId);
  if (!recipe || recipe.reviewCount <= 1) {
    await Recipe.findByIdAndUpdate(recipeId, {
      averageRating: 0,
      reviewCount: 0,
    });
    return;
  }
  const newReviewCount = recipe.reviewCount - 1;
  const totalRating = recipe.averageRating * recipe.reviewCount;
  const newAvg = (totalRating - oldRating) / newReviewCount;
  await Recipe.findByIdAndUpdate(recipeId, {
    reviewCount: newReviewCount,
    averageRating: Math.round(newAvg * 10) / 10,
  });
};

const calculateNewAverageOnCreate = async (recipeId, newRating) => {
  const recipe = await Recipe.findById(recipeId);
  const totalRating = recipe.averageRating * recipe.reviewCount + newRating;
  const newAvg = totalRating / (recipe.reviewCount + 1);
  return Math.round(newAvg * 10) / 10;
};

module.exports = { subscribe };
