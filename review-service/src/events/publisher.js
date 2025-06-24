const {getChannel} = require("../utils/rabbitmq");
const {EXCHANGES} = require("/app/shared/rabbitmq/events.config.js");

//terbitin event ke exchange 
exports.publishEvent = async (eventName, payload) => {
    const channel= await getChannel();

    let exchange;
    if (eventName.startsWith("user.")) {
        exchange = EXCHANGES.USER_EVENTS;
        } else if (eventName.startsWith("review.")) {
        exchange = EXCHANGES.REVIEW_EVENTS;
        } else if (eventName.startsWith("recipe.")) {
        exchange = EXCHANGES.RECIPE_EVENTS;
        } else {
        throw new Error(`Unknown event routing key: ${eventName}`);
    }

    await channel.assertExchange(exchange, "topic", {durable: true});

    channel.publish(exchange, eventName, Buffer.from(JSON.stringify(payload)));

    console.log(`[Publisher] Event "${eventName}" dikirim ke "${exchange}"`, payload);
};