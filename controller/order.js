const db = require('../database/db');

//placeorder

const placeOrder = async(req,res) =>{
    
    const{customerId,products} = req.body;

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

        const [prodQuery] =  await db.query(`select product_name, 
        product_quantity from productinfo where product_id = ?`,[productId]);
        

        if(!prodQuery.length)
        {
          return res.status(500).send(`The given product id ${productId} does not exist`);
        }
        
        if( prodQuery[0].product_quantity - productQuantity <=0)
        {
         if(prodQuery[0].product_quantity == 0)
         {
            return res.status(500).send(`The quantity of the given product id ${productId} is nill`);
         }
         else
         {
            return res.status(500).send(`please choose lesser quantity than ${prodQuery[0].product_quantity}  for product_id: ${productId}. `);
         }
        }
       }

       for(const product of products)
       {
        const productId = product.prodId;
        const productQuantity = product.prodQuantity;

        const productNameQuery =  await db.query(`select product_name 
        from productinfo where product_id = ?`,[productId]);

        const productName = productNameQuery[0][0].product_name;

        await db.query(`insert into orders(cust_id,prod_id,prod_name,
            prod_quantity) values(?,?,?,?)`,[customerId,productId,productName,productQuantity]);


        await db.query(`update productinfo set product_quantity = 
        product_quantity - ? where product_id = ?`,[productQuantity,productId]);
       }

       res.send(`Order Placed`);

    }

    catch(err)
    {
        console.error(err);
        res.status(500).send(err.message);
    }
    

};
    
    
module.exports = {placeOrder};   