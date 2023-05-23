const mongoose = require('mongoose')
require('dotenv').config();

// var mongoURL = 'mongodb+srv://franzdulnuan9:Panpan-2001@cluster0.drxk9ub.mongodb.net/hotel-rooms'

mongoose.connect(process.env.mongoURL, {useUnifiedTopology: true, useNewUrlParser: true})

var connection = mongoose.connection

connection.on('error', ()=>{
    console.log('Mongo DB Connection Failed')
})

connection.on('connected', ()=>{
    console.log('Mongo DB Connection Successfull')
})

// mongoose
//   .connect(process.env.DB)
//   .then(() => {
//     //listen for requests
//     app.listen(process.env.PORT, () => {
//       console.log(`Connected to db and listening to ${process.env.PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.log(error);
//   });

module.exports = mongoose