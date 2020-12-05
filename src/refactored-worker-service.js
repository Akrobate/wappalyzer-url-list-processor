'use strict';

const {
    AmqpQueueBuilder,
} = require('./libraries');

const {
    configuration,
} = require('./configuration');

const amqp_queue = AmqpQueueBuilder.getInstance(configuration.rabbitmq);

amqp_queue
    .createOrUseQueue(configuration.queue.worker_queue.name, 1)
    .then((worker_queue) => amqp_queue.createOrUseQueue(configuration.queue.result_queue.name)
        .then((result_queue) => {
            // eslint-disable-next-line arrow-body-style
            amqp_queue.consume(worker_queue, (data) => {
                // console.log(data);
                return amqp_queue.publish(result_queue, data);
            });
        })
    );
