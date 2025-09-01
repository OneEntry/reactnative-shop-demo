import React, {useCallback, useContext} from 'react';
import {TouchableOpacity, View} from 'react-native';
import GoBackButton from '../../ui/buttons/GoBackButton';
import Menu from '../../../assets/icons/menu.svg';
import {Screen} from '../../ui/templates/Screen';
import {DrawerActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppDispatch, useAppSelector} from '../../../state/hooks';
import {useAppNavigation} from '../../../navigation/types/types';
import {OpenDrawerContext} from '../../../state/contexts/OpenDrawerContext';
import {styleColors} from '../../../utils/consts';
import {setSearchValue} from '../../../state/reducers/FilterSlice';
import AppInput from '../../ui/inputs/AppInput';

type Props = {
  query: string;
};

const SearchHeader: React.FC<Props> = ({query}) => {
  const value = useAppSelector(state => state.filterReducer.search);
  const searchPlaceholder = useAppSelector(
    state => state.systemContentReducer.content.search_placeholder,
  );
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const {setOpen} = useContext(OpenDrawerContext);
  const handlePressToMenu = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
    setOpen(true);
  };

  //Save search history to AsyncStorage and navigate to shop screen with search value
  const onEndEditing = useCallback(async () => {
    if (value) {
      await AsyncStorage.setItem(
        'search-history',
        `${value} ${query.split(' ').slice(0, 5).join(' ')}`,
      );
      navigation.navigate('shop', {searchValue: value});
    }
  }, [value]);

  return (
    <Screen
      edges={['top', 'horizontal']}
      style={{backgroundColor: styleColors.gray_v2, paddingBottom: 36}}>
      <View className={'flex-row w-full justify-between items-center '}>
        <GoBackButton />
        <AppInput
          className={
            'bg-white text-[16px] font-normal px-4 py-2.5 rounded-full w-[235px]'
          }
          value={value || ''}
          setValue={value => dispatch(setSearchValue(value.value))}
          placeholder={searchPlaceholder}
          placeholderTextColor={styleColors.lightGray}
          onBlur={onEndEditing}
        />

        <TouchableOpacity className={'z-10'} onPress={handlePressToMenu}>
          <Menu width={24} />
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

export default SearchHeader;
