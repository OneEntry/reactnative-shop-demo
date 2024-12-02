import React, {Dispatch, memo, useMemo} from 'react';
import {Modal, ScrollView, View} from 'react-native';
import {styleColors} from '../../../utils/consts';
import {Button} from '../../ui/buttons/Button';
import TopSpacerV2 from '../../ui/space/TopSpacerV2';
import {Screen} from '../../ui/templates/Screen';
import ModalHeader from './ModalHeader';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {removeAllFilters} from '../../../store/reducers/FilterSlice';
import ColorFilter from './ColorFilter';
import ResetButton from './ResetButton';
import AvailabilityFilter from './AvailabilityFilter';
import PricePickerFilter from './PricePickerFilter';
import {useGetPageQuery} from '../../../api/api/RTKApi';
import ErrorBlock from '../../shared/ErrorBlock';

interface Props {
  visible: boolean;
  setVisible: Dispatch<boolean>;
  children?: React.ReactNode;
  text?: string;
}

function sortObjectFieldsByPosition(obj: Record<any, any>) {
  const entries = Object.entries(obj);
  entries.sort((a, b) => a[1].position - b[1].position);

  const sortedObj = {};
  for (const [key, value] of entries) {
    // @ts-ignore
    sortedObj[key] = value;
  }

  return sortedObj;
}

const CatalogFiltersModal: React.FC<Props> = ({visible, setVisible}) => {
  const dispatch = useAppDispatch();
  const {
    data: pageInfo,
    isLoading,
    error,
  } = useGetPageQuery({pageUrl: 'catalog_filters'});
  const {close_text, reset_button_placeholder} = useAppSelector(
    state => state.systemContentReducer.content,
  );

  const sortedAttributes: Record<any, any> = useMemo(() => {
    if (!pageInfo) {
      return [];
    }
    return sortObjectFieldsByPosition(pageInfo?.attributeValues);
  }, [pageInfo]);

  const onRequestClose = () => {
    setVisible(!visible);
  };
  const onReset = () => {
    dispatch(removeAllFilters());
  };

  if (isLoading) {
    return (
      <Modal visible={visible}>
        <View className={'animate-pulse-analog flex-1'} />
      </Modal>
    );
  }

  if (error) {
    return (
      <Modal visible={visible}>
        <ErrorBlock errorTitle={error.toString()} />
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onRequestClose}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled"
        className={'bg-lightGray'}>
        <Screen>
          <ModalHeader
            onRequestClose={onRequestClose}
            title={pageInfo?.localizeInfos?.title || 'no localization'}
          />
          <TopSpacerV2 />
          <ResetButton title={reset_button_placeholder} onReset={onReset} />
        </Screen>
        <Screen
          edges={['top', 'horizontal']}
          className={'bg-white'}
          style={{gap: 30}}>
          {Object.keys(sortedAttributes).map((attribute, index) => {
            if (attribute === 'color_filter') {
              return (
                <ColorFilter
                  key={index}
                  //@ts-ignore
                  color_filter_title={sortedAttributes[attribute]?.value}
                />
              );
            }

            if (attribute === 'price_filter') {
              return (
                <PricePickerFilter
                  key={index}
                  title={sortedAttributes[attribute]?.value}
                />
              );
            }

            if (attribute === 'availability_filter') {
              return (
                <AvailabilityFilter
                  key={index}
                  title={sortedAttributes[attribute]?.value}
                />
              );
            }
          })}

          <Button
            rounded
            style={{backgroundColor: styleColors.background, marginTop: 10}}
            paragraphProps={{
              style: {color: '#fff'},
              weight: 'bold',
              size: 16,
            }}
            onPress={onRequestClose}>
            {close_text}
          </Button>
        </Screen>
      </ScrollView>
    </Modal>
  );
};

export default memo(CatalogFiltersModal);
