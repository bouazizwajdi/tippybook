import React, {useEffect} from "react";
import {SafeAreaView} from "react-navigation";
import {Dimensions, StyleSheet, Text, View, TouchableOpacity, Slider} from "react-native";
import {colors} from "~/utils/theme";
import * as Animatable from 'react-native-animatable'
 
import MapView,{Marker,PROVIDER_GOOGLE} from 'react-native-maps';
import {Body, Button, Container, Content, Form, Header, Left, Right,Spinner} from "native-base";
import Select2 from "react-native-select-two";
import GetLocation from 'react-native-get-location'
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Modal from "react-native-modalbox";
import axios from "axios";
import {Image} from "react-native-elements";
import StarRating from 'react-native-star-rating';
import AsyncStorage from '@react-native-community/async-storage';


const height = Dimensions.get("window").height - 100;

let mockData = []
let mockDataP = []
let mockDataV = []
let listAdress = []
let handleViewRefPopup = null
let myLat = 34.747847
let myLng = 10.766163
let token = ''
const retrieveData = async () => {
    try {

        const value = await AsyncStorage.getItem('myToken');
        if (value !== null) {
            // We have data!!
            token = value;


        }
    } catch (error) {
        alert(error)// Error data
    }
};
const MapsView = (props) => {

    const [data, setData] = React.useState({
        starCount: 1,
        loading: true,
        loadingMap:true,
        isModalOpen: false,
        range: 5,
        categorieID: [],
        continentID: null,
        coutsID: null,
        evalsID: null,
        myLat:34.747847,myLng:10.766163,
        latMax:  myLat + 1,
        latMin:  myLat - 1,
        lngMax: myLng + 1,
        lngMin: myLng - 1,
         paysID:"",
        searchFilter: "",
        villeID: ""
    })

    const goFilter = async () => {
        try {
            if (token !== '') {
                try {

                    axios.get('https://api.trippybook.com/api/visiteur/pays', {headers: {'Authorization': token}})
                        .then(
                            response => {
                                if (response.status === 200) {
                                    let objMockP = {}
                                    mockDataP = []
 
                                    for (let i = 0; i < response.data.pays.length; i++) {

                                        objMockP = {
                                            id: response.data.pays[i].id,
                                            name: response.data.pays[i].nom_pays,
                                            lat: response.data.pays[i].latitude,
                                            longg: response.data.pays[i].longitude,
                                            checked: false,
                                        }
                                        mockDataP.push(objMockP);

                                    }

                                }
                            }
                        )
                        
                    axios.get('https://api.trippybook.com/api/visiteur/categories', {headers: {'Authorization': token}})
                        .then(
                            res => {
                                if (res.status === 200) {
                                    let objMock = {}
                                    mockData = [{
                                        id: -1,
                                        name: 'Tout des Catégories',
                                        checked: false,
                                    }]
                                    for (let j = 0; j < res.data.categories.length; j++) {
                                        objMock = {
                                            id: res.data.categories[j].id,
                                            name: res.data.categories[j].nom_categorie,
                                            checked: false,
                                        }
                                        mockData.push(objMock);

                                    }
                                    if (mockData.length) {
                                        setData({
                                            ...data,
                                            loading: false,
                                            isModalOpen: true
                                        })
                                        // handleViewRefPopup = ref => this.view = ref;

                                    } else {
                                        console.log('no data')
                                    }

                                }
                            }
                        )


                } catch (error) {
                    if (error.response) {
                        console.log(JSON.stringify(error.response.data));
                        console.log(JSON.stringify(error.response.status));
                        console.log(JSON.stringify(error.response.headers));
                    } else if (error.request) {
                        console.log(error.request);
                    } else {
                        console.log('Error======' + error);
                    }
                }
            }
        } catch (e) {
            console.log(e)
        }


    }


    const goBack = () => {
        props.navigation.goBack();
    };
    const goToHome = () => {
        props.navigation.navigate('Home');
    };

    const closeModal = () => {
        // handleViewRefPopup = ref => this.view = ref;
        setData({
            ...data,
            isModalOpen: false,
        })
    }
    const handleChange = (name, val) => {
        var new_latitude = 0
        var new_longitude = 0

        if (name == 'range') {
            var earth = 6378.137,  //radius of the earth in kilometer
                pi = Math.PI,
                m = (1 / ((2 * pi / 360) * earth)) / 1000;  //1 meter in degree

            new_latitude = data.latMax + (val * m);
            var cos = Math.cos,
                m = (1 / ((2 * pi / 360) * earth)) / 1000;  //1 meter in degree

            new_longitude = data.lngMax + (val * m) / cos(data.latMax * (pi / 180));
            setData({
                ...data,
                lngMax: new_longitude,
                lngMin: new_longitude,
                latMax: new_latitude,
                latMin: new_latitude,
            })

        } else if (name == "villeID") {
            let localData = mockDataV.filter(function (item) {
                return item.id == val[0];
            })
            myLat = localData[0].lat
            myLng = localData[0].longg
            setData({
                latMax: localData[0].lat + 1,
                latMin: localData[0].lat - 1,
                lngMax: localData[0].longg + 1,
                lngMin: localData[0].longg - 1,
                ...data,
                villeID: val[0]
            })
        } else if (name == "paysID") {
 
            axios.get(' https://api.trippybook.com/api/visiteur/villes/' + val, {headers: {'Authorization': token}})
                .then(
                    res => {
                        if (res.status === 200) {
                            let objMock = {}
                            mockDataV = []
                            for (let j = 0; j < res.data.villes.length; j++) {
                                objMock = {
                                    id: res.data.villes[j].id,
                                    name: res.data.villes[j].nom_ville,
                                    lat: res.data.villes[j].latitude,
                                    longg: res.data.villes[j].longitude,
                                    checked: false,
                                }
                                mockDataV.push(objMock);

                            }

                            if (mockDataV.length) {

                                let localData = mockDataP.filter(function (item) {
                                    return item.id == val[0];
                                })
                                myLat = localData[0].lat
                                myLng = localData[0].longg


                                setData({
                                    ...data,

                                    latMax: localData[0].lat + 1,
                                    latMin: localData[0].lat - 1,
                                    lngMax: localData[0].longg + 1,
                                    lngMin: localData[0].longg - 1,
                                    paysID: val[0],
                                    loading: false,
                                    isModalOpen: true
                                })
                                // handleViewRefPopup = ref => this.view = ref;
                                console.log(JSON.stringify(data))
                            } else {
                                console.log('no data')
                            }


                        }
                    }
                ).catch(error=>{console.log(JSON.stringify(error))})
        }
        if (name == 'categorieID') {
            if (val.includes(-1)) {
                let myArr = []
                for (let i = 1; i < mockData.length; i++) {
                    myArr.push(i)

                }
                setData({
                    ...data,
                    [name]: myArr
                })
            }
        } else {
            setData({
                ...data,
                [name]: val
            })
        }

        //     console.log(JSON.stringify(data))
    }
    const onStarRatingPress = (rating) => {
        if (rating != data.evalsID) {
            setData({
                ...data,
                starCount: rating,
                evalsID: rating
            });
        } else {
            setData({
                ...data,
                starCount: null,
                evalsID: null
            });
        }
    }

    const markerClick = async (ev) => {
        props.navigation.navigate('HomeList', {idAdr: listAdress[ev].id})


    }
    const getFilter = async () => {
        try {
        console.log('errorrrrrr'+JSON.stringify(data))
            const response = await axios.post(`https://api.trippybook.com/api/visiteur/mesAdressesFilter`, data, {headers: {'Authorization': token}});
            if (response.status === 200) {

                listAdress = response.data.adresses
console.log(JSON.stringify(response.data))
                setData({
                    ...data,
                    isModalOpen: false
                })
            }else{
                console.warn(response)
            }
        } catch (error) {


            setData({
                ...data,
                isModalOpen: false
            })
        }

    }
  useEffect(() => {
 
            retrieveData()
GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
    })
        .then(location => {
            myLat = location.latitude
            myLng = location.longitude
  setTimeout(()=>{setData({
              ...data,
               myLat : location.latitude,
              myLng :location.longitude,
              loadingMap:false,
               latMax:  myLat + 1,
              latMin:  myLat - 1,
              lngMax: myLng + 1,
           lngMin: myLng - 1
          })
      
          },15000)})
        .catch(error => {
            const {code, message} = error;
            // console.log('opppps' + code + message);
        })



    }, []);
if(data.loadingMap===false && listAdress.length==0 ){
    getFilter()
}
    return (

          data.loadingMap?
              <Spinner color={colors.dark_gray} style={[styles.spinner]}/>:
   <Container style={{flex: 1, backgroundColor: 'transparent'}}>
            <Header style={{backgroundColor: colors.white}}>
                {/* <Left>
                    <Button transparent onPress={goBack}>
                        <Icon style={{color: colors.black, fontSize: 32}}
                              name='chevron-left'/>
                    </Button>
                </Left>*/}
                <Body>
                    <TouchableOpacity>
                        <Text style={{fontSize: 18, color: colors.black, fontWeight: 'bold'}}>View map</Text>
                    </TouchableOpacity>
                </Body>
                <Right>
                    <TouchableOpacity onPress={goToHome}>
                        <Image style={{width: 28, height: 28}}
                               source={require('~/assets/images/home.png')}/>
                    </TouchableOpacity>
                </Right>

            </Header>
            <Content style={{backgroundColor: 'transparent'}}>
                <View style={styles.block1Btns}>
                    <Button style={styles.btndark}  onPress={() => {

                        goFilter();

                    }}><Text style={{color: '#000', fontWeight: 'bold'}}>Filter
                    </Text><Icon name={"filter"} style={{fontSize: 18, color: '#000', fontWeight: 'bold'}}/></Button>
                </View>
                <View style={styles.blockBtns}>
                    <Button onPress={() => {
                        props.navigation.navigate('MapsView')
                    }} style={styles.btnMap}><Icon name={'map'} style={{fontSize: 28}}/></Button>
                    <Button onPress={() => {
                        props.navigation.navigate('MapList')
                    }} style={styles.btnMap}><Icon name={'format-list-bulleted'} style={{fontSize: 28}}/></Button>

                </View>

                <MapView

                    style={styles.map}
                    //  loadingEnabled={true}
                    region={{
                        latitude: myLat,
                        longitude: myLng,
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121
                    }}
                    showsUserLocation={true}
                >

                  {listAdress.map((marker, index) => (
            <Marker
              key={index}
              identifier={"1"}
               image={require('~/assets/images/pin-map.png')}
                width={48}
                height={48}
              coordinate={{
                                latitude: marker.lat?marker.lat:0,
                                longitude: marker.long?marker.long:0
                            }}
              title={marker.rs?marker.rs:""}
              description={marker.adresse?marker.adresse:""}
              onCalloutPress={(event) =>markerClick(index)}>


              </Marker>
          ))}
                        </MapView>
                        {/*<TouchableOpacity onPress={()=> {
                        props.navigation.navigate('Home');
                    }}>
                        <Text style={{fontSize: 18, color: colors.black, fontWeight: 'bold'}}>go to Home</Text>
            </TouchableOpacity>*/}
            </Content>
            <SafeAreaView/>
            <Modal style={{backgroundColor: '#fff', zIndex: 9999, position: 'absolute', top: 0}}
                   isOpen={data.isModalOpen}
                   onClosed={closeModal} position="center"
                   swipeToClose
                   swipeArea={250}
                   backButtonClose>
                <Header style={{backgroundColor: colors.white, borderBottomWidth: 0}}>
                    <Left>
                        <Button transparent onPress={closeModal}>
                            <Icon style={{color: colors.black, fontSize: 32}}
                                  name='close'/>
                        </Button>
                    </Left>
                    <Body>
                        <Text style={{fontSize: 18, color: colors.black, fontWeight: 'bold'}}>Filter adresse</Text>
                    </Body>
                    <Right>
                        <Button transparent onPress={getFilter}>
                            <Icon style={{color: colors.black, fontSize: 32}}
                                  name='check'/>
                        </Button>
                    </Right>
                </Header>
                <Content>
                    {data.loading ? null :
                        <Form>
                            <View style={{padding: 15}}>
                                <View>
                                    <Select2
                                        style={{borderRadius: 5, border: '1px solid #eee'}}
                                        colorTheme="blue"
                                        popupTitle="Catégories"
                                        searchPlaceHolderText="By categories"
                                        title="Catégories"
                                        data={mockData}
                                        cancelButtonText={'Cancel'}
                                        selectButtonText={'Ok'}
                                        onSelect={(val: any) => handleChange('categorieID', val)}
                                        onRemoveItem={(val: any) => handleChange('categorieID', val)}
                                    />
                                </View>
                                <View>
                                    <Select2
                                        isSelectSingle
                                        style={{borderRadius: 5, border: '1px solid #eee'}}
                                        colorTheme="blue"
                                        popupTitle="Country"
                                        searchPlaceHolderText="By country"
                                        title="Country"
                                        data={mockDataP}
                                        cancelButtonText={'Cancel'}
                                        selectButtonText={'Ok'}
                                        onSelect={(val: any) => handleChange('paysID', val)}
                                        onRemoveItem={(val: any) => handleChange('paysID', val)}
                                    />
                                </View>
                                <View>
                                    <Select2
                                        isSelectSingle
                                        style={{borderRadius: 5, border: '1px solid #eee'}}
                                        colorTheme="blue"
                                        popupTitle="Ville"
                                        searchPlaceHolderText="By City"
                                        title="Ville"
                                        data={mockDataV}
                                        cancelButtonText={'Cancel'}
                                        selectButtonText={'Ok'}
                                        onSelect={(val: any) => handleChange('villeID', val)}
                                        onRemoveItem={(val: any) => handleChange('villeID', val)}
                                    />
                                </View>
                                <View style={{marginTop: 50}}>
                                    <Slider step={1} value={data.range} minimumValue={5} maximumValue={200}
                                            minimumTrackTintColor={'#2e58a6'} thumbTintColor={'#2e58a6'}
                                            onValueChange={(val: any) => handleChange('range', val)}/>


                                    <View style={{flex: 3, padding: 7}}>
                                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                            <View style={{alignItems: 'center'}}><Text>5</Text></View>
                                            <View style={{alignItems: 'center'}}><Text>{data.range} km</Text></View>
                                            <View style={{alignItems: 'center'}}><Text>200</Text></View>
                                        </View>
                                    </View>
                                    <Animatable.View style={{marginTop: 50}} ref={handleViewRefPopup}
                                                     animation="bounceIn">
                                        <StarRating
                                            starStyle={data.evalsID ? {opacity: 1} : {opacity: 0.5}}
                                            disabled={false}
                                            maxStars={5}
                                            fullStarColor={'#fbc634'}
                                            rating={data.starCount}
                                            selectedStar={(rating) => onStarRatingPress(rating)}
                                        />
                                    </Animatable.View>
                                </View>
                            </View>

                        </Form>}
                </Content>

            </Modal>

        </Container>

    )
}
const styles = StyleSheet.create({
    map: {
        flex:1,
        height
    },
    btndark: {
        display: "flex",
        padding: 8,
        justifyContent: 'space-between',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 5,
        marginTop: -5,
        width: '95%',
        marginLeft: 'auto',
        marginRight: 'auto',
        color: '#000',
        textAlign: "center"
    },
    blockBtns: {
        position: 'absolute',
        top: 95, zIndex: 999,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        width: '95%',
        height: 30,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    block1Btns: {
        position: 'absolute',
        top: 35,
        zIndex: 9999,
        display: 'flex',
        height: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        width: '98%',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    btnMap: {
        padding: 10,
        backgroundColor: '#fff',
        marginTop: -5,
        borderRadius: 0,
        borderColor: '#eee',
        borderWidth: 1,
        //  width: '25%',
        marginLeft: 0,
        marginRight: 0,
        color: '#000',
        textAlign: "center"
    },
})
export default MapsView;