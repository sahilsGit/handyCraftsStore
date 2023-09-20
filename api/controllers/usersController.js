import User from "../models/User.js";

export const updateUser = async (req, res, next) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body}, 
            {new: true}
        ); // Find user by Id
        res.status(200).json(updatedUser);
    } catch(err) {
        next(err);
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        await User.findByIdAndDelete(
            req.params.id
        ); // Find the user and delete
        res.status(200).json("User has been deleted!");
    } catch(err) {
        next(err);
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(
            req.params.id
        ); // Return user related details
        res.status(200).json(user);
    } catch(err) {
        next(err); // Fire the error handler middleware
    }
}