const { getChannel } = require('../utils/rabbitmq');
const { EXCHANGES } = require('Recipedia\shared\rabbitmq\events.config.js'); // Pastikan path-nya sesuai

/**
 * Menerbitkan event ke exchange yang sesuai berdasarkan eventName.
 * Pastikan eventName sudah sesuai dengan routing key yang dikonfigurasi.
 */
exports.publishEvent = async (eventName, payload) => {
  const channel = await getChannel();

  // Tentukan exchange berdasarkan prefix routing key
  let exchange;

  if (eventName.startsWith('user.')) {
    exchange = EXCHANGES.USER_EVENTS;
  } else if (eventName.startsWith('review.')) {
    exchange = EXCHANGES.REVIEW_EVENTS;
  } else if (eventName.startsWith('recipe.')) {
    exchange = EXCHANGES.RECIPE_EVENTS;
  } else {
    throw new Error(`Unknown event routing key: ${eventName}`);
  }

  // Assert exchange (durable)
  await channel.assertExchange(exchange, 'topic', { durable: true });

  // Publish
  channel.publish(exchange, eventName, Buffer.from(JSON.stringify(payload)));

  console.log(`[publisher] Published event "${eventName}" to "${exchange}"`, payload);
};
