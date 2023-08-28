import React, {Component, useEffect, useState} from "react";
import {SafeAreaView} from "react-navigation";
import {ActivityIndicator, Dimensions, RefreshControl, ScrollView, Text, TouchableOpacity, View} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import axios from "axios";
import {colors} from "~/utils/theme";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {Image} from "react-native-elements";
import {Body, Button, Container, Content, Header, Left, Right, Spinner} from "native-base";

export default class Friends extends Component {

    constructor() {
        super();
        this.state = {
            demandesAmisSent: false,
            loading: true,
            page: 1,
            last_page: 1,
            all: true,
            amis: [],
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
            console.log(error)// Error data
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
            console.log(error)// Error data
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
            console.log(error)// Error data
        }
    };

    componentDidMount() {
        this.retrieveData()
        this.retrieveDataPhoto()
        this.retrieveDataId()
        setTimeout(() => this.getadr(), 1000)
    }

    getadr = async () => {
        if (this.state.token !== '') {
            try {
                const res = await axios.get(`https://api.trippybook.com/api/visiteur/amis/all?page=${this.state.page}`, {headers: {'Authorization': this.state.token}});
                if (res.status == 200) {
                    if (res.data.amis.current_page === 1) {
                        this.setState({
                            amis: res.data.amis.data,
                            wsFriend:true,
                            last_page: res.data.amis.last_page,
                            demandesAmisSent: false,
                            all: true
                        }, () => {
                            this.setState({loading: false})
                        })
                    } else {
                        this.setState({
                            amis: this.state.amis.concat(res.data.amis.data),
                            last_page: res.data.amis.last_page,
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
    getSuggested = async () => {
        if (this.state.token !== '') {
            try {
                const res = await axios.get(`https://api.trippybook.com/api/visiteur/amisSuggested?page=${this.state.page}`, {headers: {'Authorization': this.state.token}});
                if (res.status == 200) {
                    if (res.data.amis.current_page === 1) {
                        this.setState({
                            amis: res.data.amis.data,
                            last_page: res.data.amis.last_page,
                            demandesAmisSent: false,
                            all: false
                        }, () => {
                            this.setState({loading: false})
                        })
                    } else {
                        this.setState({
                            amis: this.state.amis.concat(res.data.amis.data),
                            last_page: res.data.amis.last_page,
                            demandesAmisSent: false,
                            all: false
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
    getSent = async () => {
        if (this.state.token !== '') {
            try {
                const res = await axios.get(`https://api.trippybook.com/api/visiteur/amis/getAllDemamdesAmisSent?page=${this.state.page}`, {headers: {'Authorization': this.state.token}});
                if (res.status == 200) {
                    if (res.data.demandesAmisSent.current_page === 1) {
                        this.setState({
                            amis: res.data.demandesAmisSent.data,
                            last_page: res.data.demandesAmisSent.last_page,
                            demandesAmisSent: true,
                            all: false
                        }, () => {
                            this.setState({loading: false})
                        })
                    } else {
                        this.setState({
                            amis: this.state.demandesAmisSent.concat(res.data.demandesAmisSent.data),
                            last_page: res.data.demandesAmisSent.last_page,
                            demandesAmisSent: true,
                            all: false
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
    getReceived = async () => {
        if (this.state.token !== '') {
            try {
                const res = await axios.get(`https://api.trippybook.com/api/visiteur/amis/demandesAmis?page=${this.state.page}`, {headers: {'Authorization': this.state.token}});
                if (res.status == 200) {
                    if (res.data.demandesAmis.current_page === 1) {
                        this.setState({
                            amis: res.data.demandesAmis.data,
                            last_page: res.data.demandesAmis.last_page,
                            demandesAmisSent: false,
                            all: false
                        }, () => {
                            this.setState({loading: false})
                        })
                    } else {
                        this.setState({
                            amis: this.state.demandesAmis.concat(res.data.demandesAmis.data),
                            last_page: res.data.demandesAmis.last_page,
                            demandesAmisSent: false,
                            all: false
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

    goBack = () => {
        this.props.navigation.goBack();
    };
    goToHome = () => {
        this.props.navigation.navigate('Home');
    };
    handleScrollDataSection = (e) => {
        console.log(this.state.page)
        var windowHeight = Dimensions.get('window').height,
            height = e.nativeEvent.contentSize.height,
            offset = e.nativeEvent.contentOffset.y;
        if (windowHeight + offset > height && this.state.page < this.state.last_page) {
            this.setState({loading: true}, () => {
                let page1 = this.state.page + 1
                this.setState({
                    page: page1,
                }, () => {
                    this.getadr()

                })

            })
        }
    }
    handleOnCancelLike = async (visiteurId) => {
        if (this.state.token !== '') {
            try {
                const res = await axios.post('https://api.trippybook.com/api/visiteur/amis/supprimerAmis', {
                    visiteur_id: visiteurId,
                }, {headers: {'Authorization': this.state.token}})
                if (res.status == 200) {
                    this.getadr()
                    // console.log(JSON.stringify(res.data))

                }
            } catch (e) {
                console.log(e)
            }
        }
    }
    handleOnConfirmInvit = async (visiteurId) => {
        if (this.state.token !== '') {
            try {
                const res = await axios.post('https://api.trippybook.com/api/visiteur/amis/confimer', {
                    visiteur_id: visiteurId,
                }, {headers: {'Authorization': this.state.token}})
                if (res.status == 200) {
                    this.getadr()
                    // console.log(JSON.stringify(res.data))

                }
            } catch (e) {
                console.log(e)
            }
        }
    }
    handleOnCancelInvit = async (visiteurId) => {
        if (this.state.token !== '') {
            try {
                const res = await axios.post('https://api.trippybook.com/api/visiteur/amis/supprimerAmis', {
                    visiteur_id: visiteurId,
                }, {headers: {'Authorization': this.state.token}})
                if (res.status == 200) {
                    this.getadr()
                    // console.log(JSON.stringify(res.data))

                }
            } catch (e) {
                console.log(e)
            }
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
                            <Text style={{fontSize: 18, color: colors.black, fontWeight: 'bold'}}>List Friends</Text>
                        </TouchableOpacity>
                    </Body>
                    <Right>
                        <TouchableOpacity onPress={this.goToHome}>
                            <Image style={{width: 28, height: 28}}
                                   source={require('~/assets/images/home.png')}/>
                        </TouchableOpacity>
                    </Right>

                </Header>
                <ScrollView contentInsetAdjustmentBehavior="automatic"
                            onScrollEndDrag={this.handleScrollDataSection}
                            overScrollMode={this.state.loading ? 'never' : 'auto'}>
                    <View style={{flexDirection: 'row', justifyContent: 'center',}}>
                        <Button bordered dark onPress={() => {
                            this.setState({page: 1}, () => {
                                this.getadr()
                            })

                        }}
                                style={{
                                    flex: 1,
                                    marginLeft: 10,
                                    justifyContent: 'center',
                                    height: 30,
                                    padding: 10,
                                    marginTop: 10
                                }}>
                            <Text style={{fontSize: 12}}>My friends</Text>
                        </Button>
                        <Button bordered dark onPress={() => {
                            this.setState({page: 1}, () => {
                                this.getReceived()
                            })

                        }}
                                style={{
                                    flex: 1,
                                    marginLeft: 10,
                                    justifyContent: 'center',
                                    height: 30,
                                    padding: 10,
                                    marginTop: 10
                                }}>
                            <Text style={{fontSize: 12}}>Received</Text>
                        </Button>
                        <Button bordered dark onPress={() => {
                            this.setState({page: 1}, () => {
                                this.getSent()
                            })

                        }}
                                style={{
                                    flex: 1,
                                    marginLeft: 10,
                                    justifyContent: 'center',
                                    height: 30,
                                    padding: 10,
                                    marginTop: 10
                                }}>
                            <Text style={{fontSize: 12}}>Sent</Text>
                        </Button>
                        <Button bordered dark onPress={() => {
                            this.setState({page: 1}, () => {
                                this.getSuggested()
                            })

                        }}
                                style={{
                                    flex: 1,
                                    marginLeft: 10,
                                    justifyContent: 'center',
                                    height: 30,
                                    padding: 10,
                                    marginTop: 10
                                }}>
                            <Text style={{fontSize: 12}}>Suggested</Text>
                        </Button>
                    </View>
                    {this.state.loading && this.state.amis.length === 0 ? <Spinner color={colors.black} style={{
                        fontSize: 32,
                        display: this.state.loading && this.state.amis.length === 0 ? 'flex' : 'none'
                    }}/> : null}
                    {(this.state.amis.length) ?
                        this.state.amis.map((adr: any) =>
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('ProfileVisiteur', {idVisiteur: adr.receiver && !this.state.wsFriend ? adr.receiver_id : adr.sender ? adr.sender_id : adr.id})}
                                key={adr.id} style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                padding: 15,
                                alignItems: 'center'
                            }}>
                                <View style={{alignItems: 'center', width: '25%'}}>
                                    <Image style={{width: 60, height: 60}}
                                           source={{
                                               uri:
                                                   adr.photo ? "https://ressources.trippybook.com/assets/" + adr.photo :
                                                       adr.receiver&& !this.state.wsFriend ? "https://ressources.trippybook.com/assets/" + adr.receiver.photo :
                                                           "https://ressources.trippybook.com/assets/" + adr.sender.photo
                                           }}/>
                                </View>
                                <View style={{alignItems: 'flex-start', width: '65%'}}>
                                    <Text style={{fontWeight: 'bold', textAlign: "center"}}>
                                        {adr.receiver && !this.state.wsFriend?
                                            adr.receiver.nom + ' ' + adr.receiver.prenom :
                                            adr.sender ?
                                                adr.sender.nom + ' ' + adr.sender.prenom :
                                                adr.nom + ' ' + adr.prenom}
                                    </Text>
                                    <Text style={{fontSize: 12}}>
                                        {adr.receiver && !this.state.wsFriend ?
                                            adr.receiver.mutualFriend ?
                                                null :
                                                adr.mutualFriend ?
                                                    null :
                                                    'no mutual friends' : 'no mutual friends'}
                                    </Text>
                                </View>
                                {this.state.demandesAmisSent ?
                                    <View style={{alignItems: 'flex-start', width: '10%'}}>
                                        <TouchableOpacity onPress={() => this.handleOnCancelLike(adr.receiver_id)}
                                                          style={{width: '100%', padding: 5, alignItems: 'center'}}>
                                            <Text>
                                                <Icon style={{fontSize: 20, color: 'red'}} name={'close-circle'}/>
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    adr.sender && !this.state.all ?
                                        <View style={{alignItems: 'flex-start', width: '10%'}}>
                                            <TouchableOpacity onPress={() => this.handleOnConfirmInvit(adr.sender_id)} style={{width: '100%', padding: 5, alignItems: 'center'}}>
                                                <Text>
                                                    <Icon style={{color: 'green', fontSize: 20}} name='check'/>
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => this.handleOnCancelInvit(adr.sender_id)} style={{width: '100%', padding: 5, alignItems: 'center'}}>
                                                <Text>
                                                    <Icon style={{fontSize: 20, color: 'red'}} name={'close-circle'}/>
                                                </Text>
                                            </TouchableOpacity>
                                        </View> : null
                                }
                            </TouchableOpacity>) : null}
                    <ActivityIndicator color={colors.black} style={{
                        fontSize: 32,
                        display: this.state.loading && this.state.amis.length > 0 ? 'flex' : 'none'
                    }}/>
                </ScrollView>
                <SafeAreaView/>
            </Container>
        )
    }


}
