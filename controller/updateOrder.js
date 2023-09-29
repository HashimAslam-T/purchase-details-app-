const db = require('../database/db');
const {updateSchema} = require(`../validate`);

//input validation

const validateOrder = async(req,res,next) =>
{
  try
  {
    const value = req.body;
    const validatedData = await updateSchema.validateAsync(value);
    console.log(validatedData);
    next();
  }
  catch(err)
  {
    console.error('Validation error:', err.details[0].message);
    res.status(400).send('Validation error:'+ err.details[0].message); 
  }
}

//update Order

const updateOrder = async(req,res)=>
{
    const{orderId,updatedProducts} = req.body;
    try
    {
      const [order] =  await db.query(`select mainorder_id from mainorder where mainorder_id = ?`,[orderId]);
      if (!order.length)
      {
       return res.status(400).send("Invalid Order Id");
      }
      const totalProductQuantityQuery = await db.query(`select * from productinfo`);
      const totalProductsQuantity = totalProductQuantityQuery[0];
      // console.log(totalProductsQuantity);
      const currentProducts = await db.query(`select * from orders where ord_id=?`,[orderId]);
      const customerId_query = await db.query(`select cust_id from mainorder where mainorder_id =?`,[orderId]);
      
      const updateOrdersQuantityArray =[];
      const updateProdInfoQuantityArray =[];
      const createdProdArray =[];
      const addProdInfoQuantityArray = [];
      const deleteOrders = [];

      for(const product of updatedProducts)
      {
        const productId = product.productId;
        const productQuantity = product.quantity;
        const findProduct = totalProductsQuantity.find(obj => obj.product_id === productId);
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
        const findProduct1 = currentProducts[0].find(currentProd => currentProd.prod_id === productId);
        if (findProduct1)
        { 
          updateOrdersQuantityArray.push([productQuantity,productId]);
          const temp = productQuantity-findProduct1.prod_quantity;
          updateProdInfoQuantityArray.push([temp,productId]);
          console.log(`Product id ${productId} updated`);
        }
        else
        {
          createdProdArray.push([orderId,customerId_query[0][0].cust_id,productId,productQuantity]);
          updateProdInfoQuantityArray.push([productQuantity,productId]);
          console.log(`Product id ${productId} added`);
        }
      }

      for(const currentProd of currentProducts[0])
      {
       const findProduct = updatedProducts.find(updateProd => updateProd.productId === currentProd.prod_id)
       if(!findProduct)
       {
        addProdInfoQuantityArray.push([currentProd.prod_quantity,currentProd.prod_id]);
        deleteOrders.push([orderId,currentProd.prod_id]);
        console.log(`Product id ${currentProd.prod_id} removed`);
       }
      }
      

      if(updateOrdersQuantityArray.length !== 0)
      {      
        let sql =`update orders set prod_quantity = case prod_id `;
        updateOrdersQuantityArray.forEach(item => {
          sql+= `when ${item[1]} then ${item[0]} `;
        });
        sql+= `end where prod_id in (`;
        updateOrdersQuantityArray.forEach((item,index)=>{
         sql+= `${item[1]}${index < updateOrdersQuantityArray.length -1 ? ',' : ''}`;
        });
        sql+=`)`;
       await db.query(sql);
      }


      if(updateProdInfoQuantityArray.length !== 0)
      {  
        let sql =`update productinfo set product_quantity = case product_id `;
        updateProdInfoQuantityArray.forEach(item => {
          sql+= `when ${item[1]} then product_quantity - ${item[0]} `;
        });
        sql+= `end where product_id in (`;
        updateProdInfoQuantityArray.forEach((item,index)=>{
         sql+= `${item[1]}${index < updateProdInfoQuantityArray.length -1 ? ',' : ''}`;
        });
        sql+=`)`;    
       await db.query(sql);
      }
      

      if(createdProdArray.length !== 0)
      {
       await db.query(`insert into orders(ord_id,cust_id,prod_id,
        prod_quantity) values ?`,[createdProdArray]);
      } 


      if(addProdInfoQuantityArray.length !== 0)
      {  
        let sql =`update productinfo set product_quantity = case product_id `;
        addProdInfoQuantityArray.forEach(item => {
          sql+= `when ${item[1]} then product_quantity + ${item[0]} `;
        });
        sql+= `end where product_id in (`;
        addProdInfoQuantityArray.forEach((item,index)=>{
         sql+= `${item[1]}${index < addProdInfoQuantityArray.length -1 ? ',' : ''}`;
        });
        sql+=`)`;    
       await db.query(sql);
      }

      
      if(deleteOrders.length !== 0)
      {
        let sql = "DELETE FROM orders WHERE (ord_id, prod_id) IN (";
        deleteOrders.forEach((item, index) => {
        sql += `(${item[0]}, ${item[1]})${index < deleteOrders.length - 1 ? ',' : ''} `;
        });
        sql += ")";
        await db.query(sql)
      }
             
      res.status(200).send('Order Updated');
    }

   catch(err)
   {
    console.error(err);
    res.status(500).send(err.message);
   }

}

module.exports={validateOrder,updateOrder};