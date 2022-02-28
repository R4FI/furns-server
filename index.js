// must have some server extention
const express = require('express');
const app = express();
const port = process.env.PORT || 7000;
const {MongoClient} = require('mongodb');
const objectId = require('mongodb').ObjectId;
const cors = require ('cors');
require('dotenv').config();
// --------these all are middleware-------
app.use(cors());
app.use(express.json());
const { query } = require('express');
const {  ObjectId } = require('bson');
// connect mongo
const uri = "mongodb+srv://furns:furns556@cluster0.fqe4k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try {
      await client.connect();
      const database = client.db('furns');
      const usersCollection = database.collection('users');
      const HomeFurnCollection = database.collection('homefurn');
      const OfficeFurnCollection = database.collection('officefurn');
      const HospitalFurnCollection = database.collection('hospitalfurn');
      const ordersCollection = database.collection('orders');
      const feedbackCollection = database.collection('feebacks');  




        // ---------------home--------------
      // post api
      app.post('/homefurn',async(req,res)=>{
        const homefurn = req.body;
        const result = await HomeFurnCollection.insertOne(homefurn);
        console.log(result);
       });
    
        //    get homrfurn
        app.get('/homefurn',async(req,res)=>{
          const cursor =  HomeFurnCollection.find({});
          const catagories1 = await cursor.toArray();
          res.send(catagories1);
          });


          // ----------get single Item-------------
          app.get('/homefurn/:id',async(req,res)=>
          {
              const id = req.params.id;
              console.log('getting product',id);
              const querry = { _id: objectId(id) }; 
              const product = await HomeFurnCollection.findOne(querry);
              res.json(product);
          });

           // delete product
           app.delete('/homefurn/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await HomeFurnCollection.deleteOne(query);
            res.json(result);
        });


            // --------------End---------





          // ------------office---------
      // post api
      app.post('/officefurn',async(req,res)=>{
        const officefurn = req.body;
        const result = await OfficeFurnCollection.insertOne(officefurn);
        console.log(result);
       });
    
        // //    get officefurn
        app.get('/officefurn',async(req,res)=>{
          const cursor =  OfficeFurnCollection.find({});
          const catagories2 = await cursor.toArray();
          res.send(catagories2);
          });
      
          // delete product
          app.delete('/officefurn/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await  OfficeFurnCollection.deleteOne(query);
            res.json(result);
        });


           // ----------get single Item-------------
           app.get('/officefurn/:id',async(req,res)=>
           {
               const id = req.params.id;
               console.log('getting product',id);
               const querry = { _id: objectId(id) }; 
               const product = await OfficeFurnCollection.findOne(querry);
               res.json(product);
           });
          // -------------hostpital----------------
      // post api
      app.post('/hospitalfurn',async(req,res)=>{
        const hospitalfurn= req.body;
        const result = await HospitalFurnCollection.insertOne(hospitalfurn);
        console.log(result);
       });
    
        //   get hospitalfurn
        app.get('/hospitalfurn',async(req,res)=>{
          const cursor = HospitalFurnCollection.find({});
          const catagories3 = await cursor.toArray();
          res.send(catagories3);
          });

            //   delete product
            app.delete('/hospitalfurn/:id', async (req, res) => {
              const id = req.params.id;
              const query = { _id: ObjectId(id) };
              const result = await  HospitalFurnCollection.deleteOne(query);
              res.json(result);
          });

  // ----------get single Item-------------
  app.get('/hospitalfurn/:id',async(req,res)=>
  {
      const id = req.params.id;
      console.log('getting product',id);
      const querry = { _id: objectId(id) }; 
      const product = await HospitalFurnCollection.findOne(querry);
      res.json(product);
  });
// ----------end--------------



          // --------order section---------
                 //add order api 
                 app.post('/orders', async (req, res) => {
                  const order = req.body;
                  order.createdAt = new Date();
                  const result = await ordersCollection.insertOne(order);
                  res.json(result);
              });

                app.get('/orders',async(req,res)=>{
                  let query = {};
                  const email = req.query.email;
                  if (email) {
                      query = {email:email};   
                  }
                  const cursor = ordersCollection.find(query);
                  const orders = await cursor.toArray();
                  res.send(orders);
          });
              // -----------------end----------


              // user 
              app.post('/users', async (req, res) => {
                const user = req.body;
                const result = await usersCollection.insertOne(user);
                res.json(result);
            });

            app.put('/users', async (req, res)=>{
              const user = req.body;
              const filter = {email: user.email};
              const option = {upsert:true};
              const updateDoc = {$set:user};
              const result = await usersCollection.updateOne(filter,updateDoc,option);
              res.json(result);
            })

            // admin
            app.put('/users/admin', async (req, res)=>{
              const user = req.body;
              const filter = {email: user.email};
              const updateDoc = {$set:{role:'admin'}};
              const result = await usersCollection.updateOne(filter,updateDoc);
              res.json(result);
            })


            app.get('/users/:email',async(req,res)=>{
              const email = req.params.email;
              const querry = {email: email};
              const user = await usersCollection.findOne(querry);
              let isAdmin = false ;
              if(user.role === 'admin' ){
                    isAdmin = true;
              }
              res.json({admin: isAdmin});
              })
                // --------user  part end-----------

                     // DELETE API
                     app.delete('/orders/:id', async (req, res) => {
                      const id = req.params.id;
                      const query = { _id: ObjectId(id) };
                      const result = await ordersCollection.deleteOne(query);
          
                      // console.log('deleting user with id ', result);
          
                      res.json(result);
                  });

                  // feedback section

                     //     add feed back api
                     app.get('/feedbacks',async(req,res)=>{
                      const cursor = feedbackCollection.find({});
                      const feedbacks = await cursor.toArray();
                      res.send(feedbacks);
              });

          //     feedback post api
          app.post('/feedbacks', async(req,res)=>{
                  const feedback = req.body;
                  // console.log('hitted',feedback);
                  const result = await feedbackCollection.insertOne(feedback);
                  console.log(result);
                  res.json(result);
          })
              

    } 
    finally{
         // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at 
  http://localhost:${port}`)
})