import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator,} from 'react-navigation-stack';
import Home from "./home";
import Intro from "~/screens/Intro";
import Comments from "~/screens/Comments";
import PostDetail from "~/screens/Detail";
import Root from "~/screens/Root";
import Login from "~/screens/Login";
import SignUp from "~/screens/SignUp";
import MapList from "~/screens/MapList";
import HomeList from "~/screens/HomeList";
import EditProfil from "~/screens/EditProfil";
import Following from "~/screens/Following";
import Friends from "~/screens/Friends";
import Favorites from "~/screens/Favorites";
import ProfileVisiteur from "~/screens/ProfileVisiteur";
import ChangePassword from "~/screens/ChangePassword";
import SearchTag from "~/components/searchTag";

const appStack = createStackNavigator({
    Root: {
        screen: Root,
        navigationOptions: () => ({
            header: null,
            headerBackTitle: null,
        }),

    },
    Splash: {
        screen: Intro,
        navigationOptions: () => ({
            header: null,
            headerBackTitle: null
        })
    },
    Login: {
        screen: Login,
        navigationOptions: () => ({
            header: null,
            headerBackTitle: null
        })
    },
    SignUp: {
        screen: SignUp,
        navigationOptions: () => ({
            header: null,
            headerBackTitle: null
        })
    },
    MapList: {
        screen: MapList,
        navigationOptions: () => ({
            header: null,
            headerBackTitle: null
        })
    },
    SearchTag: {
        screen: SearchTag,
        navigationOptions: () => ({
            header: null,
            headerBackTitle: null
        })
    },
    EditProfil: {
        screen: EditProfil,
        navigationOptions: () => ({
            header: null,
            headerBackTitle: null
        })
    },
    ChangePassword: {
        screen: ChangePassword,
        navigationOptions: () => ({
            header: null,
            headerBackTitle: null
        })
    },
    Following: {
        screen: Following,
        navigationOptions: () => ({
            header: null,
            headerBackTitle: null
        })
    },
    Friends: {
        screen: Friends,
        navigationOptions: () => ({
            header: null,
            headerBackTitle: null
        })
    },
    ProfileVisiteur: {
        screen: ProfileVisiteur,
        navigationOptions: () => ({
            header: null,
            headerBackTitle: null
        })
    },
    Favorites: {
        screen: Favorites,
        navigationOptions: () => ({
            header: null,
            headerBackTitle: null
        })
    },
    Home: {
        screen: Home,
        navigationOptions: () => ({
            header: null,
            headerBackTitle: null
        })
    },
    HomeList: {
        screen: HomeList,
        navigationOptions: () => ({
            header: null,
            headerBackTitle: null
        })
    },/*
    HomeMap: {
        screen: HomeMap,
        navigationOptions: () => ({
            header: null,
            headerBackTitle: null
        })
    },*/
    Comments: {
        screen: Comments,
        navigationOptions: () => ({
            header: null,
            headerBackTitle: null
        })
    },
    PostDetail: {
        screen: PostDetail,
        navigationOptions: () => ({
            header: null,
            headerBackTitle: null
        })
    }
}, {
    initialRouteName: 'Root'
});


// @ts-ignore
export default createAppContainer(createSwitchNavigator(
    {
        Intro: Intro,
        Root: Root,
        App: appStack,
    },
    {
        initialRouteName: 'Intro'
    }
));
