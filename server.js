const express = require('express');
const app = express();
const env = require('dotenv');
env.config();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user')

app.use(cors());
app.use(express.json());


app.use('/api/users', userRoutes);



mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser : true,
    useUnifiedTopology : true
}).then(() =>{
    console.log("MongoDB is connected....");
}).catch((error) =>{
    console.log(error);
})


app.listen(PORT, ()=>{
    console.log(`Server is running on the port: ${PORT}`)
})