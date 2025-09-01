import {IProductsEntity} from 'oneentry/dist/products/productsInterfaces';

export const findProductsOutOfStock = (products: IProductsEntity[]) => {
  return products.filter(
    product => product.statusIdentifier === 'out_of_stock',
  );
};
