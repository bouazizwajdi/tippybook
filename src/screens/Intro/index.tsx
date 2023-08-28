import React from 'react';
import {NavigationScreenProp, SafeAreaView} from 'react-navigation';
import {View, StatusBar} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {colors} from "~/utils/theme";
import {Image} from "react-native-elements";
import styles from "~/screens/Intro/styles";


export interface NavigationProps {
    navigation: NavigationScreenProp<any, any>
}

interface IProps extends NavigationProps {
}

let token = ''

export default class Intro extends React.PureComponent<IProps> {

    constructor(props: IProps) {
        super(props)
        this.state={
            loading:true
        }
    }

    retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('myToken');
            if (value !== null) {
                // We have data!!
                token = value
               this.setState({loading: false},()=>{
                   if (token !== '') {
                       this.props.navigation.navigate('MapsView');
                   }
               })

            }else {
                this.setState({loading: false},()=>{
                        this.props.navigation.navigate('Login');
                })


            }
        } catch (error) {
            alert(error)// Error data
        }
    };

    componentDidMount() {
        //alert('token')
        const clearAll = async () => {
            try {
                await AsyncStorage.clear()
            } catch (e) {
                // clear error
            }

            console.log('Done.')
        }
        //clearAll()
       this.retrieveData()


    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: colors.white}}>
                <StatusBar barStyle="dark-content"/>
                <SafeAreaView/>
                <View style={styles.imageContainer}>
                    <Image
                        style={styles.logo}
                        source={require('~/assets/images/logo.png')}
                    />
                </View>
            </View>
        );
    }
}
