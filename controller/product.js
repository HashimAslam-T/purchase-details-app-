const db = require("../database/db")
const {productSchema} = require('../validate')

const validateProduct = async(req,res,next) =>
{
  try
  {
    const value = req.body;
    const validatedData = await productSchema.validateAsync(value);
    console.log(validatedData);
    next();
  }
  catch(err)
  {
    console.error('Validation error:', err.details[0].message);
    res.status(400).send('Validation error:'+ err.details[0].message); 
  }
}


//create a product

const postProduct =  async(req,res)=>{

    const {productName, alternateName, productDescription ,
        productPrice, productImage, productQuantity } = req.body
    try
    {
        const query = `insert into productinfo(product_name,
            product_alternate_name,product_description,product_price,
            product_image,product_quantity) values(?,?,?,?,?,?)`
            
        await db.query(query,[productName,alternateName,productDescription,productPrice,productImage,productQuantity])
        res.status(200).send("Product Updated")
    }
    catch(err)
    {
        console.error(err);
        res.status(500).send(err.message);
    }
    
}

module.exports = {validateProduct,postProduct};
