const fs = require("fs");
const path = require("path");
var PizZip = require('pizzip');
var Docxtemplater = require('docxtemplater');

function replaceErrors(key, value) {
    if (value instanceof Error) {
        return Object.getOwnPropertyNames(value).reduce(function (error, key) {
            error[key] = value[key];
            return error;
        }, {});
    }
    return value;
}

function errorHandler(error) {
    console.log(JSON.stringify({ error: error }, replaceErrors));

    if (error.properties && error.properties.errors instanceof Array) {
        const errorMessages = error.properties.errors.map(function (error) {
            return error.properties.explanation;
        }).join("\n");
        // console.log('errorMessages', errorMessages);
    }
    throw error;
}

module.exports = {
    create: (request) => {
        var content = fs.readFileSync(path.resolve(__dirname, './template/' + request.nameTemplate), 'binary');
        var zip = new PizZip(content);
        var doc;

        try {
            doc = new Docxtemplater(zip, { linebreaks: true });

        } catch (error) {
            errorHandler(error);
        }

        doc.setData(request.data);

        try {
            doc.render()
        }
        catch (error) {
            errorHandler(error);
        }

        var buf = doc.getZip().generate({ type: 'nodebuffer' });
        return buf;
    }
}