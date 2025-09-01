// Packages imports
import {useRef} from 'react';

interface OTPKeyboardHookProps {
  maxLength?: number;
  onPress?: any;
  onSubmitPress?: any;
}

export default function useTextManager({
  maxLength,
  onPress,
  onSubmitPress,
}: OTPKeyboardHookProps) {
  // Local Variable for the input value
  const OTP = useRef<string>('');

  // Callback fired on press of a key
  const onKeyPress = (text: string | undefined) => {
    try {
      if (maxLength && OTP.current.length >= maxLength) {
        return;
      }

      if (text) {
        OTP.current = OTP.current + text;
        if (typeof onPress === 'function') {
          onPress(OTP.current);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Callback fired on backspace press
  const onBackSpacePress = () => {
    try {
      OTP.current = OTP.current.slice(0, -1);
      if (typeof onPress === 'function') {
        onPress(OTP.current);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Callback fired on submit press
  const onSubmit = () => {
    try {
      if (typeof onSubmitPress === 'function') {
        onSubmitPress(OTP.current);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Exporting the callbacks here
  return {
    onKeyPress,
    onBackSpacePress,
    onSubmit,
  };
}
