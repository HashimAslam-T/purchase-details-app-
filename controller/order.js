const db = require('../database/db');
const {orderSchema} = require(`../validate`)


const validateOrder = async(req,res,next) =>
{
  try
  {
    const value = req.body;
    const validatedData = await orderSchema.validateAsync(value);
    console.log(validatedData);
    next();
  }
  catch(err)
  {
    console.error('Validation error:', err.details[0].message);
    res.status(400).send('Validation error:'+ err.details[0].message); 
  }
}

//placeorder

const placeOrder = async(req,res) =>{
    
    const{customerId,products} = req.body;
    const productsQuery = await db.query(`select * from productinfo`);
    const allProducts = productsQuery[0];   

    try
    {
       const [customer] =  await db.query(`select customer_id from customers where customer_id = ?`,[customerId]);

       if (!customer.length)
       {
        return res.status(400).send("Invalid Customer Id");
       }

       for (const product of products)
       {
        const productId = product.prodId;
        const productQuantity = product.prodQuantity;

        const findProduct = allProducts.find(obj => obj.product_id === productId);
        if (!findProduct)
        {
           return res.status(500).send(`The given product id ${productId} does not exist`);   
        }
        if( findProduct.product_quantity - productQuantity <=0)
        {
         if(findProduct.product_quantity == 0)
         {
            return res.status(500).send(`The quantity of the given product id ${productId} is nill`);
         }
         else
         {
            return res.status(500).send(`please choose lesser quantity than ${findProduct.product_quantity}  for product_id: ${productId}. `);
         }
        }

       }

       const orders =[];
       const reduceQuantity = [];
       const r = await db.query(`insert into mainorder (order_status,cust_id) values ('order placed',?)`,[customerId]);
       const orderId = r[0].insertId;

       for(const product of products)
       {
        const productId = product.prodId;
        const productQuantity = product.prodQuantity;

        const orderInsert = [orderId,customerId,productId,productQuantity];
        orders.push(orderInsert);

        const subtractQauntity = [productQuantity,productId];
        reduceQuantity.push(subtractQauntity);

       }
       
       await db.query(`insert into orders(ord_id,cust_id,prod_id,
         prod_quantity) values ?`,[orders]);

         let sql = "UPDATE productinfo SET product_quantity = CASE product_id ";
         reduceQuantity.forEach(item => {
           sql += `WHEN ${item[1]} THEN product_quantity - ${item[0]} `;
         });
         sql += "END WHERE product_id IN (";
         reduceQuantity.forEach((item, index) => { 
           sql += `${item[1]}${index < reduceQuantity.length - 1 ? ',' : ''} `;
         });
         sql += ")";

       await db.query(sql);
      
       
       res.send(`Order Placed`);

    }

    catch(err)
    {
        console.error(err);
        res.status(500).send(err.message);
    }
    

};
    
    
module.exports = {validateOrder,placeOrder};   