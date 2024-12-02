import React from 'react';
import {Screen} from '../ui/templates/Screen';
import {IPagesEntity} from 'oneentry/dist/pages/pagesInterfaces';
import {Paragraph} from '../ui/texts/Paragraph';
import {navigateAuth} from '../../navigation/utils/NavigatonRef';
import {Button} from '../ui/buttons/Button';

type Props = {
  page: IPagesEntity;
};

const UnauthorizedBlock: React.FC<Props> = ({page}) => {
  const action = () => {
    navigateAuth('auth_home');
  };
  return (
    <Screen isFull className={'gap-8 justify-center'} white edges={['top', 'horizontal']}>
      <Paragraph size={56} weight={'bold'}>
        {page?.attributeValues?.error_title?.value}
      </Paragraph>
      <Paragraph size={28}>
        {page?.attributeValues?.error_description?.value[0]?.plainValue}
      </Paragraph>
      <Button
        rounded
        className={'bg-accent mt-24'}
        paragraphProps={{
          style: {color: '#fff'},
          weight: 'bold',
          size: 16,
        }}
        onPress={action}>
        {page?.attributeValues?.error_button_text?.value}
      </Button>
    </Screen>
  );
};

export default UnauthorizedBlock;
