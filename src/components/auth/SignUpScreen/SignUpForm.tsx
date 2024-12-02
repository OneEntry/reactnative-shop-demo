import React from 'react';
import {View} from 'react-native';
import {IAttributes} from 'oneentry/dist/base/utils';
import {useGetFormByMarkerQuery} from '../../../api';
import FlexLoader from '../../ui/space/FlexLoader';
import SignUpInput from './SignUpInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';

type Props = {};

const SignUpForm: React.FC<Props> = ({}) => {
  const {data, isLoading} = useGetFormByMarkerQuery({marker: 'reg'});

  if (isLoading) {
    return <FlexLoader />;
  }

  return (
    <KeyboardAwareScrollView bottomOffset={65}>
      <View className={'mt-10'} style={{gap: 15}}>
        {/*Input fields from CMS in correct order*/}
        {data?.attributes?.map((item: IAttributes, index: number) => {
          if (item?.marker === 'phone_reg') {
            return (
              <SignUpInput field={item} initialValue={'+'} key={item?.marker} />
            );
          }
          if (item?.marker === 'password_reg') {
            return <SignUpInput field={item} isPassword key={item?.marker} />;
          }

          if (item?.marker === 'email_reg') {
            return <SignUpInput field={item} key={item?.marker} />;
          }

          if (item?.marker !== 'email_notifications') {
            return <SignUpInput field={item} key={item?.marker} />;
          }
        })}
      </View>
    </KeyboardAwareScrollView>
  );
};

export default SignUpForm;
