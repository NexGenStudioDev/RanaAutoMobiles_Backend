import zod from 'zod';

const ColorSchema = zod.object({
  name: zod.string().min(1, 'Color name is required'),
  hex: zod.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'),
  images: zod.array(zod.string()).optional().default([]),
});

const RatingSchema = zod.object({
  score: zod.number().min(0).max(5).default(0),
  count: zod.number().min(0).default(0),
});

const FlagSchema = zod.object({
  label: zod.string().min(1, 'Flag label is required'),
  type: zod.enum(['info', 'success', 'warning', 'error']),
  icon: zod.string().optional(),
});

export const Product_Validator = zod
  .object({
    name: zod
      .string()
      .min(1, 'Product name is required')
      .max(200, 'Product name cannot exceed 200 characters'),
    description: zod
      .string()
      .max(2000, 'Description cannot exceed 2000 characters')
      .optional(),
    price: zod.number().positive('Price must be positive'),
    modelNumber: zod
      .string()
      .max(50, 'Model number cannot exceed 50 characters')
      .optional(),
    discountPrice: zod
      .number()
      .positive('Discount price must be positive')
      .optional(),
    currency: zod.string().default('INR'),
    inStock: zod.boolean().default(true),
    sap: zod.union([zod.string(), zod.number()]).optional(),
    rating: RatingSchema.optional().default({ score: 0, count: 0 }),
    images: zod.array(zod.string()).default([]),
    colors: zod.array(ColorSchema).default([]),
    sizes: zod.array(zod.string()).default([]),
    category: zod.string().min(1, 'Category is required'),
    tags: zod.array(zod.string()).optional().default([]),
    flags: zod.array(FlagSchema).optional().default([]),
  })
  .strict();

  export type ProductInput = zod.infer<typeof Product_Validator>;