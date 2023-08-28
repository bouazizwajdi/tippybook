import React, {Component, useEffect, useState} from "react";
import {SafeAreaView} from "react-navigation";
import { Dimensions, RefreshControl, ScrollView, Text, TouchableOpacity, View} from "react-native";
import axios from "axios";
import AsyncStorage from '@react-native-community/async-storage';
import {colors} from "~/utils/theme";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {Image} from "react-native-elements";
import {Body, Button, Container, Content, Header, Left, Right, Spinner} from "native-base";

export default class Following  extends Component {

constructor() {
    super();
    this.state ={
        loading: true,
        page: 1,
        last_page: 1,
        adresse:[],
        photoUser: '',
        id: '',
        token: '',
    }
}
    retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('myToken');
            if (value !== null) {
                // We have data!!
                this.setState({token: value})

            }
        } catch (error) {
            alert(error)// Error data
        }
    };
    retrieveDataId = async () => {
        try {
            const value = await AsyncStorage.getItem('idUser');
            if (value) {
                this.setState({id: value})
                // We have data!!
            }
        } catch (error) {
            alert(error)// Error data
        }
    };
    retrieveDataPhoto = async () => {
        try {
            const photo1 = await AsyncStorage.getItem('photo');

            if (photo1) {
                // We have data!!
                this.setState({photoUser: photo1})

            }
        } catch (error) {
            alert(error)// Error data
        }
    };

    componentDidMount() {
        const {nav} = this.props;
        this.retrieveData()
        this.retrieveDataPhoto()
        this.retrieveDataId()
        setTimeout(() =>  this.getadr(),1000)
}

    getadr = async () => {
        if (this.state.token !== '') {
            try {
                const res = await axios.post('https://api.trippybook.com/api/visiteur/followByUser?page='+this.state.page, {visiteurId: this.state.id}, {headers: {'Authorization': this.state.token}});
                if (res.status == 200) {
                  //  alert('data ok '+ JSON.stringify(res.data))
                    if(this.state.adresse.length==0) {
                        this.setState({
                            adresse: res.data.follows.data,
                            last_page: res.data.follows.last_page,
                        }, () => {
                            this.setState({loading: false})
                        })
                    }else{
                        this.setState({
                            adresse: this.state.follows.concat(res.data.follows.data),
                            last_page: res.data.follows.last_page,
                        }, () => {
                            this.setState({loading: false})
                        })
                    }

                }
            } catch (e) {
                console.log('mesAdressesFilter' + e)
            }
        }

    }

     handleUnfollow = async (adresseId) => {
        if (this.state.token !== '') {
            try {
                const res = await axios.post('https://api.trippybook.com/api/visiteur/unfollow', {
                    adresseId: adresseId,
                    visiteurId: this.state.id
                }, {headers: {'Authorization': this.state.token}})
                if (res.status == 200) {
                    this.getadr()
                    // alert(JSON.stringify(res.data))

                }
            } catch (e) {
                alert(e)
            }
        }
    }
     goBack = () => {
        this.props.navigation.goBack();
    };
     goToHome = () => {
         this.props.navigation.navigate('Home');
    };
    handleScrollDataSection =(e) => {
        console.log(this.state.page)
        var windowHeight = Dimensions.get('window').height,
            height = e.nativeEvent.contentSize.height,
            offset = e.nativeEvent.contentOffset.y;
        if( windowHeight + offset > height &&  this.state.page<this.state.last_page ){
            this.setState({loading:true},()=>{
                let page1=this.state.page+1
                this.setState({
                    page: page1,
                },()=> {
                        this.getadr()

                })

            })
        }
    }
     render() {
         return (
             <Container>
                 <SafeAreaView/>
                 <Header style={{backgroundColor: colors.white}}>
                     <Left>
                         <Button transparent onPress={this.goBack}>
                             <Icon style={{color: colors.black, fontSize: 32}}
                                   name='chevron-left'/>
                         </Button>
                     </Left>
                     <Body>
                         <TouchableOpacity>
                             <Text style={{fontSize: 18, color: colors.black, fontWeight: 'bold'}}>List following</Text>
                         </TouchableOpacity>
                     </Body>
                     <Right>
                         <TouchableOpacity onPress={this.goToHome}>
                             <Image style={{width: 28, height: 28}}
                                    source={require('~/assets/images/home.png')}/>
                         </TouchableOpacity>
                     </Right>

                 </Header>
                 <ScrollView contentInsetAdjustmentBehavior="automatic" style={{padding:20}} onScrollEndDrag={this.handleScrollDataSection} overScrollMode={this.state.loading?'never':'auto'}
                 >
                     {this.state.loading && this.state.adresse.length===0?<Spinner color={colors.black} style={{
                         fontSize: 32,
                         display: this.state.loading && this.state.adresse.length === 0 ? 'flex' : 'none'
                     }}/>:null}
                     { (this.state.adresse.length) ?
                         this.state.adresse.map((adr: any) =>
                             <View key={adr.id} style={{flexDirection: 'column', justifyContent: 'center', padding: 15,marginBottom:20,borderWidth:1,alignItems: 'center',borderRadius:4}}>
                                 <View style={{alignItems: 'center'}}>
                                     <Image style={{width: 60, height: 60}}
                                            source={{uri: "https://ressources.trippybook.com/assets/" + adr.adresse.logo}}/>
                                 </View>
                                 <View style={{alignItems: 'center'}}>
                                     <TouchableOpacity onPress={() => {
                                         this.props.navigation.navigate('HomeList', {idAdr: adr.adresse.id})
                                     }}>
                                         <Text style={{fontWeight: 'bold', textAlign: "center"}}>{adr.adresse.rs}</Text>
                                         <Text style={{fontSize: 12}}>{adr.adresse.adresse}</Text>

                                     </TouchableOpacity>
                                 </View>
                                 <View style={{alignItems: 'center'}}>
                                     <Button bordered dark onPress={() => this.handleUnfollow(adr.adresse.id)}
                                             style={{
                                                 marginLeft: 10,
                                                 justifyContent: 'center',
                                                 height: 30,
                                                 padding:10,
                                                 marginTop: 10
                                             }}>
                                         <Text>Unfollow</Text>
                                     </Button>
                                 </View>
                             </View>
                         ):null}
                     <Spinner color={colors.black} style={{fontSize: 32,display:this.state.loading && this.state.adresse.length>0 ?'flex':'none'}} />
                 </ScrollView>
                 <SafeAreaView/>
             </Container>
         )
     }


}
