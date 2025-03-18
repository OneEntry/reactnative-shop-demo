import React, { useState} from 'react';
import {defineApi} from '../../../api';
import {useAuth } from "../../../state/contexts/AuthContext";
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import {Paragraph} from '../../ui/texts/Paragraph';

type Props = {};

const RemoveUserButton: React.FC<Props> = ({}) => {
  const {authenticate, user, logOutUser} = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const removeUser = async () => {
    try {
      setIsLoading(true);
      const form = await defineApi.Users.deleteUser();
      const res = logOutUser();
      if (!res.error) {
        authenticate();
      }
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View className={'w-full items-center mb-4 justify-start'}>
        <ActivityIndicator size={'small'} color={'black'} />
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={removeUser}
      className={'w-full items-center mb-4 justify-start'}>
      <Paragraph size={20} color={'red'}>
        Remove user
      </Paragraph>
    </TouchableOpacity>
  );
};

export default RemoveUserButton;
