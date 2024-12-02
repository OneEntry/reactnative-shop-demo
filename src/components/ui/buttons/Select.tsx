import React from 'react';
import {View} from 'react-native';

interface Props {
  selected: boolean;
}

const Select: React.FC<Props> = ({selected}) => {
  return (
    <View
      className={`border-sm h-4 w-4 rounded-full 
      ${selected ? 'bg-accent' : 'bg-transparent'} 
      ${selected ? 'border-accent' : 'border-gray'}`}
    />
  );
};

export default Select;
