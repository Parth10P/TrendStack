import * as React from 'react';
import { BottomNavigation, Text } from 'react-native-paper';

const HomeRoute = () => <Text>Home</Text>;
const CategoriesRoute = () => <Text>Categories</Text>;
const ExploreRoute = () => <Text>Explore</Text>;
const SavedRoute = () => <Text>Saved</Text>;

const MyComponent = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
    { key: 'categories', title: 'Categories', focusedIcon: 'apps' },
    { key: 'explore', title: 'Explore', focusedIcon: 'magnify' },
    { key: 'saved', title: 'Saved', focusedIcon: 'bookmark', unfocusedIcon: 'bookmark-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    categories: CategoriesRoute,
    explore: ExploreRoute,
    saved: SavedRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default MyComponent;
