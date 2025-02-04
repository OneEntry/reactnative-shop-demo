import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {styleColors} from '../../utils/consts';
import {Paragraph} from '../ui/texts/Paragraph';
import {InputValue} from '../ui/inputs/AppInput';
import {useAppDispatch} from '../../store/hooks';
import {addFieldContactUs} from '../../store/reducers/contactUsFieldsReducer';
import { DropdownItem } from "../../navigation/components/CustomDropdown";

interface Props {
  data: any;
  name: string;
  label: string;
  required: boolean;
  field?: InputValue;
}

const FormDropdown: React.FC<Props> = ({
  data,
  label,
  name,
  required,
  field,
}) => {
  const dispatch = useAppDispatch();
  const renderItem = (item: DropdownItem) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
      </View>
    );
  };

  useEffect(() => {
    if (!field) {
      dispatch(
        addFieldContactUs({
          [name]: {
            value: '',
            valid: !required,
          },
        }),
      );
    }
  }, []);

  return (
    <View style={{gap: 5}}>
      <Paragraph size={16} weight={'400'} color={'border_color'} />
      <Dropdown
        style={[
          styles.dropdown,
          {
            borderWidth: !field?.valid && required ? 1 : 0,
            borderColor: styleColors.red,
            backgroundColor:
              !field?.valid && required
                ? styleColors.lightRed
                : styleColors.gray_v2,
          },
        ]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        containerStyle={styles.container}
        iconStyle={styles.iconStyle}
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={label}
        value={field?.value}
        onChange={(item: DropdownItem) => {
          dispatch(
            addFieldContactUs({
              [name]: {
                value: item.value,
                valid: true,
              },
            }),
          );
        }}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: styleColors.gray_v2,
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 37,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    paddingHorizontal: 17,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {
    borderRadius: 10,
    shadowRadius: 0,
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
    fontWeight: '400',
    color: styleColors.gray,
  },
  selectedTextStyle: {
    fontSize: 16,
    fontWeight: '400',
    color: styleColors.gray,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
export default FormDropdown;
