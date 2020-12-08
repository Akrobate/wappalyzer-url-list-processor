'use strict';

const Wappalyzer = require('wappalyzer');

class WappalyzerWrapper {

    // eslint-disable-next-line require-jsdoc
    static get OPTIONS() {
        return {
            debug: true,
            delay: 500,
            headers: {},
            htmlMaxCols: 2000,
            htmlMaxRows: 2000,
            maxDepth: 3,
            maxUrls: 10,
            maxWait: 5000,
            probe: true,
            recursive: true,
            userAgent: 'Wappalyzer',
        };
    }

    // eslint-disable-next-line require-jsdoc
    static get HEADERS() {
        return {};
    }

    // eslint-disable-next-line require-jsdoc
    constructor() {
        this.wappalyzer_instance = new Wappalyzer(WappalyzerWrapper.OPTIONS);
    }

    /**
     * @returns {WappalyzerWrapper}
     */
    static getInstance() {
        if (WappalyzerWrapper.instance === null) {
            WappalyzerWrapper.instance = new WappalyzerWrapper();
        }
        return WappalyzerWrapper.instance;
    }

    /**
     * @returns {Promise}
     */
    init() {
        return this.wappalyzer_instance.init();
    }

    /**
     * @param {String} url
     * @returns {Promise}
     */
    analyse(url) {
        const site = this.wappalyzer_instance
            .open(url, WappalyzerWrapper.HEADERS);
        // Optionally capture and output errors
        // site.on('error', console.error)
        return site.analyze();
    }

    /**
     * @returns {Promise}
     */
    destroy() {
        return this.wappalyzer_instance.destroy();
    }
}

WappalyzerWrapper.instance = null;

module.exports = {
    WappalyzerWrapper,
};
