import React, {useState} from "react";
import {View, StyleSheet, TouchableOpacity, Image, FlatList} from "react-native";
import {Avatar, Text} from "react-native-elements";
import AsyncStorage from '@react-native-community/async-storage';
import {colors} from "~/utils/theme";
import styles from "~/components/commentItem/styles";
import Icon from "react-native-vector-icons/Feather";
import {Button} from "native-base";
import axios from "axios";

let idCurrentUser = ''
const retrieveDataId = async () => {
    try {
        const value = await AsyncStorage.getItem('idUser');
        if (value) {
            // We have data!!
            idCurrentUser = value
        }
    } catch (error) {
        alert(error)// Error data
    }
};
retrieveDataId()
const CommentItem: React.StatelessComponent = (props: any) => {
    const [showList, setShowList] = useState(false)
    const onPress = () => {
        let notShow = !showList
        setShowList(notShow)
    }
    const getDiffDate = (date: any) => {
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
        else
            return Math.floor((Math.abs(date2 - date1)) / (1000 * 60 * 60)) + ' hours';
    }
    const deleteAction = async () => {
        try {
            let response = await axios.delete(`https://api.trippybook.com/api/visiteur/commentaire/` + props.idComment, {headers: {'Authorization': props.token}});
            if (response.status === 200) {
                console.log(JSON.stringify(response.data.message))
            }
        } catch (error) {
            console.log('erreur ws method delete https://api.trippybook.com/api/visiteur/commentaire/' + props.idComment);
        }
    }
    const editAction = async () => {
        try {
            let response = await axios.put(`https://api.trippybook.com/api/visiteur/commentaire/` + props.idComment, {headers: {'Authorization': props.token}});
            if (response.status === 200) {
                console.log(JSON.stringify(response.data.message))
            }
        } catch (error) {
            console.log('erreur ws method put https://api.trippybook.com/api/visiteur/commentaire/' + props.idComment);
        }
    }
    return (
        <View>
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    marginTop: 10,
                    marginLeft: props.context !== 'Home' ? 20 : 4,
                    marginRight: props.context !== 'Home' ? 20 : 4
                }}>
                {props.context !== 'Home' ?
                    <TouchableOpacity style={{justifyContent: 'center'}}>
                        <Image
                            containerStyle={styles.avatarStyle}
                            style={{width: 30, height: 30, borderRadius: 15,}}
                            rounded
                            source={{uri: 'https://ressources.trippybook.com/assets/' + props.photo}}
                        />
                    </TouchableOpacity> : null}
                {props.message ? <TouchableOpacity
                    onPress={props.clicked}><Text
                    numberOfLines={props.linesType == "multilines" ? props.numberOfLines : 1}
                    style={Object.assign({}, styles.commentRow, {marginLeft: props.context !== 'Home' ? 23 : 0})}><Text
                    style={styles.author}>@{props.author}</Text>{` ${props.message}`}</Text></TouchableOpacity> : null}
            </View>
            <View style={styles.cardStatsCounter}>
                <View style={Object.assign({}, styles.flexStartAligned, {flex: 7})}>
                    <Text style={styles.hour}>{getDiffDate(props.createdAt)}</Text>
                    {props.likeCount > 0 ? <Text style={styles.likes}>{props.likeCount} Likes</Text> : null}
                    <TouchableOpacity>
                        <Text style={styles.commentCounter}>Reply</Text>
                    </TouchableOpacity>

                </View>
                <View style={{position: 'relative', float: 'right'}}>
                    {props.visiteur_id == idCurrentUser &&
                    <Icon name={'more-horizontal'} style={{fontSize: 20, textAlign: 'right',}} onPress={onPress}/>}
                    {(showList) && <FlatList style={{
                        position: 'relative',
                        backgroundColor: "#eee",
                        width: 55,
                        top: 0,
                        float: 'right',
                        // right: 0,
                        zIndex: 999,
                        borderWidth: 1,
                        borderColor: '#ddd'
                    }}
                                             data={[{key: 'Edit'}, {key: 'Delete'}]}
                                             renderItem={({item}) =>
                                                 <TouchableOpacity onPress={
                                                     item.key == 'Delete' ? deleteAction : editAction}>
                                                     <Text style={{
                                                         padding: 5,
                                                         textAlign: 'center',
                                                         borderBottomWidth: 1,
                                                         borderBottomColor: '#ddd'
                                                     }}>{item.key}</Text>
                                                 </TouchableOpacity>}
                    />}
                </View>
            </View>
            {

                props.context != 'Home' && props.canReply ? (
                    <View>
                        <View style={styles.replyContainer}>
                            <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'center'}}>
                                <View style={{
                                    width: 25,
                                    height: 2,
                                    backgroundColor: colors.dark_gray,
                                    alignSelf: 'center'
                                }}/>
                                <Text style={{
                                    marginLeft: 10, fontSize: 13,
                                    fontWeight: 'bold',
                                    color: colors.dark_gray
                                }}>Hide replies</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{marginLeft: 30}}>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                marginLeft: props.context !== 'Home' ? 20 : 4,
                                marginRight: props.context !== 'Home' ? 20 : 4
                            }}>
                                {props.context !== 'Home' ? <TouchableOpacity style={{justifyContent: 'center'}}>
                                    <Avatar
                                        containerStyle={styles.avatarStyle}
                                        rounded
                                        source={{uri: 'https://ressources.trippybook.com/assets/' + props.photo}}

                                    />
                                </TouchableOpacity> : null}
                                <Text numberOfLines={props.linesType == "multilines" ? props.numberOfLines : 1}
                                      style={Object.assign({}, styles.commentRow, {marginLeft: props.context !== 'Home' ? 23 : 0})}><Text
                                    style={styles.author}>@{props.author}</Text>{` ${props.message}`}</Text>
                            </View>
                            <View style={styles.cardStatsCounter}>
                                <View style={Object.assign({}, styles.flexStartAligned, {flex: 7})}>
                                    <Text style={styles.hour}>7h</Text>
                                    <Text style={styles.likes}>12 Likes</Text>
                                    <TouchableOpacity>
                                        <Text style={styles.commentCounter}>Reply</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                ) : null
            }

        </View>

    );
};

export default CommentItem;
