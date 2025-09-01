import React, {useMemo} from 'react';
import {BadgeList} from '../../../shared/Badges';
import {IListTitle} from 'oneentry/dist/attribute-sets/attributeSetsInterfaces';
import {layoutPadding} from '../../../../utils/consts';
import {navigate} from '../../../../navigation/utils/NavigatonRef';
import {IAttributeValues} from 'oneentry/dist/base/utils';
import Skeleton from '../../../shared/Skeleton';

type Props = {
  attributes?: IAttributeValues;
  loading: boolean;
};

/**
 * HomeBadges component displays a list of badges.
 * It navigates to the corresponding shop screen based on the clicked badge.
 *
 * @param {Props} props - Component props.
 * @returns {React.ReactElement} - Rendered component.
 */
const HomeBadges: React.FC<Props> = ({
  attributes,
  loading,
}: Props): React.ReactElement => {
  const badges = useMemo<[]>(() => {
    return attributes?.badges?.value?.map((badge: IListTitle) => {
      if (!badge?.title || !badge?.value) {
        return;
      }
      const badgeToPush = {
        label: badge.title,
        value: badge.value,
      };
      return badgeToPush;
    });
  }, [attributes]);

  const onChangeActiveBadge = (value: number) => {
    // @ts-ignore
    const field = attributes?.badges?.value[value];

    console.log('=>(HomeBadges.tsx:42) field', field);

    if (!field?.value) {
      return;
    }

    navigate('shop', {pageUrl: field.value});
  };

  return (
    <Skeleton height={60} isLoading={loading}>
      <BadgeList
        options={badges || []}
        onChange={index => onChangeActiveBadge(index)}
        style={{paddingHorizontal: layoutPadding}}
        filters={[]}
      />
    </Skeleton>
  );
};
export default HomeBadges;
