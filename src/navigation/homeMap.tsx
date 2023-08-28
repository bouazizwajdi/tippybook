import React from 'react';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {Image} from "react-native-elements";
import MapsView from "~/screens/MapsView";
import MapList from "~/screens/MapList";
import Icon from "react-native-vector-icons/Fontisto";
import {View} from "react-native";

export default (createBottomTabNavigator(
    {
        MapsView: {
            screen: MapsView,
            navigationOptions: {
                tabBarIcon: ({tintColor}) =>                   <Icon name={'world-o'} style={{fontSize:28}} />

            }
        },
        MapList: {
            screen: MapList,
            navigationOptions: {
                tabBarIcon: ({tintColor}) => <Icon name={'nav-icon-list-a'} style={{fontSize:20}} />
            }
        },
    },
    {
        tabBarOptions: {
            showLabel: false,
            tabStyle: {
                padding: 20
            },
        },
        initialRouteName: 'MapList',

    }
));
