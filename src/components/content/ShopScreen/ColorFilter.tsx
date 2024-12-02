import React, {useEffect, useMemo} from 'react';
import {FlatList, View} from 'react-native';
import {Paragraph} from '../../ui/texts/Paragraph';
import ColorPicker from './ColorPicker';
import {IFilterParams} from 'oneentry/dist/products/productsInterfaces';
import {addFilter, removeFilter} from '../../../store/reducers/FilterSlice';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import ErrorBlock from '../../shared/ErrorBlock';
import FlexLoader from '../../ui/space/FlexLoader';
import {IListTitle} from 'oneentry/dist/attribute-sets/attributeSetsInterfaces';
import ContentNotFoundBlock from '../../shared/ContentNotFoundBlock';
import {layoutWidth} from '../../../utils/consts';
import {useGetSingleAttributeInSetByMarkerQuery} from '../../../api/api/RTKApi';

interface Props {
  color_filter_title?: string;
}

type Color = {
  code: string;
  name: string;
  selected?: boolean;
};

const ColorFilter: React.FC<Props> = ({color_filter_title}) => {
  const dispatch = useAppDispatch();
  const {
    data: attributes,
    error,
    isLoading,
  } = useGetSingleAttributeInSetByMarkerQuery({
    setMarker: 'product',
    attributeMarker: 'color',
  });
  const {colorFilterActive: activeColor, colorFilterPrevious} = useAppSelector(
    state => state.filterReducer,
  );

  const cardWidth = 240;

  const colorFilters = useMemo(() => {
    let colors: Color[] = [];

    if (!attributes) {
      return colors;
    }

    colors = attributes?.listTitles.reduce(
      (arr: Color[], option: IListTitle) => {
        const color: Color = {
          code: option.value.toString(),
          name: option.title,
        };

        arr.push(color);
        return arr;
      },
      [],
    );
    return colors;
  }, [attributes]);

  useEffect(() => {
    if (colorFilters?.[colorFilterPrevious as any]?.code) {
      // @ts-ignore
      const oldFilter: IFilterParams = {
        attributeMarker: 'color',
        conditionMarker: 'in',
        conditionValue: colorFilters[colorFilterPrevious as any].code,
        pageUrl: ['shop'],
        isNested: true,
      };
      dispatch(removeFilter(oldFilter));
    }

    if (colorFilters?.[activeColor as any]?.code) {
      // @ts-ignore
      const newFilter: IFilterParams = {
        attributeMarker: 'color',
        conditionMarker: 'in',
        conditionValue: colorFilters[activeColor as any].code,
        pageUrl: ['shop'],
        isNested: true,
      };
      dispatch(addFilter(newFilter));
    }
  }, [activeColor]);

  if (!isLoading && !attributes) {
    return <></>;
  }

  if (error) {
    return <ErrorBlock errorDescription={''} errorTitle={error.toString()} />;
  }

  if (isLoading) {
    return <FlexLoader />;
  }

  return (
    <View>
      <Paragraph size={16} weight={'400'} style={{marginBottom: 20}}>
        {color_filter_title}
      </Paragraph>
      <FlatList
        scrollEnabled={false}
        data={colorFilters}
        key={cardWidth >= layoutWidth ? '3col' : '4col'}
        numColumns={cardWidth >= layoutWidth ? 3 : 4}
        columnWrapperStyle={{
          gap:
            cardWidth >= layoutWidth
              ? (layoutWidth - cardWidth) / 3 - 10
              : (layoutWidth - cardWidth) / 4 - 10,
        }}
        contentContainerStyle={{
          gap: 10,
        }}
        ListEmptyComponent={<ContentNotFoundBlock />}
        renderItem={({item, index}) => (
          <ColorPicker
            code={item.code}
            name={item.name}
            active={activeColor}
            index={index}
          />
        )}
      />
    </View>
  );
};

export default ColorFilter;
