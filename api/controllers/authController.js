import User from "../models/User.js";
import bcrypt from 'bcryptjs'
import { createError } from "../utils/error.js";
import jwt from 'jsonwebtoken';

export const register = async (req, res, next) => {
    try {

        // Hashing the password using bcryptjs
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        // Making a User by sending data collected and calling the schema function
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            email: req.body.email,
            password: hash,
            role: ['buyer']
        });

        // Optionally, you can set additional properties based on the request body
        if (req.body.profilePicture) {
            newUser.profilePicture = req.body.profilePicture;
        }
        if (req.body.bio) {
            newUser.bio = req.body.bio;
        }

        await newUser.save(); // Saving the User into our DB
        res.status(201).send("User has been created");
        
    } catch(err) {
        next(err);
    }
}

export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username }); // Find the user
        if (!user) {
            return next(createError(404, "User not found")); // Return error if no user found
        }

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);

        if (!isPasswordCorrect) {
            return next(createError(400, "Incorrect Username or Password!")); // Return error
        }

        const token = jwt.sign({ 
            "id": user._id, 
            "role": user.role       // User Role
        }, process.env.JWT); // Authorizing user using the secret key


        const { 
            firstName, 
            lastName,
            username,
            role, 
            ...otherDetails 
        } = user._doc; // Doing this so that we don't have to send password, isAdmin when logging in to the client

        res.cookie("access_token", token, {
            httpOnly: true
        })
        .status(200)
        .json({
            firstName, 
            lastName,
            username,
            role
        });

    } catch(err) {
        next(err);
    }
}
