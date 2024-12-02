import React, {
  Dispatch,
  memo,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {TouchableOpacity, View} from 'react-native';
import Filter from '../../../assets/icons/Filter.svg';
import {Paragraph} from '../../ui/texts/Paragraph';
import PopUpMenu from '../../shared/PopUpMenu';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {
  addFilter,
  removeFilter,
  setSortFilterActive,
} from '../../../store/reducers/FilterSlice';
import {IFilterParams} from 'oneentry/dist/products/productsInterfaces';
import {IPositionBlock} from 'oneentry/dist/pages/pagesInterfaces';
import {useGetAttributesByMarker} from '../../../api';
import {IListTitle} from 'oneentry/dist/attribute-sets/attributeSetsInterfaces';
import Sort from '../../../assets/icons/Sort.svg';
import FilterModal from './CatalogFiltersModal';
import {useGetAttributesByMarkerQuery} from '../../../api/api/RTKApi';
import { useFocusEffect } from "@react-navigation/native";

type PopUpOption = {
  title: string;
  value: string;
  filter?: IFilterParams;
};
interface Props {
  setSortOption: Dispatch<'low' | 'high' | undefined>;
  sortOption: 'low' | 'high' | undefined;
  filterText?: string;
  sortBlock?: IPositionBlock;
}

const SortFilterMenu: React.FC<Props> = ({setSortOption}) => {
  const {data: attributes, refetch} = useGetAttributesByMarkerQuery({
    setMarker: 'sort_catalog',
  });
  const [visible, setVisible] = useState<boolean>(false);
  const activeOption = useAppSelector(
    state => state.filterReducer.sortFilterActive,
  );
  const openFiltersButtonPlaceholder = useAppSelector(
    state => state.systemContentReducer.content.open_filters_button,
  );
  const dispatch = useAppDispatch();
  const previousFilter = useRef<IFilterParams>();

  const popUpFilterAction = (option: PopUpOption, index: number) => {
    previousFilter.current && dispatch(removeFilter(previousFilter.current));
    dispatch(setSortFilterActive(index));
    if (index === activeOption) {
      return (previousFilter.current = undefined);
    }

    previousFilter.current = option.filter;

    if (!option?.filter) {
      if (option.value === 'price_low_sort') {
        setSortOption('low');
      }

      if (option.value === 'price_high_sort') {
        setSortOption('high');
      }

      return;
    }
    dispatch(addFilter(option.filter));
  };

  const newPopUpOptions = useMemo<PopUpOption[]>(() => {
    if (!attributes?.length) {
      return [];
    }

    return attributes.reduce((options: PopUpOption[], attribute) => {
      if (attribute?.marker === 'price_low_sort') {
        const optionPopUp = {
          title: attribute?.localizeInfos?.title,
          value: 'price_low_sort',
          filter: undefined,
        };
        options.push(optionPopUp);
      }

      if (attribute?.marker === 'price_high_sort') {
        const optionPopUp = {
          title: attribute?.localizeInfos?.title,
          value: 'price_high_sort',
          filter: undefined,
        };
        options.push(optionPopUp);
      }

      if (!attribute?.listTitles) {
        return options;
      }

      if (attribute?.type !== 'list') {
        return options;
      }

      if (attribute?.listTitles?.length > 1) {
        return options;
      }

      const listTitles = attribute?.listTitles as IListTitle[];

      const filter: IFilterParams = {
        attributeMarker: listTitles[0]?.title,
        conditionMarker: listTitles[0]?.value as any,
        conditionValue: listTitles[0]?.extended?.value,
      };

      const optionPopUp = {
        title: attribute?.localizeInfos?.title,
        value: 'filter',
        filter,
      };

      options.push(optionPopUp);
      return options;
    }, []);
  }, [attributes]);

  // useFocusEffect(() => {
  //   refetch();
  // });

  return (
    <View className={'absolute bottom-0 w-full'}>
      <View
        className={
          'w-full justify-between items-center px-layout py-2.5 flex-row'
        }>
        <PopUpMenu
          active={activeOption}
          options={newPopUpOptions}
          trigger={<Sort />}
          action={popUpFilterAction}
        />
        <TouchableOpacity
          className={'flex-row items-end gap-1'}
          onPress={() => setVisible(true)}>
          <Filter />
          <Paragraph weight={'700'} color={'gray'}>
            {openFiltersButtonPlaceholder || ''}
          </Paragraph>
        </TouchableOpacity>
        <FilterModal visible={visible} setVisible={setVisible} />
      </View>
    </View>
  );
};

export default memo(SortFilterMenu);
