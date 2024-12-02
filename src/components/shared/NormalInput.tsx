import React, {forwardRef, FunctionComponent, useState} from 'react';
import {StyleSheet, TextInput, TextInputProps, View} from 'react-native';
import {styleColors} from '../../utils/consts';
import {IAttributes} from 'oneentry/dist/base/utils';
import Eye from './assets/PasswordVisible.svg';
import ClosedEye from './assets/PasswordInvisible.svg';
import {Paragraph} from '../ui/texts/Paragraph';
import {useAppSelector} from '../../store/hooks';
import AppInput, {InputValue} from '../ui/inputs/AppInput';

type Props = {
  field?: IAttributes;
  isPassword?: boolean;
  value: string;
  title?: string;
  setValue: (value: InputValue) => void;
  capitalize?: 'none' | 'sentences';
  isTitle?: boolean;
  onPressIcon?: () => void;
  Icon?: FunctionComponent;
  editable?: boolean;
} & TextInputProps;

const NormalInput = forwardRef<TextInput, Props>(
  (
    {
      field,
      isPassword,
      value,
      setValue,
      isTitle = true,
      capitalize,
      onPressIcon,
      Icon,
      title,
      editable = true,
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
            {title || field?.localizeInfos?.title}
          </Paragraph>
        )}
        <AppInput
          ref={ref}
          currentValidators={field?.validators}
          style={styles.input}
          value={value}
          validationErrorMessage={invalid_input_value}
          notValidStyles={styles.notValidStyles}
          secureTextEntry={isPassword && !visible}
          setValue={setValue}
          autoCapitalize={capitalize}
          editable={editable}
          placeholder={rest?.placeholder || field?.localizeInfos?.title || ''}
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
