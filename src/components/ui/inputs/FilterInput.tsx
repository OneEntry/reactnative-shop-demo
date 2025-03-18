import React, {memo} from 'react';
import {KeyboardAvoidingView, StyleSheet, TextInput, View} from 'react-native';
import {styleColors} from '../../../utils/consts';
import {Paragraph} from '../texts/Paragraph';
import {useAppDispatch, useAppSelector} from '../../../state/hooks';
import {
  addFilter,
  removeFilter,
  setPriceFilterActive,
} from '../../../state/reducers/FilterSlice';
import {IFilterParams} from 'oneentry/dist/products/productsInterfaces';

interface Props {
  operator: 'to' | 'from';
  title?: string;
}

const FilterInput: React.FC<Props> = ({operator, title}) => {
  const {
    priceFromPrevious,
    priceToSelected,
    priceFromSelected,
    priceToPrevious,
    filters,
  } = useAppSelector(state => state.filterReducer);
  const dispatch = useAppDispatch();

  const onEdit = (value: string) => {
    if (priceFromPrevious) {
      const filter: IFilterParams = {
        attributeMarker: 'price',
        conditionMarker: 'mth',
        conditionValue: priceFromPrevious,
        pageUrl: ['shop'],
      };
      dispatch(removeFilter(filter));
    }
    if (priceToPrevious) {
      const filter: IFilterParams = {
        attributeMarker: 'price',
        conditionMarker: 'lth',
        conditionValue: priceToPrevious,
        pageUrl: ['shop'],
      };
      dispatch(removeFilter(filter));
    }
    const filter: IFilterParams = {
      attributeMarker: 'price',
      conditionMarker: operator === 'to' ? 'lth' : 'mth',
      conditionValue: value,
      pageUrl: ['shop'],
    };
    dispatch(setPriceFilterActive({value, operator}));

    if (value) {
      dispatch(addFilter(filter));
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.operator}>
        <Paragraph>{title || operator}</Paragraph>
      </View>
      <TextInput
        style={styles.input}
        keyboardType={'numeric'}
        value={operator === 'to' ? priceToSelected : priceFromSelected}
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

export default memo(FilterInput);
