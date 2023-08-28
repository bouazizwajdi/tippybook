import React from 'react';
import {
    View,
    RefreshControl,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    TextInput, Dimensions, ActivityIndicator
} from "react-native";
import Separator from "~/components/separator";
import CommentItem from "~/components/commentItem/index";
import {
    Button,
    Text,
    Container,
    Header,
    Body,
    Content,
} from "native-base";
import AsyncStorage from '@react-native-community/async-storage';
import {colors} from "~/utils/theme";
import {Avatar, Image} from "react-native-elements";
import CommentsEmojis from "~/utils/datas/emojis";
import styles from "~/screens/Comments/styles";
import PostComments from "~/utils/datas/postComments";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from "axios";
import AvatarInput from "~/components/avatarInput";

export default class Comments extends React.PureComponent<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            author: {},
            commentaires: [],
            refreshing: false,
            setRefreshing: false,
            loading: true,
            isModalOpen: false,
            orderedStories: null,
            selectedStory: null,
            commentaire: '',
            photoUser: '',
            id: '',
            token: '',
            page: 1,
            last: 1,
            idPoste: props.navigation.state.params.idPoste
        };
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

    componentDidMount(): void {

        this.retrieveData()
        this.retrieveDataId()
        this.retrieveDataPhoto()
        this.wait(2000).then(() => {
            this.loadData()
        });
    }

    wait = (timeout: number) => {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    };

    onRefresh = () => {
        this.setState({setRefreshing: true});
        this.wait(2000).then(() => {
            this.setState({setRefreshing: false});
        });
    };

    goBack = () => {
        this.props.navigation.goBack();
    };
    handleChange = (val: string) => {
        this.setState({commentaire: val})
    }
    comment = async () => {

        if (this.state.token !== '' && this.state.id !== '') {
            if (this.state.commentaire != '') {
                try {
                    const response = await axios.post(`https://api.trippybook.com/api/visiteur/commentaire`, {
                        commentable_id: this.state.idPoste,
                        commentable_type: "App\\Models\\Publication",
                        reaction_type: 1,
                        taggedAdresses: [],
                        taggedFriends: [],
                        texte_com: this.state.commentaire,
                        visiteur_id: this.state.id,

                    }, {headers: {'Authorization': this.state.token}});
                    // alert(response.status)
                    if (response.status === 200) {
                        console.log(JSON.stringify(response.data));
                        this.setState({commentaire: ''})
                    }
                } catch (error) {
                    console.log(error);
                }

            } else {
                alert('les champs ne doit pas être vide')

            }
        }
    }
    loadData = async () => {
        if (this.state.token !== '') {
            console.log(this.state.page)
            try {
                const response = await axios.get(`https://api.trippybook.com/api/visiteur/commentaire/${this.state.idPoste}/Publication?page=${this.state.page}`, {headers: {'Authorization': this.state.token}});
                // const response = await axios.get(`https://api.trippybook.com/api/visiteur/commentaire/14/Publication?page=1`, {headers: {'Authorization': this.state.token}});
                if (response.status === 200) {
                    //  alert(JSON.stringify(response.data))
                    if (this.state.page == 1) {
                        this.setState({
                            commentaires: response.data.commentaires.data,
                            last: response.data.commentaires.last_page
                        }, () => {
                            this.setState({loading: false});
                        })
                    } else if (this.state.page <= this.state.last) {
                        //alert(JSON.stringify(response.data))
                        this.setState({
                            commentaires: this.state.commentaires.concat(response.data.commentaires.data)
                        }, () => {
                            this.setState({loading: false});
                        })
                    }
                    // alert('success');
                }
            } catch (error) {
                alert(error);
            }
        }
    }

    render() {
        const {refreshing} = this.state;
        return (
            <Container>
                <Header style={{backgroundColor: colors.white}}>

                    <Body style={{display:'flex',justifyContent:'center',alignContent:'center',flexDirection:'row'}}>
                        <Button transparent onPress={this.goBack} style={{marginLeft: 4,position:'absolute',right:0}}>
                            <Icon style={{color: colors.black, fontSize: 32}}
                                  name='chevron-left'/>
                        </Button>
                        <Text style={{textAlign:'center',fontWeight:'bold',textTransform:'uppercase'}}>Comments</Text>
                    </Body>

                </Header>
                <Content>
                    <ScrollView
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={() => this.onRefresh}/>
                        }
                        contentInsetAdjustmentBehavior="automatic"
                        style={styles.scrollView}>
                        <ActivityIndicator color={colors.dark_gray}
                                 style={[styles.spinner, {display: this.state.loading ? 'flex' : 'none'}]}/>
                        <Content padder style={{display: this.state.loading ? 'none' : 'flex'}}>
                            {this.state.last > this.state.page ? <TouchableOpacity onPress={() => {
                                this.setState({page: this.state.page + 1}, () => {
                                    this.setState({loading: true});
                                    this.wait(2000).then(() => {
                                        this.loadData()
                                    });
                                })
                            }}><Text>See previous comments</Text></TouchableOpacity> : null}
                            {this.state.loading ? null : this.state.commentaires.map((comment: any) => (
                                <CommentItem clicked={() => {
                                    if (comment.visiteur_id != this.state.id) {
                                        this.props.navigation.navigate('ProfileVisiteur', {idVisiteur: comment.visiteur_id})
                                    }
                                }} key={comment.id} idComment={comment.id} linesType="multilines"
                                             createdAt={comment.visiteur.created_at} visiteur_id={comment.visiteur_id}
                                             context="Comments" NumberOfLines={1} likeCount={comment.jaimes.length}
                                             author={comment.visiteur.nom + ' ' + comment.visiteur.prenom}
                                             message={comment.texte_com} avatar={true} photo={comment.visiteur.photo}/>
                            ))}
                            <Separator/>
                            <AvatarInput idPoste={this.state.idPoste} style={{
                                position: 'absolute',
                                flexGrow: 1,
                                width: Dimensions.get('window').width,
                                zIndex: 1
                            }}/>
                        </Content>
                    </ScrollView>
                </Content>
                {/* <Footer style={styles.footer}>
                        <View style={styles.cardStatsCounter}>
                        <View style={{ flexGrow: 1}}>
                                <TouchableOpacity style={{justifyContent: 'center'}}>
                                    <Avatar
                                        size="large"
                                        containerStyle={styles.avatarStyle}
                                        rounded
                                        source={{uri: 'https://ressources.trippybook.com/assets/' + this.state.photoUser}}
                                    />
                                </TouchableOpacity>
                                <TextInput underlineColorAndroid='transparent' style={styles.inputStyle}
                                           onChangeText={(val) => this.handleChange(val)}
                                           placeholder='Add a comment...' placeholderTextColor={colors.light_gray}
                                           value={this.state.commentaire}
                                /><Button transparent onPress={this.comment}><Text>send</Text></Button>

                        </View>
                        </View>
                </Footer>*/}
            </Container>
        );
    }
}

