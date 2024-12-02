import {Dimensions} from 'react-native';

export const ROUNDED_RADIUS = 99999999;
export const layoutPadding = 20;
export const layoutWidth = Dimensions.get('window').width - layoutPadding * 2;
export const proportionX = Dimensions.get('window').width / 393;
export const proportionY = Dimensions.get('window').height / 840;
export const screenWidth = Dimensions.get('window').width;
export const styleColors = {
  white: '#ffffff',
  white50: 'rgba(255,255,255,0.5)',
  background: '#EC722B',
  yellow: '#FFD129',
  gray: '#4C4D56',
  gray_v2: '#F6F7F9',
  border_color: '#A8A9B5',
  lightGray: '#B0BCCE',
  gray100: '#F5F5F5',
  gray200: '#EEEFF0',
  gray300: '#D7DBDF',
  gray400: '#C4C6CA',
  black: '#000000',
  facebook: '#4255FF',
  accent: '#EC722B',
  // lightGray: '#F6F7F9',
  // gray: '#B0BCCE',
  darkGray: '#4C4D56',
  lightRed: '#FFEBEA',
  red: '#FF3932',
};

export const projectUrl = 'https://react-native-course.oneentry.cloud';

export type StyleColors = keyof typeof styleColors;
