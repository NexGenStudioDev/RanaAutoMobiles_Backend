import { Router } from 'express';
import AuthMiddleWare from '../../../middleware/AuthMiddleWare';
import ProductController from './Product.controller';

const router = Router();

// Admin-only routes
router.post(
  '/v1/products',
  AuthMiddleWare.validateAdmin,
  ProductController.createProduct
);

router.put(
  '/v1/products/:id',
  AuthMiddleWare.validateAdmin,
  ProductController.updateProduct
);

router.delete(
  '/v1/products/:id',
  AuthMiddleWare.validateAdmin,
  ProductController.deleteProduct
);

router.get(
  '/v1/products/search',
  AuthMiddleWare.validateAdmin,
  ProductController.searchProductsByName
);

// Public routes
router.get('/v1/products', ProductController.getAllProducts);
router.get('/v1/products/:id', ProductController.getProductById);

export { router as Product_Router };
