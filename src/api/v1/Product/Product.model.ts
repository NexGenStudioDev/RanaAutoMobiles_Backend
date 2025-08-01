import mongoose, { Schema, Document } from 'mongoose';
import { IProduct } from './Product.type';

// Mongoose Schema
const ProductSchema: Schema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    model_No: { type: String, required: true },
    discountPrice: { type: Number },
    currency: { type: String, default: 'INR' },

    inStock: { type: Boolean, default: true },

    rating: {
      score: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },

    images: [{ type: String }],

    colors: [
      {
        name: { type: String, required: true }, // e.g., "Black"
        price: { type: Number, required: true }, // Price for this color variant
        hex: { type: String, required: true }, // e.g., "#000000"
        images: [{ type: String }], // Images for that color
      },
    ],

    sizes: [{ type: String }], // e.g., ["S", "M", "L"]

    category: { type: String, required: true },

    tags: [{ type: String }], // Optional search tags

    flags: [
      {
        label: { type: String, required: true }, // e.g., "Made in India"
        type: {
          type: String,
          enum: ['info', 'success', 'warning', 'error'],
          required: true,
        },
        icon: { type: String }, // Optional emoji/icon
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

export default mongoose.models.Product ||
  mongoose.model<IProduct>('Product', ProductSchema);
