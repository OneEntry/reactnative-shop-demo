import React, {useContext} from 'react';
import {ScrollView} from 'react-native';
import Email from './assets/Email.svg';
import BigButton from '../../shared/BigButton';
import CreateAccountButton from '../../shared/CreateAccountButton';
import {navigateAuth} from '../../../navigation/utils/NavigatonRef';
import {LanguageContext} from '../../../state/contexts/LanguageContext';
import {useGetAuthProvidersQuery} from '../../../api';
import ErrorBlock from '../../shared/ErrorBlock';

type Props = {};

const AuthMethodsList: React.FC<Props> = ({}) => {
  const {activeLanguage} = useContext(LanguageContext);
  const {data, error, isLoading} = useGetAuthProvidersQuery(activeLanguage);

  if (isLoading) {
    return <></>;
  }

  if (error) {
    return <ErrorBlock errorTitle={error.toString()} />;
  }

  return (
    <ScrollView contentContainerStyle={{gap: 20}} scrollEnabled={false}>
      {data?.map((method, index) => (
        <BigButton
          className={'bg-accent'}
          paragraphStyle={{color: 'white'}}
          action={() => navigateAuth('auth_sign_in', {method: method.type})}
          key={method?.identifier + index}
          title={'Sign in with Email'}
          Icon={<Email />}
        />
      ))}
      <CreateAccountButton />
    </ScrollView>
  );
};

export default AuthMethodsList;
