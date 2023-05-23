const express = require('express');
const cors = require('cors');
// const path = require('path');
const mongoose = require('mongoose')


const app = express();

require('dotenv').config();

// const dbConfig = require('./db')
const roomsRoute = require('./routes/roomRoutes')
const usersRoute = require('./routes/usersRoute')
const bookingsRoute = require('./routes/bookingsRoute')

app.use(express.json());
app.use(cors());

// app.use(express.static(path.join(__dirname, '.frontend/build')));
// // app.get()

// app.get("*", function (_, res) {
//   res.sendFile(
//     path.join(__dirname, "./frontend/build/index.html"),
//     function (err) {
//       res.status(500).send(err);
//     }
//   );
// });

app.use('/api/rooms', roomsRoute);
app.use('/api/users', usersRoute);
app.use('/api/bookings', bookingsRoute);

mongoose
  .connect(process.env.mongoURL)
  .then(() => {
    //listen for requests
    app.listen(process.env.PORT, () => {
      console.log(`Connected to db and listening to ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

// const port = process.env.PORT;

// app.listen(port, ()=> {console.log(`Server running on port ${port}`)});