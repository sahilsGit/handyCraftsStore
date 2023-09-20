import User from "../models/User.js";
import bcrypt from 'bcryptjs'
import { createError } from "../utils/error.js";
import jwt from 'jsonwebtoken';
import Cart from "../models/Cart.js";

export const register = async (req, res, next) => {
    try {

        // Hash the password using bcryptjs
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        // Make a User by sending data collected to the schema model
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            email: req.body.email,
            password: hash,
            role: ['buyer']
        });

        if (req.body.profilePicture) {
            newUser.profilePicture = req.body.profilePicture;
        }
        if (req.body.bio) {
            newUser.bio = req.body.bio;
        }

        // Create a new Cart document and associate it with the user
        const newCart = new Cart({});
        await newCart.save();
        newUser.cart = newCart._id; // Set the user's cart reference

        await newUser.save(); // Save the User into our DB
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
            "role": user.role
        }, process.env.JWT); // Authorize user using the secret key


        const { 
            firstName, 
            lastName,
            username,
            role, 
            ...otherDetails 
        } = user._doc; // Bifurcate props 

        res.cookie("access_token", token, {
            httpOnly: true
        })
        .status(200)
        .json({
            firstName, 
            lastName,
            username,
            role
        }); // Return cookie with JWT 

    } catch(err) {
        next(err);
    }
}
