const XlsxPopulate = require('xlsx-populate');
const path = require("path");

let valueStyle = {
    "border": true,
    "fontSize": 16,
    "fontFamily": 'TH SarabunPSK',
}

/*
EXAMPLLE
{
    "nameTemplate": "ReportMediationAndConciliation",
    "namefileExport": "PRS",
    "list": [
        {
            "headCell": ["A", 1, txtHead],
            "dateCell": ["A", 4, txtDate],
            "bodyCell": ["A", 4, ["F", "setColor", 3,"ท.อาวุโส"]],
            "sumCell" : [true, "B", textSum],
            "footerCell" : [true, "B", textfooter],
            "sheetName": "รายงาน",
            "data": dataTable
        }
    ]
}
*/

module.exports = {
    create: async (req) => {
        // console.log(`req`, req)
        let workbook = null;
        let out_put_file = path.resolve(__dirname, './temp/' + req.fileName); //DEV
        // let out_put_file = req.destPath; //PRO
        try {
            //READ FILE
            let checkSheets = false
            workbook = await XlsxPopulate.fromFileAsync(path.resolve(__dirname, './template/' + req.nameTemplate + ".xlsx"));
            if (workbook) {
                let indexSheet = 0;
                req.list.forEach(list => {

                    if (workbook.sheet(list.sheetName) === undefined) {
                        workbook.sheet(indexSheet).name(list.sheetName);
                        checkSheets = true;
                    }

                    // *****HEADER
                    workbook.sheet(list.sheetName).cell(`${list.headCell[0]}${list.headCell[1]}`).value(list.headCell[2]);

                    // *****DATE
                    if (list.dateCell !== false) {
                        workbook.sheet(list.sheetName).cell(`${list.dateCell[0]}${list.dateCell[1]}`).value(list.dateCell[2]);
                    }

                    if (list.data.length > 0) {
                        // *****BODY
                        let row = 0;
                        for (const [key, value] of Object.entries(list.data)) {
                            let arr = [];
                            for (const property in value) {
                                if (value[property] !== null && value[property] !== 'null') {
                                    arr.push(value[property]);
                                }
                            }

                            // CHECK if STYLES
                            if (typeof list.bodyCell[2] === "object") {
                                valueStyle = checkRowfontColor(list, arr)
                            }
                            workbook.sheet(list.sheetName).cell(`${list.bodyCell[0]}${row + list.bodyCell[1]}`).value([arr]).style(valueStyle);
                            row++;
                        }

                        // *****SUM
                        if (list.sumCell !== undefined && list.sumCell[0]) {
                            row = row + list.bodyCell[1];
                            workbook.sheet(list.sheetName).cell(`${list.sumCell[1]}${row}`).value(list.sumCell[2]).style(valueStyle);
                        }

                        // *****FOOTER
                        if (list.footerCell !== undefined && list.footerCell[0]) {
                            let stylesFooter = {
                                "border": false,
                                "fontSize": 15,
                                "fontFamily": 'TH SarabunPSK',
                                "horizontalAlignment": 'center'
                            }
                            row = row + list.bodyCell[1] + 1;
                            if (typeof list.footerCell[2] === "object") {
                                list.footerCell[2].forEach(element => {
                                    workbook.sheet(list.sheetName).cell(`${list.footerCell[1]}${row}`).value(element).style(stylesFooter);
                                    row++
                                });
                            } else {
                                workbook.sheet(list.sheetName).cell(`${list.footerCell[1]}${row}`).value(list.footerCell[2]).style(stylesFooter);
                            }

                            if (list.footerCell2 !== undefined && list.footerCell2[0]) {
                                let stylesFooter2 = {
                                    "border": false,
                                    "fontSize": 15,
                                    "fontFamily": 'TH SarabunPSK',
                                    "horizontalAlignment": "left",
                                    "wrapText": true
                                }
                                row = row + 1;
                                if (typeof list.footerCell2[2] === "object") {
                                    list.footerCell2[2].forEach(element => {
                                        workbook.sheet(list.sheetName).cell(`${list.footerCell2[1]}${row}`).value(element).style(stylesFooter2);
                                        row++
                                    });
                                } else {
                                    workbook.sheet(list.sheetName).range(`${list.footerCell2[1]}${row}:D${row}`).merged(true).value(list.footerCell2[2]).style(stylesFooter2);
                                    workbook.sheet(list.sheetName).row(row).height(100);
                                }
                            }
                        }

                    }
                    indexSheet++;
                });

                //! REMOVE SHEET
                if (checkSheets) {
                    indexSheet++
                    for (let index = indexSheet; index <= 10; index++) {
                        workbook.deleteSheet(`temp (${index})`);
                    }
                }
            }
            // EXPORT
            await workbook.toFileAsync(out_put_file);
        } catch (error) {
            console.error(error);
        }
        return out_put_file;
    },
}

function checkRowfontColor(list, arr) {
    if (list.bodyCell[2][0] === "setColor_row" && arr[list.bodyCell[2][2]] === list.bodyCell[2][3]) {
        return {
            ...valueStyle,
            fontColor: list.bodyCell[2][1]
        }
    } else {
        return {
            "border": true,
            "fontSize": 16,
            "fontFamily": 'TH SarabunPSK',
        }
    }
}