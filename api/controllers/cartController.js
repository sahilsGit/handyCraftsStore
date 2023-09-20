import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// Add product to the user's cart
export const addToCart = async (userId, productId, quantity) => {
  // Try adding the item to cart
  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      throw new Error("Cart not found for the user");
    }

    // Find if the cart already has the same product
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId.toString()
    );

    if (existingItem) {
      // If the product exists in the cart, update the quantity
      existingItem.quantity += quantity;
    } else {
      // If the product is not in the cart, add it with the specified quantity
      cart.items.push({ productId, quantity });
    }

    await cart.save();

    return cart;
  } catch (err) {
    next(err); // next if something's wrong
  }
};

// Remove a product from the user's cart
export const removeFromCart = async (userId, productId) => {
  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      throw new Error("Cart not found for the user");
    }

    // Find the index of the product in the cart items array
    const productIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    if (productIndex === -1) {
      new Error("Product not found in the cart");
      next(err);
    }

    // Remove the product from the cart by splicing it from the items array
    cart.items.splice(productIndex, 1);

    // Save the updated cart
    await cart.save();
  } catch (err) {
    next(err);
  }
};

// Get the user's cart
export const getcart = async (userId) => {
  // Populate the cart with required details
  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      throw new Error("Cart not found for the user");
    }

    cart.populate("items.productId", "title price");
    return cart;
  } catch (err) {
    next(err);
  }
};

// Update product quantity in the user's cart
export const updateProductQuantity = async (userId, productId, newQuantity) => {
  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      throw new Error("Cart not found for the user");
    }

    const productIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    if (productIndex === -1) {
      new Error("Product not found in the cart");
      next(err);
    }

    // Update the quantity of the product
    cart.items[productIndex].quantity = newQuantity;

    // Save the updated cart
    await cart.save();

    return cart; // Return the updated cart
  } catch (err) {
    next(err);
  }
};

// Calculate cart total
export const calculateCartTotal = async (userId) => {
  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      throw new Error("Cart not found for the user");
    }

    let total = 0;
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        total += product.price * item.quantity;
      }
    }

    return total;
  } catch (err) {
    next(err);
  }
};

// Checkout and create an order
export const checkout = async (userId) => {
  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      throw new Error("Cart not found for the user");
    }

    const total = await calculateCartTotal(userId);

    // Create an order with the cart contents
    const order = new Order({
      orderID: generateUniqueOrderID(), // Implement a function to generate a unique order ID
      transactionID: generateTransactionID(), // Implement a function to generate a transaction ID
      customerID: userId,
      totalAmount: total,
      shippingAddress: {
        name: req.body.shippingAddress.name,
        street: req.body.shippingAddress.street,
        city: req.body.shippingAddress.city,
        state: req.body.shippingAddress.state,
        postalCode: req.body.shippingAddress.postalCode,
        country: req.body.shippingAddress.country,
      },
      orderItems: cart.items.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
        unitPrice: calculateUnitPrice(item.productId), // Implement a function to calculate unit price
        subtotal: calculateSubtotal(item.productId, item.quantity), // Implement a function to calculate subtotal
      })),
      status: "pending", // Initial order status
      paymentMethod: req.body.paymentMethod, // Payment method from the request
    });

    // Save the order
    await order.save();

    // Clear the user's cart (remove all items)
    cart.items = [];
    await cart.save();

    return order; // Return the created order
  } catch (err) {
    next(err);
  }
};
