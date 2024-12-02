import React from 'react';
import {StyleSheet, View} from 'react-native';
import AppInput, {InputValue} from '../ui/inputs/AppInput';
import {styleColors} from '../../utils/consts';
import {Paragraph} from '../ui/texts/Paragraph';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {addFieldContactUs} from '../../store/reducers/contactUsFieldsReducer';
import hairlineWidth = StyleSheet.hairlineWidth;

type Props = {
  multiline?: boolean;
  title: string;
  validators?: Record<string, any>;
  marker: string;
  autoCapitalize?: boolean;
};

const CompactInput: React.FC<Props> = ({
  multiline,
  title,
  validators,
  autoCapitalize,
  marker,
}) => {
  const fields = useAppSelector(state => state.ContactUsFieldsReducer.fields);
  const {invalid_input_value} = useAppSelector(
    state => state.systemContentReducer.content,
  );
  const dispatch = useAppDispatch();

  const onChange = (value: InputValue) => {
    dispatch(addFieldContactUs({[marker]: value}));
  };

  return (
    <View>
      <Paragraph size={14} weight={'400'} color={'border_color'}>
        {title}
      </Paragraph>
      <AppInput
        value={fields?.[marker]?.value}
        currentValidators={validators}
        setValue={onChange}
        multiline={multiline}
        numberOfLines={5}
        textAlignVertical={multiline ? 'top' : 'center'}
        style={[multiline ? styles.multilineInputStyle : styles.inputStyle]}
        notValidStyles={styles.notValidStyles}
        validationErrorMessage={invalid_input_value}
        autoCapitalize={autoCapitalize ? 'sentences' : 'none'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputStyle: {
    backgroundColor: styleColors.gray_v2,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: styleColors.gray,
    fontWeight: '400',
    height: 38,
    fontSize: 16,
    marginTop: 3,
  },
  multilineInputStyle: {
    backgroundColor: styleColors.gray_v2,
    borderRadius: 10,
    paddingHorizontal: 16,
    color: styleColors.gray,
    fontWeight: '400',
    fontSize: 16,
    marginTop: 3,
    height: 186,
    paddingTop: 10,
    paddingBottom: 10,
  },
  notValidStyles: {
    borderColor: styleColors.red,
    backgroundColor: styleColors.lightRed,
    borderWidth: hairlineWidth,
    // opacity: 0.1,
  },
});

export default CompactInput;
