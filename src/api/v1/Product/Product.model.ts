import mongoose, { Schema } from 'mongoose';
import { IProduct } from './Product.type';

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    modelNumber: {
      type: String,
      trim: true,
      maxlength: [50, 'Model number cannot exceed 50 characters'],
    },
    sap: {
      type: Schema.Types.Mixed,
      validate: {
        validator: function (value: any) {
          return (
            value === undefined ||
            typeof value === 'string' ||
            typeof value === 'number'
          );
        },
        message: 'SAP must be either a string or number',
      },
    },
    discountPrice: {
      type: Number,
      min: [0, 'Discount price cannot be negative'],
    },
    currency: {
      type: String,
      default: 'INR',
      maxlength: [10, 'Currency code cannot exceed 10 characters'],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    rating: {
      score: {
        type: Number,
        default: 0,
        min: [0, 'Rating score cannot be less than 0'],
        max: [5, 'Rating score cannot be more than 5'],
      },
      count: {
        type: Number,
        default: 0,
        min: [0, 'Rating count cannot be negative'],
      },
    },
    images: [
      {
        type: String,
      },
    ],
    colors: [
      {
        name: {
          type: String,
          required: [true, 'Color name is required'],
          trim: true,
        },
        hex: {
          type: String,
          required: [true, 'Color hex code is required'],
          match: [/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'],
        },
        images: [
          {
            type: String,
          },
        ],
      },
    ],
    sizes: [
      {
        type: String,
        trim: true,
      },
    ],
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    flags: [
      {
        label: {
          type: String,
          required: [true, 'Flag label is required'],
          trim: true,
        },
        type: {
          type: String,
          enum: {
            values: ['info', 'success', 'warning', 'error'],
            message: 'Flag type must be one of: info, success, warning, error',
          },
          required: [true, 'Flag type is required'],
        },
        icon: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

ProductSchema.index({ name: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ inStock: 1 });

export default mongoose.model<IProduct>('Product', ProductSchema);
