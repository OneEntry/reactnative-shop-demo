import React, {memo} from 'react';
import {Paragraph} from '../../ui/texts/Paragraph';
import {useAppSelector} from '../../../state/hooks';

type Props = {};

const ResetPasswordHeader: React.FC<Props> = ({}) => {
  const {reset_descr} = useAppSelector(
    state => state.systemContentReducer.content,
  );
  return (
    <Paragraph size={16} color={'lightGray'} className={'leading-6'}>
      {reset_descr}
    </Paragraph>
  );
};

export default memo(ResetPasswordHeader);
