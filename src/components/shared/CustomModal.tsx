import React, {Dispatch} from 'react';
import {layoutPadding, styleColors} from '../../utils/consts';
import {Modal, ModalProps, StyleSheet, View} from 'react-native';
import {Paragraph} from '../ui/texts/Paragraph';
import XButton from '../ui/buttons/XButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = ModalProps & {
  children: React.ReactNode;
  visible: boolean;
  setVisible: Dispatch<boolean>;
  title: string;
};

const CustomModal: React.FC<Props> = ({
  children,
  visible,
  title,
  setVisible,
  ...rest
}) => {
  const insets = useSafeAreaInsets();
  const onRequestClose = () => {
    setVisible(!visible);
  };
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onRequestClose}
      {...rest}>
      <View style={[{flex: 1, backgroundColor: styleColors.gray_v2}]}>
        <View
          style={[styles.container, {top: insets.top > 5 ? insets.top : 10}]}>
          <View style={styles.title_container}>
            <Paragraph weight={'600'} size={24} color={'gray'}>
              {title}
            </Paragraph>
          </View>
          <View style={{alignItems: 'flex-end', paddingRight: layoutPadding}}>
            <XButton action={onRequestClose} style={{}} />
          </View>
        </View>
        {children}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 100,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'absolute',
    width: '100%',
  },
  content_container: {
    backgroundColor: 'white',
    alignItems: 'center',
  },
  title_container: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CustomModal;
