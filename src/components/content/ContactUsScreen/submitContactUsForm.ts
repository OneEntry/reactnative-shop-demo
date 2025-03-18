import {
  FormDataType,
  IFormsPost,
} from 'oneentry/dist/formsData/formsDataInterfaces';
import {defineApi} from '../../../api';
import {IError} from 'oneentry/dist/base/utils';

export const submitContactUsForm = async (fields, onSuccess, onError) => {
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
