import {
  ActivityIndicator,
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import React, {PropsWithChildren} from 'react';
import {Paragraph, ParagraphProps} from '../texts/Paragraph';

export type ButtonProps = PropsWithChildren<
  TouchableOpacityProps & {
    style?: StyleProp<ViewStyle>;
    rounded?: boolean;
    paragraphProps?: ParagraphProps;
    isLoading?: boolean;
    Icon?: React.ReactElement;
  }
>;

export const Button = (props: ButtonProps) => {
  const {
    children,
    style,
    rounded,
    paragraphProps,
    isLoading,
    Icon,
    className,
    ...rest
  } = props;

  return (
    <TouchableOpacity
      className={`px-8 gap-x-5 flex-row items-center justify-center h-[60px] w-full ${
        rounded && 'rounded-full'
      } ${className}`}
      style={[style]}
      disabled={isLoading}
      {...rest}>
      {Icon}
      {isLoading ? (
        <ActivityIndicator size={'small'} />
      ) : (
        <Paragraph
          {...paragraphProps}
          className={'text-center'}
          style={[paragraphProps?.style]}>
          {children}
        </Paragraph>
      )}
    </TouchableOpacity>
  );
};
