import React, {Dispatch, memo} from 'react';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import {Paragraph} from '../ui/texts/Paragraph';
import {Alert} from 'react-native';

export type PopUpOption = {
  title: string;
  value?: string;
  action?: () => void;
  active?: false;
};
interface Props {
  trigger: React.ReactNode;
  options: PopUpOption[];
  action?: (option: any, index: number) => void;
  active?: number | null;
  setActive?: Dispatch<number>;
}

const PopUpMenu: React.FC<Props> = ({
  trigger,
  action,
  options,
  setActive,
  active,
}) => {
  return (
    <Menu>
      <MenuTrigger>{trigger}</MenuTrigger>
      <MenuOptions customStyles={{optionsContainer: {borderRadius: 15, paddingLeft: 10}}}>
        {options.map((option, index) => (
          <MenuOption
            key={index}
            style={[{padding: 10, paddingLeft: 15}]}
            onSelect={() => {
              if (option.action) {
                option.action();
                setActive && setActive(index);
              } else {
                if (action) {
                  action(option, index);
                } else {
                  Alert.alert('Action not found');
                }
              }
            }}>
            <Paragraph
              size={16}
              color={active === index ? 'background' : 'black'}>
              {option.title}
            </Paragraph>
          </MenuOption>
        ))}
      </MenuOptions>
    </Menu>
  );
};

export default memo(PopUpMenu);
