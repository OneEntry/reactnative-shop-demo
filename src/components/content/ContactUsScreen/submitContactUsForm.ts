/* eslint-disable prettier/prettier */
import {
  FormDataType,
  IFormsPost,
} from 'oneentry/dist/formsData/formsDataInterfaces';
import {defineApi} from '../../../api';
import {IError} from 'oneentry/dist/base/utils';
import {InputValue} from '../../ui/inputs/AppInput';

export const submitContactUsForm = async (
  fields: {[p: string]: InputValue},
  onSuccess,
  onError,
) => {
  const emptyFormData: {marker?: string; value?: string}[] = [];
  if (fields) {
    let propertiesArray = Object.entries(fields);

    const transformedFormData = propertiesArray?.reduce(
      (formData, [key, value]) => {
        if (!value.value) {
          return formData;
        }
        let newData: FormDataType = {
          marker: key,
          type: 'string',
          value: value.value,
        };
        if (key === 'topic') {
          newData = {
            marker: key,
            type: 'list',
            value: [value.value],
          };
        }

        if (key === 'text') {
          newData = {
            marker: key,
            type: 'text',
            value: [
              {
                markdownValue: "<p>value.value</p>",
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
      const res = await defineApi.FormData.postFormsData(formData);
      if ((res as IError)?.statusCode >= 400) {
        throw new Error((res as IError)?.message);
      }

      onSuccess();
    } catch (e: any) {
      onError();
    }
  }
};
