const db = require("../database/db")

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

module.exports.postProduct = postProduct;
