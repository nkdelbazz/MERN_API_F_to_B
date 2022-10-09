const mongoose = require('mongoose')
const config = require('config');
const db = config.get('mongoURI');  // va a prendere di default il valore 
const owner = config.get('owner');  // va a prendere di default il valore 

const connectDB = async () => {
   try {
    await mongoose.connect(db,{
        useNewUrlParser:true
    })
    console.log('MongoDB Connected... by ' + owner)
   }
   catch(err){
    console.error(err.message);
    process.exit(1);
   }

}

module.exports = connectDB;