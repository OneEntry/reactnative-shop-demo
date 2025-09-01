import React, {memo} from 'react';
import {NativeModules, RefreshControl, ScrollView, View} from 'react-native';
import {Paragraph} from '../../components/ui/texts/Paragraph';
import TopSpacerV2 from '../../components/ui/space/TopSpacerV2';

type Props = object;

const ContentNotVisibleScreen: React.FC<Props> = () => {
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    NativeModules.DevSettings.reload();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <TopSpacerV2 />
      <View className={'flex-1 justify-center items-center'}>
        <Paragraph size={24}>Content not visible</Paragraph>
      </View>
    </ScrollView>
  );
};

export default memo(ContentNotVisibleScreen);
