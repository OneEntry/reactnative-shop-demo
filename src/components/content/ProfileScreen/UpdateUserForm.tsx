import React, {
  Dispatch,
  memo,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {Alert, TextInput, View} from 'react-native';
import {Button} from '../../ui/buttons/Button';
import LogOutButton from './LogOutButton';
import {useAppSelector} from '../../../store/hooks';
import {AuthContext} from '../../../providers/AuthContext';
import {IAuthFormData} from 'oneentry/dist/auth-provider/authProvidersInterfaces';
import {api} from '../../../api';
import NormalInput from '../../shared/NormalInput';
import {InputValue} from '../../ui/inputs/AppInput';
import {IError} from 'oneentry/dist/base/utils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import {styleColors} from '../../../utils/consts';

type Props = {
  editing: boolean;
  setEditing: Dispatch<boolean>;
};

const UpdateUserForm: React.FC<Props> = ({editing, setEditing}) => {
  const {user_name_placeholder, user_phone_placeholder} = useAppSelector(
    state => state.systemContentReducer.content,
  );
  const [nameValue, setNameValue] = useState<string>('');
  const [phoneValue, setPhoneValue] = useState<string>('');
  const [addressValue, setAddressValue] = useState<string>('');
  const {user, refreshUser} = useContext(AuthContext);
  const usernameRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const addressRef = useRef<TextInput>(null);

  const onUpdateUserData = async () => {
    try {
      //Transform data to IAuthFormData
      const formData: IAuthFormData[] = [];

      if (nameValue) {
        formData.push({
          marker: 'name_reg',
          value: nameValue,
          type: 'string',
        });
      }

      if (phoneValue) {
        formData.push({
          marker: 'phone_reg',
          value: phoneValue,
          type: 'string',
        });
      }

      if (addressValue) {
        formData.push({
          marker: 'address_reg',
          value: addressValue,
          type: 'string',
        });
      }

      if (user?.formIdentifier) {
        const res = await api.Users.updateUser({
          formIdentifier: user.formIdentifier,
          formData,
        });
        if ((res as IError)?.statusCode >= 400) {
          throw new Error((res as IError)?.message);
        }
      }

      //Close keyboard and set editing to false
      usernameRef.current?.blur();
      phoneRef.current?.blur();
      addressRef.current?.blur();
      refreshUser();
      setEditing(!editing);
    } catch (e: any) {
      Alert.alert(e.message);
      console.error(e);
      refreshUser();
    }
  };

  useEffect(() => {
    // @ts-ignore
    const fields = user?.formData;
    //Fill inputs with user data
    if (fields) {
      fields.map((item) => {
        if (item.marker === 'phone_reg') {
          setPhoneValue(item.value);
        }

        if (item.marker === 'name_reg') {
          setNameValue(item.value);
        }

        if (item.marker === 'address_reg') {
          setAddressValue(item.value);
        }
      });
    }
  }, [user]);

  const onUpdateNameValue = (value: InputValue) => {
    setNameValue(value.value);
  };

  const onUpdatePhoneValue = (value: InputValue) => {
    setPhoneValue(value.value);
  };

  const onUpdateAddressValue = (value: InputValue) => {
    setAddressValue(value.value);
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{flex: 1}}
      bottomOffset={65}>
      <View style={{gap: 10}}>
        <NormalInput
          ref={usernameRef}
          value={nameValue}
          setValue={onUpdateNameValue}
          placeholder={user_name_placeholder}
          title={user_name_placeholder}
          onPress={() => setEditing(true)}
        />
        <NormalInput
          ref={phoneRef}
          value={phoneValue}
          setValue={onUpdatePhoneValue}
          placeholder={user_phone_placeholder}
          title={user_phone_placeholder}
          onPress={() => setEditing(true)}
          keyboardType={'phone-pad'}
        />
        <NormalInput
          ref={addressRef}
          value={addressValue}
          setValue={onUpdateAddressValue}
          placeholder={'Address'}
          title={'Address'}
          onPress={() => setEditing(true)}
        />
      </View>

      {editing ? (
        <Button
          rounded
          className={'absolute bottom-10 bg-accent'}
          paragraphProps={{
            style: {color: '#fff'},
            weight: 'bold',
            size: 16,
          }}
          onPress={onUpdateUserData}>
          SAVE
        </Button>
      ) : (
        <LogOutButton
          style={{
            position: 'absolute',
            bottom: 40,
            backgroundColor: styleColors.background,
          }}
          provider={'email'}
        />
      )}
    </KeyboardAwareScrollView>
  );
};

export default memo(UpdateUserForm);
