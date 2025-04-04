import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {NavigationProps, useAppNavigation} from '../../navigation/types/types';
import {Screen} from '../../components/ui/templates/Screen';
import {useAuth} from '../../state/contexts/AuthContext';
import {
  ProfileHeader,
  ProfileContent,
  RemoveUserButton,
} from '../../components/content/ProfileScreen';
import UnauthorizedBlock from '../../components/shared/UnauthorizedBlock';
import {useFocusEffect} from '@react-navigation/native';

const ProfileScreen: React.FC<NavigationProps> = ({}) => {
  const {errorPage, user} = useAuth();
  const [editing, setEditing] = React.useState<boolean>(false);
  const navigation = useAppNavigation();

  useFocusEffect(
    useCallback(() => {
      if (!user) {
        navigation.replace('Auth', {screen: 'auth_hone'});
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
