'use strict';

const Wappalyzer = require('wappalyzer');

class WappalyzerWrapper {

    // eslint-disable-next-line require-jsdoc
    static get OPTIONS() {
        return {
            debug: false,
            delay: 500,
            headers: {},
            htmlMaxCols: 2000,
            htmlMaxRows: 2000,
            maxDepth: 3,
            maxUrls: 20,
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
     * @param {String} url
     * @returns {Promise}
     */
    static initAnalyseDestroy(url) {
        let wappalyzer = new Wappalyzer(WappalyzerWrapper.OPTIONS);
        return wappalyzer
            .init()
            .then(() => wappalyzer.open(url, WappalyzerWrapper.HEADERS))
            .then((site) => site.analyze())
            .then((result) => wappalyzer.destroy()
                .then(() => {
                    wappalyzer = null;
                    return result;
                })
            )
            .catch((error) => {
                wappalyzer.destroy()
                    .then(() => {
                        wappalyzer = null;
                    });
                throw error;
            });
    }

    /**
     * @returns {Number}
     */
    static getAutoCalculatedTimeoutMillis() {

        const security_coef = 3;

        const {
            maxWait,
            maxUrls,
            delay,

        } = WappalyzerWrapper.OPTIONS;

        return (maxWait + delay) * maxUrls * security_coef;
    }

    /**
     * @param {String} url
     * @returns {Promise}
     */
    static initAnalyseDestroyWithTimeout(url) {
        let wappalyzer = new Wappalyzer(WappalyzerWrapper.OPTIONS);
        let timeout_handler = null;
        const timeout_milliseconds = WappalyzerWrapper.getAutoCalculatedTimeoutMillis();
        // console.log('timeout_milliseconds', timeout_milliseconds);
        return new Promise((resolve, reject) => {

            timeout_handler = setTimeout(
                () => wappalyzer.destroy()
                    .then(() => {
                        wappalyzer = null;
                        return reject(
                            new Error('Wappalyser Wrapper forced to quit because of too long process')
                        );
                    }),
                timeout_milliseconds
            );

            wappalyzer
                .init()
                .then(() => wappalyzer.open(url, WappalyzerWrapper.HEADERS))
                .then((site) => {
                    site.on('error', (error) => {
                        wappalyzer.destroy()
                            .then(() => {
                                wappalyzer = null;
                            });
                        return reject(error);
                    });
                    return site;
                })
                .then((site) => site.analyze())
                .then((result) => wappalyzer.destroy()
                    .then(() => {
                        wappalyzer = null;
                        return resolve(result);
                    })
                )
                .catch((error) => {
                    wappalyzer.destroy()
                        .then(() => {
                            wappalyzer = null;
                        });
                    return reject(error);
                })
                .finally(() => {
                    clearTimeout(timeout_handler);
                });

        });

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
