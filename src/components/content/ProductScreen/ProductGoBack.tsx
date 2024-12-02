import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import GoBackButton from '../../ui/buttons/GoBackButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Search from '../../../assets/icons/search-icon.svg';
import Menu from '../../../assets/icons/menu.svg';
import {navigate} from '../../../navigation/utils/NavigatonRef';
import {DrawerActions} from '@react-navigation/native';
import {useAppNavigation} from '../../../navigation/types/types';

interface Props {}

const ProductGoBack: React.FC<Props> = ({}) => {
  const insets = useSafeAreaInsets();
  const navigation = useAppNavigation();

  const handlePressToMenu = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  return (
    <View
      className={
        'z-10 absolute w-full px-layout flex-row justify-between items-center'
      }
      style={[{top: insets.top > 5 ? insets.top : 10}]}>
      <GoBackButton />
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
        <TouchableOpacity onPress={() => navigate('Search')}>
          <Search width={24} />
        </TouchableOpacity>
        <TouchableOpacity className={'p-1'} onPress={handlePressToMenu}>
          <Menu width={24} color={'black'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductGoBack;
