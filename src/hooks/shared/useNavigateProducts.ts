import {useAppNavigation} from '../../navigation/types/types';

export const useNavigateProducts = ({id}: {id?: number}) => {
  const navigation = useAppNavigation();

  return {
    navigate: () => {
      id &&
        navigation.navigate('Products', {
          screen: 'Product',
          params: {id},
        });
    },
  };
};
