const express = require('express');
const router = express.Router();

const Room = require('../models/room')

router.get("/getallrooms", async (req, res) => {

    try {
        const rooms = await Room.find({})
        res.send(rooms)
    } catch (error) {
        return res.status(404).json({message: error});
    }
});

router.post("/getroombyid", async (req, res) => {

    const roomid = req.body.roomid
    // const roomid = req.params

    try {
        const room = await Room.findOne({_id: roomid})
        res.send(room)
    } catch (error) {
        return res.status(404).json({message: error});
    }
});

router.post("/addroom", async (req, res) => {
    try {
        const newroom = new Room(req.body)
        await newroom.save()
        res.send('New Room Added Successfully')
    } catch (error) {
        return res.status(400).json({error});
    }
});

router.put('/updateroom/:roomid', async (req, res) => {
    try {
      const { roomid } = req.params;
      console.log(req.body);
    const room = await Room.findByIdAndUpdate({_id: roomid}, req.body, {new: true}
      ).exec()
      res.status(200).json(room);
    } catch (error) {
      res.status(500).json({msg: error.message});
    }
  });

  router.delete('/deleteroom/:roomid', async (req, res) => {
    try {
        const {roomid} = req.params
        const room = await Room.findByIdAndDelete(roomid)

        res.status(200).send("Room deleted")
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
  })

module.exports = router;