const { getChannel } = require("../utils/rabbitmq");
const Review = require("../models/Review");
const ReviewVote = require("../models/ReviewVote");
const {
  EXCHANGES,
  ROUTING_KEYS,
  QUEUES
} = require("/app/shared/rabbitmq/events.config.js");

const subscribe = async () => {
  const channel = await getChannel();

  //assert exchanges
  await channel.assertExchange(EXCHANGES.RECIPE_EVENTS, "topic", {
    durable: true,
  });
  await channel.assertExchange(EXCHANGES.USER_EVENTS, "topic", {
    durable: true,
  });

  //buat queue khusus review-service
  const q = await channel.assertQueue(QUEUES.REVIEW_SERVICE, { durable: true });

  //bind routing key yang akan didengarkan
  const bindings = [
    { exchange: EXCHANGES.RECIPE_EVENTS, key: ROUTING_KEYS.RECIPE_DELETED },
    { exchange: EXCHANGES.USER_EVENTS, key: ROUTING_KEYS.USER_DELETED },
  ];

  for (const { exchange, key } of bindings) {
    await channel.bindQueue(q.queue, exchange, key);
  }

  //mulai mendengarkan pesan dari queue
  channel.consume(q.queue, async (msg) => {
    try {
      const routingKey = msg.fields.routingKey;
      const data = JSON.parse(msg.content.toString());

      console.log(`[review-service] Received event: ${routingKey}`, data);

      switch (routingKey) {
        case ROUTING_KEYS.USER_DELETED:
          await Review.updateMany({ userId: data.userId }, { deletedAt: new Date() });
          await ReviewVote.updateMany({ userId: data.userId }, { deletedAt: new Date() });
          break;

        case ROUTING_KEYS.RECIPE_DELETED:
          await Review.updateMany({ recipeId: data.recipeId }, { deletedAt: new Date() });
          break;
      }

      channel.ack(msg);
    } catch (err) {
      console.error("[review-service] Error processing message:", err.message);
      channel.nack(msg, false, false); //buang pesan yang error
    }
  });
};

module.exports = { subscribe };