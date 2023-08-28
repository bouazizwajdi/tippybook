import React, {useEffect, useState} from 'react'
import {ScrollView, TouchableOpacity, View, StyleSheet, TextInput, Dimensions, Modal, Text} from "react-native";
import StoryItem from "./storyItem";
import AsyncStorage from '@react-native-community/async-storage';
import StoriesData from "~/components/StorySlide/StoriesData/StoriesData";
import {Body, Button, Content, Footer, Header, Left, Right} from "native-base";
import {colors} from "~/utils/theme";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as Animatable from "react-native-animatable";
import axios from "axios";
import {Image} from "react-native-elements";

const AnimatedIcon = Animatable.createAnimatableComponent(Icon);

let id = ''
let token = ''
const retrieveDataId = async () => {
    try {
        const value = await AsyncStorage.getItem('idUser');
        if (value) {
            // We have data!!
            id = value
        }
    } catch (error) {
        alert(error)// Error data
    }
};

const retrieveData = async () => {
    try {
        const value = await AsyncStorage.getItem('myToken');
        if (value !== null) {
            // We have data!!
            token = value;
            console.log(JSON.stringify(value))

        }
    } catch (error) {
        alert(error)// Error data
    }
};

const storyItems: React.StatelessComponent = (props: any) => {
    useEffect(() => {
        retrieveData()
        retrieveDataPhoto()
        retrieveDataId()
    }, [])

    const [photoUser, setPhotoUser] = useState('')
    const [setIsMe, setsetIsMe] = useState('')
    const [loadingP, setLoadingP] = useState(true)
    let [selectedStory, setSelectedStory] = useState({})
    let [isModalOpen, setIsModalOpen] = useState(false)
    console.log('myStorie==='+JSON.stringify(props.avatars))
    const retrieveDataPhoto = async () => {
        try {
            const photo1 = await AsyncStorage.getItem('photo');

            if (photo1) {
                // We have data!!
                setPhotoUser(photo1)
                setLoadingP(false)
            }
        } catch (error) {
            console.log(error)// Error data
        }
    };
    const _handleStoryItemPress = (item: any,num:number) => {
        console.log(item)
        setSelectedStory(item)
        setIsModalOpen(true)
        if(num==1){
            setsetIsMe(true)
        }
    };
    const handleOnPressLike = async (jaimable_id, reaction_type) => {

        if (token !== '' && id != '') {
            try {

                const res = await axios.post('https://api.trippybook.com/api/visiteur/jaimeStory', {
                    jaimable_id: jaimable_id,
                    jaimable_type: "App\\Models\\Media",
                    reaction_type: reaction_type,
                    visiteur_id: id
                }, {headers: {'Authorization': token}})
                if (res.status == 200) {
                    console.log(JSON.stringify(res.data))
                }
            } catch (error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(JSON.stringify(error.response.data));
                    console.log(JSON.stringify(error.response.status));
                    console.log(JSON.stringify(error.response.headers));
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error======', error.message);
                }
            }

        }
    }

    return (
        <><ScrollView
            style={styles.contactContainerStyle}
            horizontal={true}
            showsHorizontalScrollIndicator={false}>
            <View style={{flex: 1, flexDirection: 'row'}}>

                {!loadingP ?<StoryItem key={Math.random()} isBtnProfile={true}
                            image={'https://ressources.trippybook.com/assets/' + photoUser}
                            photo={'https://ressources.trippybook.com/assets/' + photoUser} title="add story"
                />:<StoryItem key={Math.random()} isBtnProfile={true}
                              image={'https://ressources.trippybook.com/assets/user.png'}
                              photo={'https://ressources.trippybook.com/assets/user.png'} title="add story"
                />}
                {props.avatars.length ?
                    props.avatars.map((avatar: any) => (
                        avatar.visiteur_id.toString() === props.idCurrentUser ?
                            avatar.medias[0]?<StoryItem navigation={props.navigation} key={avatar.id} isBtnProfile={true}
                                       image={!loadingP?'https://ressources.trippybook.com/assets/' + avatar.medias[0].src:'https://ressources.trippybook.com/assets/user.png'}
                                       photo={!loadingP?'https://ressources.trippybook.com/assets/' + avatar.medias[0].src:'https://ressources.trippybook.com/assets/user.png'}
                                       title="Your story"
                                       clicked={() => _handleStoryItemPress(avatar,1)}/>:null :
                            <StoryItem navigation={props.navigation} title={avatar.visiteur.prenom} key={avatar.id}
                                       photo={'https://ressources.trippybook.com/assets/' + avatar.medias[0].src}
                                       image={'https://ressources.trippybook.com/assets/' + avatar.medias[0].src}
                                       clicked={() => _handleStoryItemPress(avatar,2)}/>
                    ))
                    : null}

                <Modal

                    animationType="slide"
                    style={styles.modal}
                    visible={isModalOpen}
                    onRequestClose={() => {
                        setIsModalOpen(false);
                    }}

                    // position="center"
                    //  swipeToClose
                    //  swipeArea={250}
                >
                    <Header style={{backgroundColor: colors.black, borderBottomWidth: 0}}>
                        <Left style={{flex: 1}}>

                        </Left>
                        <Body style={{flex: 3}}>
                        </Body>
                        <Right style={{flex: 1}}>
                            <TouchableOpacity
                                style={{ paddingHorizontal: 20, paddingVertical: 10, textAlign: 'right'}}
                                onPress={() => setIsModalOpen(false)}>
                                <Icon style={{color: colors.white, fontSize: 20}} name='close'/>
                            </TouchableOpacity>
                        </Right>
                    </Header>

                    <StoriesData dataStory={selectedStory}
                    />
                    {setIsMe?null:
                        <Footer style={{backgroundColor: '#000', justifyContent: 'flex-start'}}><TouchableOpacity
                        style={{backgroundColor: '#000'}} onPress={
                        () => handleOnPressLike(selectedStory.id, 1)
                    }>
                        <AnimatedIcon
                            name={'thumb-up'}
                            color={'#e4c560'}
                            size={32}
                            style={styles.icon}
                        />

                    </TouchableOpacity>
                        <TouchableOpacity style={{backgroundColor: '#000'}} onPress={
                            () => handleOnPressLike(selectedStory.id, 2)
                        }>
                            <AnimatedIcon
                                name={'heart'}
                                color={colors.darkRed}
                                size={32}
                                style={styles.icon}
                            />

                        </TouchableOpacity>
                        <TouchableOpacity style={{backgroundColor: '#000'}} onPress={
                            () => handleOnPressLike(selectedStory.id, 7)
                        }>
                            <AnimatedIcon
                                name={'thumb-down'}
                                color={'#e4c560'}
                                size={32}
                                style={styles.icon}
                            />

                        </TouchableOpacity></Footer>}
                </Modal>
            </View>
        </ScrollView>

        </>

    );
};
const styles = StyleSheet.create({
    contactContainerStyle: {
        marginRight: 5
    },
    modal: {
        height: Dimensions.get("window").height,
        width: Dimensions.get("window").width,
        flex: 1,
        backgroundColor: '#000'
    },
    icon: {
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
});
export default storyItems;
