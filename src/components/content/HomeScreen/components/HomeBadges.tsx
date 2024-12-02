import React, {useMemo} from 'react';
import {BadgeList} from '../../../shared/Badges';
import ContentNotFoundBlock from '../../../shared/ContentNotFoundBlock';
import {IListTitle} from 'oneentry/dist/attribute-sets/attributeSetsInterfaces';
import {layoutPadding} from '../../../../utils/consts';
import {navigate} from '../../../../navigation/utils/NavigatonRef';
import Skeleton from 'react-native-reanimated-skeleton';
import {IAttributeValues} from 'oneentry/dist/base/utils';

type Props = {
  attributes?: IAttributeValues;
  loading: boolean;
};

const HomeBadges: React.FC<Props> = ({attributes, loading}) => {
  const badges = useMemo<TBadge[]>(() => {
    return attributes?.badges?.value?.map((badge: IListTitle) => {
      if (!badge?.title || !badge?.value) {
        return;
      }
      const badgeToPush: TBadge = {
        label: badge.title,
        value: badge.value,
      };
      return badgeToPush;
    });
  }, [attributes]);

  const onChangeActiveBadge = (value: number) => {
    // @ts-ignore
    const field = attributes?.badges?.value[value];

    if (!field?.value) {
      return;
    }

    navigate(field.value, {});
  };

  return (
    <Skeleton
      containerStyle={{height: 60}}
      isLoading={loading}
      layout={[{key: 'badges', height: 40, width: '100%', marginTop: 20}]}>
      <BadgeList
        options={badges || []}
        onChange={(index) => onChangeActiveBadge(index)}
        style={{paddingHorizontal: layoutPadding}}
        filters={[]}
      />
    </Skeleton>
  );
};
export default HomeBadges;
