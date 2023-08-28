import React, {useEffect, useState} from "react";
import {SafeAreaView} from "react-navigation";
import {ActivityIndicator, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import axios from "axios";
import AsyncStorage from '@react-native-community/async-storage';
import {colors} from "~/utils/theme";
import styles from "~/components/postItems/PostItem/styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {Image} from "react-native-elements";
import {Body, Button, Container, Content, Header, Left, Right, Spinner} from "native-base";
import * as Animatable from "react-native-animatable";
import GetLocation from 'react-native-get-location'
import StarRating from 'react-native-star-rating';

const AnimatedIcon = Animatable.createAnimatableComponent(Icon);

let adresse = [];
let token = ''
let id = ''
let photoUser = ''
let myLat = 0
let myLng = 0
const retrieveData = async () => {
    try {
        const value = await AsyncStorage.getItem('myToken');
        if (value !== null) {
            // We have data!!
            token = value;

        }
    } catch (error) {
        console.log(error)// Error data
    }
};
const retrieveDataId = async () => {
    try {
        const value = await AsyncStorage.getItem('idUser');
        if (value) {
            // We have data!!
            id = value
        }
    } catch (error) {
        console.log(error)// Error data
    }
};
const retrieveDataPhoto = async () => {
    try {
        const photo1 = await AsyncStorage.getItem('photo');

        if (photo1) {
            // We have data!!
            photoUser = photo1
        }
    } catch (error) {
        console.log(error)// Error data
    }
};


const MapList = (props) => {
    myLat = 48.8588548
    myLng = 2.347035
    const [data, setData] = useState({
        loading: true,
        favoris: 0,
        categorieID: [],
        continentID: null,
        coutsID: null,
        evalsID: null,
        latMax: myLat + 0.5,
        latMin: myLat - 0.5,
        lngMax: myLng + 0.5,
        lngMin: myLng - 0.5,
        paysID: "",
        searchFilter: "",
        villeID: "",
        searchTerm: "",
    })

    GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 1500,
    })
        .then(location => {
            myLat = location.latitude
            myLng = location.longitude
 
           
           
            console.log(myLng)
            const [data, setData] = useState({
                loading: true,
                favoris: 0,
                categorieID: [],
                continentID: null,
                coutsID: null,
                evalsID: null,
                latMax: myLat + 0.5,
                latMin: myLat - 0.5,
                lngMax: myLng + 0.5,
                lngMin: myLng - 0.5,
                paysID: "",
                searchFilter: "",
                villeID: "",
            })
        })
        .catch(error => {
            const {code, message} = error;


        })


    const getadr = async () => {
        if (token !== '') {
            try {
                console.log(JSON.stringify(data))
                const res = await axios.post(`https://api.trippybook.com/api/visiteur/mesAdressesFilter`, data, {headers: {'Authorization': token}});
                if (res.status == 200) {

                    adresse = res.data.adresses;
                    setData({
                        ...data,
                        loading: false,
                    })

                }
            } catch (e) {
                console.log('mesAdressesFilter' + e)
            }
        }

    }
    useEffect(() => {

        retrieveData()
        retrieveDataId()
        retrieveDataPhoto()
        setTimeout(() => getadr(), 1200)
    }, []);

    const handleOnPressLike = async (adresseId) => {
        if (token !== '' && id != '') {
            try {
                const res = await axios.post('https://api.trippybook.com/api/visiteur/favoris/add', {
                    adresseId: adresseId,
                    visiteurId: id
                }, {headers: {'Authorization': token}})
                if (res.status == 200) {
                    getadr()
                    // console.log(JSON.stringify(res.data))
                }
            } catch (e) {
                console.log('like' + e)
            }

        }
    }
    const handleOnCancelLike = async (adresseId) => {
        if (token !== '') {
            try {
                const res = await axios.post('https://api.trippybook.com/api/visiteur/favoris/delete', {
                    adresseId: adresseId,
                    visiteurId: id
                }, {headers: {'Authorization': token}})
                if (res.status == 200) {
                    getadr()
                    // console.log(JSON.stringify(res.data))

                }
            } catch (e) {
                console.log(e)
            }
        }
    }
    const goBack = () => {
        props.navigation.goBack();
    };
    const goToHome = () => {
        props.navigation.navigate('Home');
    };
    let adresseFilter = adresse.filter(res => res.rs.toLowerCase().includes(data.searchTerm.toLowerCase()))
    const onSearch = (value) => {
        setData({
            ...data,
            searchTerm: value,
        })
    };
    return (
        <Container>
            <SafeAreaView/>
            <Header style={{backgroundColor: colors.white}}>
                <Left>
                    <Button transparent onPress={goBack}>
                        <Icon style={{color: colors.black, fontSize: 32}}
                              name='chevron-left'/>
                    </Button>
                </Left>
                <Body>
                    <TouchableOpacity>
                        <Text style={{fontSize: 18, color: colors.black, fontWeight: 'bold'}}>List address</Text>
                    </TouchableOpacity>
                </Body>
                <Right>
                    <TouchableOpacity onPress={goToHome}>
                        <Image style={{width: 28, height: 28}}
                               source={require('~/assets/images/home.png')}/>
                    </TouchableOpacity>
                </Right>

            </Header>
            <ScrollView contentInsetAdjustmentBehavior="automatic" style={{backgroundColor: '#f5f5f5'}}
            >
                {adresse.length == 0 ? <ActivityIndicator color={colors.black} style={{fontSize: 32}}
                    /> :
                    <><View style={{flex:1,marginVertical:15,marginHorizontal:10}}>
                        <TextInput onChangeText={(val) => onSearch( val)}  style={{ fontSize: 13,
                        height: 40,
                        fontWeight: "400",
                        padding: 3,
                        paddingLeft: 10,
                        borderWidth: 1,
                        borderColor: colors.white,
                        marginVertical:10,
                        backgroundColor:colors.white,
                            flex: 1}} textContentType={'name'} placeholder={'🔍 search...'} value={data.searchTerm} />
                </View>
                        {
                            adresseFilter.map((adr: any) =>
                                <View key={adr.id} style={{
                                    flexDirection: 'row',
                                    alignContent: 'center',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: 15,
                                    backgroundColor: adr.id % 2 === 0 ? '#f5f5f5' : '#fff'
                                }}>
                                    <View style={{
                                        alignItems: 'center',
                                        width: 60,
                                        height: 60,
                                        borderRadius: 100,
                                        overflow: "hidden"
                                    }}>
                                        <Image style={{width: 60, height: 60, borderRadius: 100, overflow: "hidden"}}
                                               source={{uri: "https://ressources.trippybook.com/assets/" + adr.logo}}/>
                                    </View>
                                    <View style={{alignItems: 'flex-start', width: '55%'}}>
                                        <TouchableOpacity onPress={() => {
                                            props.navigation.navigate('HomeList', {idAdr: adr.id})
                                        }}>
                                            <Text style={{fontWeight: 'bold', textAlign: "left"}}>{adr.rs}</Text>
                                            <Text style={{fontSize: 12,marginBottom:7}}>{adr.adresse}</Text>
                                            <Text>
                                                <StarRating
                                                    disabled={false}
                                                    maxStars={5}
                                                    rating={adr.rateRound}
                                                    fullStarColor={'#2e58a6'}
                                                    starSize={15}
                                                    // selectedStar={(rating) => this.onStarRatingPress(rating)}
                                                /></Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{alignItems: 'center', width: '20%'}}>
                                        <TouchableOpacity onPress={adr.favoris.length ?
                                            () => handleOnCancelLike(adr.id)

                                            :
                                            () => handleOnPressLike(adr.id)
                                        }>
                                            <AnimatedIcon
                                                name={'heart'}
                                                color={adr.favoris.length ? '#2e58a6' : '#cfcfcf'}
                                                size={32}
                                                style={styles.icon}
                                            />

                                        </TouchableOpacity>
                                    </View>
                                </View>)
                            }
                    </>
                }
            </ScrollView>
            <SafeAreaView/>
        </Container>
    )
}
export default MapList;