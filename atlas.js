const { MongoClient } = require('mongodb');
const fs =require('fs')
const uri = process.env.mongodb_url
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const data = fs.readFileSync('./ipekyol-kadin-elbise.json',{encoding:'utf-8'})
const dataObj =JSON.parse(data)
const bulkData =dataObj.map(d=>{
  const {imageUrl,title,priceOld,priceNew,priceBasket,basketDiscount,link,timestamp,plcHolder,discPerc,hizliGonderi,kargoBedava,yeni}=d

  return   {
    updateOne: {
      filter: { imageUrl },
      update: {
        $set: {
          title,
          priceOld,
          priceNew,
          priceBasket,
          basketDiscount,
          imageUrl,
          link,
          timestamp,
          plcHolder,
          discPerc,
          hizliGonderi,
          kargoBedava,
          yeni
        }
      },
      upsert: true,
    }
  }

})
debugger;
client.connect(async err => {
  const collection = client.db("ecom").collection("collection2023");
  // perform actions on the collection object
  const response = await collection.bulkWrite(bulkData)
 
  debugger;
  client.close();
});

