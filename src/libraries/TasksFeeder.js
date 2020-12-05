'use strict';

const {
    CsvFile,
} = require('./CsvFile');

class TasksFeeder {

    /**
     * @param {Object} configuration
     * @param {CsvFile} csv_file
     * @returns {TasksFeeder}
     */
    constructor(
        {
            result_file,
            source_file,
            source_file_filter,
        },
        csv_file
    ) {
        this.csv_file = csv_file;

        this.result_file = result_file;
        this.source_file = source_file;
        this.source_file_filter = source_file_filter;
    }

    /**
     * @param {Object} configuration
     * @returns {TasksFeeder}
     */
    static buildInstance(configuration) {
        return new TasksFeeder(
            configuration,
            CsvFile.getInstance()
        );
    }

    /**
     * @param {*} task_callback
     * @return {Primse}
     */
    iterateOverSelectedTasks(task_callback) {
        return this.getIdListFromCrawlerResultFile(this.source_file_filter)
            .then((filter_id_list) => this.feedQueueWithUrls(
                this.source_file,
                filter_id_list,
                task_callback)
            );
    }

    /**
     *
     * @param {*} file
     * @param {*} status_code_filter
     * @return {Primse}
     */
    getIdListFromCrawlerResultFile(file, status_code_filter = '200') {
        const results = [];
        return this.csv_file
            .readLinePerLineCsvFile(
                file,
                (data) => {
                    if (data.status_code === String(status_code_filter)) {
                        results.push(data.id);
                    }
                }
            )
            .then(() => results);
    }

    /**
     *
     * @param {*} file
     * @param {*} include_id_list
     * @param {*} data_callback
     * @return {Primse}
     */
    feedQueueWithUrls(file, include_id_list = [], data_callback) {
        return this.csv_file
            .readLinePerLineCsvFile(
                file,
                (data) => {
                    if (include_id_list.find((item) => item === data.id) !== undefined) {
                        data_callback(data);
                    }
                }
            );
    }

}

TasksFeeder.instance = null;

module.exports = {
    TasksFeeder,
};
