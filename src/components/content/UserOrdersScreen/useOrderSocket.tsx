import {useEffect} from 'react';
import {defineApi} from '../../../api';

type Props = {
  refetch: () => void;
};

/**
 * Custom hook for handling WebSocket connections and updating product data in real-time.
 *
 * @function useOrderSocket
 */
const useOrderSocket = ({refetch}: Props) => {
  useEffect(() => {
    const ws = defineApi.WS.connect();
    if (ws) {
      /**
       * Handles incoming WebSocket events and modifies products.
       * Updates the price and status of the corresponding product in the state.
       * Learn more about WebSockets in our docs: https://doc.oneentry.cloud/docs/events/introduction
       */
      ws.on('notification', async res => {
        if (res.order) {
          refetch();
        }
      });

      /**
       * Cleans up the WebSocket connection when the component unmounts.
       */
      return () => {
        ws.disconnect();
      };
    }
  }, []);

  return {};
};

export default useOrderSocket;
