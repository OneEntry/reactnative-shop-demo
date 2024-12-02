import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import {Dimensions, Image, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {LanguageContext} from '../../providers/LanguageContext';
import CustomDropdown from './CustomDropdown';
import {OpenDrawerContext} from '../../providers/OpenDrawerContext';
import {styleColors} from '../../utils/consts';
import {useAppSelector} from '../../store/hooks';
import {DrawerActions} from '@react-navigation/native';
import {DIcon} from './DIcon';
import Footer from '../../components/ui/space/Footer';
import FlexLoader from '../../components/ui/space/FlexLoader';
import {IMenusPages} from 'oneentry/dist/menus/menusInterfaces';
import ErrorBlock from '../../components/shared/ErrorBlock';
import {navigate} from '../utils/NavigatonRef';
import {useGetMenuQuery} from '../../api/api/RTKApi';

type NestedPage = IMenusPages & {children?: IMenusPages[]};

export const createNestedArray = (
  objects: IMenusPages[],
  parentId: null | number = null,
): NestedPage[] => {
  const nestedArray: NestedPage[] = [];
  objects.map((object: any) => {
    if (object.parentId === parentId) {
      const nestedChildren: NestedPage[] = createNestedArray(
        objects,
        object.id,
      );
      if (nestedChildren.length) {
        object.children = nestedChildren;
      }
      nestedArray.push(object);
    }
  });
  return nestedArray;
};

const SubPage = ({page}: {page: IMenusPages}) => {
  const {setActive, active} = useContext(OpenDrawerContext);

  return (
    <DrawerItem
      style={{paddingLeft: 60, width: 200}}
      focused={active === page.pageUrl}
      activeBackgroundColor={'rgba(236, 114, 43, 0.05)'}
      activeTintColor={styleColors.background}
      // @ts-ignore
      label={page?.localizeInfos?.menuTitle || 'no localization'}
      onPress={() => {
        setActive(page.pageUrl);
        navigate(page?.pageUrl, {
          pageUrl: page?.pageUrl,
          title: page?.pageUrl,
        });
      }}
      key={page?.pageUrl}
    />
  );
};

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const {navigation} = props;
  const {
    data: menu,
    isLoading: loading,
    error,
  } = useGetMenuQuery({marker: 'main'});
  const [nestedPages, setNestedPages] = useState<NestedPage[]>([]);
  const {languagesData} = useContext(LanguageContext);
  const logo = useAppSelector(
    state => state.systemContentReducer.content.contact_us_logo,
  );
  const {setActive, active} = useContext(OpenDrawerContext);

  useEffect(() => {
    if (menu) {
      setNestedPages(createNestedArray(menu?.pages as IMenusPages[]));
    }
  }, [menu]);

  if (error) {
    return <ErrorBlock errorTitle={error.toString()} />;
  }

  return (
    <DrawerContentScrollView className={'bg-white w-full h-full'} {...props}>
      {loading && <FlexLoader />}
      {nestedPages && (
        <>
          <View style={{padding: 15, paddingBottom: 40}}>
            {logo && (
              <Image
                source={{uri: logo}}
                style={{width: 127.5, height: 35.1, objectFit: 'contain'}}
              />
            )}
          </View>

          <View
            className={
              'absolute right-0 top-0 items-center justify-center h-screen'
            }
          />
          {nestedPages.map((page, index) => (
            <View key={index}>
              <DrawerItem
                focused={active === page.pageUrl}
                label={page?.localizeInfos?.menuTitle || 'no localization'}
                icon={props =>
                  DIcon(
                    props,
                    // @ts-ignore
                    page?.attributeValues?.page_icon?.value?.downloadLink,
                  )
                }
                activeBackgroundColor={'rgba(236, 114, 43, 0.05)'}
                activeTintColor={styleColors.background}
                style={{width: 200, justifyContent: 'center'}}
                onPress={() => {
                  setActive(page.pageUrl);
                  navigation.dispatch(DrawerActions.toggleDrawer());
                  props.navigation.navigate(page?.pageUrl);
                }}
                key={page.pageUrl}
              />
              {page.children &&
                page.children.map(child => {
                  return <SubPage key={child.pageUrl} page={child} />;
                })}
            </View>
          ))}
          <View style={{width: 150}}>
            {languagesData && <CustomDropdown data={languagesData} />}
          </View>
          <Footer />
        </>
      )}
    </DrawerContentScrollView>
  );
}
