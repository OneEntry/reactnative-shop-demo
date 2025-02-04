import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Paragraph} from '../../ui/texts/Paragraph';
import {FeaturedObjectItem} from '../../shared/FeaturedObjectItem';
import ContentNotFoundBlock from '../../shared/ContentNotFoundBlock';
import {IProductBlock} from 'oneentry/dist/products/productsInterfaces';
import Skeleton from 'react-native-reanimated-skeleton';
import {useGetBlockByMarkerQuery} from '../../../api/api/RTKApi';

type Props = {
  relatedItems?: IProductBlock;
};

const SimilarProductsList: React.FC<Props> = ({relatedItems}) => {
  const {data, isLoading} = useGetBlockByMarkerQuery({
    marker: relatedItems?.identifier || '',
  });

  if (isLoading) {
    return (
      <Skeleton
        containerStyle={{height: 250}}
        isLoading={isLoading}
        layout={[{key: 'blocks', width: '100%', height: 250, borderRadius: 15}]}
      />
    );
  }
  return (
    <>
      <View style={styles.featuredObjects}>
        <View style={styles.featuredObjectsHeader}>
          <Paragraph size={17} color="black">
            {relatedItems?.attributeValues?.block_title?.value}
          </Paragraph>
        </View>
      </View>
      <FlatList
        data={data?.similarProducts?.items}
        renderItem={({item}) => (
          <FeaturedObjectItem inner product={item} loading={isLoading} />
        )}
        scrollEnabled={false}
        numColumns={2}
        columnWrapperStyle={{
          gap: 10,
        }}
        ListEmptyComponent={<ContentNotFoundBlock loading={isLoading} />}
        contentContainerStyle={{gap: 20, paddingBottom: 12}}
        ListHeaderComponent={<View style={{marginTop: 10}} />}
        onEndReached={() => {}}
      />
    </>
  );
};

const styles = StyleSheet.create({
  featuredObjects: {
    marginTop: 20,
  },
  featuredObjectsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default SimilarProductsList;
