import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    TouchableOpacity,

    FlatList,
    Image, RefreshControl
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Container, Content, Header, Left, Body, Right, Button, Spinner} from 'native-base';
import StoryItem from "~/components/storyItems/storyItem/index";
import {colors} from "~/utils/theme";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from "axios";
import PostItems from "~/components/postItems";
import {NavigationActions, StackActions} from "react-navigation";


const {width, height} = Dimensions.get('window');

export default class ProfileTab extends Component {

    constructor(props: any) {
        super(props);

        this.state = {
            name: '',
            reputation: 0,
            showList: false,
            page: 1,
            lastPage: 1,
            loadingData: false,
            loadingData1: true,
            loadingData2: true,
            loadingData3: true,
            profile: {},
            loadDataPublication: {},
            loadDataCurrentUser: {},
            loadDataStoryHighlight: {},
            loadDataShow: {},
            postCount: 0,
            followingCount: 0,
            followerCount: 0,
            activeIndex: 0,
            blogs: [], token: '', idCurrentUser: ''
        };
        this.markRead = this.markRead.bind(this);
    }

    retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('myToken');
            if (value !== null) {
                // We have data!!
                this.setState({token: value});
                console.log(JSON.stringify(value))

            }
        } catch (error) {
            alert(error)// Error data
        }
    };
    retrieveDataId = async () => {
        try {
            const value = await AsyncStorage.getItem('idUser');
            if (value) {
                this.setState({idCurrentUser: value});
                // We have data!!
            }
        } catch (error) {
            alert(error)// Error data
        }
    };

    goBack = () => {
        this.props.navigation.goBack();
    };
    wait = (timeout: number) => {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    };
    handleScrollDataSection = (e) => {
        console.log(this.state.page)
        var windowHeight = Dimensions.get('window').height,
            height = e.nativeEvent.contentSize.height,
            offset = e.nativeEvent.contentOffset.y;
        if (windowHeight + offset > height && this.state.page < this.state.loadDataPublicationLastPage) {
            this.setState({loadingData1: true}, () => {
                let page1 = this.state.page + 1
                this.setState({
                    page: page1,
                }, () => {
                    if (this.state.activeIndex === 0) {
                        this.loadDataPublicationScroll(`https://api.trippybook.com/api/visiteur/publications/visiteur/${this.state.idCurrentUser}?page=${this.state.page}`, 'feeds')
                    } else if (this.state.activeIndex === 1) {
                        this.loadDataPublicationScroll(`https://api.trippybook.com/api/visiteur/photos/visiteur/${this.state.idCurrentUser}?page=${this.state.page}`, 'photos')
                    } else if (this.state.activeIndex === 2) {
                        this.loadDataPublicationScroll(`https://api.trippybook.com/api/visiteur/videos/visiteur/${this.state.idCurrentUser}?page=${this.state.page}`, 'videos')

                    }
                })

            })
        }
    }
    segmentClicked = (index: number) => {
        this.setState({page: 1, loadDataPublication: {}}, () => {
            if (index === 0) {
                this.setState({
                        loadingData1: true,
                        activeIndex: index,
                    }, () => this.loadDataPublicationHome()
                );
            } else if (index === 1) {
                this.setState({
                        loadingData1: true,
                        activeIndex: index,
                    }, () => this.loadDataPublicationPhoto()
                );
            } else {
                this.setState({
                        loadingData1: true,
                        activeIndex: index,
                    }, () => this.loadDataPublicationVideo()
                );
            }
        })

    };
    loadDataPublicationScroll = async (url: any, feed: string) => {
        try {
            const response = await axios.get(url, {headers: {'Authorization': this.state.token}});
            if (response.status === 200) {
                if (feed == 'feeds') {
                    this.setState({
                        loadDataPublication: this.state.loadDataPublication.concat(response.data.feeds.data),
                    }, () => {
                        this.setState({loadingData1: false})
                    })
                } else if (feed == 'photos') {
                    this.setState({
                        loadDataPublication: this.state.loadDataPublication.concat(response.data.photos.data),
                    }, () => {
                        this.setState({loadingData1: false})
                    })
                } else if (feed = 'videos') {
                    this.setState({
                        loadDataPublication: this.state.loadDataPublication.concat(response.data.videos.data),
                    }, () => {
                        this.setState({loadingData1: false})
                    })
                }

            }
        } catch (error) {
            alert(error);
        }
    }
    loadDataPublicationHome = async () => {
        try {
            const response = await axios.get(`https://api.trippybook.com/api/visiteur/publications/visiteur/${this.state.idCurrentUser}?page=${this.state.page}`, {headers: {'Authorization': this.state.token}});
            if (response.status === 200) {
                this.setState({
                    loadDataPublication: response.data.feeds.data,
                    loadDataPublicationLastPage: response.data.feeds.last_page
                }, () => {
                    this.setState({loadingData1: false})
                })

            }
        } catch (error) {
            alert(error);
        }
    }
    loadDataPublicationPhoto = async () => {
        try {
            const response = await axios.get(`https://api.trippybook.com/api/visiteur/photos/visiteur/${this.state.idCurrentUser}?page=${this.state.page}`, {headers: {'Authorization': this.state.token}});
            if (response.status === 200) {
                this.setState({
                    loadDataPublication: response.data.photos.data,
                    loadDataPublicationLastPage: response.data.photos.last_page
                }, () => {
                    this.setState({loadingData1: false})
                })

            }
        } catch (error) {
            alert(error);
        }
    }
    loadDataPublicationVideo = async () => {
        try {
            const response = await axios.get(`https://api.trippybook.com/api/visiteur/videos/visiteur/${this.state.idCurrentUser}?page=${this.state.page}`, {headers: {'Authorization': this.state.token}});
            if (response.status === 200) {
                this.setState({
                    loadDataPublication: response.data.videos.data,
                    loadDataPublicationLastPage: response.data.videos.last_page
                }, () => {
                    this.setState({loadingData1: false})
                })

            }
        } catch (error) {
            alert(error);
        }
    }
    loadDataCurrentUser = async () => {

        try {
            const response = await axios.get(`https://api.trippybook.com/api/visiteur/currentUser`, {headers: {'Authorization': this.state.token}});
            if (response.status === 200) {
                console.log('loadDataCurrentUser ' + JSON.stringify(response.data.notifications));
                this.setState({
                    loadDataCurrentUser: response.data,
                }, () => {
                    this.loadDataNotification1(`https://api.trippybook.com/api/visiteur/notifications?page=` + this.state.page)
                    this.setState({loadingData2: false})
                })

            }
        } catch (error) {
            alert(error);
        }
    }
    loadDataNotification1 = async (url: string) => {
        try {
            const response = await axios.get(url, {headers: {'Authorization': this.state.token}});
            if (response.status === 200) {
                console.log('loadDataNotification ' + JSON.stringify(response.data.notifications));
                this.setState(prev => ({
                    loadDataCurrentUser: {
                        ...prev.loadDataCurrentUser,
                        notifications: response.data.notifications.data,
                        lastPage: response.data.notifications.last_page,

                    }
                }), () => {
                    this.setState({loadingDataNotif: false})
                })
            }
        } catch (error) {
            alert(error);
        }
    }
    loadDataNotification = async (url: string) => {
        try {
            const response = await axios.get(url, {headers: {'Authorization': this.state.token}});
            if (response.status === 200) {
                console.log('loadDataNotification ' + JSON.stringify(response.data.notifications));

                this.setState(prev => ({
                    loadDataCurrentUser: {
                        ...prev.loadDataCurrentUser,
                        notifications: this.state.loadDataCurrentUser.notifications.concat(response.data.notifications.data),
                        lastPage: response.data.notifications.last_page,

                    }
                }), () => this.setState({loadingDataNotif: false}))
            }

        } catch (error) {
            alert(error);
        }
    }
    loadDataStoryHighlight = async () => {

        try {
            const response = await axios.get(`https://api.trippybook.com/api/visiteur/getStoryHighlight`, {headers: {'Authorization': this.state.token}});
            if (response.status === 200) {
                console.log('loadDataStoryHighlight ' + JSON.stringify(response.data));
                this.setState({loadDataStoryHighlight: response.data}, () => this.setState({loadingData3: false}))

            }
        } catch (error) {
            alert(error);
        }
    }
    loadDataShow = async () => {

        try {
            const response = await axios.get(`https://api.trippybook.com/api/visiteur/show/` + this.state.idCurrentUser, {headers: {'Authorization': this.state.token}});
            if (response.status === 200) {

                this.setState({loadDataShow: response.data}, () => this.setState({loadingData2: false}))

            }
        } catch (error) {
            alert(error);
        }
    }

    componentDidMount() {
        this.retrieveData()
        this.retrieveDataId()
        setTimeout(() => this.loadDataCurrentUser(), 1000)
        setTimeout(() => this.loadDataPublicationHome(), 1000)
        setTimeout(() => this.loadDataStoryHighlight(), 1000)
        setTimeout(() => this.loadDataShow(), 1000)

    }

    resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName: 'Home'})],
        key: null,
    });
    handleScroll = () => {
        if (this.state.page < this.state.loadDataCurrentUser.lastPage) {
            this.setState({loadingDataNotif: true}, () => {
                let page1 = this.state.page + 1
                this.setState({
                    page: page1,
                }, () => this.loadDataNotification(`https://api.trippybook.com/api/visiteur/notifications?page=` + this.state.page))
            })
        }

    }
    clearAll = async () => {
        try {
            await AsyncStorage.clear()
            this.props.navigation.dispatch(this.resetAction);      // @ts-ignore clear navigation history
            this.props.navigation.navigate('Login')
        } catch (e) {
            // clear error
        }

        console.log('Done.')
    }
    edit = () => {
        this.props.navigation.navigate('EditProfil');

    }
    followingList = () => {
        this.props.navigation.navigate('Following');

    }
    friendsList = () => {
        this.props.navigation.navigate('Friends');

    }
    favoritesList = () => {
        this.props.navigation.navigate('Favorites');

    }
    notif = () => {
        let notShow = !this.state.showList
        this.setState({showList: notShow},()=>{
        })
    }
    markRead = async () => {
       // this.setState({loadingData2: true});
        try {
            const response = await axios.get(`https://api.trippybook.com/api/visiteur/markNotificationsAsRead`, {headers: {'Authorization': this.state.token}});
            if (response.status === 200) {
                this.setState(prevState => (
                    {
                        loadDataCurrentUser: {
                            ...prevState.loadDataCurrentUser,
                            unreadNotifCount: 0
                        }
                    }
                ), () => {
                    console.log(this.state.loadDataCurrentUser.unreadNotifCount)
                    this.setState({loadingData2: false})
                })

            }
        } catch (error) {
            alert(error);
        }
    }
    getDiffDate = (date: any) => {
        const date1 = new Date(date);
        console.log(date1)
        const date2 = new Date();
        console.log(date2)
        let res = Math.floor((Math.abs(date2 - date1)) / (1000 * 60 * 60 * 24));
        let resh = Math.floor((Math.abs(date2 - date1)) / (1000 * 60 * 60));
        if (res > 365) {
            return Math.floor(res / 365) + ' year ago'
        } else if (res > 30) {
            return Math.floor(res / 30) + ' month ago'

        } else if (res > 7) {
            return Math.floor(res / 7) + ' week ago'

        } else if (res < 7 && resh > 24)
            return Math.floor((Math.abs(date2 - date1)) / (1000 * 60 * 60 * 24)) + ' day ago';
        else if (res < 7 && resh < 24)
            return Math.floor((Math.abs(date2 - date1)) / (1000 * 60 * 60)) + ' hours';
    }

    render() {
        const {
            loadDataCurrentUser,
            loadDataShow,
            loadDataStoryHighlight,
            loadDataPublication,
            loadingData3,
            loadingData2,
            loadingDataNotif,
            loadingData1, showList
        } = this.state;
        return (
            <View style={{flex: 1, flexDirection: 'column'}}>
                <Spinner color={colors.dark_gray}
                         style={[styles.spinner, {display: loadingData2 || !loadDataCurrentUser.visiteur ? 'flex' : 'none'}]}/>
                <Container style={{
                    display: loadingData2 || !loadDataCurrentUser.visiteur ? 'none' : 'flex',
                    backgroundColor: '#f5f5f5'
                }}>
                    <Header style={{backgroundColor: colors.white}}>
                        <Left>
                            <Button transparent onPress={this.goBack}>
                                <Icon style={{color: colors.black, fontSize: 32}}
                                      name='chevron-left'/>
                            </Button>
                        </Left>
                        <Body>
                            <TouchableOpacity>
                                <Text style={{
                                    textTransform: 'capitalize',
                                    fontSize: 14,
                                    color: colors.black,
                                    fontWeight: 'bold'
                                }}>{loadingData2 || !loadDataCurrentUser.visiteur ? null : loadDataCurrentUser.visiteur.nom + ' ' + loadDataCurrentUser.visiteur.prenom}</Text>
                            </TouchableOpacity>
                        </Body>
                        <Right>
                            <TouchableOpacity onPressIn={this.notif} onPressOut={this.markRead}><Text> <Icon name="bell" style={{
                                paddingRight: 12,
                                fontSize: 28
                            }}/></Text></TouchableOpacity>
                            <View style={{
                                position: 'absolute',
                                right: 0,
                                bottom: 0,
                                backgroundColor: '#2e58a6',
                                borderRadius: 500,
                                padding: 2
                            }}><Text style={{
                                fontSize: 9,
                                color: 'white',
                                fontWeight: 'bold'
                            }}>{loadingData2 || !loadDataCurrentUser ? 0 : loadDataCurrentUser.unreadNotifCount}</Text></View>

                        </Right>
                    </Header>
                    <View>
                    </View>
                    <ScrollView onScrollEndDrag={this.handleScrollDataSection}
                    style={{zIndex:2}}
                                overScrollMode={this.state.loadingData1 ? 'never' : 'auto'}
                                contentInsetAdjustmentBehavior="automatic">
                        <Content>
                        {(showList && loadDataCurrentUser.notifications) &&

                    <FlatList onScrollEndDrag={this.handleScroll} style={{
                        position: 'absolute',
                        backgroundColor: "#fff",
                        width: 220,
                        top: 0,
                        right: 5,
                        maxHeight: 350,
                        overflow: 'scroll',
                        // right: 0,
                        zIndex: 999,
                        borderWidth: 1,
                        borderColor: '#ddd',
                        zIndex:1,
                    }}
                              ListFooterComponent={
                                  loadingDataNotif ? <Spinner color={colors.dark_gray} style={{
                                      display: 'flex', justifyContent: 'center'
                                  }}/> : null
                              }
                              ListHeaderComponent={() => <View style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  flexDirection: 'row',
                                  borderBottomWidth: 1,
                                  borderBottomColor: '#ddd',
                                  padding: 7
                              }}>
                                  <Text style={{fontWeight: 'bold', fontSize: 12}}>Notifications
                                      ({loadingData2 || !loadDataCurrentUser ? 0 : loadDataCurrentUser.unreadNotifCount})</Text>
                                  <TouchableOpacity onPress={this.markRead}><Text style={{
                                      fontSize: 12,
                                      color: '#2e58a6'
                                  }}>{loadingData2 || !loadDataCurrentUser ? null : 'Mark all as read'}</Text></TouchableOpacity>
                              </View>}
                              data={loadDataCurrentUser.notifications}
                              renderItem={({item}) =>
                                  <TouchableOpacity style={{backgroundColor:'#fff'}}>
                                      <Text style={{
                                          padding: 5,
                                          paddingBottom: 0,
                                          textAlign: 'right',
                                      }}><Text
                                          style={{
                                              fontSize: 9,
                                              color: '#405de7'
                                          }}>{this.getDiffDate(item.updated_at)}</Text></Text>

                                      <View style={{
                                          flexDirection: 'row',
                                          alignContent: 'center',
                                          alignItems: 'center',
                                          justifyContent: 'space-between',
                                          padding: 15
                                      }}>
                                          <View style={{width: 30, height: 30, borderRadius: 100, overflow: "hidden"}}>
                                              <Image
                                                  style={[styles.avatarStyle, {
                                                      width: 30,
                                                      height: 30,
                                                      borderRadius: 100,
                                                      overflow: "hidden"
                                                  }]}
                                                  source={{uri: 'https://ressources.trippybook.com/assets/' + item.data.visiteur.photo}}
                                              /></View>
                                          <View style={{alignItems: 'flex-start', width: '75%'}}>
                                              <Text style={{
                                                  fontWeight: 'bold',
                                                  padding: 5,
                                                  paddingTop: 0,
                                                  paddingBottom: 5,
                                                  textAlign: 'left',
                                              }}> {item.data.visiteur.nom} {item.data.visiteur.prenom} </Text>
                                              <Text style={{
                                                  padding: 5,
                                                  paddingTop: 0,
                                                  paddingBottom: 10,
                                                  textAlign: 'left',
                                                  borderBottomWidth: 1,
                                                  opacity: 1,
                                                  borderBottomColor: '#ddd'
                                              }}>{item.data.message} </Text>
                                          </View>
                                          <View style={{alignItems: 'center', flexDirection: 'column', width: '20%'}}>
                                              <Text>{item.type == 'App\\Notifications\\storyNotification' &&
                                              <Icon name={'filmstrip'}
                                                    style={{fontSize: 16, color: '#2e58a6'}}/>}</Text>
                                              <Text>{item.type == 'App\\Notifications\\commentNotification' &&
                                              <Icon name={'comment'}
                                                    style={{fontSize: 16, color: '#2e58a6'}}/>}</Text>

                                              <Text>{item.type == 'App\\Notifications\\jaimeNotification' ? item.data.reaction_type == '1' ?
                                                  <Icon name={'thumb-up'} style={{
                                                      fontSize: 16,
                                                      color: '#00f'
                                                  }}/> : item.data.reaction_type == '7' ?
                                                      <Icon name={'thumb-down'}
                                                            style={{fontSize: 16, color: '#f60'}}/> :
                                                      <Icon name={'cards-heart'}
                                                            style={{fontSize: 16, color: 'red'}}/> : null}</Text>

                                          </View>
                                      </View>
                                  </TouchableOpacity>}
                    />}
                            <View style={{flexDirection: 'row', paddingTop: 10}}>
                                <View style={{flex: 1, alignItems: 'center'}}>
                                    <StoryItem key={0} isBtnProfile={true} isMyProfil={true}
                                               photo={loadingData2 || !loadDataCurrentUser.visiteur ? null : 'https://ressources.trippybook.com/assets/' + loadDataCurrentUser.visiteur.photo}
                                               image={loadingData2 || !loadDataCurrentUser.visiteur ? null : 'https://ressources.trippybook.com/assets/' + loadDataCurrentUser.visiteur.photo}/>
                                </View>
                                <View style={{flex: 2, paddingHorizontal: 10, paddingVertical: 10}}>
                                    <Text style={{
                                        fontWeight: 'bold',
                                        fontSize: 15
                                    }}>{loadingData2 || !loadDataCurrentUser.visiteur ? null : loadDataCurrentUser.visiteur.nom + ' ' + loadDataCurrentUser.visiteur.prenom}</Text>
                                    <Text
                                        style={styles.userEmail}>{loadingData2 || !loadDataCurrentUser.visiteur ? null : loadDataCurrentUser.visiteur.email}</Text>
                                    <Text style={{fontSize: 15}}><Icon name={'map-marker'}
                                                                       style={{fontSize: 14}}/> {loadingData2 || !loadDataCurrentUser.visiteur ? null : loadDataCurrentUser.visiteur.adresse}
                                    </Text>
                                    <Text style={{fontSize: 15}}><Icon name={'phone'}
                                                                       style={{fontSize: 14}}/> {loadingData2 || !loadDataCurrentUser.visiteur ? null : loadDataCurrentUser.visiteur.tel}
                                    </Text>
                                </View>
                            </View>
                            <View style={{flex: 3}}>
                                <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                                    <View style={{alignItems: 'center'}}>
                                        <TouchableOpacity onPress={this.favoritesList}
                                                          style={{width: '100%', alignItems: 'center'}}>
                                            <Text
                                                style={styles.countable}>{loadDataShow ? loadDataShow.favorisCount : null}</Text>
                                            <Text style={{fontSize: 13, color: 'gray'}}>Favorites</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{alignItems: 'center'}}>
                                        <TouchableOpacity onPress={this.friendsList}
                                                          style={{width: '100%', alignItems: 'center'}}>
                                            <Text
                                                style={styles.countable}>{loadDataShow ? loadDataShow.friendCount : null}</Text>
                                            <Text style={{fontSize: 13, color: 'gray'}}>Friends</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{alignItems: 'center'}}>
                                        <TouchableOpacity onPress={this.followingList}
                                                          style={{width: '100%', alignItems: 'center'}}>
                                            <Text
                                                style={styles.countable}>{loadDataShow ? loadDataShow.followsCount : null}</Text>
                                            <Text style={{fontSize: 13, color: 'gray'}}>Following</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <Button bordered dark onPress={this.edit}
                                            style={{
                                                flex: 4,
                                                marginLeft: 10,
                                                justifyContent: 'center',
                                                height: 40,
                                                marginTop: 10,

                                                borderColor: '#2e58a6'
                                            }}>
                                        <Text style={{
                                            color: '#2e58a6', textTransform: 'uppercase', fontWeight: 'bold',
                                            textAlign: 'center', letterSpacing: 2,
                                        }}>Edit Profile</Text>
                                    </Button>
                                    <Button bordered dark small icon onPress={this.clearAll}
                                            style={{
                                                flex: 1,
                                                marginRight: 10,
                                                marginLeft: 5,
                                                justifyContent: 'center',
                                                height: 40,
                                                marginTop: 10,
                                                backgroundColor: '#2e58a6',
                                                borderColor: '#2e58a6'
                                            }}>
                                        <Icon name="logout" style={{fontSize: 18, color: 'white'}}/>
                                    </Button>
                                </View>
                            </View>


                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                borderTopWidth: 1,
                                borderTopColor: '#eae5e5'
                            }}>
                                <Button transparent
                                        onPress={() => this.segmentClicked(0)}
                                        active={this.state.activeIndex === 0}>
                                    <Icon name='home'
                                          style={[this.state.activeIndex === 0 ? {
                                              color: 'black',
                                              fontSize: 25
                                          } : {color: 'grey', fontSize: 25}]}/>
                                </Button>
                                <Button transparent
                                        onPress={() => this.segmentClicked(1)}
                                        active={this.state.activeIndex === 1}>
                                    <Icon name='image-multiple'
                                          style={[this.state.activeIndex === 1 ? {
                                              color: 'black',
                                              fontSize: 25
                                          } : {color: 'grey', fontSize: 25}]}/>
                                </Button>
                                {/*
                        <Button transparent
                                onPress={() => this.segmentClicked(1)}
                                active={this.state.activeIndex === 1}>
                            <Icon name='ios-list'
                                  style={[this.state.activeIndex === 1 ? {} : {color: 'grey'}]}/>
                        </Button>
                        */}
                                <Button transparent
                                        onPress={() => this.segmentClicked(2)}
                                        active={this.state.activeIndex === 2}>
                                    <Icon name='video'
                                          style={[this.state.activeIndex === 2 ? {
                                              color: 'black',
                                              fontSize: 25
                                          } : {color: 'grey', fontSize: 25}]}/>
                                </Button>
                            </View>

                            <Spinner color={colors.dark_gray}
                                     style={[styles.spinner, {display: loadingData1 ? 'flex' : 'none'}]}/>
                            <PostItems myData={loadDataPublication} loading={loadingData1}
                                       navigation={this.props.navigation}/>

                        </Content>
                    </ScrollView>
                </Container>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    userEmail: {
        color: colors.fullDarkBlue,
        fontSize: 15
    },
    countable: {
        fontWeight: 'bold',
        fontSize: 18
    },
    spinner: {
        marginLeft: (Dimensions.get("window").width / 2) - 20,
        marginTop: 30,
        marginRight: 'auto'
    },
    avatarStyle: {
        width: 30,
        height: 30,
        borderRadius: 50,
    },
});
