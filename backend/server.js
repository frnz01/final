const express = require('express');
const cors = require('cors');

const app = express();

require('dotenv').config();

const dbConfig = require('./db')
const roomsRoute = require('./routes/roomRoutes')
const usersRoute = require('./routes/usersRoute')
const bookingsRoute = require('./routes/bookingsRoute')

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, '.frontend/build')));
// app.get()

app.use(express.static(path.join(__dirname, ".//build")));
app.get("*", function (_, res) {
  res.sendFile(
    path.join(__dirname, "./frontend/build/index.html"),
    function (err) {
      res.status(500).send(err);
    }
  );
});

app.use('/api/rooms', roomsRoute);
app.use('/api/users', usersRoute);
app.use('/api/bookings', bookingsRoute);



const port = process.env.PORT;

app.listen(port, ()=> {console.log(`Server running on port ${port}`)});