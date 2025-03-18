import React, {useRef, useState} from 'react';
import {Alert, RefreshControl, ScrollView, View} from 'react-native';
import FormDropdown from '../../shared/FormDropdown';
import {useGetForm} from '../../../api';
import {Screen} from '../../ui/templates/Screen';
import TopSpacerV2 from '../../ui/space/TopSpacerV2';
import Loader from '../../ui/space/Loader';
import {IAttributes} from 'oneentry/dist/base/utils';
import {FormCaptcha} from '../../shared/FormCaptcha';
import ContactUsInput from './ContactUsInput';
import {useAppDispatch, useAppSelector} from '../../../state/hooks';
import {clearAllFieldsContactUs} from '../../../state/reducers/ContactUsFieldsReducer';
import {navigate} from '../../../navigation/utils/NavigatonRef';
import BigButton from '../../shared/BigButton';
import {submitContactUsForm} from './submitContactUsForm';

/**
 * A React component that renders a contact us form with dynamic fields based on the form data fetched from the server.
 * This component supports refreshing, validation, and submission of the form data using an external utility function.
 *
 * @component ContactUsForm
 * @returns {React.ReactElement} A React element representing the contact us form.
 */
const ContactUsForm: React.FC = (): React.ReactElement => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');
  const [isCaptcha, setIsCaptcha] = useState<boolean>(false);
  const {loading, form, refetch} = useGetForm({
    marker: 'contact_us',
  });
  const recaptcha = useRef<any>();
  const success_message = form?.localizeInfos?.successMessage;
  const unsuccess_message = form?.localizeInfos?.unsuccessMessage;
  const fields = useAppSelector(state => state.ContactUsFieldsReducer.fields);
  const dispatch = useAppDispatch();

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      refetch();
      setRefreshing(false);
    }, 3000);
  };

  /**
   * Validates the form fields and triggers either form submission or CAPTCHA.
   */
  const verify = () => {
    let propertiesArray = Object.keys(fields);

    const isValid = propertiesArray?.findIndex(
      property => !fields[property].valid,
    );
    if (!isValid) {
      Alert.alert('Not all fields are correct');
      return;
    }
    if (!isCaptcha) {
      return submitContactUsForm(fields, onSuccess, onError);
    } else {
      recaptcha?.current?.open();
    }
  };

  // Callback function for successful form submission.
  const onSuccess = () => {
    dispatch(clearAllFieldsContactUs());
    setToken('');
    navigate('message', {message: success_message});
  };

  // Callback function for failed form submission.
  const onError = () => {
    setToken('');
    navigate('message', {message: unsuccess_message});
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <Screen edges={['horizontal']}>
        <View style={{gap: 20}}>
          {form?.attributes?.map((attribute: IAttributes, index: number) => {
            // This switch statement is used to render the correct component based on the attribute type
            switch (attribute.type) {
              case 'string':
                return (
                  <ContactUsInput
                    marker={attribute.marker}
                    validators={attribute.validators}
                    title={attribute.localizeInfos.title}
                    key={'contact_us_str' + index}
                  />
                );
              case 'text':
                return (
                  <ContactUsInput
                    marker={attribute.marker}
                    validators={attribute.validators}
                    title={attribute.localizeInfos.title}
                    multiline
                    key={'contact_us_text' + index}
                  />
                );
              case 'button':
                return (
                  <BigButton
                    action={verify}
                    title={attribute.localizeInfos.title}
                    key={index}
                    outline={false}
                    disabled={false}
                  />
                );
              case 'spam':
                if (attribute?.settings?.captchaKey) {
                  return (
                    <FormCaptcha
                      captchaKey={attribute.settings.captchaKey}
                      captchaDomain={attribute.settings.captchaKeyDomain}
                      token={token}
                      onSuccess={() =>
                        submitContactUsForm(fields, onSuccess, onError)
                      }
                      ref={recaptcha}
                      setIsCaptcha={setIsCaptcha}
                      setToken={setToken}
                      key={index}
                    />
                  );
                }

              case 'list':
                const dataArray = attribute.listTitles.reduce(
                  (arr: any[], currentValue: any) => {
                    arr.push({
                      label: currentValue.title,
                      value: currentValue.value,
                    });
                    return arr;
                  },
                  [],
                );
                return (
                  <FormDropdown
                    label={attribute.localizeInfos.title}
                    field={fields[attribute.marker]}
                    name={attribute.marker}
                    required={!!attribute?.validators?.requiredValidator}
                    data={dataArray}
                    key={index}
                  />
                );
            }
          })}
        </View>
      </Screen>
      <TopSpacerV2 height={200} />
    </ScrollView>
  );
};

export default ContactUsForm;
