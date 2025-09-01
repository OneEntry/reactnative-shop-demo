import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import {Image, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {LanguageContext} from '../../state/contexts/LanguageContext';
import CustomDropdown from './CustomDropdown';
import {OpenDrawerContext} from '../../state/contexts/OpenDrawerContext';
import {styleColors} from '../../utils/consts';
import {useAppSelector} from '../../state/hooks';
import {DrawerActions} from '@react-navigation/native';
import {DIcon} from './DIcon';
import Footer from '../../components/ui/space/Footer';
import {IMenusEntity, IMenusPages} from 'oneentry/dist/menus/menusInterfaces';
import {navigate} from '../utils/NavigatonRef';

type NestedPage = IMenusPages & {children?: IMenusPages[]};

/**
 * Creates a nested array from flat menu data.
 *
 * @param {IMenusPages[]} objects - Array of menu objects.
 * @param {null | number} parentId - Parent ID for the current level.
 * @returns {NestedPage[]} - Nested array of menu objects.
 */
export const createNestedArray = (
  objects: IMenusPages[],
  parentId: null | number = null,
): NestedPage[] => {
  const nestedArray: NestedPage[] = [];
  objects.map((object: any) => {
    // Check if the current object's parentId matches the specified parent ID
    if (object.parentId === parentId) {
      // Create array of current page children
      const nestedChildren: NestedPage[] = createNestedArray(
        objects,
        object.id,
      );

      if (nestedChildren.length) {
        return nestedArray.push({...object, children: nestedChildren});
      }
      nestedArray.push(object);
    }
  });
  return nestedArray;
};

/**
 * CustomDrawerContent component represents the custom drawer(sidebar) for navigation.
 * It dynamically generates drawer items based on the menu data.
 *
 * @param {DrawerContentComponentProps} props - Component props.
 * @returns {React.ReactElement} - Rendered component.
 */
export function CustomDrawerContent(
  props: DrawerContentComponentProps & {menu: IMenusEntity},
): React.ReactElement {
  const {navigation, menu} = props;
  const [nestedPages, setNestedPages] = useState<NestedPage[]>([]);
  const {languagesData} = useContext(LanguageContext);
  const logo = useAppSelector(
    state => state.systemContentReducer.content.contact_us_logo,
  );
  const {setActive, active} = useContext(OpenDrawerContext);

  // Create nested pages array from flat menu data
  useEffect(() => {
    if (menu) {
      setNestedPages(createNestedArray(menu?.pages as IMenusPages[]));
    }
  }, [menu]);

  return (
    <DrawerContentScrollView className={'bg-white w-full h-full'} {...props}>
      {nestedPages && (
        <>
          {/* Logo section */}
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

          {/* Drawer items */}
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
                  return (
                    <SubPage
                      parentUrl={page.pageUrl}
                      key={child.pageUrl}
                      page={child}
                    />
                  );
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

/**
 * SubPage component renders a nested page item in the drawer.
 *
 * @param {Object} props - Component props.
 * @param {IMenusPages} props.page - The page object to render.
 * @returns {React.ReactElement} - Rendered component.
 */
const SubPage = ({
  page,
  parentUrl,
}: {
  page: IMenusPages;
  parentUrl?: string;
}) => {
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
        if (parentUrl === 'shop') {
          return navigate(parentUrl, {
            pageUrl: page.pageUrl,
            title: page?.pageUrl,
          });
        }
        navigate(page?.pageUrl, {
          pageUrl: page?.pageUrl,
          title: page?.pageUrl,
        });
      }}
      key={page?.pageUrl}
    />
  );
};
