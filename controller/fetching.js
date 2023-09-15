const db = require("../database/db");

const getDetails = async (req, res) => {
    const customerId  = req.body.c_id;

    try {

        const [checkCustomer] = await db.query(`select customer_name from customers where customer_id = ?`,[customerId])
        if(!checkCustomer.length)
        {
          return res.status(500).send("Customer does not exist")  
        }
        const query = `SELECT prod_quantity, prod_name FROM orders WHERE cust_id = ?`;
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
