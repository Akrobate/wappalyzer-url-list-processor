'use strict';

const amqp = require('amqplib/callback_api');

class AmqpQueue {

    /**
     * @param {String} config.user
     * @param {String} config.password
     * @param {String} config.vhost
     * @param {String} config.host
     * @param {String} config.port
     */
    constructor(
        {
            user,
            password,
            vhost,
            host,
            port,
        }
    ) {
        this.amqp_connection_url = `amqp://${user}:${password}@${host}:${port}${vhost}`;
        this.connection_handler = null;
    }


    /**
     * @param {String} queue_name
     * @param {String} prefetch_count
     * @returns {Promise<AMQPConnection>}
     */
    createOrUseQueue(queue_name, prefetch_count = 1) {
        return this.getConnection()
            .then((connection) => this
                .createChannel(connection)
                .then((channel) => {
                    channel.prefetch(prefetch_count);
                    channel.assertQueue(queue_name, {
                        durable: false,
                    });
                    return {
                        channel,
                        connection,
                        queue_name,
                    };
                })
            );
    }

    /**
     * @param {Object} queue
     * @returns {Promise<Void>}
     */
    closeQueue({
        channel,
        connection,
    }) {
        return new Promise((resolve) => {
            channel.close();
            // @todo: Should be a separate method
            connection.close();
            this.connection = null;
            return resolve();
        });
    }

    /**
     * @param {*} queue
     * @param {*} data
     * @returns {Promise}
     */
    publish(
        {
            channel,
            queue_name,
        },
        data
    ) {
        return new Promise((resolve) => {
            channel.sendToQueue(
                queue_name,
                // eslint-disable-next-line new-cap
                new Buffer.from(JSON.stringify(data))
            );
            return resolve();
        });
    }


    /**
     * @param {*} queue
     * @param {*} consume_callback
     * @returns {Promise}
     */
    consume(
        {
            channel,
            queue_name,
        },
        consume_callback
    ) {
        channel.consume(
            queue_name,
            (data) => {
                const json_data = JSON.parse(data.content.toString());
                return consume_callback(json_data)
                    .then(() => channel.ack(data));
            },
            {
                noAck: false,
            }
        );
    }

    /**
     * @returns {Promise<AMQPConnection>}
     */
    getConnection() {
        return new Promise((resolve, reject) => {
            if (this.connection_handler) {
                return resolve(this.connection_handler);
            }
            return this
                .connect()
                .then((connection) => {
                    this.connection_handler = connection;
                    return resolve(this.connection_handler);
                })
                .catch(reject);
        });
    }


    /**
     * @returns {Promise<AMQPConnection>}
     */
    connect() {
        return new Promise((resolve, reject) => amqp.connect(
            this.amqp_connection_url,
            (error, connection) => {
                if (error) {
                    return reject(error);
                }
                return resolve(connection);
            })
        );
    }

    /**
     * @param {Object} connection
     * @returns {Promise<AMQPConnection>}
     */
    createChannel(connection) {
        return new Promise((resolve, reject) => connection
            .createChannel(
                (error, channel) => {
                    if (error) {
                        // console.log(error);
                        return reject(error);
                    }
                    return resolve(channel);
                }
            )
        );
    }

}

module.exports = {
    AmqpQueue,
};
