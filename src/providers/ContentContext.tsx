import {createContext, ReactNode, useEffect} from 'react';
import {useAppDispatch} from '../store/hooks';
import {addContent, ContentType} from '../store/reducers/SystemContentSlice';
import {IListTitle} from 'oneentry/dist/attribute-sets/attributeSetsInterfaces';
import {
  useGetBlockByMarkerQuery,
  useGetSingleAttributeInSetByMarkerQuery,
} from '../api/api/RTKApi';

const ContentContext = createContext({});

type Props = {
  children: ReactNode;
};

export const ContentContextProvider = ({children}: Props) => {
  const {data: block} = useGetBlockByMarkerQuery({marker: 'system_content'});
  const {data: attributes, error} = useGetSingleAttributeInSetByMarkerQuery({
    setMarker: 'system_content',
    attributeMarker: 'cart_item_options',
  });
  const dispatch = useAppDispatch();

  //Set variables which will be used in the app
  useEffect(() => {
    if (block) {
      const systemContent: ContentType = {
        buttons: {
          addToCart: block?.attributeValues?.add_to_cart_button?.value,
          outOfStock: block?.attributeValues?.out_of_stock_button?.value,
        },
        currency: block?.attributeValues?.currency?.value,
        open_filters_button: block?.attributeValues?.open_filters_button?.value,
        empty_cart_plug: block?.attributeValues?.empty_cart_plug?.value,
        empty_favorites_plug:
          block?.attributeValues?.empty_favorites_plug?.value,
        cart_button_active: block?.attributeValues?.cart_button_active?.value,
        cart_item_options: !error
          ? (attributes?.listTitles as IListTitle[])
          : [],
        all_products_button: block?.attributeValues?.all_products_button?.value,
        content_not_found: block?.attributeValues?.content_not_found?.value,
        reset_button_placeholder:
          block?.attributeValues?.reset_button_placeholder?.value,
        apply_button_placeholder:
          block?.attributeValues?.apply_button_placeholder?.value,
        search_placeholder: block?.attributeValues?.search_placeholder?.value,
        search_history_title:
          block?.attributeValues?.search_history_title?.value,
        category_product_plug:
          block?.attributeValues?.category_product_plug?.value,
        contact_us_logo:
          block?.attributeValues?.contact_us_logo?.value[0]?.downloadLink,
        go_to_pay_placeholder:
          block?.attributeValues?.go_to_pay_placeholder?.value,
        units_plug: block?.attributeValues?.units_plug?.value,
        price_to: block?.attributeValues?.price_to?.value,
        price_from: block?.attributeValues?.price_from?.value,
        user_name_placeholder:
          block?.attributeValues?.user_name_placeholder?.value,
        user_phone_placeholder:
          block?.attributeValues?.user_phone_placeholder?.value,
        order_info_total: block?.attributeValues?.order_info_total?.value,
        order_info_quantity: block?.attributeValues?.order_info_quantity?.value,
        order_info_status: block?.attributeValues?.order_info_status?.value,
        order_info_amount: block?.attributeValues?.order_info_amount?.value,
        order_info_date_placeholder:
          block?.attributeValues?.order_info_date_placeholder?.value,
        order_info_time_placeholder:
          block?.attributeValues?.order_info_time_placeholder?.value,
        order_info_comment_placeholder:
          block?.attributeValues?.order_info_comment_placeholder?.value,
        order_info_address_placeholder:
          block?.attributeValues?.order_info_address_placeholder?.value,
        round_logo: block?.attributeValues?.round_logo?.value[0]?.downloadLink,
        log_out_button: block?.attributeValues?.log_out_button?.value,
        unsuccessful_payment_text:
          block?.attributeValues?.unsuccessful_payment_text?.value,
        successful_payment_text:
          block?.attributeValues?.successful_payment_text?.value,
        email_auth: block?.attributeValues?.email_auth?.value,
        auth_text: block?.attributeValues?.auth_text?.value,
        terms_text: block?.attributeValues?.terms_text?.value,
        success_alert: block?.attributeValues?.success_alert?.value,
        invalid_input_value: block?.attributeValues?.invalid_input_value?.value,
        verify: block?.attributeValues?.verify?.value,
        close_text: block?.attributeValues?.close_text?.value,
        view_catalog_text: block?.attributeValues?.view_catalog_text?.value,
        sign_in_title: block?.attributeValues?.sign_in_title?.value,
        sign_up_title: block?.attributeValues?.sign_up_title?.value,
        welcome_title: block?.attributeValues?.welcome_title?.value,
        reset_title: block?.attributeValues?.reset_title?.value,
        otp_title: block?.attributeValues?.otp_title?.value,
        new_password_title: block?.attributeValues?.new_password_title?.value,
        resend_text: block?.attributeValues?.resend_text?.value,
        enter_otp_code: block?.attributeValues?.enter_otp_code?.value,
        receive_otp_text: block?.attributeValues?.receive_otp_text?.value,
        verify_now_text: block?.attributeValues?.verify_now_text?.value,
        submit_text: block?.attributeValues?.submit_text?.value,
        email_text: block?.attributeValues?.email_text?.value,
        reset_descr: block?.attributeValues?.reset_descr?.value,
        privacy_policy: block?.attributeValues?.privacy_policy?.value,
        sign_in_text: block?.attributeValues?.sign_in_text?.value,
        forgot_password_text:
          block?.attributeValues?.forgot_password_text?.value,
      };
      dispatch(addContent(systemContent));
    }
  }, [block, attributes]);

  return <ContentContext.Provider value>{children}</ContentContext.Provider>;
};
