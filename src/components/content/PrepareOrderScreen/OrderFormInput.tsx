import React, {FunctionComponent} from 'react';
import NormalInput from '../../shared/NormalInput';
import {IAttributes} from 'oneentry/dist/base/utils';
import {InputValue} from '../../ui/inputs/AppInput';
import {useAppDispatch} from '../../../state/hooks';
import {addData} from '../../../state/reducers/OrderReducer';
import {TextInputProps} from 'react-native';

type Props = {
  field: IAttributes;
  value: string;
  onPressIcon?: () => void;
  Icon?: FunctionComponent;
  editable?: boolean;
  initialValue?: string;
} & TextInputProps;

const OrderFormInput: React.FC<Props> = ({
  field,
  value,
  onPressIcon,
  editable,
  Icon,
  ...rest
}) => {
  const dispatch = useAppDispatch();

  const onChangeText = (val: InputValue) => {
    dispatch(
      addData({
        marker: field?.marker,
        type: 'string',
        value: val.value,
        valid: val.valid,
      }),
    );
  };

  return (
    <NormalInput
      validators={field.validators}
      value={value}
      isTitle={false}
      onPressIcon={onPressIcon}
      Icon={Icon}
      editable={editable}
      setValue={onChangeText}
      {...rest}
    />
  );
};

export default OrderFormInput;
