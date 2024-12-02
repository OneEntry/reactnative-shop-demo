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
import {api} from '../../../api';
import {useRoute} from '@react-navigation/native';
import {AuthActivateRouteProp} from '../../../navigation/utils/hooks';
import {useAppSelector} from '../../../store/hooks';

type Props = {
  value: string;
  setValue: Dispatch<string>;
};

const numbers = Array.from({length: 6}, (_, i) => i);
const CODE_LENGTH = numbers.length;

const OTPInput: React.FC<Props> = ({value, setValue}) => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const {params} = useRoute<AuthActivateRouteProp>();
  const ref = useRef<TextInput>(null);
  const {enter_otp_code, receive_otp_text, resend_text} = useAppSelector(
    state => state.systemContentReducer.content,
  );

  const onResend = async () => {
    try {
      await api.AuthProvider.generateCode(
        params.method,
        params.email,
        params.event === 'activate' ? 'generate_code' : 'reset',
      );
    } catch (e: any) {
      Alert.alert(e.message);
      console.log(e);
    }
  };

  const handleOnPress = () => {
    setIsKeyboardOpen(true);
    ref?.current?.focus();
  };

  // Functionalities to close the keyboard when it is hidden
  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardOpen(false);
    });
  }, []);

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
