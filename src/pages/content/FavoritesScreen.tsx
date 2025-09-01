import React from 'react';
import {NavigationProps} from '../../navigation/types/types';
import TopSpacerV2 from '../../components/ui/space/TopSpacerV2';
import {Screen} from '../../components/ui/templates/Screen';
import {FavoritesItemsList} from '../../components/content/FavoritesScreen';

const FavoritesScreen: React.FC<NavigationProps> = () => {
  return (
    <Screen white edges={['horizontal']} className={'h-full'}>
      <TopSpacerV2 height={90} />
      <FavoritesItemsList />
    </Screen>
  );
};

export default FavoritesScreen;
