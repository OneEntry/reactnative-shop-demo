import {defineOneEntry} from 'oneentry';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PROJECT_URL, APP_TOKEN} from '@env';

const saveFunction = async (res: string) => {
  try {
    if (res) {
      await AsyncStorage.setItem('refresh-token', res);
    }
  } catch (e) {
    console.log('=>(hooks.ts:20) e', e);
  }
};

//Initial hooks definition
export let api = defineOneEntry(PROJECT_URL, {
  langCode: 'en_US',
  token: APP_TOKEN,
  auth: {
    saveFunction,
  },
  errors: {
    isShell: true,
  },
});

//This function used to update hooks config
export function reDefine(refreshToken?: string, langCode?: string) {
  console.log(langCode);
  api = defineOneEntry(PROJECT_URL, {
    langCode: langCode || 'en_US',
    token: APP_TOKEN,
    auth: {
      saveFunction,
      refreshToken,
    },
    errors: {
      customErrors: {
        400: e => {
          console.log(e);
        },
      },
    },
  });
}
