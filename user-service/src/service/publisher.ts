import amqp from "amqplib";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const {
  EXCHANGES,
  ROUTING_KEYS,
} = require("/app/shared/rabbitmq/events.config.js");

let channel: amqp.Channel | null = null;
let connection;
let USER_EXCHANGE = EXCHANGES.USER_EVENTS;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getChannel = async (retryCount = 0): Promise<amqp.Channel> => {
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

    await channel.assertExchange(USER_EXCHANGE, "topic", {
      durable: true,
    });
    console.log(
      `[RabbitMQ] Channel and exchange "${USER_EXCHANGE}" established`
    );

    return channel;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error(
      `[RabbitMQ] Failed to connect (attempt ${
        retryCount + 1
      }): ${errorMessage}`
    );

    if (retryCount >= 10) {
      throw new Error("RabbitMQ connection failed after 10 retries");
    }

    await sleep(3000);
    return getChannel(retryCount + 1);
  }
};

export const publishMessage = async (
  routingKey: string,
  message: object
): Promise<void> => {
  const ch = await getChannel();

  if (!Object.values(ROUTING_KEYS).includes(routingKey)) {
    console.warn(`[RabbitMQ] Unknown routing key: ${routingKey}`);
  }

  const buffer = Buffer.from(JSON.stringify(message));
  ch.publish(USER_EXCHANGE, routingKey, buffer);
  console.log(
    `[RabbitMQ] Published to "${USER_EXCHANGE}:${routingKey}" →`,
    message
  );
};
