'use strict';

const {
    AmqpQueueBuilder,
    WappalyzerWrapper,
} = require('./libraries');

const {
    configuration,
} = require('./configuration');

const amqp_queue = AmqpQueueBuilder.getInstance(configuration.rabbitmq);

// Rewrite to promize all instead of this promise hell
amqp_queue
    .createOrUseQueue(configuration.queue.worker_queue.name, 5)
    .then((worker_queue) => amqp_queue
        .createOrUseQueue(configuration.queue.result_queue.name)
        .then((result_queue) => {
            // eslint-disable-next-line arrow-body-style
            amqp_queue.consume(worker_queue, (data) => {
                const {
                    website_url,
                } = data;

                console.log('Consuming - ' + data.id + ' url ' + data.website_url);
                return WappalyzerWrapper
                    .initAnalyseDestroyWithTimeout(website_url)
                    .catch((error) => ({
                        error,
                    }))
                    .then((wappalyser_data) => amqp_queue
                        .publish(result_queue, Object.assign(
                            {},
                            data,
                            {
                                wappalyser_data: JSON.stringify(wappalyser_data),
                            }
                        ))
                    );
            });
        }));

/*
wappalyzer_wrapper
    .init()
    .then(() => {
        amqp_queue
            .createOrUseQueue(configuration.queue.worker_queue.name, 10)
            .then((worker_queue) => amqp_queue
                .createOrUseQueue(configuration.queue.result_queue.name)
                .then((result_queue) => {
                    // eslint-disable-next-line arrow-body-style
                    amqp_queue.consume(worker_queue, (data) => {
                        const {
                            website_url,
                        } = data;

                        console.log('Consuming - ' + data.id + ' url ' + data.website_url);
                        return wappalyzer_wrapper
                            .analyse(website_url)
                            .catch((error) => ({
                                error,
                            }))
                            .then((wappalyser_data) => amqp_queue
                                .publish(result_queue, Object.assign(
                                    {},
                                    data,
                                    {
                                        wappalyser_data: JSON.stringify(wappalyser_data),
                                    }
                                ))
                            );
                    });
                }));
    });

*/
