const amqp = require("amqplib");

let channel;
let connection;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

exports.getChannel = async (retryCount = 0) => {
  if (channel) return channel;

  try {
    const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://rabbitmq:5672";
    connection = await amqp.connect(RABBITMQ_URL);

    connection.on("error", (err) => {
      console.error("[RabbitMQ] Connection error:", err.message);
    });

    connection.on("close", () => {
      console.warn("[RabbitMQ] Connection closed");
      channel = null;
    });

    channel = await connection.createChannel();

    channel.on("error", (err) => {
      console.error("[RabbitMQ] Channel error:", err.message);
    });

    channel.on("close", () => {
      console.warn("[RabbitMQ] Channel closed");
      channel = null;
    });

    console.log("[RabbitMQ] Channel established");
    return channel;
  } catch (err) {
    console.error(
      `[RabbitMQ] Failed to connect (attempt ${retryCount + 1}): ${err.message}`
    );

    if (retryCount >= 10) {
      throw new Error("RabbitMQ connection failed after 10 retries");
    }

    await sleep(3000); // tunggu 3 detik
    return exports.getChannel(retryCount + 1);
  }
};