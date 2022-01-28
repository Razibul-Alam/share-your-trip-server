const express=require('express')
const app =express()
const cors=require('cors')
const{MongoClient}=require('mongodb')
require("dotenv").config();
const port=process.env.PORT || 5000
const ObjectId=require('mongodb').ObjectId

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
      console.log('database connected')
      const database = client.db('ShareTrip');
    const blogsCollection = database.collection('blogs');
    const approvedBlogsCollection = database.collection('Approved-blogs');
    const commentCollection = database.collection('comments');
    const userCollection=database.collection('users')
    
    // create a blog
    app.post('/addBlog', async(req,res)=>{
        const blogInfo=req.body
        console.log('hit the api',blogInfo)
        const insertedResult=await blogsCollection.insertOne(blogInfo)
        res.json(insertedResult)
        console.log(insertedResult)
    })
    app.post('/addComment', async(req,res)=>{
        const commentInfo=req.body
        console.log('hit the api',commentInfo)
        const insertedResult=await commentCollection.insertOne(commentInfo)
        res.json(insertedResult)
        console.log(insertedResult)
    })

    // add user
    app.post('/addUser', async(req,res)=>{
        const user=req.body
        console.log(user)
        const insertedResult=await userCollection.insertOne(user)
        res.json(insertedResult)
    })
    // load all Blogs
    app.get('/allblogs', async(req,res)=>{
        const query=req.query.search
            const getAllblogs=await blogsCollection.find({}).toArray();
            res.json(getAllblogs)
        
    })
    // load allcomments
    app.get('/getComments', async(req,res)=>{
        const queryEmail=req.query.search;
        console.log(queryEmail)
        const getComments=await commentCollection.find({identy:queryEmail}).toArray();
        res.json(getComments)
    })
    app.get('/test',(req,res)=>{
        res.send('just test')
    })
    // // get all reviews
    // app.get('/allReviews', async(req,res)=>{
    //     const getAllReviews=await reviewCollection.find({}).toArray();
    //     res.json(getAllReviews)
    // })
    
    // load all blogs by email
    app.get('/getBlogsByEmail', async(req,res)=>{
        const queryEmail=req.query.email;
        console.log(queryEmail)
        const getBlogs=await blogsCollection.find({email:queryEmail}).toArray();
        res.json(getBlogs)
    })
    // load single item
    app.get('/singleBlog/:id', async(req,res)=>{
        const itemQuery=req.params.id
        const getSingleBlog=await blogsCollection.find({_id:ObjectId(itemQuery)}).toArray();
        res.json(getSingleBlog)
    })
     
    //  delete an item by id
    app.delete('/removeItem/:id',async(req,res)=>{
        const removeId=req.params.id
        // console.log(removeId)
        const deletedItem= await blogsCollection.deleteOne({_id:ObjectId(removeId)})
        // console.log(deletedItem)
        res.json(deletedItem)
    })
    
     // update status
     app.put('/updateStatus',async(req,res)=>{
        const updateInfo=req.body
        const filter = { _id:ObjectId(req.body.id)};
        const updateStatus = {

            $set: {
      
              status:req.body.status,
      
            },
      
          };
          const updateResult=await blogsCollection.updateOne(filter,updateStatus) 
          res.json(updateResult)
    })

    // make admin
     app.put('/saveUser',async(req,res)=>{
     const userInfo=req.body
   console.log(userInfo)
   const filter={email:userInfo.email}
        const option={upsert:true}
        const updateStatus = {

            $set: {
      
            email:userInfo.email,
            displayName:userInfo.displayName,
            role:userInfo.role
      
            },
      
          };
       
           const updateResult=await userCollection.updateOne(filter,updateStatus,option) 
          console.log(updateResult)
          res.json(updateResult)
    })
    // make admin
     app.put('/createAdmin/:email',async(req,res)=>{
         console.log(req.body)
       const queryEmail=req.params.email
        const filter={email:queryEmail}
        console.log(filter)
        // const option={upsert:true}
        const updateStatus = {

            $set: {
      
              role:req.body.role
      
            },
      
          };
          const updateResult=await userCollection.updateOne(filter,updateStatus) 
          console.log(updateResult)
          res.json(updateResult)
    })

    // check admin
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

  app.get('/',(req,res)=>{
    res.send('the server is responsing')
    })
app.listen(port,()=>{
    console.log('hello i am from server')
})
