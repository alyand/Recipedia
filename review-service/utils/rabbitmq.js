const amqp = require("amqplib");

let channel;

exports.getChannel = async () => {
    if (channel) return channel;

    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();

    return channel;
}