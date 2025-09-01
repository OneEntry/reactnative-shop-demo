/* eslint-disable prettier/prettier */
import {Dispatch, useEffect} from 'react';
import {defineApi} from '../../api';
import {IProductsEntity} from 'oneentry/dist/products/productsInterfaces';
import {useAppDispatch, useAppSelector} from '../../state/hooks';
import {updateCartItemAvailability} from '../../state/reducers/userStateSlice';

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
  const dispatch = useAppDispatch();
  const cart = useAppSelector(state => state.userStateReducer.cart);
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
          console.log(res);

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

            // Получаем старый статус продукта для сравнения
            const oldProduct = products[index];
            const oldStatus = oldProduct?.statusIdentifier;
            const newStatus = res?.product?.status?.identifier;

            // Проверяем изменение статуса доступности
            const wasOutOfStock = oldStatus === 'out_of_stock';
            const isNowInStock = newStatus === 'in_stock';

            // Если продукт есть в корзине и изменился статус доступности
            const cartItem = cart.find(item => item.id === product.id);
            if (cartItem && wasOutOfStock && isNowInStock) {
              dispatch(updateCartItemAvailability({
                productId: product.id,
                wasOutOfStock: true,
                isNowInStock: true,
              }));
            }

            // @ts-ignore
            setProducts((prevProducts: IProductsEntity[]) => {
              const newProducts = [...prevProducts];

              newProducts[index] = {
                ...products[index],
                price: newPrice,
                statusIdentifier: newStatus,
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
  }, [products, cart, dispatch]);
};

export default UseWebSocket;
