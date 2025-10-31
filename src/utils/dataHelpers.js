import XLSX from "tempa-xlsx";
import * as FileSaver from 'file-saver';
var dateFormat = require('dateformat');

const strToArrBuffer = (s) => {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);

    for (var i = 0; i !== s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xFF;
    }

    return buf;
};

const dateToNumber = (v, date1904) => {
    if (date1904) {
        v += 1462;
    }

    var epoch = Date.parse(v);

    return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
};

const excelSheetFromDataSet = (dataSet) => {
    /*
    Assuming the structure of dataset
    {
        xSteps?: number; //How many cells to skips from left
        ySteps?: number; //How many rows to skips from last data
        columns: [array | string]
        data: [array_of_array | string|boolean|number | CellObject]
        fill, font, numFmt, alignment, and border
    }
     */
    if (dataSet === undefined || dataSet.length === 0) {
        return {};
    }

    var ws = {};
    var range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
    var rowCount = 0;

    dataSet.forEach(dataSetItem => {
        var columns = dataSetItem.columns;
        var xSteps = typeof (dataSetItem.xSteps) === 'number' ? dataSetItem.xSteps : 0;
        var ySteps = typeof (dataSetItem.ySteps) === 'number' ? dataSetItem.ySteps : 0;
        var data = dataSetItem.data;
        if (dataSet === undefined || dataSet.length === 0) {
            return;
        }

        rowCount += ySteps;
        var columnsWidth = []
        if (dataSetItem.page === "MSM03") {
            columnsWidth = [{ wpx: 50 }, { wpx: 150 }, { wpx: 150 }, { wpx: 150 }, { wpx: 150 }, { wpx: 150 }, { wpx: 150 }, { wpx: 150 }, { wpx: 150 }, { wpx: 150 }, { wpx: 150 }]
        } else if (dataSetItem.page === "ADM11") {
            let width = [];
            width.push({ wpx: 50 })
            data[4].forEach(element => {
                width.push({ wpx: 200 })
            });
            columnsWidth = width
        }

        // var columnsWidth = []
        if (columns !== null && columns.length >= 0) {
            columns.forEach((col, index) => {
                var cellRef = XLSX.utils.encode_cell({ c: xSteps + index, r: rowCount });
                fixRange(range, 0, 0, rowCount, xSteps, ySteps);
                var colTitle = col;
                if (typeof col === 'object') {
                    //colTitle = col.title; //moved to getHeaderCell
                    columnsWidth.push(col.width || { wpx: 80 }); /* wch (chars), wpx (pixels) - e.g. [{wch:6},{wpx:50}] */
                }
                getHeaderCell(colTitle, cellRef, ws);
            });

            rowCount += 1;
        }

        if (columnsWidth.length > 0) {
            ws['!cols'] = columnsWidth;
            ws['!rows'] = [{ hpt: 300 }];
        }

        for (var R = 0; R !== data.length; ++R, rowCount++) {
            for (var C = 0; C !== data[R].length; ++C) {
                var cellRef = XLSX.utils.encode_cell({ c: C + xSteps, r: rowCount });
                fixRange(range, R, C, rowCount, xSteps, ySteps);
                getCell(data[R][C], cellRef, ws);
            }
        }
        if (dataSetItem.merges !== []) {
            ws["!merges"] = dataSetItem.merges
        }
    });

    if (range.s.c < 10000000) {
        ws['!ref'] = XLSX.utils.encode_range(range);

    }
    return ws;
};

const exportAsExcel = (dataExcel, name, merges) => {
    let filename = name + "_" + dateFormat(new Date().setFullYear(2564), 'yyyymmdd')

    const wb = {
        SheetNames: [filename],
        Sheets: {
            [filename]: excelSheetFromDataSet([{
                columns: null,
                data: dataExcel,
                merges: merges,
                page: name
            }])

        }
    };
    const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
    let data = (new Blob([strToArrBuffer(wbout)], { type: "application/octet-stream" }));
    FileSaver.saveAs(data, filename + "." + 'xlsx');
}

function getHeaderCell(v, cellRef, ws) {
    var cell = {};
    var headerCellStyle = v.style ? v.style : { font: { bold: true } }; //if style is then use it
    cell.v = v.title;
    cell.t = 's';
    cell.s = headerCellStyle;
    ws[cellRef] = cell;
}

function getCell(v, cellRef, ws) {
    //assume v is indeed the value. for other cases (object, date...) it will be overriden.
    var cell = { v };
    if (v === null) {
        return;
    }


    var isDate = (v instanceof Date);
    if (!isDate && (typeof v === 'object')) {
        cell.s = v.style;
        cell.v = v.value;
        v = v.value;
    }

    if (typeof v === 'number') {
        cell.t = 'n';
    } else if (typeof v === 'boolean') {
        cell.t = 'b';
    } else if (isDate) {
        cell.t = 'n';
        cell.z = XLSX.SSF._table[14];
        cell.v = dateToNumber(cell.v);
    } else {
        cell.t = 's';
    }
    ws[cellRef] = cell;
}

function fixRange(range, R, C, rowCount, xSteps, ySteps) {
    if (range.s.r > R + rowCount) {
        range.s.r = R + rowCount;
    }

    if (range.s.c > C + xSteps) {
        range.s.c = C + xSteps;
    }

    if (range.e.r < R + rowCount) {
        range.e.r = R + rowCount;
    }

    if (range.e.c < C + xSteps) {
        range.e.c = C + xSteps;
    }
}

let setBorder = {
    "left": {
        "style": "thin",
        "color": {
            "auto": 1
        }
    },
    "right": {
        "style": "thin",
        "color": {
            "auto": 1
        }
    },
    "top": {
        "style": "thin",
        "color": {
            "auto": 1
        }
    },
    "bottom": {
        "style": "thin",
        "color": {
            "auto": 1
        }
    }
};
const styleTextHeaders = {
    fill: {
        fgColor: { rgb: "ffffff" }
    },
    font: { bold: true, name: 'TH SarabunPSK', sz: '20' },
    alignment: {
        horizontal: "center", vertical: "center", wrapText: true
    },
    border: setBorder,
};
const styleHeaders = {
    fill: {
        fgColor: { rgb: "c7c7c7" }
    },
    font: { bold: true, name: 'TH SarabunPSK', sz: '16' },
    alignment: {
        horizontal: "center", vertical: "center", wrapText: true
    },
    border: setBorder,

};
const text_Default = {
    fill: {
        fgColor: { rgb: "ffffff" }
    },
    border: setBorder,
    alignment: {
        vertical: "center", wrapText: true
    },
    font: { name: 'TH SarabunPSK', sz: '16' },

};
const text_Center = {
    fill: {
        fgColor: { rgb: "ffffff" }
    },
    border: setBorder,
    alignment: {
        horizontal: "center", vertical: "center", wrapText: true
    },
    font: { name: 'TH SarabunPSK', sz: '16' },
};
const text_Right = {
    fill: {
        fgColor: { rgb: "ffffff" }
    },
    border: setBorder,
    alignment: {
        horizontal: "right", vertical: "center", wrapText: true
    },
    font: { name: 'TH SarabunPSK', sz: '16' },
};

export { strToArrBuffer, dateToNumber, excelSheetFromDataSet, exportAsExcel, styleTextHeaders, styleHeaders, text_Default, text_Center, text_Right };