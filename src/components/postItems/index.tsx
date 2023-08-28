import React, {useEffect} from 'react'
import {ActivityIndicator, Dimensions, FlatList, ScrollView, Text, View} from "react-native";
import PostItem from "./PostItem";
import posts from "~/utils/datas/posts";
import axios from "axios";
import {colors} from "~/utils/theme";
import styles from "~/screens/Comments/styles";
import {Content, Spinner} from "native-base";
import CommentItem from "~/components/commentItem";
import AsyncStorage from '@react-native-community/async-storage';

let token = ''
let id = ''
let photoUser = ''
const retrieveData = async () => {
    try {
        const value = await AsyncStorage.getItem('myToken');
        if (value !== null) {
            // We have data!!
            token = value;
            //  alert(token)

        }
    } catch (error) {
        console.log('erreur myToken' + error)// Error data
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

const PostItems: React.StatelessComponent = (props: any) => {
    useEffect(() => {

        retrieveData()
        retrieveDataId()
        retrieveDataPhoto()
    }, [])
    return (
        <View style={{flex: 1, flexDirection: 'column', marginTop: 13,backgroundColor:'#f5f5f5'}}>
            <Spinner color={colors.dark_gray}
                     style={[styles.spinner, {display: props.loading && props.myData.length === 0 ? 'flex' : 'none'}]}/>

            <Content padder style={{display: props.myData.length === 0 ? 'none' : 'flex'}}>
                <FlatList data={props.myData} renderItem={(post)=>(
                    props.myData.length ?
                        (post.item.src || post.item.medias.length > 0) ?
                            <PostItem
                                key={post.item.id}
                                idComment={post.item.id}
                                idAdresse={post.item.adresse_id}
                                idCurrentUser={id}
                                token={token}
                                idPoste={post.item.id}
                                likeDetail={post.item.jaimes}
                                likeCount={post.item.jaimes.length}
                                commentCount={post.item.commentaires.length}
                                visiteur={post.item.visiteur ? post.item.visiteur : null}
                                firstcomment={post.item.commentaires.length > 0 ? post.item.commentaires[(post.item.commentaires.length)-1].texte_com : ''}
                                shareCount={post.item.partages ? `${post.item.partages.length} Shares` : ''}
                                author={post.item.mediatable ? post.item.mediatable.adresse.rs : post.item.adresse.rs}
                                time={post.item.datetime}
                                avatar={post.item.mediatable ? 'https://ressources.trippybook.com/assets/' + post.item.mediatable.adresse.logo : 'https://ressources.trippybook.com/assets/' + post.item.adresse.logo}
                                image={post.item.src ? 'https://ressources.trippybook.com/assets/' + post.item.src : post.item.medias}
                                text={'text'}
                                isArrayMedia={post.item.src ? false : true}
                                isImage={post.item.type ? post.item.type == 1 ? true : false : post.item.medias[0].type == 1 ? true : false}
                                isVideo={post.item.type ? post.item.type == 2 ? true : false : post.item.medias[0].type == 2 ? true : false}
                                isText={post.item.type ? post.item.type == 3 ? true : false : post.item.medias[0].type == 3 ? true : false}
                                videoUrl={post.item.src ? 'https://ressources.trippybook.com/assets/' + post.item.src : 'https://ressources.trippybook.com/assets/' + post.item.medias[0].src}
                                navigation={props.navigation}/> : null: null
                )}/>

                <ActivityIndicator color={colors.dark_gray}
                         style={[styles.spinner, {display: props.loading && props.myData.length > 0 ? 'flex' : 'none'}]}/>
            </Content>

        </View>
    );
};
export default PostItems;