import {Dispatch, forwardRef, useEffect} from 'react';
import Recaptcha, {RecaptchaRef} from 'react-native-recaptcha-that-works';
import {Alert, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {PROJECT_URL} from '@env';

type Props = {
  setToken: Dispatch<string>;
  token: string;
  setIsCaptcha: Dispatch<boolean>;
  captchaKey: string;
  captchaDomain: string;
  onSuccess: () => void;
};

export const FormCaptcha = forwardRef<RecaptchaRef, Props>(
  ({setToken, setIsCaptcha, onSuccess, captchaKey, captchaDomain}, ref) => {
    const {top} = useSafeAreaInsets();

    useEffect(() => {
      setIsCaptcha(true);
    }, []);

    const onVerify = (token: any) => {
      setToken(token);
      onSuccess();
    };

    const onExpire = () => {
      console.warn('expired!');
    };

    const onLoad = () => {
      console.log('loading');
    };

    const onError = (e: any) => {
      console.log('error ' + e);
      Alert.alert(`${e}`);
    };

    return (
      <View>
        <Recaptcha
          ref={ref}
          siteKey={captchaKey}
          baseUrl={captchaDomain}
          onVerify={onVerify}
          onExpire={onExpire}
          onError={onError}
          onLoad={onLoad}
          webViewProps={{
            containerStyle: {
              paddingTop: top,
            },
          }}
          size="normal"
          enterprise={false}
        />
      </View>
    );
  },
);
