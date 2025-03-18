import React, {
  forwardRef,
  FunctionComponent,
  memo,
  useEffect,
  useState,
} from 'react';
import {
  Image,
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {validators} from '../../../utils/validators';
import {Paragraph, ParagraphProps} from '../texts/Paragraph';
import {styleColors} from '../../../utils/consts';

type InputState = 'valid' | 'notActive' | 'error';

export type InputValue = {value: string; valid: boolean; [key: string]: any};

type Props = {
  value: string;
  setValue: (value: InputValue) => void;
  currentValidators?: Record<string, any>;
  validationErrorMessage?: string;
  initialState?: InputState;
  validStyles?: ViewStyle;
  notValidStyles?: ViewStyle;
  errorMessage?: ParagraphProps;
  containerStyle?: ViewStyle;
  Icon?: FunctionComponent;
  onPressIcon?: () => void;
} & TextInputProps;

const AppInput = forwardRef<TextInput, Props>(
  (
    {
      value,
      setValue,
      currentValidators,
      validationErrorMessage,
      notValidStyles,
      validStyles,
      errorMessage,
      containerStyle,
      Icon,
      onPressIcon,
      ...rest
    },
    ref,
  ) => {
    const {style, ...other} = rest;
    const [currentState, setCurrentState] = useState<InputState>('valid');

    useEffect(() => {
      if (!!currentValidators?.requiredValidator && !value) {
        setCurrentState('error');
        setValue({value, valid: false});
      }

      if (!currentValidators?.requiredValidator && !value) {
        setCurrentState('valid');
        // setValue({value, valid: true});
      }
    }, [value]);

    useEffect(() => {
      if (value) {
        onChange(value);
      }
    }, [currentValidators]);

    const onChange = (val: string) => {
      let valid = true;
      if (currentValidators) {
        valid = Object.keys(currentValidators)?.reduce(
          (isValid, validator: string): boolean => {
            if (!val) {
              return false;
            }
            // @ts-ignore
            const candidate = validators[validator];
            const result = candidate
              ? candidate(val, currentValidators[validator])
              : true;

            if (isValid) {
              return result;
            } else {
              return false;
            }
          },
          true,
        );
      }
      setCurrentState(valid ? 'valid' : 'error');
      setValue({value: val, valid});
    };

    return (
      <View style={[styles.container, containerStyle]}>
        <View>
          <TextInput
            style={[
              style,
              currentState === 'valid' && validStyles,
              currentState === 'error' && notValidStyles,
              {color: styleColors.gray},
            ]}
            value={value}
            placeholderTextColor={styleColors.lightGray}
            onChangeText={onChange}
            ref={ref}
            {...other}
          />

          {Icon && (
            <TouchableOpacity
              onPress={onPressIcon}
              style={{
                position: 'absolute',
                right: 0,
                height: '100%',
                justifyContent: 'center',
              }}>
              <Icon />
            </TouchableOpacity>
          )}
        </View>

        {currentState === 'error' && (
          <View style={styles.error_container}>
            <Image
              style={{width: 15, height: 15}}
              source={require('../../shared/assets/alert_circle.png')}
            />
            <Paragraph size={12} color={'red'} {...errorMessage}>
              {validationErrorMessage}
            </Paragraph>
          </View>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    gap: 5,
  },
  error_container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});
export default memo(AppInput);
