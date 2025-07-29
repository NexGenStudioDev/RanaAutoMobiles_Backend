import SendResponse from '../../../utils/SendResponse';
import CategoryService from './Category.service';
import { Request, Response } from 'express';
import { Category_Validator } from './Category.validator';
import FileUpload from '../../../utils/FileUpload'; // Utility class for file uploads
import { ZodError } from 'zod';
import StatusCode_Constant from '../../../constant/StatusCode.constant';
import { Category_Constant } from './Category.consant';
import CategoryUtils from './Category.utils';

class Category_Controller {
  async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const { name, description } = Category_Validator.parse(req.body);

      let Find_Category = await CategoryUtils.findByName(name);
      if (Find_Category) {
        throw new Error(Category_Constant.CATEGORY_ALREADY_EXISTS);
      }

      console.log('req.file', req.file);

      if (!req.file) {
        throw new Error('Category image is required');
      }

      const categoryImage = await FileUpload.uploadFileInBunny(req.file);
      console.log('categoryImage', categoryImage);

      if (!categoryImage) {
        throw new Error('Failed to upload category image');
      }

      const newCategory = await CategoryService.createCategory({
        name,
        description,
        categoryImage,
      });

      SendResponse.success(
        res,
        StatusCode_Constant.CREATED,
        Category_Constant.CATEGORY_CREATED,
        newCategory
      );
    } catch (error: any) {
      console.error('Error creating category:', error);

      // Handle Zod validation errors
      if (error instanceof ZodError) {
        const zodMessage = error._zod.def[0].message;
        SendResponse.error(res, StatusCode_Constant.BAD_REQUEST, zodMessage);
      }

      // Handle other errors
      SendResponse.error(
        res,
        StatusCode_Constant.INTERNAL_SERVER_ERROR,
        error.message || 'Failed to create category'
      );
    }
  }

  async find_ProductByName(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.params;

      const category = await CategoryUtils.findProductsByCategoryName(name);

      if (!category) {
        SendResponse.error(
          res,
          StatusCode_Constant.NOT_FOUND,
          Category_Constant.CATEGORY_NOT_FOUND
        );
        return;
      }

      SendResponse.success(
        res,
        StatusCode_Constant.OK,
        Category_Constant.CATEGORY_FETCHED,
        category
      );
    } catch (error: any) {
      console.error('Error finding category by name:', error);
      SendResponse.error(
        res,
        StatusCode_Constant.INTERNAL_SERVER_ERROR,
        error.message || 'Failed to find category by name'
      );
    }
  }

  async findAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await CategoryUtils.findAllCategories();

      if (!categories || categories.length === 0) {
        throw new Error(Category_Constant.CATEGORY_NOT_FOUND);
      }

      SendResponse.success(
        res,
        StatusCode_Constant.OK,
        Category_Constant.CATEGORIES_FETCHED,
        categories
      );
    } catch (error: any) {
      console.error('Error finding all categories:', error);
      SendResponse.error(
        res,
        StatusCode_Constant.INTERNAL_SERVER_ERROR,
        error.message || 'Failed to find all categories'
      );
    }
  }
}

export default new Category_Controller();
