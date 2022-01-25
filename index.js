const express=require('express')
const app =express()
const cors=require('cors')
const{MongoClient}=require('mongodb')
require("dotenv").config();
const port=process.env.PORT || 5000

//  using middleware
app.use(cors())
app.use(express.json())

// database connect
const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aicgl.mongodb.net/${process.env.DB_DATABASE}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// create a client connection
async function run() {
    try {
      // Connect the client to the server
      await client.connect();
    //   console.log('database connected')
    //   const database = client.db('Engineers-world');
    // const jobsCollection = database.collection('Jobs');
    // const favoriteCollection = database.collection('Favorites');
    // const reviewCollection=database.collection('reviews')
    // const userCollection=database.collection('users')
    // add item
    app.post('/addJob', async(req,res)=>{
        const jobInfo=req.body
        console.log('hit the api',jobInfo)
        const insertedResult=await jobsCollection.insertOne(jobInfo)
        res.json(insertedResult)
        console.log(insertedResult)
    })
    app.post('/addfavorite', async(req,res)=>{
        const favoriteInfo=req.body
        console.log('hit the api',favoriteInfo)
        const insertedResult=await favoriteCollection.insertOne(favoriteInfo)
        res.json(insertedResult)
        console.log(insertedResult)
    })
    // add booking order
    // app.post('/addOrder', async(req,res)=>{
    //     const carOrder=req.body
    //     console.log(carOrder)
    //     const insertedResult=await orderCollection.insertOne(carOrder)
    //     res.json(insertedResult)
    // })
    // add review
    // app.post('/addReview', async(req,res)=>{
    //     const review=req.body
    //     console.log(review)
    //     const insertedResult=await reviewCollection.insertOne(review)
    //     res.json(insertedResult)
    // })
    // add user
    // app.post('/addUser', async(req,res)=>{
    //     const user=req.body
    //     console.log(user)
    //     const insertedResult=await userCollection.insertOne(user)
    //     res.json(insertedResult)
    // })
    // load allevents
    app.get('/alljobs', async(req,res)=>{
        const query=req.query.search
        console.log(query)
        if (query) {
            const getAllJobs=await jobsCollection.find({}).toArray();
            // const searchResult=getAllJobs.filter(job=>job.designation.include(query))
            // res.json(searchResult)
            const searchResult=getAllJobs.filter(job=>job.designation.toLowerCase().includes(query.toLowerCase()))
            res.json(searchResult)
        }
        else{
            res.json(getAllJobs)
        }
        
    })
    // load allevents
    app.get('/getfavorite', async(req,res)=>{
        const getFavorite=await favoriteCollection.find({}).toArray();
        res.json(getFavorite)
    })
    // get all reviews
    app.get('/allReviews', async(req,res)=>{
        const getAllReviews=await reviewCollection.find({}).toArray();
        res.json(getAllReviews)
    })
    // load all bookings
    // app.get('/allOrders', async(req,res)=>{
    //     const getOrders=await orderCollection.find({}).toArray();
    //     res.json(getOrders)
    // })
    // load all bookings by email
    // app.get('/getOrdersByEmail', async(req,res)=>{
    //     const queryEmail=req.query.email;
    //     console.log(queryEmail)
    //     const getOrders=await orderCollection.find({email:queryEmail}).toArray();
    //     res.json(getOrders)
    // })
    // load single item
    app.get('/singleApply/:id', async(req,res)=>{
        const itemQuery=req.params.id
        const getSingleApply=await jobsCollection.find({_id:ObjectId(itemQuery)}).toArray();
        res.json(getSingleApply)
    })
     
    //  delete an item by id
    app.delete('/removeItem/:id',async(req,res)=>{
        const removeId=req.params.id
        // console.log(removeId)
        const deletedItem= await orderCollection.deleteOne({_id:ObjectId(removeId)})
        // console.log(deletedItem)
        res.json(deletedItem)
    })
    //  delete an item by id from cars collection
    app.delete('/removeCarItem/:id',async(req,res)=>{
        const removeId=req.params.id
        // console.log(removeId)
        const deletedItem= await carsCollection.deleteOne({_id:ObjectId(removeId)})
        // console.log(deletedItem)
        res.json(deletedItem)
    })
    
     // update status
    //  app.put('/updateStatus',async(req,res)=>{
    //     const updateInfo=req.body
    //     const filter = { _id:ObjectId(req.body.id)};
    //     const updateStatus = {

    //         $set: {
      
    //           status:req.body.status,
      
    //         },
      
    //       };
    //       const updateResult=await orderCollection.updateOne(filter,updateStatus) 
    //       res.json(updateResult)
    // })

    // make admin
//      app.put('/saveUser',async(req,res)=>{
//      const userInfo=req.body
//    console.log(userInfo)
//    const filter={email:userInfo.email}
//         const option={upsert:true}
//         const updateStatus = {

//             $set: {
      
//             userInfo
      
//             },
      
//           };
       
//            const updateResult=await userCollection.updateOne(filter,updateStatus,option) 
//           console.log(updateResult)
//           res.json(updateResult)
//     })
    // make admin
    //  app.put('/createAdmin/:email',async(req,res)=>{
    //      console.log(req.body)
    //    const queryEmail=req.params.email
    //     const filter={email:queryEmail}
    //     console.log(filter)
    //     // const option={upsert:true}
    //     const updateStatus = {

    //         $set: {
      
    //           role:req.body.role
      
    //         },
      
    //       };
    //       const updateResult=await userCollection.updateOne(filter,updateStatus) 
    //       console.log(updateResult)
    //       res.json(updateResult)
    // })

    // check admin
//     app.get('/getAdmin', async(req,res)=>{
// const query=req.query.email
// const getAdmin=await userCollection.find({email:query}).toArray();
//         let admin=false
//         if(getAdmin[0].role==='admin'){
// admin=true
//         }
//         res.json(admin)
//     })
app.get('/',(req,res)=>{
    res.send('the server is responsing')
    })

    app.get('/getAdmin', async(req,res)=>{
const query=req.query.email
const getAdmin=await userCollection.find({email:query}).toArray();
        let admin=false
        if(getAdmin[0].role==='admin'){
admin=true
        }
        res.json(admin)
    })

    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.listen(port,()=>{
    console.log('hello i am from server')
})
