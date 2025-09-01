/* eslint-disable prettier/prettier */
import React, {useEffect, useRef, useState} from 'react';
import {Alert, RefreshControl, ScrollView, View} from 'react-native';
import FormDropdown from '../../shared/FormDropdown';
import {useGetForm} from '../../../api';
import {Screen} from '../../ui/templates/Screen';
import TopSpacerV2 from '../../ui/space/TopSpacerV2';
import Loader from '../../ui/space/Loader';
import {IAttributes} from 'oneentry/dist/base/utils';
import ContactUsInput from './ContactUsInput';
import {useAppDispatch, useAppSelector} from '../../../state/hooks';
import {
  addFieldContactUs,
  clearAllFieldsContactUs,
} from '../../../state/reducers/ContactUsFieldsReducer';
import {navigate} from '../../../navigation/utils/NavigatonRef';
import BigButton from '../../shared/BigButton';
import {submitContactUsForm} from './submitContactUsForm';
import {useAuth} from '../../../state/contexts/AuthContext';

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
  const [isSubmiting, setISubmiting] = useState(false);
  const {user} = useAuth();
  const success_message = form?.localizeInfos?.successMessage;
  const unsuccess_message = form?.localizeInfos?.unsuccessMessage;
  const fields = useAppSelector(state => state.ContactUsFieldsReducer.fields);
  const {incorrect_fields_text} = useAppSelector(
    state => state.systemContentReducer.content,
  );
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
    setISubmiting(true);
    let propertiesArray = Object.keys(fields);

    const isValid = propertiesArray?.findIndex(
      property => !fields[property].valid,
    );
    if (!isValid) {
      Alert.alert(incorrect_fields_text);
      return;
    }

    const filteredObject = Object.fromEntries(
      Object.entries(fields).filter(([key, value]) => value.value !== '' && value.value !== undefined)
    );
    if (!isCaptcha) {
      return submitContactUsForm(filteredObject, onSuccess, onError);
    }

    setISubmiting(false);
  };

  useEffect(() => {
    if (form) {
      form.attributes?.map((attribute: IAttributes) => {
        const fieldValue =
          (attribute?.marker === 'first_nme' &&
            user?.formData?.find(field => field.marker === 'name_reg')
              ?.value) ||
          (attribute?.marker === 'email' &&
            user?.formData?.find(field => field.marker === 'email_reg')
              ?.value) ||
          '';
        dispatch(
          addFieldContactUs({
            [attribute.marker]: {
              marker: attribute?.marker,
              value: fieldValue,
              valid: fieldValue
                ? true
                : !attribute?.validators?.requiredValidator,
              type: attribute?.type,
              validators: attribute?.validators,
              title: attribute?.localizeInfos?.title,
              listTitles: attribute?.listTitles,
            },
          }),
        );
      });
    }
  }, [form]);

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
          {Object.entries(fields)?.map(([marker, value], index: number) => {
            // This switch statement is used to render the correct component based on the attribute type
            switch (value?.type) {
              case 'string':
                return (
                  <ContactUsInput
                    marker={marker}
                    validators={value?.validators}
                    title={value?.title}
                    field={value}
                    key={'contact_us_str' + index}
                  />
                );
              case 'text':
                return (
                  <ContactUsInput
                    marker={marker}
                    validators={value?.validators}
                    title={value?.title}
                    field={value}
                    multiline
                    key={'contact_us_text' + index}
                  />
                );
              case 'button':
                return (
                  <BigButton
                    action={verify}
                    isLoading={isSubmiting}
                    title={value?.title}
                    key={index}
                    outline={false}
                    disabled={false}
                  />
                );
              // case 'spam':
              //   if (currentAttribute?.settings?.captchaKey) {
              //     return (
              //       <FormCaptcha
              //         captchaKey={attribute.settings.captchaKey}
              //         captchaDomain={attribute.settings.captchaKeyDomain}
              //         token={token}
              //         onSuccess={() =>
              //           submitContactUsForm(fields, onSuccess, onError)
              //         }
              //         setIsCaptcha={setIsCaptcha}
              //         setToken={setToken}
              //         key={index}
              //       />
              //     );
              //   }

              case 'list':
                console.log(value);
                const dataArray = value?.listTitles?.reduce(
                  (arr: any[], currentValue) => {
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
                    field={value}
                    marker={marker}
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
