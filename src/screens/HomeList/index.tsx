import React, {Fragment} from 'react';
import {
    View, RefreshControl, ScrollView, TextInput, Dimensions, TouchableOpacity, Text, Picker, Image
} from "react-native";
import HeaderToolbar from '~/components/toolbar/index'
import Modal from "react-native-modalbox";
import AsyncStorage from '@react-native-community/async-storage';
import StoriesData from '~/components/StorySlide/StoriesData/StoriesData'
import PostItems from "~/components/postItems";
import Separator from "~/components/separator";
import styles from "~/screens/HomeList/styles";
import axios from "axios";
import StoryItem from "~/components/storyItems/storyItem";
import {Body, Button, Content, Header, Left, Right} from "native-base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {colors} from "~/utils/theme";
import * as Animatable from "react-native-animatable";
import StarRating from 'react-native-star-rating';
import {Avatar} from "react-native-elements";
import SvgUri from "react-native-svg-uri";


const AnimatedIcon = Animatable.createAnimatableComponent(Icon);

export default class HomeList extends React.PureComponent<any, any> {

    constructor(props: any) {
        super(props);

        this.state = {
            starCount: 1,
            avis: 0,
            nbrVisitor: 0,
            dataNote: {nodata:true},
            costs: 1,
            follows: [],
            dataProfil: {},
            photoUser: '',
            comment: '',
            id: '',
            token: '',
            refreshing: false,
            openRateModal: false,
            openRequestModal: false,
            setRefreshing: false,
            isModalOpen: false,
            isGalleryModalOpen: false,
            orderedStories: null,
            selectedStory: null,
            loading: true,
            loadingHandle: true,
            page: 1,
            myData: [],
            tax: '',
            message: '',
            reasonSocial: '',
            email: '',
            phone: '',
            address: '',
            zip: '',
            fb: '', twitter: '', instagram: '', youtube: '', website: ''
        };
    }

    handleChange = (name: string, val: string) => {
        this.setState({[name]: val})
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

    componentDidMount(): void {
        this.retrieveData()
        this.retrieveDataPhoto()
        this.retrieveDataId()
        setTimeout(() => {
            if (this.props.navigation.state.params != null) {
                this.followByAddress()
                const idAdr = this.props.navigation.state.params.idAdr
                this.loadData(`https://api.trippybook.com/api/visiteur/publications/${idAdr}?page=` + this.state.page, true)

            } else {
                this.loadData(`https://api.trippybook.com/api/visiteur/feeds?page=` + this.state.page, false)
            }
        }, 1000)
        // https://api.trippybook.com/api/visiteur/publications/78?page=1
    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
        if (this.props.navigation.state.params != null) {
            console.log('list')
            const idAdr = this.props.navigation.state.params.idAdr
            this.loadData(`https://api.trippybook.com/api/visiteur/publications/${idAdr}?page=` + this.state.page, true)

        }

    }


    wait = (timeout: number) => {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    };

    onRefresh = () => {
        this.setState({setRefreshing: true, loading: true});
        this.wait(2000).then(() => {
            if (this.props.navigation.state.params != null) {
                const idAdr = this.props.navigation.state.params.idAdr
                this.loadData(`https://api.trippybook.com/api/visiteur/publications/${idAdr}?page=` + this.state.page, true)

            }
            this.setState({setRefreshing: false});
        });
    };
    loadDataRate = async () => {
        const idAdr = this.props.navigation.state.params.idAdr
        if (this.state.token !== '') {
            try {
                const res = await axios.get('https://api.trippybook.com/api/visiteur/ratesByAdress/' + idAdr, {headers: {'Authorization': this.state.token}})
                if (res.status == 200) {
                    if (res.data.avis.length) {
                        let totalAvis = 0
                        res.data.avis.map((avisStar: any) => {
                            totalAvis += avisStar.note
                        })
                        totalAvis = totalAvis / res.data.avis.length
                        this.setState({avis: totalAvis,nbrVisitor:res.data.avis.length, dataNote: res.data},()=>{
                            this.setState((prev:any)=>({
                                ...prev,
                                dataNote: {...prev.dataNote, nodata: false}
                            }))
                           
                            if (res.data.currentUserRate) {
                                this.setState({
                                    starCount: res.data.currentUserRate.note,
                                    comment: res.data.currentUserRate.comment_avis,
                                    costs: res.data.currentUserRate.couts
                                }, () => this.setState({openRateModal: true}))
                            } else {
                                this.setState({openRateModal: true})
                            }
                        })
                    }else {
                        this.setState({openRateModal: true})
                    }


                }
            } catch (e) {
                alert(e)
            }
        } else {
            alert('les champs ne doit pas être vide')
        }
    }

    loadData = async (url: string, hasProps: boolean) => {
        const {loading, myData, page,loadingHandle} = this.state;
        if (this.state.token !== '') {
            try {
                const response = await axios.get(url, {headers: {'Authorization': this.state.token}});
                if (response.status === 200 && (loading ||loadingHandle)) {
                    if (hasProps) {
                        this.setState({
                            myData: response.data.feeds.data,
                            dataProfil: response.data,

                        }, () => {
                            this.setState({loading: false,loadingHandle:false})
                        })
                    }

                }
            } catch (error) {
                alert('erreur loadData' + error)// Error data
            }
        }
    }
    followByAddress = async () => {
        if (this.state.token !== '') {
            try {
                const res = await axios.post('https://api.trippybook.com/api/visiteur/followByAdress', {
                    adresseId: this.props.navigation.state.params.idAdr,
                }, {headers: {'Authorization': this.state.token}})
                if (res.status == 200) {
                    // alert(JSON.stringify( res.data.follows))
                    this.setState({follows: res.data.follows})


                    // getadr()

                }
            } catch (e) {
                alert(e)
            }
        }
    }

    render() {
        const {isModalOpen, refreshing, loading, myData, page, follows, dataProfil} = this.state;
        const {navigation} = this.props;
        if (this.props.navigation.state.params != null) {
            const idAdr = this.props.navigation.state.params.idAdr
            console.log('idAdr ====>' + idAdr)
            this.loadData(`https://api.trippybook.com/api/visiteur/publications/${idAdr}?page=` + this.state.page, true)

        }
        const handleScroll = (e) => {
            var windowHeight = Dimensions.get('window').height,
                height = e.nativeEvent.contentSize.height,
                offset = e.nativeEvent.contentOffset.y;
            if (windowHeight + offset > height && this.state.page < this.state.lastPage) {
                this.setState({loading: true})


            }
            if (loading) {
                let page1 = page + 1
                console.log(page1)
                this.setState({
                    page: page1,
                }, () => this.loadData(`https://api.trippybook.com/api/visiteur/feeds?page=` + this.state.page, true))
            }
        }


        const handleOnPressLike = async () => {
            const idAdr = this.props.navigation.state.params.idAdr
            if (this.state.token !== '' && this.state.id != '') {
                try {
                    const res = await axios.post('https://api.trippybook.com/api/visiteur/favoris/add', {
                        adresseId: idAdr,
                        visiteurId: this.state.id
                    }, {headers: {'Authorization': this.state.token}})
                    if (res.status == 200) {
                       this.setState({loadingHandle:true},()=>{this.loadData(`https://api.trippybook.com/api/visiteur/publications/${idAdr}?page=` + this.state.page, true)
                       })
                    }
                } catch (e) {
                    alert('like' + e)
                }

            }
        }
        const handleOnCancelLike = async () => {
            const idAdr = this.props.navigation.state.params.idAdr
            if (this.state.token !== '') {
                try {
                    const res = await axios.post('https://api.trippybook.com/api/visiteur/favoris/delete', {
                        adresseId: idAdr,
                        visiteurId: this.state.id
                    }, {headers: {'Authorization': this.state.token}})
                    if (res.status == 200) {
                        this.setState({loadingHandle:true},()=>{this.loadData(`https://api.trippybook.com/api/visiteur/publications/${idAdr}?page=` + this.state.page, true)
                        })


                    }
                } catch (e) {
                    alert(e)
                }
            }
        }
        const follow = async () => {
            const idAdr = this.props.navigation.state.params.idAdr
            if (this.state.token !== '') {
                try {
                    const res = await axios.post('https://api.trippybook.com/api/visiteur/follow', {
                        adresseId: idAdr,
                        visiteurId: this.state.id
                    }, {headers: {'Authorization': this.state.token}})
                    if (res.status == 200) {
                        this.setState({loadingHandle:true},()=>{this.loadData(`https://api.trippybook.com/api/visiteur/publications/${idAdr}?page=` + this.state.page, true)
                        })


                    }
                } catch (e) {
                    alert(e)
                }
            }
        }
        const unfollow = async () => {
            const idAdr = this.props.navigation.state.params.idAdr
            if (this.state.token !== '') {
                try {
                    const res = await axios.post('https://api.trippybook.com/api/visiteur/unfollow', {
                        adresseId: idAdr,
                        visiteurId: this.state.id
                    }, {headers: {'Authorization': this.state.token}})
                    if (res.status == 200) {
                        this.setState({loadingHandle:true},()=>{this.loadData(`https://api.trippybook.com/api/visiteur/publications/${idAdr}?page=` + this.state.page, true)
                        })
                    }
                } catch (e) {
                    alert(e)
                }
            }
        }

        const handleViewRef = ref => this.view = ref;
        const onStarRatingPress = (rating: any) => {
            this.setState({starCount: rating,})
        }
        const sendRate = async () => {
            const idAdr = this.props.navigation.state.params.idAdr
            let myData = {
                adresseId: idAdr,
                commentRate: this.state.comment,
                couts: this.state.costs,
                note: this.state.starCount,
                visiteurId: this.state.id,
            }
            if (this.state.token !== '' && this.state.comment != '') {
                try {
                    const res = await axios.post('https://api.trippybook.com/api/visiteur/rate', myData, {headers: {'Authorization': this.state.token}})
                    if (res.status == 200) {
                       
                        this.setState({openRateModal: false})
                    }
                } catch (e) {
                    alert(e)
                }
            } else {
                alert('les champs ne doit pas être vide')
            }
        }
        const sendRequestAdmin = async () => {
            const idAdr = this.props.navigation.state.params.idAdr
            let myData = {
                mf: this.state.tax,
                rs: this.state.reasonSocial,
                email: this.state.email,
                adresse: this.state.address,
                code_postal: this.state.zip,
                tel: this.state.phone,
                site_web: this.state.website,
                message: this.state.message,
                adresse_id: idAdr,
            }
            if (this.state.token !== '' && this.state.address != '' && this.state.email != '' && this.state.phone != '' && this.state.reasonSocial != '') {
                try {
                    const res = await axios.post('https://api.trippybook.com/api/visiteur/demandeAdministration', myData, {headers: {'Authorization': this.state.token}})
                    if (res.status == 200) {
                  
                        this.setState({openRequestModal: false})
                    }
                } catch (e) {
                    alert(e)
                }
            } else {
                alert('les champs ne doit pas être vide')
            }
        }
        return (
            <Fragment>
                <View style={styles.fragment}>
                    <HeaderToolbar context="HomeList" onClicked={() => navigation.goBack()}/>
                    <ScrollView onScroll={()=>handleScroll} scrollEventThrottle={16} overScrollMode={loading ? 'never' : 'auto'}
                                refreshControl={
                                    <RefreshControl refreshing={refreshing} onRefresh={() => this.onRefresh}/>
                                }
                                contentInsetAdjustmentBehavior="automatic"
                                style={styles.scrollView}>
                        <View>
                            {loading ?
                                null :
                                <View style={{flexDirection: 'row', paddingTop: 10}}>
                                    <View style={{flex: 1, alignItems: 'center'}}>
                                        {this.state.dataProfil.Adresse != null ?
                                                <Image
                                                        style={styles.containerAvatar}
                                                        source={{uri: 'https://ressources.trippybook.com/assets/' + this.state.dataProfil.Adresse.logo}}
                                                />
                                             : null}
                                    </View>
                                    <View style={{flex: 2}}>
                                        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                                            <View style={{alignItems: 'center'}}>
                                                <Text
                                                    style={styles.countable}>{myData.length}</Text>
                                                <Text style={{fontSize: 13, color: 'gray'}}>Publications</Text>
                                            </View>
                                            <View style={{alignItems: 'center'}}>
                                                <Text style={styles.countable}>{follows.length}</Text>
                                                <Text style={{fontSize: 13, color: 'gray'}}>Followers</Text>
                                            </View>
                                        </View>
                                        {dataProfil && !this.state.loadingHandle ? <View style={{flexDirection: 'row'}}>
                                            <Button bordered dark onPress={dataProfil.isFollowed ?
                                                () => unfollow()
                                                :
                                                () => follow()}
                                                    style={{
                                                        flex: 4,
                                                        marginLeft: 10,
                                                        justifyContent: 'center',
                                                        height: 30,
                                                        marginTop: 10
                                                    }}>
                                                {dataProfil.isFollowed ? <Text>Unfollow</Text> : <Text>Follow</Text>}
                                            </Button>
                                            <Button bordered dark small icon onPress={dataProfil.isFavorite ?
                                                () => handleOnCancelLike()

                                                :
                                                () => handleOnPressLike()
                                            }
                                                    style={{
                                                        flex: 1,
                                                        marginRight: 10,
                                                        marginLeft: 5,
                                                        justifyContent: 'center',
                                                        height: 30,
                                                        marginTop: 10
                                                    }}>
                                                <AnimatedIcon
                                                    name={dataProfil.isFavorite ? 'heart' : 'heart-outline'}
                                                    color={dataProfil.isFavorite ? colors.darkRed : colors.black}
                                                    size={18}
                                                    style={styles.icon}
                                                />
                                            </Button>
                                        </View> : null}
                                    </View>
                                </View>
                            }

                            {loading ? null : <View style={{paddingHorizontal: 10, paddingVertical: 10}}>
                                <Text style={{
                                    fontWeight: 'bold',
                                    fontSize: 15
                                }}>{this.state.dataProfil.Adresse != null ? dataProfil.Adresse.rs : null}</Text>
                            </View>}
                            {loading ?
                                null :
                                <View style={{flexDirection: 'row', paddingTop: 10}}>
                                    <View style={{flex: 2}}>
                                        {dataProfil ?
                                            <View style={{flexDirection: 'row'}}>
                                                {dataProfil.isDemandeAdminSent ? null : <Button bordered dark
                                                                                                onPress={() => this.setState({openRequestModal: true})}
                                                                                                style={{
                                                                                                    flex: 4,
                                                                                                    marginRight: 10,
                                                                                                    marginLeft: 5,
                                                                                                    justifyContent: 'center',
                                                                                                    height: 30,
                                                                                                    marginTop: 10
                                                                                                }}>
                                                    <Text>Send administration request</Text>
                                                </Button>}
                                                <Button bordered dark small icon
                                                        onPress={() => this.loadDataRate()}
                                                        style={{
                                                            flex: 2,
                                                            marginRight: 10,
                                                            marginLeft: 5,
                                                            justifyContent: 'center',
                                                            height: 30,
                                                            marginTop: 10
                                                        }}>
                                                    <Text>Rates</Text>
                                                </Button>
                                            </View> : null}
                                    </View>
                                </View>
                            }
                            <Separator/>
                            <PostItems myData={myData} navigation={navigation} loading={loading}/>
                        </View>
                    </ScrollView>
                    <Modal
                        style={styles.modal}
                        isOpen={isModalOpen}
                        onClosed={() => this.setState({isModalOpen: false})}
                        position="center"
                        swipeToClose
                        swipeArea={250}
                        backButtonClose
                    >
                        <StoriesData
                            footerComponent={
                                <TextInput
                                    placeholder="Send message"
                                    placeholderTextColor="white"
                                />
                            }
                        />
                    </Modal>
                    <Modal
                        style={styles.modal}
                        isOpen={this.state.openRateModal}
                        onClosed={() => this.setState({openRateModal: false})}
                        position="center"
                        swipeToClose
                        swipeArea={250}
                        backButtonClose
                    >
                        <Header style={{backgroundColor: colors.white, borderBottomWidth: 0}}>
                            <Left>
                                <Button transparent onPress={() => this.setState({openRateModal: false})}>
                                    <Icon style={{color: colors.black, fontSize: 32}} name='close'/>
                                </Button>
                            </Left>
                            <Body>
                                <Text style={{fontSize: 18, color: colors.black, fontWeight: 'bold'}}>Rate us</Text>
                            </Body>
                            <Right>
                                <Button transparent onPress={() => sendRate()}>
                                    <Icon style={{color: colors.black, fontSize: 32}}
                                          name='check'/>
                                </Button>
                            </Right>
                        </Header>
                        <Content style={{padding:10}}>
                            {this.state.avis ?
                                <>
                                    <Text style={{fontSize: 17, fontWeight: 'bold'}}>{this.state.nbrVisitor} Visitor Reviews</Text>
                                    <View style={{flexDirection: 'row', paddingTop: 10, alignContent: 'center'}}>
                                        <StarRating
                                            disabled={false}
                                            emptyStar={'ios-star-outline'}
                                            fullStar={'ios-star'}
                                            halfStar={'ios-star-half'}
                                            iconSet={'Ionicons'}
                                            maxStars={5}
                                            starSize={12}
                                            fullStarColor={'#fbc634'}
                                            rating={this.state.avis}/>
                                        <Text style={{fontSize: 12}}> {this.state.avis}/5</Text>
                                    </View></> :
                                <Text style={{fontSize: 17, fontWeight: 'bold'}}>0 Visitor Reviews</Text>
                            }
                            <View style={{flexDirection: 'row', justifyContent:'space-between', alignContent: 'center'}}>
                            {this.state.dataNote.nodata ?
                             null
                                :

                              <>
                              <View  style={{flexDirection: 'column',  alignContent: 'center',width:'30%'}}>
                                    <View style={{flexDirection: 'row', paddingTop: 10, alignContent: 'center'}}>
                                        <StarRating
                                            disabled={false}
                                            emptyStar={'ios-star-outline'}
                                            fullStar={'ios-star'}
                                            halfStar={'ios-star-half'}
                                            iconSet={'Ionicons'}
                                            maxStars={5}
                                            starSize={12}
                                            fullStarColor={'#fbc634'}
                                            rating={5}/>
                                        <Text style={{fontSize: 12}}> ({this.state.dataNote.five.length})</Text>
                                    </View>
                                    <View style={{flexDirection: 'row', paddingTop: 10, alignContent: 'center'}}>
                                        <StarRating
                                            disabled={false}
                                            emptyStar={'ios-star-outline'}
                                            fullStar={'ios-star'}
                                            halfStar={'ios-star-half'}
                                            iconSet={'Ionicons'}
                                            maxStars={5}
                                            starSize={12}
                                            fullStarColor={'#fbc634'}
                                            rating={4}/>
                                        <Text style={{fontSize: 12}}> ({this.state.dataNote.four.length})</Text>
                                    </View>
                                    <View style={{flexDirection: 'row', paddingTop: 10, alignContent: 'center'}}>
                                        <StarRating
                                            disabled={false}
                                            emptyStar={'ios-star-outline'}
                                            fullStar={'ios-star'}
                                            halfStar={'ios-star-half'}
                                            iconSet={'Ionicons'}
                                            maxStars={5}
                                            starSize={12}
                                            fullStarColor={'#fbc634'}
                                            rating={3}/>
                                        <Text style={{fontSize: 12}}> ({this.state.dataNote.three.length})</Text>
                                    </View>
                                    <View style={{flexDirection: 'row', paddingTop: 10, alignContent: 'center'}}>
                                        <StarRating
                                            disabled={false}
                                            emptyStar={'ios-star-outline'}
                                            fullStar={'ios-star'}
                                            halfStar={'ios-star-half'}
                                            iconSet={'Ionicons'}
                                            maxStars={5}
                                            starSize={12}
                                            fullStarColor={'#fbc634'}
                                            rating={2}/>
                                        <Text style={{fontSize: 12}}> ({this.state.dataNote.two.length})</Text>
                                    </View>
                                    <View style={{flexDirection: 'row', paddingTop: 10, alignContent: 'center'}}>
                                        <StarRating
                                            disabled={false}
                                            emptyStar={'ios-star-outline'}
                                            fullStar={'ios-star'}
                                            halfStar={'ios-star-half'}
                                            iconSet={'Ionicons'}
                                            maxStars={5}
                                            starSize={12}
                                            fullStarColor={'#fbc634'}
                                            rating={1}/>
                                        <Text style={{fontSize: 12}}> ({this.state.dataNote.one.length})</Text>
                                    </View></View>

                                <View style={{flexDirection: 'column',  alignContent: 'center',width:'70%',borderLeftWidth:1,borderLeftColor:'#ddd'}}>
                                    <>
                                        {this.state.dataNote.avis.map((avis:any)=>
                                        <View style={{flexDirection: 'row' ,alignContent: 'center',justifyContent:'space-around',paddingBottom:10}}>
                                            <Image source={{uri: "https://ressources.trippybook.com/assets/" + avis.visiteur.photo}} style={{height: 30,width:30,borderRadius:70}}/>
                                            <Text>{avis.visiteur.prenom}</Text>
                                            <StarRating
                                                disabled={false}
                                                emptyStar={'ios-star-outline'}
                                                fullStar={'ios-star'}
                                                halfStar={'ios-star-half'}
                                                iconSet={'Ionicons'}
                                                maxStars={5}
                                                starSize={12}
                                                fullStarColor={'#fbc634'}
                                                rating={this.state.avis}/>
                                            {avis.couts==1?
                                                <Text><Text style={{color:'green'}}>$</Text>$$$$</Text>:
                                                avis.couts==2? <Text><Text style={{color:'green'}}>$$</Text>$$$</Text>:
                                                    avis.couts==3? <Text><Text style={{color:'green'}}>$$$</Text>$$</Text>:
                                                        avis.couts==4? <Text><Text style={{color:'green'}}>$$$$</Text>$</Text>:
                                                            avis.couts==5?<Text style={{color:'green'}}>$$$$$</Text>:null}
                                        </View>
                                        )}
                                        </>
                                </View>
                              </>
                            }
                             </View>
                                <Separator/>
                            <Animatable.View style={{marginTop: 50, paddingHorizontal: 35}} ref={handleViewRef}
                                             animation="bounceIn">
                                <Text style={{paddingBottom:15}}>Rate us *</Text>
                                <StarRating
                                    disabled={false}
                                    emptyStar={'ios-star-outline'}
                                    fullStar={'ios-star'}
                                    halfStar={'ios-star-half'}
                                    iconSet={'Ionicons'}
                                    maxStars={5}
                                    fullStarColor={'#fbc634'}
                                    rating={this.state.starCount}
                                    selectedStar={(rating: any) => onStarRatingPress(rating)}
                                />
                            </Animatable.View>

                            <View style={[styles.container,{paddingHorizontal: 35,paddingTop:20}]}>
                                <Text  style={{paddingBottom:15}}>Costs</Text>
                                <Picker
                                    selectedValue={this.state.costs}
                                    style={{width: '100%'}}
                                    onValueChange={(itemValue) => this.setState({costs: itemValue})}
                                >
                                    <Picker.Item label="$" value="1"/>
                                    <Picker.Item label="$$" value="2"/>
                                    <Picker.Item label="$$$" value="3"/>
                                    <Picker.Item label="$$$$" value="4"/>
                                    <Picker.Item label="$$$$$" value="5"/>
                                </Picker>
                            </View>
                                                        <View style={styles.container}>
<TextInput value={this.state.comment} underlineColorAndroid='transparent'
                                       textContentType={'message'}
                                       style={styles.inputStyle}
                                       onChangeText={(val) => this.handleChange('comment', val)}
                                       placeholder={'Write a comment'}/>
                                       </View>

                        </Content>

                    </Modal>
                    <Modal
                        style={styles.modal}
                        isOpen={this.state.openRequestModal}
                        onClosed={() => this.setState({openRequestModal: false})}
                        position="center"
                        swipeToClose
                        swipeArea={250}
                        backButtonClose
                    >
                        <Header style={{backgroundColor: colors.white, borderBottomWidth: 0}}>
                            <Left>
                                <Button transparent onPress={() => this.setState({openRequestModal: false})}>
                                    <Icon style={{color: colors.black, fontSize: 32}} name='close'/>
                                </Button>
                            </Left>
                            <Body>
                                <Text style={{fontSize: 14, color: colors.black, fontWeight: 'bold'}}>You want to be
                                    admin for this adress ?</Text>
                            </Body>
                            <Right>
                                <Button transparent onPress={() => sendRequestAdmin()}>
                                    <Icon style={{color: colors.black, fontSize: 32}}
                                          name='check'/>
                                </Button>
                            </Right>
                        </Header>
                        <Content>
                            <TextInput value={this.state.tax} underlineColorAndroid='transparent'
                                       textContentType={'message'}
                                       style={styles.inputStyle} onChangeText={(val) => this.handleChange('tax', val)}
                                       placeholder={"Tax registration number"}/>
                            <TextInput value={this.state.reasonSocial} underlineColorAndroid='transparent'
                                       textContentType={'message'}
                                       style={styles.inputStyle}
                                       onChangeText={(val) => this.handleChange('reasonSocial', val)}
                                       placeholder={"Social reason *"}/>
                            <TextInput value={this.state.email} underlineColorAndroid='transparent'
                                       textContentType={'emailAddress'}
                                       style={styles.inputStyle} onChangeText={(val) => this.handleChange('email', val)}
                                       placeholder={"Email"}/>
                            <TextInput value={this.state.address} underlineColorAndroid='transparent'
                                       textContentType={'addressCity'}
                                       style={styles.inputStyle}
                                       onChangeText={(val) => this.handleChange('address', val)}
                                       placeholder={"Address *"}/>
                            <TextInput value={this.state.zip} underlineColorAndroid='transparent'
                                       textContentType={'postalCode'}
                                       style={styles.inputStyle} onChangeText={(val) => this.handleChange('zip', val)}
                                       placeholder={"Postal code"}/>
                            <TextInput value={this.state.fb} underlineColorAndroid='transparent'
                                       textContentType={'URL'}
                                       style={styles.inputStyle} onChangeText={(val) => this.handleChange('fb', val)}
                                       placeholder={"Facebook"}/>
                            <TextInput value={this.state.phone} underlineColorAndroid='transparent'
                                       textContentType={'telephoneNumber'}
                                       style={styles.inputStyle} onChangeText={(val) => this.handleChange('phone', val)}
                                       placeholder={"Phone *"}/>
                            <TextInput value={this.state.insta} underlineColorAndroid='transparent'
                                       textContentType={'URL'}
                                       style={styles.inputStyle} onChangeText={(val) => this.handleChange('insta', val)}
                                       placeholder={"Instagram"}/>
                            <TextInput value={this.state.youtube} underlineColorAndroid='transparent'
                                       textContentType={'URL'}
                                       style={styles.inputStyle}
                                       onChangeText={(val) => this.handleChange('youtube', val)}
                                       placeholder={"Youtube"}/>
                            <TextInput value={this.state.twitter} underlineColorAndroid='transparent'
                                       textContentType={'URL'}
                                       style={styles.inputStyle}
                                       onChangeText={(val) => this.handleChange('twitter', val)}
                                       placeholder={"Twitter"}/>
                            <TextInput value={this.state.website} underlineColorAndroid='transparent'
                                       textContentType={'URL'}
                                       style={styles.inputStyle}
                                       onChangeText={(val) => this.handleChange('website', val)}
                                       placeholder={"Web site"}/>
                            <TextInput value={this.state.message} underlineColorAndroid='transparent'
                                       textContentType={'message'}
                                       style={styles.inputStyle}
                                       onChangeText={(val) => this.handleChange('message', val)}
                                       placeholder={'Message'}/>
                        </Content>

                    </Modal>
                </View>
            </Fragment>
        );
    }
}

