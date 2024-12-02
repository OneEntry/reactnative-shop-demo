import React, {Dispatch, memo} from 'react';
import {TouchableOpacity} from 'react-native';
import Select from '../../ui/buttons/Select';
import {Paragraph} from '../../ui/texts/Paragraph';
import {useAppSelector} from '../../../store/hooks';

type Props = {
  agreed: boolean;
  setAgreed: Dispatch<boolean>;
};

const TermsAndConditions: React.FC<Props> = ({agreed, setAgreed}) => {
  const toggleSwitch = () => setAgreed(!agreed);
  const {terms_text} = useAppSelector(
    state => state.systemContentReducer.content,
  );

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={toggleSwitch}
      className={'flex-row items-start w-full'}>
      <Select selected={agreed} />
      <Paragraph size={14} weight={'500'} color={'gray'} className={'ml-2.5'}>
        {terms_text}
      </Paragraph>
    </TouchableOpacity>
  );
};

export default memo(TermsAndConditions);
