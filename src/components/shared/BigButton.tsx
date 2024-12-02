import React from 'react';
import {TextStyle, ViewStyle} from 'react-native';
import {Button, ButtonProps} from '../ui/buttons/Button';
import {styleColors} from '../../utils/consts';

type Props = {
  action: () => void;
  title: string;
  Icon?: React.ReactElement;
  styles?: ViewStyle;
  outline?: boolean;
  paragraphStyle?: TextStyle;
} & ButtonProps;

const BigButton: React.FC<Props> = ({
  action,
  Icon,
  paragraphStyle,
  title,
  outline = true,
  styles,
  ...rest
}) => {
  return (
    <Button
      rounded
      className={`w-full ${
        outline
          ? !rest.disabled
            ? 'border-accent border-sm'
            : 'border-gray border-sm'
          : !rest.disabled
          ? 'bg-accent'
          : 'bg-gray'
      }`}
      style={[styles]}
      paragraphProps={{
        weight: '600',
        style: [
          {
            color: outline ? styleColors.background : styleColors.white,
            fontSize: 20,
          },
          paragraphStyle,
        ],
      }}
      Icon={Icon}
      onPress={action}
      {...rest}>
      {title}
    </Button>
  );
};

export default BigButton;
