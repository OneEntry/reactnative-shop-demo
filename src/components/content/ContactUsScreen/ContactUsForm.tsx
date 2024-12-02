import React, {useEffect, useRef, useState} from 'react';
import {Alert, RefreshControl, ScrollView, View} from 'react-native';
import FormDropdown from '../../shared/FormDropdown';
import {
  FormDataType,
  IFormsPost,
} from 'oneentry/dist/formsData/formsDataInterfaces';
import {api, useGetForm} from '../../../api';
import {Screen} from '../../ui/templates/Screen';
import TopSpacerV2 from '../../ui/space/TopSpacerV2';
import Loader from '../../ui/space/Loader';
import {IAttributes, IError} from 'oneentry/dist/base/utils';
import {FormCaptcha} from '../../shared/FormCaptcha';
import CompactInput from '../../shared/CompactInput';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {clearAllFieldsContactUs} from '../../../store/reducers/contactUsFieldsReducer';
import {navigate} from '../../../navigation/utils/NavigatonRef';
import BigButton from '../../shared/BigButton';

const ContactUsForm: React.FC = () => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');
  const [isCaptcha, setIsCaptcha] = useState<boolean>(false);
  const {loading, form, initialFormData, refetch} = useGetForm({
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
      postForm();
      return;
    } else {
      recaptcha?.current?.open();
    }
  };

  useEffect(() => {
    if (initialFormData) {
    }
  }, [initialFormData]);

  // This function is used to validate and post the form data to the OneEntry
  const postForm = async () => {
    const emptyFormData: {marker?: string; value?: string}[] = [];
    if (fields) {
      let propertiesArray = Object.keys(fields);

      const transformedFormData = propertiesArray?.reduce(
        (formData, currentValue) => {
          if (!fields[currentValue].value) {
            return formData;
          }
          let newData: FormDataType = {
            marker: currentValue,
            type: 'string',
            value: fields[currentValue].value,
          };
          if (currentValue === 'topic') {
            newData = {
              marker: currentValue,
              type: 'list',
              value: [
                {
                  title: fields[currentValue].value,
                  value: fields[currentValue].value,
                },
              ],
            };
          }

          if (currentValue === 'time2') {
            newData = {
              marker: currentValue,
              type: 'list',
              value: [
                {
                  title: fields[currentValue].value,
                  value: fields[currentValue].value,
                },
              ],
            };
          }

          if (currentValue === 'text') {
            newData = {
              marker: currentValue,
              type: 'text',
              value: [
                {
                  htmlValue: `<p>${fields[currentValue].value}</p>`,
                  plainValue: fields[currentValue].value,
                  params: {
                    isEditorDisabled: false,
                    isImageCompressed: true,
                  },
                },
              ],
            };
          }

          if (newData) {
            formData.push(newData);
          }
          return formData;
        },
        emptyFormData,
      );
      const formData: IFormsPost = {
        formIdentifier: 'contact_us',
        formData: transformedFormData,
      };
      try {
        const res = await api.FormData.postFormsData(formData);
        if ((res as IError)?.statusCode >= 400) {
          throw new Error((res as IError)?.message);
        }
        dispatch(clearAllFieldsContactUs());
        setToken('');
        navigate('message', {message: success_message});
      } catch (e: any) {
        setToken('');
        navigate('message', {message: unsuccess_message});
      }
    }
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
                  <CompactInput
                    marker={attribute.marker}
                    validators={attribute.validators}
                    title={attribute.localizeInfos.title}
                    key={'contact_us_str' + index}
                  />
                );
              case 'text':
                return (
                  <CompactInput
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
                      onSuccess={postForm}
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
