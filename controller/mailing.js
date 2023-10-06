const db = require('../database/db');
const ExcelJs = require('exceljs');
const nodemailer = require('nodemailer');
const env = require('dotenv');
env.config();

const mailing = async(req,res)=>
{
  try
  {
    const [result] = await db.query(`select customer_name,product_name,product_alternate_name,product_description,prod_quantity,product_price from orders join customers join productinfo on customers.customer_id = orders.cust_id and productinfo.product_id = orders.prod_id ;`);
    console.log(result);
    const workbook = new ExcelJs.Workbook();
    const worksheet = workbook.addWorksheet('sheet 1');

    const headers = Object.keys(result[0]);
    worksheet.addRow(headers);

    result.forEach((row) => {
        const rowData = Object.values(row);
        worksheet.addRow(rowData);
    });

    await workbook.xlsx.writeFile('kk.xlsx')

    const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'hashimaslam.doodleblue@gmail.com',
      pass: process.env.PASS,
    },
  });

  const mailOptions = {
    from: 'hashimaslam.doodleblue@gmail.com',
    to: 'hashimaslam214@gmail.com',
    subject: 'Excel Report',
    text: 'Please find the attached Excel report.',
    attachments: [
      {
        filename: 'kk.xlsx',
        path: "C:\\Users\\User\\Desktop\\nodetask2\\kk.xlsx",
      },
    ],
  };

  await transporter.sendMail(mailOptions);

  console.log('Email sent successfully.');

    res.status(200).send("Mailed successfully");
  }
  catch(err)
  {
    console.error(err);
    res.status(500).send(err.message);
  }
}

module.exports={mailing};