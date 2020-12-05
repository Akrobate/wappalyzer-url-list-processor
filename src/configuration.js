/* eslint-disable no-process-env */

'use strict';

const configuration = {};
configuration.rabbitmq = {};

configuration.rabbitmq.user = process.env.RABBITMQ_USER || 'admin';
configuration.rabbitmq.password = process.env.RABBITMQ_PASSWORD || 'password';
configuration.rabbitmq.host = process.env.RABBITMQ_HOST || '192.168.1.11';
configuration.rabbitmq.port = process.env.RABBITMQ_PORT || '5672';
configuration.rabbitmq.vhost = process.env.RABBITMQ_VHOST || '/';

configuration.queue = {
    result_queue: {
        name: 'processed_result',
    },
    worker_queue: {
        name: 'url_to_process',
    },
};

configuration.files = {
    result_file: './data/wappalyzer_result.csv',
    source_file: './data/websites_url_list.csv',
    source_file_filter: './data/results.csv',
};

module.exports = {
    configuration,
};
