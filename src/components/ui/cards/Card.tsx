import React, {memo} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {styleColors} from '../../../utils/consts';
import {useNavigateProducts} from '../../../utils/hooks';

interface Props {
  children: React.ReactNode;
  productId?: number;
}

const Card: React.FC<Props> = ({children, productId}) => {
  const {navigate} = useNavigateProducts({id: productId});

  return (
    <TouchableOpacity
      disabled={!productId}
      onPress={productId ? () => navigate() : () => {}}
      style={styles.container}>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderColor: styleColors.lightGray,
    borderBottomWidth: 1,
    paddingVertical: 10,
    gap: 10,
  },
});

export default memo(Card);
