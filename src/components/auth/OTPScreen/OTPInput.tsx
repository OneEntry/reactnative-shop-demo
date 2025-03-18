import React, {Dispatch, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Keyboard,
  Pressable,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Paragraph} from '../../ui/texts/Paragraph';
import {defineApi} from '../../../api';
import {useRoute} from '@react-navigation/native';
import {AuthActivateRouteProp} from '../../../navigation/utils/hooks';
import {useAppSelector} from '../../../state/hooks';
import {IError} from 'oneentry/dist/base/utils';

type Props = {
  value: string;
  setValue: Dispatch<string>;
};

const numbers = Array.from({length: 6}, (_, i) => i);
const CODE_LENGTH = numbers.length;

/**
 * A React component for entering a One-Time Password (OTP) code.
 *
 * @component OTPInput
 * @param {Props} props - The properties passed to the component.
 * @param {string} props.value - The current OTP code value.
 * @param {Dispatch<string>} props.setValue - Function to update the OTP code value.
 * @returns {React.ReactElement} A React element representing the OTP input fields and controls.
 */
const OTPInput: React.FC<Props> = ({
  value,
  setValue,
}: Props): React.ReactElement => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const {params} = useRoute<AuthActivateRouteProp>();
  const ref = useRef<TextInput>(null);
  const {enter_otp_code, receive_otp_text, resend_text} = useAppSelector(
    state => state.systemContentReducer.content,
  );

  const onResend = async () => {
    try {
      const result = await defineApi.AuthProvider.generateCode(
        params.method,
        params.email,
        params.event === 'activate' ? 'generate_code' : 'reset',
      );

      if ((result as IError).pageData) {
        throw new Error((result as IError).message);
      }
    } catch (e: any) {
      Alert.alert(e.message);
    }
  };

  const handleOnPress = () => {
    setIsKeyboardOpen(true);
    ref?.current?.focus();
  };

  /**
   * Listens for keyboard hide events and updates the keyboard open state.
   */
  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardOpen(false);
    });
  }, []);

  /**
   * Renders a single digit input field.
   *
   * @param {Object} param0 - Parameters for the digit component.
   * @param {number} param0.i - Index of the digit.
   * @returns {React.ReactElement} A React element representing a single digit input field.
   */
  const digitComponent = ({i}: {i: number}) => {
    const isCurrentDigit = i === value.length;
    const isLastDigit = i === CODE_LENGTH - 1;
    const isCodeFull = value.length === CODE_LENGTH;

    const isFocused =
      isKeyboardOpen && (isCurrentDigit || (isLastDigit && isCodeFull));

    const style = `h-[60px] w-10 items-center justify-center bg-[#F6F7F9] rounded-xxs ${
      isFocused && 'border-sm border-darkGray'
    }`;

    return (
      <Pressable onPress={handleOnPress} key={'Code' + i} className={style}>
        {value?.[i] && (
          <Paragraph size={20} weight={'500'} color={'gray'}>
            {value[i]}
          </Paragraph>
        )}
      </Pressable>
    );
  };

  return (
    <View className={'justify-center pt-16 gap-4'}>
      <Paragraph size={20}>{enter_otp_code}</Paragraph>
      <View className={'flex-row justify-between'}>
        {/* Hidden TextInput to handle the keyboard with autocomplete */}
        <TextInput
          ref={ref}
          value={value}
          onChangeText={setValue}
          keyboardType="number-pad"
          returnKeyType="done"
          textContentType="oneTimeCode"
          autoComplete={'one-time-code'}
          maxLength={numbers?.length}
          className={'absolute h-0 w-0 opacity-0'}
        />
        {/* OTP Input */}
        {numbers.map((_, i) => digitComponent({i}))}
      </View>
      <View className={'flex-row justify-between'}>
        <Paragraph size={18}>{receive_otp_text}</Paragraph>
        <TouchableOpacity onPress={onResend}>
          <Paragraph color={'background'} weight={'600'} size={18}>
            {resend_text}
          </Paragraph>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OTPInput;
