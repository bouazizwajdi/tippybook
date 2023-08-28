import React, {Fragment} from 'react';
import {
    StyleSheet,
    View, RefreshControl, ScrollView, TextInput, Dimensions, ActivityIndicator, TouchableOpacity, Text
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import HeaderToolbar from '~/components/toolbar/index'
import StoryItems from '~/components/storyItems/index'
import Modal from "react-native-modalbox";
import StoriesData from '~/components/StorySlide/StoriesData/StoriesData'
import PostItems from "~/components/postItems";
import Separator from "~/components/separator";
import styles from "~/screens/Home/styles";
import axios from "axios";
import {colors} from "~/utils/theme";
import {Content} from "native-base";
import Search from "~/screens/Search";

export default class Home extends React.PureComponent<any, any> {
/*

import { useIsFocused } from "@react-navigation/native"; 
...
const History = ({ navigation }) => {
  ...
  const isFocusedHistory = useIsFocused();
  ...
  useEffect(() => {
    ...
    loadFlatlist("savedRuns")
    ...
  }, [isFocusedHistory]);
  ...
}
*/

    constructor(props: any) {
        super(props);
        console.log('constructor')

        this.state = {
            refreshing: false,
            avatars: [],
            setRefreshing: false,
            isModalOpen: false,
            isGalleryModalOpen: false,
            orderedStories: null,
            loading: true,
            searchTerm: '',
            photoUser: '',
            id: '',
            token: '',
            loadingAvatars: true,
            page: 1,
            myData: []
        };

    }

    onSearch = (value) => {
        this.setState({searchTerm: value})
    };
    retrieveData = async () => {
        console.log('retrieveData')
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
        console.log('retrieveDataPhoto')
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
    getAvatars = async () => {
        try {
 
            const response = await axios.get(`https://api.trippybook.com/api/visiteur/myStories`, {headers: {'Authorization': this.state.token}});
            if (response.status === 200) {
 
                console.log('avatars === ' + JSON.stringify("avatarrr sss r"+JSON.stringify(response.data.stories)))
                //alert('success')
                if (response.data.stories.length > 0) {
                    this.setState({
                        avatars: response.data.stories,
                    }, () => {
                        this.getMyStories()

                    })
                } else {
                    this.getMyStories()

                }
              

            }
        } catch (error) {
            console.log(JSON.stringify(error));

        }

    }
    getMyStories = async () => {

        try {

            const response = await axios.get(`https://api.trippybook.com/api/visiteur/stories`, {headers: {'Authorization': this.state.token}});
            if (response.status === 200) {
                console.log('myStories === ' + JSON.stringify(response.data.stories))
                if (this.state.avatars.length > 0) {
                    this.setState({
                        avatars: this.state.avatars.concat(response.data.stories),
                        loadingAvatars: false,
                    })
                } else {

                    this.setState({
                        avatars: response.data.stories,
                        loadingAvatars: false,
                    })

                }

            }
        } catch (error) {
            console.log(JSON.stringify(error));
        }

    }

/*componentDidUpdate(): void {
 
        const {nav} = this.props;
        this.retrieveData()
        this.retrieveDataPhoto()
        this.retrieveDataId()
        setTimeout(() => this.loadData(`https://api.trippybook.com/api/visiteur/feeds?page=` + this.state.page, false), 1200)


        
    }*/

    componentDidMount(): void {
 
        const {nav} = this.props;
        this.retrieveData()
        this.retrieveDataPhoto()
        this.retrieveDataId()
        setTimeout(() => this.loadData(`https://api.trippybook.com/api/visiteur/feeds?page=` + this.state.page, 0), 1200)


        // https://api.trippybook.com/api/visiteur/publications/78?page=1
    }

    wait = (timeout: number) => {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    };

    onRefresh = () => {
       
        this.setState({ setRefreshing: true,loading: true,avatars:[]},()=>{
            this.loadData(`https://api.trippybook.com/api/visiteur/feeds?page=` + this.state.page, false,true)

        });
    };


    loadData = async (url: string, hasProps: boolean,isReset:boolean) => {
        const {loading,setRefreshing, myData, page} = this.state;

        if (this.state.token !== '') {
            try {
                const response = await axios.get(url, {headers: {'Authorization': this.state.token}});
                if (response.status === 200 && (loading ||setRefreshing)) {
                    if (myData.length == 0||isReset) {
                        this.setState({
                            myData: response.data.feeds.data,
                            lastPage: response.data.feeds.last_page,

                        }, () => {
                            this.setState({loading: false,setRefreshing: false}, () => {
                                this.getAvatars()
                            })
                        })
                    } else {
                        this.setState({
                            myData: this.state.myData.concat(response.data.feeds.data),
                            lastPage: response.data.feeds.last_page,

                        }, () => {
                            this.setState({loading: false ,setRefreshing: false})
                        })
                    }
                }
            } catch (error) {
                alert('erreur loadData' + error)// Error data
            }
        }
    }

    render() {
        const {isModalOpen, refreshing, loading, myData, page} = this.state;
        const {navigation} = this.props;
        const handleScroll = (e) => {
            var windowHeight = Dimensions.get('window').height,
                height = e.nativeEvent.contentSize.height,
                offset = e.nativeEvent.contentOffset.y;
            if (windowHeight + offset > height && this.state.page < this.state.lastPage) {
                this.setState({loading: true})


            }
            if (loading) {
                let page1 = page + 1
                this.setState({
                    page: page1,
                }, () => this.loadData(`https://api.trippybook.com/api/visiteur/feeds?page=` + this.state.page, false,false))
            }
        }

        return (
            <Fragment>
                <View style={styles.fragment}>
                    <HeaderToolbar context="Home"/>
                    {loading?
                        <ActivityIndicator color={colors.dark_gray}
                                                style={[styles.spinner, {display: loading ? 'flex' : 'none'}]}/>
                                                :
                        <ScrollView onScroll={() => handleScroll} scrollEventThrottle={16}
                                 overScrollMode={loading ? 'never' : 'auto'}
                                 refreshControl={
                                     <RefreshControl refreshing={refreshing} onRefresh={() => this.onRefresh()}/>
                                 }
                                 contentContainerStyle={styles.scrollView}>
                        <View>
                            <View style={Object.assign({}, styles.marginContainer, styles.storiesContainer)}>

                                    <StoryItems avatars={this.state.avatars} navigation={navigation} idCurrentUser={this.state.id} />
                            </View>
                            <Separator/>
                            <View style={{position:'relative',flex:1,paddingVertical:5, paddingHorizontal:15}}>
                                <TextInput onChangeText={(val) =>this.onSearch(val)}  style={{ fontSize: 13,
                                    height: 40,
                                    fontWeight: "400",
                                    padding: 3,
                                    paddingLeft: 10,
                                    borderWidth: 1,
                                    borderColor: colors.white,
                                    marginVertical:10,
                                    backgroundColor:colors.white,
                                    flex: 1}} textContentType={'name'} placeholder={'search...'} value={this.state.searchTerm} />
                                <TouchableOpacity onPress={()=>this.props.navigation.navigate('SearchTag', {searchTerm: this.state.searchTerm})}
                                style={{position:'absolute',right:17,top:18,backgroundColor:'#f5f5f5',padding:8}}><Text>🔍</Text></TouchableOpacity>
                            </View>
                            <PostItems myData={myData} navigation={navigation} loading={loading}/>
                        </View>
                    </ScrollView>
                    }
                    <Modal
                        style={styles.modal}
                        isOpen={isModalOpen}
                        close={() => this.setState({isModalOpen: false})}
                        position="center"
                        swipeToClose={true}
                        swipeArea={250}
                        backButtonClose={true}
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
                </View>
            </Fragment>
        );
    }
}

