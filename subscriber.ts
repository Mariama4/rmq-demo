import { connect } from 'amqplib';

const run = async () => {
	try {
		const connection = await connect('amqp://localhost');
		const channel = await connection.createChannel();
		await channel.assertExchange('test', 'topic', { durable: true });
		const queue = await channel.assertQueue('my-cool-queue', { durable: true });
		channel.bindQueue(queue.queue, 'test', 'my.command');
		channel.consume(
			queue.queue,
			(message) => {
				if (!message) {
					return;
				}
				console.log(message.content.toString());
			},
			{
				noAck: true,
			}
		);
	} catch (e) {
		console.error(e);
	}
};

run();
