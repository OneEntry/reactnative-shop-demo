import React, {Dispatch, memo} from 'react';
import {View} from 'react-native';
import {useAppSelector} from '../../../state/hooks';
import CustomImage from '../../ui/templates/CustomImage';
import UpdateUserForm from './UpdateUserForm';

interface Props {
  editing: boolean;
  setEditing: Dispatch<boolean>;
}

const ProfileContent: React.FC<Props> = ({editing, setEditing}) => {
  const {round_logo} = useAppSelector(
    state => state.systemContentReducer.content,
  );

  return (
    <View className={'flex-1'}>
      <View className={'pt-layout items-center'}>
        <CustomImage uri={round_logo} height={141} width={141} />
      </View>
      {/*Form with user data*/}
      <UpdateUserForm editing={editing} setEditing={setEditing} />
    </View>
  );
};

export default memo(ProfileContent);
