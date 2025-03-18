import React, {forwardRef, FunctionComponent, useState} from 'react';
import {
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInputProps,
  Image,
} from 'react-native';
import {InputValue} from '../ui/inputs/AppInput';
import {Paragraph, ParagraphProps} from '../ui/texts/Paragraph';
import {styleColors} from '../../utils/consts';
import {validators as validationMethods} from '../../utils/validators';

type Props = {
  title?: string;
  onPressIcon?: () => void;
  Icon?: FunctionComponent;
  validators?: Record<string, any>;
  value: InputValue;
  setValue: (value: InputValue) => void;
  errorParagraphProps?: ParagraphProps;
  errorMessage?: string;
  type?: 'normal' | 'compact';
} & Omit<TextInputProps, 'value'>;

const CustomInput = forwardRef<TextInput, Props>(
  (
    {
      title,
      Icon,
      validators,
      value,
      setValue,
      onPressIcon,
      errorParagraphProps,
      errorMessage,
      type = 'normal',
      ...rest
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const {style, ...other} = rest;

    const onChange = (val: string) => {
      let valid = true;
      if (validators) {
        valid = Object.keys(validators)?.reduce(
          (isValid, validator: string): boolean => {
            if (!val) {
              return false;
            }
            // @ts-ignore
            const validatorFunc = validationMethods[validator];
            const result = validatorFunc
              ? validatorFunc(val, validators[validator])
              : true;

            if (isValid) {
              return result;
            } else {
              return false;
            }
          },
          true,
        );
      }

      setValue({value: val, valid});
    };

    return (
      <View className={'gap-y-1.5'}>
        {title && (
          <Paragraph size={14} weight={'400'} color={'border_color'}>
            {title}
          </Paragraph>
        )}
        <View className={'flex-row justify-between items-center'}>
          <TextInput
            style={[
              style,
              type === 'normal' ? styles.normalInput : styles.compactInput,
              !value?.valid ? styles.invalidValue : styles.validStyles,
              isFocused && styles.focusedStyles,
              other.multiline && styles.multilineInputStyle,
            ]}
            value={value?.value}
            placeholderTextColor={styleColors.gray}
            onChangeText={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            ref={ref}
            {...other}
          />

          {Icon && (
            <TouchableOpacity
              onPress={onPressIcon}
              className={'absolute right-0 h-full justify-center'}>
              <Icon />
            </TouchableOpacity>
          )}
        </View>

        {!value?.valid && (
          <View style={styles.errorContainer}>
            <Image
              style={{width: 15, height: 15}}
              source={require('./assets/alert_circle.png')}
            />
            <Paragraph size={12} color={'red'} {...errorParagraphProps}>
              {errorMessage}
            </Paragraph>
          </View>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  invalidValue: {
    backgroundColor: '#f8d7d7',
    borderColor: styleColors.red,
  },
  normalInput: {
    borderBottomWidth: 1,
    borderColor: styleColors.lightGray,
    width: '100%',
    fontSize: 14,
    paddingVertical: 5,
    fontWeight: '400',
    lineHeight: 20,
  },
  compactInput: {
    backgroundColor: styleColors.gray_v2,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: styleColors.gray,
    fontWeight: '400',
    height: 38,
    width: '100%',
    fontSize: 16,
    marginTop: 3,
  },
  multilineInputStyle: {
    marginTop: 3,
    height: 186,
    paddingTop: 10,
    paddingBottom: 10,
  },
  validStyles: {
    borderColor: styleColors.gray,
  },
  focusedStyles: {
    borderColor: styleColors.background,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});

export default CustomInput;
