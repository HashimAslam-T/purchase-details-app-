const db = require("../database/db");
const {fetchSchema} = require('../validate');

const validatefetch = async(req,res,next) =>
{
  try
  {
    const value = req.body;
    const validatedData = await fetchSchema.validateAsync(value);
    console.log(validatedData);
    next();
  }
  catch(err)
  {
    console.error('Validation error:', err.details[0].message);
    res.status(400).send('Validation error:'+ err.details[0].message); 
  }
}

const getDetails = async (req, res) => {
    
    const {customerId}  = req.body;

    try {

        const [checkCustomer] = await db.query(`select customer_name from customers where customer_id = ?`,[customerId])
        if(!checkCustomer.length)
        {
          return res.status(500).send("Customer does not exist")  
        }
        const query = `SELECT prod_quantity, product_name, product_description, product_price FROM orders join productinfo 
                       on orders.cust_id = ? and orders.prod_id = productinfo.product_id`;
        const [result] = await db.query(query, [customerId]);
        if(!result.length)
        {
        return res.send("customer does not have any products")
        }
        res.send(result);
       
    } catch (err) {
       
        res.status(500).send(err.message);
    }
    
};

module.exports = { validatefetch,getDetails };
