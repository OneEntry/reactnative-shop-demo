import React, {useContext} from 'react';
import {NavigationProps} from '../../navigation/types/types';
import {AuthContext} from '../../providers/AuthContext';
import UnauthorizedBlock from '../../components/shared/UnauthorizedBlock';
import {UserOrdersList} from '../../components/content/UserOrdersScreen';

const UserOrdersScreen: React.FC<NavigationProps> = ({}) => {
  const {errorPage, user} = useContext(AuthContext);

  if (errorPage && !user) {
    return <UnauthorizedBlock page={errorPage} />;
  }

  return <UserOrdersList />;
};

export default UserOrdersScreen;
