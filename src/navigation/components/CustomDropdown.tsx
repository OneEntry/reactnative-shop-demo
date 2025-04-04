import React, {memo, useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {LanguageContext} from '../../state/contexts/LanguageContext';
import {RTKApi} from '../../api';
import {useAppDispatch} from '../../state/hooks';

export type DropdownItem = {
  label: any;
  value: any;
};

interface Props {
  data: DropdownItem[];
}

const CustomDropdown: React.FC<Props> = ({data}) => {
  const [value, setValue] = useState<string>();
  const {setActiveLanguage, activeLanguage} = useContext(LanguageContext);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setValue(activeLanguage);
  }, [activeLanguage]);

  const renderItem = (item: DropdownItem) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
      </View>
    );
  };

  return (
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      iconStyle={styles.iconStyle}
      data={data}
      maxHeight={300}
      labelField="label"
      valueField="value"
      value={value}
      onChange={(item: DropdownItem) => {
        setActiveLanguage(item.value);
        dispatch(RTKApi.util.resetApiState());
      }}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  dropdown: {
    margin: 16,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
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

export default memo(CustomDropdown);
