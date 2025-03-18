import React, {FunctionComponent, memo} from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {Paragraph, ParagraphProps} from '../texts/Paragraph';
import {styleColors} from '../../../utils/consts';

export type InputProps = TextInputProps & {
  title: string;
  placeholder: string;
  containerStyle?: ViewStyle;
  onPressIcon?: () => void;
  Icon?: FunctionComponent;
  titleSize?: number;
  paragraphProps?: ParagraphProps;
  validation?: boolean;
  valid?: boolean;
};

const CustomInput: React.FC<InputProps> = ({
  title,
  placeholder,
  style,
  containerStyle,
  Icon,
  keyboardType,
  onPressIcon,
  titleSize = 14,
  paragraphProps,
  valid,
  validation = true,
  ...rest
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {title && (
        <Paragraph
          size={titleSize}
          weight={'400'}
          color={'border_color'}
          {...paragraphProps}>
          {title}
        </Paragraph>
      )}
      <TextInput
        keyboardType={keyboardType}
        placeholder={placeholder}
        style={[
          styles.input,
          !valid && validation && {borderColor: '#ff1d1d'},
          style,
        ]}
        {...rest}
      />
      {Icon && (
        <TouchableOpacity
          onPress={onPressIcon}
          style={{position: 'absolute', right: 0, bottom: 15}}>
          <Icon />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    textAlign: 'left',
    gap: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: styleColors.lightGray,
    width: '100%',
    fontSize: 14,
    paddingVertical: 5,
    fontWeight: '700',
    lineHeight: 20,
  },
});

export default memo(CustomInput);
