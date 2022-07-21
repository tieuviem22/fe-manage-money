import { Workbook } from 'exceljs';
// import * as fs from 'file-saver';
const fs = require('file-saver');
// const Workbook = require('exceljs');
export const generateExcel = (data: any, header: any, getOption: any, columnsOption: any, fileName: any, sheetName = fileName) => {
  let option = `"${getOption}"`;
  //Create workbook and worksheet
  let workbook = new Workbook();
  let worksheet = workbook.addWorksheet(sheetName); //we using the same

  //Add Header Row
  let headerRow = worksheet.addRow(header);

  // Cell Style : Fill and Border
  headerRow.eachCell((cell: any) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF00B050' },
      bgColor: { argb: 'FF0000FF' }
    };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });
  worksheet.getColumn(1).width = 7;
  worksheet.getColumn(2).width = 20;
  worksheet.getColumn(3).width = 25;
  worksheet.getColumn(4).width = 20;
  worksheet.getColumn(5).width = 25;
  // worksheet.getColumn(3).width = 30;
  data.forEach((d: any) => {
    let row = worksheet.addRow(d);
  });
  data.forEach((element: any, index: any) => {
    worksheet.getCell(columnsOption + (+index + 2)).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: [option]
    };
  });
  //Generate Excel File with given name
  workbook.xlsx.writeBuffer().then((data: any) => {
    let blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    fs.saveAs(blob, fileName);
  });
};