import React from 'react';
import {NavigationProps} from '../../navigation/types/types';
import {Screen} from '../../components/ui/templates/Screen';
import {useAuth} from '../../state/contexts/AuthContext';
import {
  ProfileHeader,
  ProfileContent,
  RemoveUserButton,
} from '../../components/content/ProfileScreen';
import UnauthorizedBlock from '../../components/shared/UnauthorizedBlock';

const ProfileScreen: React.FC<NavigationProps> = ({}) => {
  const {errorPage, user} = useAuth();
  const [editing, setEditing] = React.useState<boolean>(false);
  if (errorPage && !user) {
    return <UnauthorizedBlock page={errorPage} />;
  }

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
