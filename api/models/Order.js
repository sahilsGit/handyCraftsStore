import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderID: {
    type: String,
    required: true,
    unique: true, // Ensure order IDs are unique
  },
  transactionID: {
    type: String,
    required: true, // Unique identifier for the transaction
  },
  customerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // Reference to the customer who placed the order
  },
  orderDate: {
    type: Date,
    default: Date.now, // Date and time when the order was placed
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0, // Ensure non-negative order total
  },
  shippingAddress: {
    // Embedded schema for shipping address
    name: String,
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  orderItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true, // Reference to the product in the order
      },
      quantity: {
        type: Number,
        required: true,
        min: 1, // Ensure a positive quantity
      },
      unitPrice: {
        type: Number,
        required: true,
        min: 0, // Ensure non-negative unit price
      },
      subtotal: {
        type: Number,
        required: true,
        min: 0, // Ensure non-negative subtotal
      },
    },
  ],
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending', // Initial order status
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  // Additional properties, if needed
});

const Order = mongoose.model('Order', orderSchema);

export default Order
