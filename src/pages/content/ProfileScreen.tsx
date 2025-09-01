import React, {useCallback} from 'react';
import {NavigationProps, useAppNavigation} from '../../navigation/types/types';
import {Screen} from '../../components/ui/templates/Screen';
import {useAuth} from '../../state/contexts/AuthContext';
import {
  ProfileHeader,
  ProfileContent,
  RemoveUserButton,
} from '../../components/content/ProfileScreen';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {useAppDispatch} from '../../state/hooks';
import {setScreen} from '../../state/reducers/lastVisitedScreenSlice';

const ProfileScreen: React.FC<NavigationProps> = () => {
  const {user} = useAuth();
  const [editing, setEditing] = React.useState<boolean>(false);
  const dispatch = useAppDispatch();
  const params = useRoute();
  const navigation = useAppNavigation();

  useFocusEffect(
    useCallback(() => {
      if (!user) {
        // @ts-ignore
        navigation.replace('Auth');
        dispatch(setScreen(params.name));

        return () => {};
      }
    }, [user]),
  );

  if (!user) {
    return null;
  }

  return (
    <Screen isHideKeyboard isFull white edges={['horizontal', 'bottom']}>
      <ProfileHeader editing={editing} setEditing={setEditing} />
      <ProfileContent editing={editing} setEditing={setEditing} />
      <RemoveUserButton />
    </Screen>
  );
};

export default ProfileScreen;
