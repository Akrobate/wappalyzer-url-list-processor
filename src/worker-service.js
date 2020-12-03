var amqp = require('amqplib/callback_api');

const amqp_connection_url = 'amqp://admin:password@192.168.1.11:5672/'

const url_to_process_queue = 'url_to_process';
const processed_result_queue = 'processed_result';

let res_channel = null;

const publishToQueue = (channel, queueName, data) => {
    channel.sendToQueue(queueName, new Buffer.from(JSON.stringify(data)));
}


amqp.connect(amqp_connection_url, function (err, conn) {

    conn.createChannel(function (err, ch) {

        ch.prefetch(500)

        console.log("beffore assert queue")
        ch.assertQueue(url_to_process_queue, {
            durable: false
        });

        console.log("After assert queue")

        ch.consume(
            url_to_process_queue,
            function (data) {
                console.log("Message:", data.content.toString());
                setTimeout(() => {
                    publishToQueue(ch, processed_result_queue, data)
                    ch.ack(data)
                }, 1000)
            }, 
            {
                noAck: false
            }
        );

    });

/*
    conn.createChannel(function (err, channel) {
        res_channel = channel;
        res_channel.prefetch(1)
        res_channel.assertQueue(processed_result_queue, {
            durable: false
        });
        console.log("Channel for to process created...")
    });
*/
});