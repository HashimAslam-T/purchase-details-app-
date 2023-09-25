const db = require("../database/db");

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

module.exports = { getDetails };
