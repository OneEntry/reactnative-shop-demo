import React from 'react';
import {ActivityIndicator, ImageBackground, View} from 'react-native';

type Props = {
  showBanner?: boolean;
};

const Loader = ({showBanner}: Props) => {
  if (showBanner) {
    return (
      <ImageBackground
        source={require('../../../assets/splashScreen.png')}
        style={{flex: 1}}
      />
    );
  }

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <ActivityIndicator size={'large'} />
    </View>
  );
};

export default Loader;
