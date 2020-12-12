'use strict';

const {
    AmqpQueueBuilder,
    CsvFile,
} = require('./libraries');

const {
    configuration,
} = require('./configuration');

const amqp_queue = AmqpQueueBuilder.getInstance(configuration.rabbitmq);
const csv_file_manager = CsvFile.getInstance();

amqp_queue
    .createOrUseQueue(configuration.queue.result_queue.name, 1)
    .then((results_queue) => {
        // eslint-disable-next-line arrow-body-style
        amqp_queue.consume(results_queue, (data) => {
            console.log('Consuming - ' + data.id + ' url ' + data.website_url);
            // eslint-disable-next-line arrow-body-style
            return csv_file_manager.saveJsonToCsvFileResult(
                configuration.files.result_file,
                data
            );
        });
    });
