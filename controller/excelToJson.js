const fs = require('fs').promises;
const ExcelJS = require('exceljs');


const toJson = async (req, res) => {
  try {
    let data = await fs.readFile(req.file.path);

    var workbook = new ExcelJS.Workbook();

    await workbook.xlsx.load(data);

    let worksheet = workbook.worksheets[0];

    let jsonData = [];
    worksheet.eachRow({ includeEmpty: false }, function(row, rowNumber) {
      let rowJson = {};
      row.eachCell({ includeEmpty: false }, function(cell, colNumber) {
        rowJson[worksheet.getRow(1).getCell(colNumber).value] = cell.value;
      });
      if (rowNumber !== 1) jsonData.push(rowJson);
    });

    res.json(jsonData);
    } 
    catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while processing the file.');
  }
};

module.exports = {toJson}

