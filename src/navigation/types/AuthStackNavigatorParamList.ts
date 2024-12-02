export type AuthStackNavigatorParamList = {
  auth_home: undefined;
  auth_sign_in: {
    method: string;
  };
  auth_sign_up: undefined;
  activate_user: {
    email: string;
    method: string;
    password?: string;
    event: 'activate' | 'reset';
  };
  reset_password: {
    email?: string;
  };
  new_password: {
    email: string;
    code: string;
  };
};
