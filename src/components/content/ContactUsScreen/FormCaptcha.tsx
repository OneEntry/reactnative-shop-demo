import {Dispatch, forwardRef, useEffect} from 'react';
import {Alert, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
// import {
//   execute,
//   initClient, RecaptchaAction
// } from "@google-cloud/recaptcha-enterprise-react-native";

type Props = {
  setToken: Dispatch<string>;
  token: string;
  setIsCaptcha: Dispatch<boolean>;
  captchaKey: string;
  captchaDomain: string;
  onSuccess: () => void;
};

export const FormCaptcha = ({
  setToken,
  setIsCaptcha,
  onSuccess,
  captchaKey,
  captchaDomain,
}: Props) => {
  const {top} = useSafeAreaInsets();

  // const captchaProcess = async () => {
  //   try {
  //     await initClient('6LdwewQrAAAAAOUHxTNzdKy1U1yz2y-syl8LmJgp');
  //     const token = execute(RecaptchaAction.LOGIN(), 10000).then((tok) => {
  //       console.log(tok);
  //     });
  //     // console.log('token ' + token);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
  // useEffect(() => {
  //   if (captchaKey) {
  //     captchaProcess();
  //   }
  // }, [captchaKey]);

  return <View></View>;
};
