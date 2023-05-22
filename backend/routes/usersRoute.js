const express = require('express');
const router = express.Router();
const User = require("../models/user")

router.post("/register", async(req, res) => {
    
    const newuser = new User(req.body)

    try {
        const user = await newuser.save()
        res.send('User Registered Successfully')
    } catch (error) {
        return res.status(400).json({error});
    }
});

router.post("/login", async(req, res) => {

    const {email, password} = req.body

    try {
        const user = await User.findOne({email: email, password: password})
        if(user){
            // const temp = {
            //     name: user.name,
            //     email: user.email,
            //     isAdmin: user.isAdmin,
            //     _id: user._id,
            // }
            res.send(user)
        }
        else{
            return res.status(400).json({message: 'Login Failed'});
        }
    } catch (error) {
        return res.status(400).json({error});
    }
})

router.get('/getallusers', async (req,res) => {
    try {
      const users = await User.find()
      res.send(users)
    } catch (error) {
      return res.status(400).json({error});
    }
  })

  router.put('/updateuser/:userid', async (req, res) => {
    try {
      const { userid } = req.params;
      console.log(req.body);
    const user = await User.findByIdAndUpdate({_id: userid}, req.body, {new: true}
      ).exec()
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({msg: error.message});
    }
  });

  router.delete('/deleteuser/:userid', async (req, res) => {
    try {
        const {userid} = req.params
        const user = await User.findByIdAndDelete(userid)

        res.status(200).send("User deleted")
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
  })

module.exports = router

