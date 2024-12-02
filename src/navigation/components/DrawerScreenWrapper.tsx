import React from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {interpolate, useAnimatedStyle} from 'react-native-reanimated';
import {useDrawerProgress} from '@react-navigation/drawer';
import X from '../../assets/icons/x.svg';

interface Props {
  children: React.ReactNode;
}

const DrawerScreenWrapper: React.FC<Props> = ({children}) => {
  const progress = useDrawerProgress();
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            progress.value,
            [0, 0.9],
            [1, Platform.OS === 'android' ? 0.9 : 0.8],
            'clamp',
          ),
        },
      ],
    };
  });
  const animatedTemplate = useAnimatedStyle(() => ({
    zIndex: progress.value < 0.1 ? -1 : 1100,
  }));
  const animatedContent = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 1], 'clamp'),
  }));
  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Animated.View style={[styles.drawerContainer, animatedTemplate, animatedContent]}>
        <View style={[styles.drawerContent]}>
          <TouchableOpacity
            onPress={() => {}}
            style={{zIndex: 1100, padding: 5, margin: 10}}>
            <X />
          </TouchableOpacity>
        </View>
      </Animated.View>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  drawerContainer: {
    position: 'absolute',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: Platform.OS === 'android' ? '100%' : '110%',
    zIndex: 2000,
  },
  drawerContent: {
    width: Dimensions.get('window').width,
    borderWidth: 1.5,
    backgroundColor: 'white',
    borderColor: '#B0BCCE',
    borderBottomLeftRadius: 30,
    borderTopLeftRadius: 30,
    shadowOffset: {width: 0, height: 4},
    shadowColor: '#4C4D5654',
    shadowOpacity: 0.33,
    shadowRadius: 10,
    height: '100%',
  },
});
export default DrawerScreenWrapper;
