import React, {Dispatch} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import GoBackButton from '../../ui/buttons/GoBackButton';
import {styleColors} from '../../../utils/consts';
import {Paragraph} from '../../ui/texts/Paragraph';
import {Screen} from '../../ui/templates/Screen';
import {RouteProp, useRoute} from '@react-navigation/native';
import {DrawerStackNavigatorParamList} from '../../../navigation';

type Props = {
  setEditing: Dispatch<boolean>;
  editing: boolean;
};

const ProfileHeader: React.FC<Props> = ({setEditing, editing}) => {
  const {params} = useRoute<RouteProp<DrawerStackNavigatorParamList>>();

  const onEdit = () => {
    setEditing(!editing);
  };

  return (
    <Screen
      className={'justify-between flex-row items-center w-full'}
      edges={['top']}>
      <View className={'z-10'}>
        <GoBackButton style={{backgroundColor: styleColors.gray_v2}} />
      </View>
      <View
        className={
          'absolute w-full h-full justify-center items-center bottom-0'
        }>
        <Paragraph weight={'600'} size={24} color={'gray'}>
          {params?.title}
        </Paragraph>
      </View>
      <TouchableOpacity onPress={onEdit}>
        <Image
          className={`h-5 w-5`}
          style={{tintColor: editing ? styleColors.background : undefined}}
          source={require('./assets/EditUser.png')}
        />
      </TouchableOpacity>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
});
export default ProfileHeader;
