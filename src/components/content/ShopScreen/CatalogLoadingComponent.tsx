import React from 'react';
import {View} from 'react-native';
import Skeleton from '../../shared/Skeleton';
import {layoutWidth} from '../../../utils/consts';

const CatalogLoadingComponent = ({columns}: {columns: number}) => {
  return (
    <View className={'gap-2.5'}>
      <View style={{marginTop: 10, gap: 10, flexDirection: 'row'}}>
        <Skeleton
          height={columns > 1 ? 265 : 162}
          width={columns > 1 ? (layoutWidth - 10) / 2 : '100%'}
          style={{borderRadius: 15}}
        />
        <Skeleton
          height={columns > 1 ? 265 : 162}
          width={columns > 1 ? (layoutWidth - 10) / 2 : '100%'}
          style={{borderRadius: 15}}
        />
      </View>
      <View style={{marginTop: 10, gap: 10, flexDirection: 'row'}}>
        <Skeleton
          height={columns > 1 ? 265 : 162}
          width={columns > 1 ? (layoutWidth - 10) / 2 : '100%'}
          style={{borderRadius: 15}}
        />
        <Skeleton
          height={columns > 1 ? 265 : 162}
          width={columns > 1 ? (layoutWidth - 10) / 2 : '100%'}
          style={{borderRadius: 15}}
        />
      </View>
    </View>
  );
};

export default CatalogLoadingComponent;
