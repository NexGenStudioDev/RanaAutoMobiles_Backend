import { Request, Response } from 'express';
import { ZodError } from 'zod';
import StatusCode_Constant from '../../../constant/StatusCode.constant';
import SendResponse from '../../../utils/SendResponse';
import { Product_Constant } from './Product.constant';
import ProductService from './Product.service';
import ProductUtils from './Product.utils';
import { Product_Validator } from './Product.validator';

class Product_Controller {
  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = Product_Validator.parse(req.body);

      const Find_Product = await ProductUtils.findByName(validatedData.name);
      if (Find_Product) {
        throw new Error(Product_Constant.PRODUCT_ALREADY_EXISTS);
      }

      const newProduct = await ProductService.createProduct(validatedData);

      SendResponse.success(
        res,
        StatusCode_Constant.CREATED,
        Product_Constant.PRODUCT_CREATED,
        newProduct
      );
    } catch (error: any) {
      console.error('Error creating product:', error);

      if (error instanceof ZodError) {
        const zodMessage = error.issues[0].message;
        SendResponse.error(res, StatusCode_Constant.BAD_REQUEST, zodMessage);
        return;
      }

      SendResponse.error(
        res,
        StatusCode_Constant.INTERNAL_SERVER_ERROR,
        error.message || 'Failed to create product'
      );
    }
  }

  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await ProductUtils.getAllProducts(page, limit);

      SendResponse.success(
        res,
        StatusCode_Constant.OK,
        Product_Constant.PRODUCTS_FETCHED,
        {
          products: result.products,
          pagination: {
            currentPage: page,
            totalPages: result.totalPages,
            totalProducts: result.total,
            hasNextPage: page < result.totalPages,
            hasPrevPage: page > 1,
          },
        }
      );
    } catch (error: any) {
      console.error('Error getting all products:', error);
      SendResponse.error(
        res,
        StatusCode_Constant.INTERNAL_SERVER_ERROR,
        error.message || 'Failed to retrieve products'
      );
    }
  }

  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await ProductUtils.findById(id);

      if (!product) {
        SendResponse.error(
          res,
          StatusCode_Constant.NOT_FOUND,
          Product_Constant.PRODUCT_NOT_FOUND
        );
        return;
      }

      SendResponse.success(
        res,
        StatusCode_Constant.OK,
        Product_Constant.PRODUCT_FETCHED,
        product
      );
    } catch (error: any) {
      console.error('Error finding product by ID:', error);
      SendResponse.error(
        res,
        StatusCode_Constant.INTERNAL_SERVER_ERROR,
        error.message || 'Failed to retrieve product'
      );
    }
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = Product_Validator.parse(req.body);

      const product = await ProductService.updateProduct(id, validatedData);

      if (!product) {
        SendResponse.error(
          res,
          StatusCode_Constant.NOT_FOUND,
          Product_Constant.PRODUCT_NOT_FOUND
        );
        return;
      }

      SendResponse.success(
        res,
        StatusCode_Constant.OK,
        Product_Constant.PRODUCT_UPDATED,
        product
      );
    } catch (error: any) {
      console.error('Error updating product:', error);

      if (error instanceof ZodError) {
        const zodMessage = error.issues[0].message;
        SendResponse.error(res, StatusCode_Constant.BAD_REQUEST, zodMessage);
        return;
      }

      SendResponse.error(
        res,
        StatusCode_Constant.INTERNAL_SERVER_ERROR,
        error.message || 'Failed to update product'
      );
    }
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await ProductService.deleteProduct(id);

      if (!deleted) {
        SendResponse.error(
          res,
          StatusCode_Constant.NOT_FOUND,
          Product_Constant.PRODUCT_NOT_FOUND
        );
        return;
      }

      SendResponse.success(
        res,
        StatusCode_Constant.OK,
        Product_Constant.PRODUCT_DELETED,
        null
      );
    } catch (error: any) {
      console.error('Error deleting product:', error);
      SendResponse.error(
        res,
        StatusCode_Constant.INTERNAL_SERVER_ERROR,
        error.message || 'Failed to delete product'
      );
    }
  }

  async searchProductsByName(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.query;

      if (!name || typeof name !== 'string') {
        SendResponse.error(
          res,
          StatusCode_Constant.BAD_REQUEST,
          'Search name is required'
        );
        return;
      }

      const products = await ProductUtils.searchByName(name);

      SendResponse.success(
        res,
        StatusCode_Constant.OK,
        Product_Constant.PRODUCTS_FETCHED,
        products
      );
    } catch (error: any) {
      console.error('Error searching products by name:', error);
      SendResponse.error(
        res,
        StatusCode_Constant.INTERNAL_SERVER_ERROR,
        error.message || 'Failed to search products'
      );
    }
  }
}

export default new Product_Controller();
