import {Dispatch, useEffect} from 'react';
import {defineApi} from '../../api';
import {IProductsEntity} from 'oneentry/dist/products/productsInterfaces';

type Props = {
  products: IProductsEntity[];
  setProducts: Dispatch<IProductsEntity[]>;
};

/**
 * Custom hook for handling WebSocket connections and updating product data in real-time.
 *
 * @function UseWebSocket
 * @param {Props} props - The properties passed to the hook.
 * @param {IProductsEntity[]} props.products - The array of products to monitor for updates.
 * @param {Dispatch<IProductsEntity[]>} props.setProducts - The function to update the product list in the state.
 */
const UseWebSocket = ({products, setProducts}: Props) => {
  useEffect(() => {
    if (products) {
      const ws = defineApi.WS.connect();
      if (ws) {
        /**
         * Handles incoming WebSocket events and modifies products.
         * Updates the price and status of the corresponding product in the state.
         * Learn more about WebSockets in our docs: https://doc.oneentry.cloud/docs/events/introduction
         */
        ws.on('notification', async res => {
          if (res?.product) {
            const product = {
              ...res.product,
              attributeValues: res.product?.attributes,
            };

            const index = products.findIndex(
              (p: IProductsEntity) => p.id === product.id,
            );
            const newPrice = parseInt(
              product?.attributeValues?.price?.value,
              10,
            );

            // @ts-ignore
            setProducts((prevProducts: IProductsEntity[]) => {
              const newProducts = [...prevProducts];
              newProducts[index] = {
                ...products[index],
                price: newPrice,
                statusIdentifier: res?.product?.status?.identifier,
              };
              return newProducts;
            });
          }
        });

        /**
         * Cleans up the WebSocket connection when the component unmounts.
         */
        return () => {
          ws.disconnect();
        };
      }
    }
  }, [products]);
};

export default UseWebSocket;
