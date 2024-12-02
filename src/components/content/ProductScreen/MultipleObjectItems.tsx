import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import MultipleProductItem from './MultipleProductItem';
import {Paragraph} from '../../ui/texts/Paragraph';
import {LanguageContext} from '../../../providers/LanguageContext';
import {IProductBlock} from 'oneentry/dist/products/productsInterfaces';

interface Props {
  block?: IProductBlock;
}
const MultipleObjectItems: React.FC<Props> = ({block}) => {
  const attributeValues = block?.attributeValues;

  if (!block) {
    return <></>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.featuredObjects}>
        <View style={styles.featuredObjectsHeader}>
          <Paragraph size={17} color="black">
            {attributeValues?.block_title?.value}
          </Paragraph>
        </View>
      </View>
      <MultipleProductItem marker={block.identifier} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 15,
  },
  featuredObjects: {
    marginTop: 5,
  },
  featuredObjectsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
export default MultipleObjectItems;
