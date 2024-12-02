import React, {useLayoutEffect, useState} from 'react';
import {Keyboard, TouchableWithoutFeedback, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SearchHeader, SearchHistory } from "../../components/content/SearchScreen";

interface Props {}

const SearchScreen: React.FC<Props> = ({}) => {
  const [query, setQuery] = useState<string>('');

  //Fetch stored search history from AsyncStorage
  useLayoutEffect(() => {
    (async () => {
      const storedSearch = await AsyncStorage.getItem('search-history');
      if (storedSearch) {
        setQuery(storedSearch);
      }
    })();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View>
        {/*Search input */}
        <SearchHeader query={query} />
        {/*Search history */}
        <SearchHistory query={query} />
      </View>
    </TouchableWithoutFeedback>
  );
};
export default SearchScreen;
