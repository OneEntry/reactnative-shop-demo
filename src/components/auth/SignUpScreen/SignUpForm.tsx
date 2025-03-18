import React from 'react';
import {View} from 'react-native';
import {IAttributes} from 'oneentry/dist/base/utils';
import {useGetFormByMarkerQuery} from '../../../api';
import FlexLoader from '../../ui/space/FlexLoader';
import SignUpInput from './SignUpInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import SignUpPasswordInput from './SignUpPasswordInput';

type Props = {};

/**
 * A React component that dynamically generates a sign-up form based on attributes fetched from CMS.
 *
 * @component SignUpForm
 * @returns {React.ReactElement} A React element containing the sign-up form inputs.
 */
const SignUpForm: React.FC<Props> = ({}): React.ReactElement => {
  // Fetch form from CMS
  const {data, isLoading} = useGetFormByMarkerQuery({marker: 'reg'});

  if (isLoading) {
    return <FlexLoader />;
  }

  return (
    <KeyboardAwareScrollView bottomOffset={65}>
      <View className={'mt-10'} style={{gap: 15}}>
        {/*Input fields from CMS in correct order*/}
        {data?.attributes?.map((item: IAttributes, index: number) => {
          // Special handling for phone input
          if (item?.marker === 'phone_reg') {
            return (
              <SignUpInput
                marker={item?.marker}
                validators={item?.validators}
                title={item?.localizeInfos?.title}
                initialValue={'+'}
                key={item?.marker}
              />
            );
          }
          // Special handling for password input
          if (item?.marker === 'password_reg') {
            return (
              <SignUpPasswordInput
                title={item?.localizeInfos?.title}
                validators={item?.validators}
                key={item?.marker}
              />
            );
          }

          // Regular input fields (excluding 'email_notifications')
          if (item?.marker !== 'email_notifications') {
            return (
              <SignUpInput
                validators={item?.validators}
                title={item?.localizeInfos?.title}
                marker={item?.marker}
                key={item?.marker}
                requiredError={
                  // @ts-ignore
                  item?.additionalFields?.find(
                    field => field.marker === 'error_required',
                  )?.value
                }
              />
            );
          }
        })}
      </View>
    </KeyboardAwareScrollView>
  );
};

export default SignUpForm;
