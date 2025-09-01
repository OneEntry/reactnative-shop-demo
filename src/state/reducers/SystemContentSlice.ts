import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  IAttributesSetsEntity,
  IListTitle,
} from 'oneentry/dist/attribute-sets/attributeSetsInterfaces';
import {IBlockEntity} from 'oneentry/dist/blocks/blocksInterfaces';
import {IMenusPages} from 'oneentry/dist/menus/menusInterfaces';

type ButtonsType = {
  addToCart: string;
  outOfStock: string;
};

export type ContentType = {
  buttons: ButtonsType;
  empty_cart_plug: string;
  empty_favorites_plug: string;
  cart_button_active: string;
  open_filters_button: string;
  all_products_button: string;
  content_not_found: string;
  reset_button_placeholder: string;
  apply_button_placeholder: string;
  search_history_title: string;
  search_placeholder: string;
  category_product_plug: string;
  contact_us_logo: string;
  currency: string;
  price_from: string;
  price_to: string;
  color_filters?: IListTitle[];
  go_to_pay_placeholder: string;
  unsuccessful_payment_text: string;
  successful_payment_text: string;
  email_auth: string;
  auth_text: string;
  units_plug: string;
  user_name_placeholder: string;
  user_phone_placeholder: string;
  order_info_total: string;
  order_info_quantity: string;
  order_info_status: string;
  order_info_amount: string;
  order_info_date_placeholder: string;
  order_info_time_placeholder: string;
  order_info_comment_placeholder: string;
  order_info_address_placeholder: string;
  terms_text: string;
  invalid_input_value: string;
  verify: string;
  close_text: string;
  [key: string]: any;
};

type InitialStateType = {
  content: ContentType;
  cart_item_options?: IListTitle[];
  menu: IMenusPages[];
};
const initialState: InitialStateType = {
  content: {
    buttons: {
      addToCart: '',
      outOfStock: '',
    },
    empty_cart_plug: '',
    currency: '$',
    empty_favorites_plug: '',
    cart_button_active: '',
    open_filters_button: '',
    all_products_button: '',
    content_not_found: '',
    reset_button_placeholder: '',
    apply_button_placeholder: '',
    search_placeholder: '',
    search_history_title: '',
    category_product_plug: '',
    contact_us_logo: '',
    terms_text: '',
    go_to_pay_placeholder: '',
    price_from: '',
    price_to: '',
    color_filters: [],
    units_plug: '',
    user_name_placeholder: '',
    user_phone_placeholder: '',
    order_info_total: '',
    order_info_quantity: '',
    order_info_status: '',
    order_info_amount: '',
    unsuccessful_payment_text: '',
    successful_payment_text: '',
    email_auth: '',
    auth_text: '',
    order_info_date_placeholder: '',
    order_info_time_placeholder: '',
    order_info_comment_placeholder: '',
    order_info_address_placeholder: '',
    invalid_input_value: '',
    verify: '',
    close_text: '',
  },
  menu: [],
  cart_item_options: [],
};

export const systemContentSlice = createSlice({
  name: 'featured-object-slice',
  initialState,
  reducers: {
    addContent(state, action: PayloadAction<IBlockEntity>) {
      const block = {
        attributeValues:
          action.payload?.attributeValues?.en_US ??
          action.payload?.attributeValues,
      };
      if (!Object.entries(block)?.length) {
        return;
      }

      state.content = {
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
        shipping_product_id: block?.attributeValues?.shipping_product_id?.value,
        privacy_url: block?.attributeValues?.privacy_url?.value,
        incorrect_fields_text:
          block?.attributeValues?.incorrect_fields_text?.value,
      };
    },
    addMenu(state, action: PayloadAction<IMenusPages[]>) {
      state.menu = action.payload || [];
    },
    addStaticContent(state, action: PayloadAction<any[]>) {
      const attributes = action?.payload?.reduce(
        (obj: Record<string, any>, item) => {
          obj[item.marker] = item?.localizeInfos?.value;
          return obj;
        },
        {},
      );

      console.log(attributes);
      state.content = {
        ...state.content,
        ...attributes,
      };
    },
    addCartOptions(
      state,
      action: PayloadAction<IAttributesSetsEntity | undefined>,
    ) {
      state.cart_item_options =
        (action.payload?.listTitles as IListTitle[]) || [];
    },
  },
});

export const {addContent, addCartOptions, addMenu, addStaticContent} =
  systemContentSlice.actions;

export default systemContentSlice.reducer;
