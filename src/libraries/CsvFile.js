'use strict';

const fs = require('fs');
const csv = require('csv-parser');
const {
    parse,
} = require('json2csv');

class CsvFile {

    /**
     * @returns {Object}
     */
    static getInstance() {
        if (CsvFile.instance === null) {
            CsvFile.instance = new CsvFile();
        }
        return CsvFile.instance;
    }

    /**
     * @param {*} csv_file
     * @param {*} csv_row_callback
     * @returns {Promise<void>}
     */
    readLinePerLineCsvFile(csv_file, csv_row_callback) {
        return new Promise((resolve, reject) => fs
            .createReadStream(csv_file)
            .on('error', (error) => reject(error))
            .pipe(csv())
            .on('data', (data) => csv_row_callback(data))
            .on('error', (error) => reject(error))
            .on('end', () => resolve())
        );
    }

    /**
     * @param {*} file_path
     * @param {*} data
     * @returns {Promise}
     */
    saveJsonToCsvFileResult(file_path, data) {
        const FILE_ENCODING = 'utf8';
        const CSV_OPTIONS = {
            delimiter: ',',
            eol: '\r\n',
        };
        return new Promise((resolve, reject) => {
            if (fs.existsSync(file_path)) {
                const csv_data = parse(data, Object.assign(
                    {
                        header: false,
                    },
                    CSV_OPTIONS
                ));
                fs.appendFile(file_path, `${csv_data}${CSV_OPTIONS.eol}`, FILE_ENCODING, (error) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve();
                });
            } else {
                const csv_data = parse(data, CSV_OPTIONS);
                fs.writeFile(file_path, `${csv_data}${CSV_OPTIONS.eol}`, FILE_ENCODING, (error) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve();
                });
            }
        });
    }
}

CsvFile.instance = null;

module.exports = {
    CsvFile,
};
