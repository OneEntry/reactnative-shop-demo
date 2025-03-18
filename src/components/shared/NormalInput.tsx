import React, {forwardRef, FunctionComponent, useState} from 'react';
import {StyleSheet, TextInput, TextInputProps, View} from 'react-native';
import {styleColors} from '../../utils/consts';
import Eye from './assets/PasswordVisible.svg';
import ClosedEye from './assets/PasswordInvisible.svg';
import {Paragraph} from '../ui/texts/Paragraph';
import {useAppSelector} from '../../state/hooks';
import AppInput, {InputValue} from '../ui/inputs/AppInput';

type Props = {
  isPassword?: boolean;
  value: string;
  title?: string;
  setValue: (value: InputValue) => void;
  capitalize?: 'none' | 'sentences';
  isTitle?: boolean;
  onPressIcon?: () => void;
  Icon?: FunctionComponent;
  editable?: boolean;
  validators?: Record<any, any>;
} & TextInputProps;

const NormalInput = forwardRef<TextInput, Props>(
  (
    {
      isPassword,
      value,
      setValue,
      isTitle = true,
      capitalize,
      onPressIcon,
      Icon,
      title,
      editable = true,
      validators,
      ...rest
    },
    ref,
  ) => {
    const [visible, setVisible] = useState<boolean>(false);
    const {invalid_input_value} = useAppSelector(
      state => state.systemContentReducer.content,
    );

    const onReveal = () => {
      setVisible(!visible);
    };

    return (
      <View>
        {isTitle && (
          <Paragraph size={14} weight={'400'} color={'border_color'}>
            {title}
          </Paragraph>
        )}
        <AppInput
          ref={ref}
          currentValidators={validators}
          style={styles.input}
          value={value}
          validationErrorMessage={invalid_input_value}
          notValidStyles={styles.notValidStyles}
          secureTextEntry={isPassword && !visible}
          setValue={setValue}
          autoCapitalize={capitalize}
          editable={editable}
          placeholder={rest?.placeholder || ''}
          placeholderTextColor={styleColors.lightGray}
          Icon={isPassword ? (visible ? Eye : ClosedEye) : Icon}
          onPressIcon={isPassword ? onReveal : onPressIcon}
          {...rest}
        />
      </View>
    );
  },
);

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
    fontWeight: '400',
    lineHeight: 20,
  },
  notValidStyles: {
    backgroundColor: styleColors.lightRed,
    borderColor: styleColors.red,
  },
});
export default NormalInput;
