import React, {
  createContext,
  Dispatch,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import {LanguageEnum} from '../../types/enum';
import {ILocalEntity} from 'oneentry/dist/locales/localesInterfaces';
import {
  useGetLocalesQuery,
  useGetSingleAttributeInSetByMarkerQuery,
  useLazyGetBlockByMarkerQuery,
} from '../../api/api/RTKApi';
import ErrorBlock from '../../components/shared/ErrorBlock';
import {DropdownItem} from '../../navigation/components/CustomDropdown';
import {useAppDispatch} from '../hooks';
import {addCartOptions, addContent} from '../reducers/SystemContentSlice';

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

/**
 * Provider component for the LanguageContext.
 * Manages language data, fetches system content block(placeholders, texts, plugs) based on the active language, and provides language-related data to child components.
 *
 * @component LanguageProvider
 * @param {ProviderProps} props - The properties passed to the provider.
 * @param {ReactNode} props.children - The child components wrapped by the provider.
 * @returns {React.ReactElement} A React element wrapping the child components with the LanguageContext.
 */
export const LanguageProvider = ({
  children,
}: ProviderProps): React.ReactElement => {
  const [languagesData, setLanguagesData] = useState<DropdownItem[]>([]);
  const [activeLanguage, setActiveLanguage] = useState<LanguageEnum>(
    LanguageEnum.EN,
  );
  const {data: locales, error} = useGetLocalesQuery({});
  const [getSystemContent, {data: block, isLoading}] =
    useLazyGetBlockByMarkerQuery();
  const {data: attributes} = useGetSingleAttributeInSetByMarkerQuery({
    setMarker: 'system_content',
    attributeMarker: 'cart_item_options',
  });
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (block) {
      dispatch(addContent(block)); // Adds fetched system content to the Content Redux store.
    }
  }, [block]);

  useEffect(() => {
    if (attributes) {
      dispatch(addCartOptions(attributes)); // Adds cart options attribute to the Content Redux store.
    }
  }, [attributes]);

  useEffect(() => {
    if (activeLanguage && !isLoading) {
      getSystemContent({
        marker: 'system_content',
        langCode: activeLanguage,
      }); // Fetches system content for the active language.
    }
  }, [activeLanguage]);

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
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
