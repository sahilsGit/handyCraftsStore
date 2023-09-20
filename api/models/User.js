import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: String,
    bio: String,
    location: {
      type: String,
      default: null,
    },
    role: [
      {
        type: String,
        enum: ["artisan", "buyer"], // Define roles as 'artisan' or 'buyer'
        // ,default: 'buyer', // Set the default role to 'buyer'
      },
    ],
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    profilePageURL: String, // Unique URL for the artisan's profile page
    createdAt: {
      type: Date,
      default: Date.now,
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
