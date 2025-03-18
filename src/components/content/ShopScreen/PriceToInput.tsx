import React, {memo} from 'react';
import {KeyboardAvoidingView, TextInput, View} from 'react-native';
import {IFilterParams} from 'oneentry/dist/products/productsInterfaces';
import {useAppDispatch, useAppSelector} from '../../../state/hooks';
import {
  addFilter,
  removeFilter,
  setPriceFilterActive,
} from '../../../state/reducers/FilterSlice';
import {Paragraph} from '../../ui/texts/Paragraph';

interface Props {}

const PriceToInput: React.FC<Props> = ({}) => {
  const {priceToSelected} = useAppSelector(state => state.filterReducer);
  const priceTo = useAppSelector(
    state => state.systemContentReducer.content.price_to,
  );
  const {maxPriceValue} = useAppSelector(state => state.filterReducer);

  const dispatch = useAppDispatch();

  const onEdit = (value: string) => {
    if (priceToSelected) {
      // @ts-ignore
      const filter: IFilterParams = {
        attributeMarker: 'price',
        conditionMarker: 'lth',
        conditionValue: priceToSelected,
        pageUrl: ['shop'],
      };
      dispatch(removeFilter(filter));
    }

    if (value) {
      // @ts-ignore
      const filter: IFilterParams = {
        attributeMarker: 'price',
        conditionMarker: 'lth',
        conditionValue: value,
        pageUrl: ['shop'],
      };
      dispatch(addFilter(filter));
    } else {
      // @ts-ignore
      const filter: IFilterParams = {
        attributeMarker: 'price',
        conditionMarker: 'lth',
        conditionValue: value,
        pageUrl: ['shop'],
      };
      dispatch(removeFilter(filter));
    }

    dispatch(setPriceFilterActive({value, operator: 'to'}));
  };

  return (
    <KeyboardAvoidingView className={'flex-row items-center'}>
      <View className={'px-2.5 bg-lightGray rounded-l-full h-8 justify-center'}>
        <Paragraph>{priceTo}</Paragraph>
      </View>
      <TextInput
        className={'px-2.5 py-1 bg-lightGray rounded-r-full w-20 h-8'}
        keyboardType={'numeric'}
        value={priceToSelected}
        placeholder={maxPriceValue?.toString()}
        placeholderTextColor={'gray'}
        onChangeText={input => onEdit(input)}
      />
    </KeyboardAvoidingView>
  );
};

export default memo(PriceToInput);
