import { productsIndex } from "lib/algolia";

type singleProduct = {
  objectID: string;
  title: string;
  status: string;
  price: number;
  id: number;
  vendor_id: string;
  color: string;
};

export class Product {
  products: any;
  singleProduct: singleProduct;

  async searchProducts(query: string, limit: number, offset: number) {
    const results = await productsIndex.search(query, {
      length: limit,
      offset,
    });

    this.products = results.hits;

    return {
      results: results.hits,
      pagination: {
        offset,
        limit,
        total: results.nbHits,
      },
    };
  }

  static async searchProductById(id: string) {
    const result = await productsIndex.getObject(id);
    const newProduct = new Product();
    newProduct.singleProduct = result as singleProduct;

    return newProduct;
  }
}
