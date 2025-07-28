import { Product_Constant } from './Product.constant';
import ProductModel from './Product.model';
import { ProductInput } from './Product.validator';

class Product_Service {
  async createProduct(productData: ProductInput) {
    try {
      const newProduct = await ProductModel.create(productData);

      if (!newProduct) {
        throw new Error(Product_Constant.PRODUCT_CREATION_FAILED);
      }
      return newProduct;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async updateProduct(id: string, updateData: ProductInput) {
    try {
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      return updatedProduct;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const result = await ProductModel.findByIdAndDelete(id);
      return result !== null;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export default new Product_Service();
