'use strict';

const {
    AmqpQueue,
} = require('./AmqpQueue');

class AmqpQueueBuilder {

    /**
     * @param {Object} configuration
     * @returns {AmqpQueue}
     */
    static buildInstance(configuration) {
        return new AmqpQueue(
            configuration
        );
    }

    /**
     * @param {Object} configuration
     * @returns {AmqpQueue}
     */
    static getInstance(configuration) {
        if (AmqpQueueBuilder.instance === null) {
            AmqpQueueBuilder.instance = AmqpQueueBuilder.buildInstance(configuration);
        }
        return AmqpQueueBuilder.instance;
    }

}

AmqpQueueBuilder.instance = null;

module.exports = {
    AmqpQueueBuilder,
};
