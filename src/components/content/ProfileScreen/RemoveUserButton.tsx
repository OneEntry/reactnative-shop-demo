import React, {useState} from 'react';
import {defineApi} from '../../../api';
import {useAuth} from '../../../state/contexts/AuthContext';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import {Paragraph} from '../../ui/texts/Paragraph';
import {useAppSelector} from '../../../state/hooks';

type Props = object;

const RemoveUserButton: React.FC<Props> = () => {
  const {authenticate, logOutUser} = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {remove_user_text} = useAppSelector(
    state => state.systemContentReducer.content,
  );

  const removeUser = async () => {
    try {
      setIsLoading(true);
      const deleteUser = await defineApi.Users.deleteUser();
      console.log('=>(RemoveUserButton.tsx:21) deleteUser', deleteUser);

      await logOutUser();
      authenticate();
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
        {remove_user_text}
      </Paragraph>
    </TouchableOpacity>
  );
};

export default RemoveUserButton;
