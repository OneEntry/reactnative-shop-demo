import React, {memo} from 'react';
import {KeyboardAvoidingView, StyleSheet, TextInput, View} from 'react-native';
import {IFilterParams} from 'oneentry/dist/products/productsInterfaces';
import {useAppDispatch, useAppSelector} from '../../../state/hooks';
import {
  addFilter,
  removeFilter,
  setPriceFilterActive,
} from '../../../state/reducers/FilterSlice';
import {Paragraph} from '../../ui/texts/Paragraph';
import {styleColors} from '../../../utils/consts';

type Props = object;

const PriceFromInput: React.FC<Props> = () => {
  const {priceFromSelected} = useAppSelector(state => state.filterReducer);
  const priceFrom = useAppSelector(
    state => state.systemContentReducer.content.price_from,
  );
  const {minPriceValue} = useAppSelector(state => state.filterReducer);
  const dispatch = useAppDispatch();

  const onEdit = (value: string) => {
    if (priceFromSelected) {
      const filter: IFilterParams = {
        attributeMarker: 'price',
        conditionMarker: 'mth',
        conditionValue: priceFromSelected,
        pageUrl: ['shop'],
      };
      dispatch(removeFilter(filter));
    }
    if (value) {
      const filter: IFilterParams = {
        attributeMarker: 'price',
        conditionMarker: 'mth',
        conditionValue: value,
        pageUrl: ['shop'],
      };
      dispatch(addFilter(filter));
    } else {
      const filter: IFilterParams = {
        attributeMarker: 'price',
        conditionMarker: 'mth',
        conditionValue: value,
        pageUrl: ['shop'],
      };
      dispatch(removeFilter(filter));
    }

    dispatch(setPriceFilterActive({value, operator: 'from'}));
  };

  return (
    <KeyboardAvoidingView className={'flex-row items-center'}>
      <View className={'px-2.5 bg-lightGray rounded-l-full h-8 justify-center'}>
        <Paragraph>{priceFrom}</Paragraph>
      </View>
      <TextInput
        className={'px-2.5 py-1 bg-lightGray rounded-r-full w-20 h-8'}
        keyboardType={'numeric'}
        placeholder={minPriceValue?.toString()}
        placeholderTextColor={'gray'}
        value={priceFromSelected}
        onChangeText={input => onEdit(input)}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: styleColors.gray_v2,
    borderTopRightRadius: 1000,
    borderBottomRightRadius: 1000,
    width: 80,
  },
  operator: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: styleColors.gray_v2,
    borderTopLeftRadius: 1000,
    borderBottomLeftRadius: 1000,
  },
});

export default memo(PriceFromInput);
