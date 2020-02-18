import React from 'react';
import {
  createBottomTabNavigator,
  createStackNavigator,
  createAppContainer,
} from 'react-navigation';
import { Image, StyleSheet } from 'react-native';
import MapPage from './MapPage/MapPage';
import SocialPage from './SocialPage/SocialPage';
import FiltersPage from './FiltersPage/FiltersPage';
import SpotsList from './SpotsPage/SpotsList';
import MaterialFiltersPage from './MaterialFiltersPage/MaterialFiltersPage';
import OrganizationFiltersPage from './OrganizationFiltersPage/OrganizationFiltersPage';
import StatementPage from './StatementPage/StatementPage';
import TroublePage from './TroublePage/TroublePage';
import CitiesPage from './CitiesPage/CitiesPage';
import SearchPage from './SearchPage/SearchPage';
import FreeRequestPage from './FreeRequestPage/FreeRequestPage';
import SelectCityPage from './SelectCityPage/SelectCityPage';
import SettingsPage from './SettingsPage/SettingsPage';
import WasteRequestFirstPage from './WasteRequest/WasteRequestFirstPage';
import WasteRequestSecondPage from './WasteRequest/WasteRequestSecondPage';
import WasteRequestThirdPage from './WasteRequest/WasteRequestThirdPage';
import WasteRequestFourPage from './WasteRequest/WasteRequestFourPage';

import { GREEN, BLACK } from './Colors/Colors';

const MapIcon = require('../content/bottom-menu-map.png');
const MapActiveIcon = require('../content/bottom-menu-map-green.png');
const StatementIcon = require('../content/grey-camera.png');
const StatementActiveIcon = require('../content/green-camera.png');
const SocialIcon = require('../content/bottom-menu-dots.png');
const SocialActiveIcon = require('../content/bottom-menu-dots-green.png');
const SpotsIcon = require('../content/bottom-menu-spots-list.png');
const SpotsActiveIcon = require('../content/bottom-menu-spots-list-green.png');

const styles = StyleSheet.create({
  mapIcon: {
    height: 22,
    width: 22
  },
  statementIcon: {
    height: 23,
    width: 27
  },
  socialIcon: {
    width: 35,
    height: 10,
    marginTop: 15,
    resizeMode: 'contain'
  }
});

const MapStack = createStackNavigator({
  Map: MapPage,
  Trouble: {
    screen: TroublePage,
    navigationOptions: () => ({
      title: 'Заявка о проблеме',
      headerTitleStyle: {
        fontWeight: 'normal',
      },
    }),
  },
  Filters: FiltersPage,
  MaterialFilters: MaterialFiltersPage,
  OrganizationFilters: OrganizationFiltersPage,
  Cities: CitiesPage,
  Search: SearchPage
}, {
  defaultNavigationOptions: {
    gesturesEnabled: true,
  },
  headerLayoutPreset: 'center'
});

const SocialStack = createStackNavigator({
  Settings: SettingsPage,
  Social: SocialPage,
  FreeRequest: FreeRequestPage,
  Cities: CitiesPage,
  SelectCity: SelectCityPage,
  WasteRequestFirstPage,
  WasteRequestSecondPage,
  WasteRequestThirdPage,
  WasteRequestFourPage
}, {
  defaultNavigationOptions: {
    gesturesEnabled: true,
  },
  headerLayoutPreset: 'center'
});

const SpotsStack = createStackNavigator({
  Spots: SpotsList
}, {
  defaultNavigationOptions: {
    gesturesEnabled: true,
  },
  headerLayoutPreset: 'center'
});

const StatementStack = createStackNavigator({
  Statement: StatementPage
}, {
  defaultNavigationOptions: {
    gesturesEnabled: true,
  },
  headerLayoutPreset: 'center'
});

MapStack.navigationOptions = {
  tabBarLabel: 'Карта',
};

SpotsStack.navigationOptions = {
  tabBarLabel: 'Адреса',
};

SocialStack.navigationOptions = {
  tabBarLabel: 'Ещё',
};

StatementStack.navigationOptions = {
  tabBarLabel: 'Сообщить о свалке',
};

const TabIcon = ({
  icon, focusedIcon, focused, style, focusedStyle
}) => {
  return focused ? <Image
    source={focusedIcon}
    style={focusedStyle}
  /> : <Image
    source={icon}
    style={style}
  />;
};

export default createAppContainer(createBottomTabNavigator(
  {
    MapTab: MapStack,
    SpotsTab: SpotsStack,
    SocialTab: SocialStack
    // Statement: StatementStack,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        if (routeName === 'MapTab') {
          return <TabIcon
            focused={focused}
            icon={MapIcon}
            focusedIcon={MapActiveIcon}
            style={styles.mapIcon}
            focusedStyle={styles.mapIcon}
          />;
        } if (routeName === 'SocialTab') {
          return <TabIcon
            focused={focused}
            icon={SocialIcon}
            focusedIcon={SocialActiveIcon}
            style={styles.socialIcon}
            focusedStyle={styles.socialIcon}
          />;
        } if (routeName === 'SpotsTab') {
          return <TabIcon
            focused={focused}
            icon={SpotsIcon}
            focusedIcon={SpotsActiveIcon}
            style={styles.mapIcon}
            focusedStyle={styles.mapIcon}
          />;
        } if (routeName === 'StatementTab') {
          return <TabIcon
            focused={focused}
            icon={StatementIcon}
            focusedIcon={StatementActiveIcon}
            style={styles.statementIcon}
            focusedStyle={styles.statementIcon}
          />;
        }
        return null;
      },
    }),
    tabBarOptions: {
      activeTintColor: GREEN,
      inactiveTintColor: BLACK,
    },
  }
));
