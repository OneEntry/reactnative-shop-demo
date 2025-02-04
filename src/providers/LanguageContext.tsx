import {createContext, Dispatch, ReactNode, useEffect, useState} from 'react';
import {LanguageEnum} from '../types/enum';
import {ILocalEntity} from 'oneentry/dist/locales/localesInterfaces';
import {
  RTKApi,
  useGetBlockByMarkerQuery,
  useGetLocalesQuery,
  useGetSingleAttributeInSetByMarkerQuery,
  useLazyGetBlockByMarkerQuery,
} from '../api/api/RTKApi';
import ErrorBlock from '../components/shared/ErrorBlock';
import {DropdownItem} from '../navigation/components/CustomDropdown';
import {useAppDispatch} from '../store/hooks';
import {
  addCartOptions,
  addContent,
  ContentType,
} from '../store/reducers/SystemContentSlice';
import {IListTitle} from 'oneentry/dist/attribute-sets/attributeSetsInterfaces';

type ContextProps = {
  activeLanguage: LanguageEnum;
  languagesData: any;
  setActiveLanguage: Dispatch<LanguageEnum>;
};
export const LanguageContext = createContext<ContextProps>({
  activeLanguage: LanguageEnum.EN,
  setActiveLanguage(): void {},
  languagesData: null,
});

type ProviderProps = {
  children: ReactNode;
};
export const LanguageProvider = ({children}: ProviderProps) => {
  const [languagesData, setLanguagesData] = useState<DropdownItem[]>([]);
  const [activeLanguage, setActiveLanguage] = useState<LanguageEnum>(
    LanguageEnum.EN,
  );
  const {data: locales, error} = useGetLocalesQuery({});
  const {data: block} = useGetBlockByMarkerQuery({
    marker: 'system_content',
    langCode: activeLanguage,
  });
  const {data: attributes} = useGetSingleAttributeInSetByMarkerQuery({
    setMarker: 'system_content',
    attributeMarker: 'cart_item_options',
  });
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (block) {
      dispatch(addContent(block));
    }
  }, [block]);

  useEffect(() => {
    console.log(attributes);
    if (attributes) {
      dispatch(addCartOptions(attributes));
    }
  }, [attributes]);

  useEffect(() => {
    (async () => {
      if (locales?.length) {
        const localesEdit = locales.map((lang: ILocalEntity) => {
          return {
            label: lang.shortCode.toUpperCase(),
            value: lang.code,
          };
        });
        setLanguagesData(localesEdit);
      }
    })();
  }, [locales]);

  const value = {
    activeLanguage,
    languagesData,
    setActiveLanguage,
  };

  if (error) {
    return <ErrorBlock errorTitle={error.toString()} />;
  }

  return (
    <LanguageContext.Provider key={activeLanguage} value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
