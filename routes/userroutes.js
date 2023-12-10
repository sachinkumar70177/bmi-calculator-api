const express = require("express");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/usermodel");
const { auth } = require("../middleware/auth");
const userRouter = express.Router();
userRouter.post("/register", async (req, res) => {
  const { name, email, password, gender } = req.body;
  try {
    const hash = await bcrypt.hash(password, 5);
    const user = new UserModel({ name, email, gender, password: hash });
    await user.save();
    res.status(200).json({ msg: "user is registered" });
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

// login
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user=await UserModel.find({email});
    if(user.length>0){
        bcrypt.compare(password,user[0].password,function(err,result){
            if(result){
                const token=jwt.sign({userId:user[0]._id,username:user[0].name},"masai");
                res.status(200).json({msg:"user is logged in",token:token})
            }else{
                res.status(200).json({msg:"wrong details"})
            }
        })
    }
  } catch (error) {
    res.status(400).json({msg:"something went wrong in the internet"})
  }
});

userRouter.get('/profile', auth,async (req, res) => {
  try {
    // Assuming you're using some form of authentication middleware to get the user details from the token
    const userId = req.body.userId; // Extracting user ID from the token or session
console.log(req.body)
    // Fetch user details from the database based on userId
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user profile
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server Error' });
  }
});

userRouter.put('/profile',auth, async (req, res) => {
  try {
    const userId = req.body.userId; // Extracting user ID from the token or session
    const hash = await bcrypt.hash(req.body.password, 5);
    req.body.password=hash
    // Find the user by ID and update their profile details
    const user = await UserModel.findByIdAndUpdate(
      userId,
      {
        $set: req.body, 
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the updated user profile
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = {
  userRouter,
};
