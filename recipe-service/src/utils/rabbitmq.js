const amqp = require('amqplib');

let channel;
let connection;

exports.getChannel = async () => {
  if (channel) return channel;

  try {
    const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

    // Buat koneksi dan simpan (opsional, bisa dipakai untuk close nanti)
    connection = await amqp.connect(RABBITMQ_URL);

    connection.on('error', (err) => {
      console.error('[RabbitMQ] Connection error:', err.message);
    });

    connection.on('close', () => {
      console.warn('[RabbitMQ] Connection closed');
      channel = null;
    });

    channel = await connection.createChannel();

    channel.on('error', (err) => {
      console.error('[RabbitMQ] Channel error:', err.message);
    });

    channel.on('close', () => {
      console.warn('[RabbitMQ] Channel closed');
      channel = null;
    });

    console.log('[RabbitMQ] Channel established');
    return channel;

  } catch (err) {
    console.error('[RabbitMQ] Failed to connect:', err.message);
    throw err;
  }
};
