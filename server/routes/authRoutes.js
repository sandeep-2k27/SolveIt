const router = require("express").Router();

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../models/User");

router.post("/register", async(req,res)=>{

    try{

        const {
            name,
            email,
            password
        } = req.body;

        if(
            !name ||
            !email ||
            !password
        ){

            return res.status(400).json({
                message:"All fields are required"
            });

        }



         if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }


        
        const existingUser =
        await User.findOne({email});



        if(existingUser){

            return res.status(400).json({
                message:"User already exists"
            });

        }

        const hashedPassword =
        await bcrypt.hash(password,10);

        const user =
        await User.create({

            name,
            email,
            password:hashedPassword

        });

        res.status(201).json({
            message:"Registration Successful",
            user
        });

    }catch(err){

        res.status(500).json({
            message:"Server Error"
        });

    }

});

router.post("/login", async(req,res)=>{

    try{

        const {
            email,
            password
        } = req.body;

        if(
            !email ||
            !password
        ){

            return res.status(400).json({
                message:"All fields are required"
            });

        }

        const user =
        await User.findOne({email});

        if(!user){

            return res.status(400).json({
                message:"Invalid Credentials"
            });

        }

        const isMatch =
        await bcrypt.compare(
            password,
            user.password
        );

        if(!isMatch){

            return res.status(400).json({
                message:"Invalid Credentials"
            });

        }

        const token = jwt.sign(

            {
                id:user._id
            },

            process.env.JWT_SECRET,

            {
                expiresIn:"7d"
            }

        );

        res.json({

            token,

            user:{
                _id:user._id,
                name:user.name,
                email:user.email,
                karma:user.karma
            }

        });

    }catch(err){

        res.status(500).json({
            message:"Server Error"
        });

    }

});

module.exports = router;