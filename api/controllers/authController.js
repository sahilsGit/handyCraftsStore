import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
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
      role: ["buyer"],
    });

    if (req.body.profilePicture) {
      newUser.profilePicture = req.body.profilePicture;
    }
    if (req.body.bio) {
      newUser.bio = req.body.bio;
    }

    const user = await newUser.save(); // Save the User into our DB
    const cart = await new Cart({ userId: user._id }).save(); // create and save the cart
    console.log("Created user and cart");

    const savedUser = await User.findById(user._id); // find the saved user

    savedUser.cart = cart._id; // Set the user's cart reference
    await savedUser.save(); // save the updated user

    res.status(201).json({
      message: "User created",
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }); // Find the user
    if (!user) {
      return next(createError(404, "User not found")); // Return error if no user found
    }

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect) {
      return next(createError(400, "Incorrect username or Password!")); // Return error
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT
    ); // Authorize user using the secret key

    const { firstName, lastName, username, role, ...otherDetails } = user._doc; // Bifurcate props

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({
        firstName: firstName,
        lastName: lastName,
        username: username,
        role: role,
        success: true,
      }); // Return cookie with JWT
  } catch (err) {
    next(err);
  }
};
