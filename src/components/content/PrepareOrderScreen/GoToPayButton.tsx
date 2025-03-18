import React, {useMemo} from 'react';
import {Button} from '../../ui/buttons/Button';
import {navigate} from '../../../navigation/utils/NavigatonRef';
import {useAppSelector} from '../../../state/hooks';

/**
 * A button component that checks if the order form data is valid and allows navigation to the payment screen.
 * This component retrieves the order's form data from Redux, validates it, and enables/disables the button based on the validation result.
 *
 * @component GoToPayButton
 * @returns {React.ReactElement} A button that navigates to the payment screen when clicked and all form fields are valid.
 */
const GoToPayButton: React.FC<Props> = (): React.ReactElement => {
  const {go_to_pay_placeholder} = useAppSelector(
    state => state.systemContentReducer.content,
  );

  /**
   * Retrieves the current order state from Redux, including its form data.
   */
  const {order} = useAppSelector(state => state.orderReducer);

  /**
   * Memoized computation to determine if the form data is valid.
   * Iterates through the order's form data and checks if all fields are valid.
   *
   * @returns {boolean} True if all form fields are valid, false otherwise.
   */
  const canSubmit = useMemo(() => {
    if (!order?.formData) {
      return false;
    }
    //Check if the order has form data and validate each form field
    return Object.keys(order.formData).every(key => {
      const field = order.formData[key];
      return field?.valid !== undefined ? field.valid : true;
    });
  }, [order]);

  const onSubmitOrder = async () => {
    if (order && canSubmit) {
      navigate('payment');
    }
  };

  return (
    <Button
      rounded
      disabled={!canSubmit}
      className={'bg-accent'}
      paragraphProps={{
        style: {color: '#fff'},
        weight: 'bold',
        size: 16,
      }}
      onPress={onSubmitOrder}>
      {go_to_pay_placeholder?.toUpperCase()}
    </Button>
  );
};

type Props = {};

export default GoToPayButton;
