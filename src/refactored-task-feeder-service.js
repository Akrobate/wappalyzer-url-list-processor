'use strict';

const {
    AmqpQueueBuilder,
    TasksFeeder,
} = require('./libraries');

const {
    configuration,
} = require('./configuration');

const amqp_queue = AmqpQueueBuilder.getInstance(configuration.rabbitmq);
const task_feeder = TasksFeeder.buildInstance(configuration.files);

amqp_queue
    .createOrUseQueue(configuration.queue.worker_queue.name)
    .then((queue) => task_feeder
        .iterateOverSelectedTasks((data) => {
            amqp_queue.publish(queue, data);
        })
        .then(() => amqp_queue.closeQueue(queue))
    );
