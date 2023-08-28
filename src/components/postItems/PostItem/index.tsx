import React from 'react';
import {
    TouchableOpacity, View,
    StyleSheet,
    Text,
    Image, Dimensions
} from "react-native";
import {colors} from "~/utils/theme";
import SvgUri from "react-native-svg-uri";
import {Avatar} from "react-native-elements";
import * as Animatable from 'react-native-animatable'
import Icon from 'react-native-vector-icons/AntDesign'
import Video from 'react-native-video';
import LinearGradient from "react-native-linear-gradient";
import {generateHiperlinkText} from "~/utils/methods";
import CommentItem from "~/components/commentItem";
import AvatarInput from "~/components/avatarInput";
import styles from "~/components/postItems/PostItem/styles";
import axios from "axios";

interface IPostItemProps {
    avatar: String,
    isArrayMedia: boolean,
    idPoste: any,
    idCurrentUser: any,
    firstcomment: String,
    visiteur: any,
    author: String,
    time: String,
    image: any,
    likeCount: any,
    likeDetail: any,
    commentCount: String,
    shareCount: String,
    videoUrl: string,
    text: String,
    isImage: boolean,
    isVideo: boolean,
    isText: boolean
}

const AnimatedIcon = Animatable.createAnimatableComponent(Icon);

class PostItem extends React.Component<IPostItemProps> {
    private player: any;

    constructor(props: IPostItemProps) {
        super(props);
        this.state = {
            likeCount: props.likeCount,
            liked1: false,
            liked2: false,
            liked7: false,
            paused: false
        };
        this.lastPress = 0
        this.blur = this.blur.bind(this);
        this.focus = this.focus.bind(this);
        if (this.props.isArrayMedia)
            console.log(JSON.stringify(this.props.image))


    }

    componentDidMount(): void {
        if (this.props.likeDetail.length) {
            this.props.likeDetail.map((likeD: any) => {
                    if (likeD.visiteur_id == this.props.idCurrentUser) {
                       
                        let liked = 'liked' + likeD.reaction_type
                        this.setState({[liked]: true})
                    }
                }
            )

        }
    }

    handleLargeAnimatedIconRef = (ref: any) => {
        this.largeAnimatedIcon = ref
    };

    handleSmallAnimatedIconRef = (ref: any) => {
        this.smallAnimatedIcon = ref
    };

    animateIcon = () => {
        const {liked2} = this.state;
        this.largeAnimatedIcon.stopAnimation();

        if (liked2) {
            this.largeAnimatedIcon.bounceIn()
                .then(() => this.largeAnimatedIcon.bounceOut())
            this.smallAnimatedIcon.pulse(200)
        } else {
            this.largeAnimatedIcon.bounceIn()
                .then(() => {
                    this.largeAnimatedIcon.bounceOut()
                    this.smallAnimatedIcon.bounceIn()
                })
                .then(() => {
                    if (!liked2) {
                        this.handleOnPressLike('2')
                        //  this.setState(prevState => ({liked2: !prevState.liked2}))
                    }
                })
        }
    };

    handleOnPress = () => {
        const time = new Date().getTime();
        const delta = time - this.lastPress;
        const doublePressDelay = 400;
        if (delta < doublePressDelay) {
            this.animateIcon()
        }
        this.lastPress = time
    };
    deleteDataLike = async () => {
        const res = await axios.post('https://api.trippybook.com/api/visiteur/jaime/delete', {
            post_id: this.props.idPoste,
            jaimable_type: "App\\Models\\Publication",
            visiteur_id: this.props.idCurrentUser
        }, {headers: {'Authorization': this.props.token}})
        if (res.status == 200) {
         
            this.smallAnimatedIcon.bounceIn();
            this.setState({liked1: false, liked2: false, liked7: false, likeCount: this.state.likeCount - 1})
        }
    }
    handleOnPressLike = async (reaction_type) => {
        let liked = 'liked' + reaction_type
        try {
            if (this.props.token !== '' && this.props.idCurrentUser != '') {
                if (this.state.liked1 || this.state.liked2 || this.state.liked7) {
                    this.deleteDataLike();
                }
                
                if ((!this.state.liked1 && reaction_type == 1) || (!this.state.liked2 && reaction_type == 2) || (!this.state.liked7 && reaction_type == 7)) {
                    const res = await axios.post('https://api.trippybook.com/api/visiteur/jaime', {
                        jaimable_id: this.props.idPoste,
                        jaimable_type: "App\\Models\\Publication",
                        reaction_type: reaction_type,
                        visiteur_id: this.props.idCurrentUser
                    }, {headers: {'Authorization': this.props.token}});
                    if (res.status == 200) {
                      
                        this.smallAnimatedIcon.bounceIn();
                        this.setState({[liked]: true, likeCount: this.state.likeCount + 1});
                    }

                }
            }


        } catch (error) {
            if (error.response) {
                console.log(JSON.stringify(error.response.data));
                console.log(JSON.stringify(error.response.status));
                console.log(JSON.stringify(error.response.headers));
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log('Error======', error.message);
            }
        }

    };

    onBuffer = () => {
        console.log("Buffer");
    };
    onError = () => {
        console.log("Unable to load video");
    };
    blur = () => this.props.navigation.addListener('blur', () => {
        this.setState({paused: true})
    });

    focus = () => this.props.navigation.addListener('focus', () => {
        this.setState({paused: false})
    });

    openComments(id) {
      
        this.props.navigation.navigate('Comments', {
            idPoste: id
        });
    };

    render() {
        const {
            idComment,
            idAdresse,
            avatar,
            author,
            image,
            likeCount,
            likeDetail,
            commentCount,
            firstcomment,
            idPoste,
            visiteur,
            isImage,
            isArrayMedia,
            isVideo,
            isText,
            token,
            videoUrl
        } = this.props;
        let imageHtml=null
        const {liked1, liked2, liked7, paused} = this.state;
      
        if(isImage && isArrayMedia) imageHtml = image.map((img, i) => {
            return (
                <Image key={Math.random()} source={{uri: 'https://ressources.trippybook.com/assets/' + img.src}}
                       resizeMode={'cover'}
                       style={{width: Dimensions.get('window').width, height: 270, position: 'relative'}}/>
            );
        });
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={this.handleOnPress}>

                    <View style={styles.cardHeader}>
                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                            <LinearGradient
                                colors={[colors.turkois, colors.extraLightRed, colors.orangeLight]}
                                style={{
                                    height: 50,
                                    width: 50,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 25,
                                    marginLeft: 1
                                }}
                            >
                                <TouchableOpacity>
                                    <View style={styles.containerProfilePhoto}>
                                        <Image
                                            resizeMode={'cover'}
                                            containerStyle={styles.avatar}
                                            style={{width: 46, height: 46, borderRadius: 23,}}
                                            rounded
                                            // size={"medium"}
                                            source={{uri: avatar}}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>
                        <View style={styles.statContainer}>
                            <TouchableOpacity onPress={() =>
                                this.props.navigation.navigate('HomeList', {idAdr: idAdresse})
                            }>
                                <Text style={styles.postAuthor}>{author}</Text>

                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={{alignSelf: 'flex-end', flex: 1}}>
                            <SvgUri source={require('~/assets/svg/more.svg')} style={styles.buttonMore}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        paddingLeft: isText ? 20 : 0, justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <AnimatedIcon
                            ref={this.handleLargeAnimatedIconRef}
                            name="heart"
                            color={colors.white}
                            size={80}
                            style={styles.animatedIcon}
                            duration={500}
                            delay={200}
                        />
                        {isImage ?
                            isArrayMedia ?
                                imageHtml : <Image source={{uri: image}} resizeMode={'cover'}
                                                   style={{
                                                       width: Dimensions.get('window').width,
                                                       height: 270,
                                                       position: 'relative'
                                                   }}/> : null}
                        {isVideo ?
                            <><Video source={{uri: videoUrl}}   // Can be a URL or a local file.
                                     ref={(ref: any) => {
                                         this.player = ref
                                     }}
                                     paused={paused}
                                     onLoad={() => {
                                         this.setState({
                                             paused: true
                                         });
                                     }}
                                     controls={false}
                                     onBuffer={this.onBuffer}                // Callback when remote video is buffering
                                     onError={this.onError}               // Callback when video cannot be loaded
                                     style={{
                                         width: Dimensions.get('window').width,
                                         height: 270,
                                         position: 'relative'
                                     }}/>
                                <TouchableOpacity style={{
                                    position: 'absolute',
                                    left: 5,
                                    bottom: 35,
                                    backgroundColor: '#fff',
                                    padding: 5,
                                    borderRadius: 50
                                }} onPress={() => {
                                    this.setState({
                                        paused: !paused
                                    });
                                }}><Icon name={paused ? 'play' : 'pause'} style={{fontSize: 28}}/></TouchableOpacity></>

                            : null}
                    </View>
                    {visiteur &&
                    <>
                        <View style={styles.cardActionContainer}>

                            <TouchableOpacity>
                                <AnimatedIcon
                                    ref={this.handleSmallAnimatedIconRef}
                                    name={liked1 ? 'like1' : 'like2'}
                                    color={liked1 ? '#e4c560' : colors.black}
                                    size={26}
                                    onPress={() => this.handleOnPressLike('1')}
                                    style={styles.icon}
                                />

                            </TouchableOpacity>
                            <TouchableOpacity style={{marginLeft: 16}}>
                                <AnimatedIcon
                                    ref={this.handleSmallAnimatedIconRef}
                                    name={liked2 ? 'heart' : 'hearto'}
                                    color={liked2 ? colors.darkRed : colors.black}
                                    size={26}
                                    onPress={() => this.handleOnPressLike('2')}
                                    style={styles.icon}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginLeft: 16}}>
                                <AnimatedIcon
                                    ref={this.handleSmallAnimatedIconRef}
                                    name={liked7 ? 'dislike1' : 'dislike2'}
                                    color={liked7 ? '#e4c560' : colors.black}
                                    size={26}
                                    onPress={() => this.handleOnPressLike('7')}
                                    style={styles.icon}
                                />

                            </TouchableOpacity>
                            <TouchableOpacity style={{marginLeft: 16}}>
                                <Image style={{width: 26, height: 26}}
                                       source={require('~/assets/images/comment.png')}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginLeft: 16, marginTop: 2}}>
                                <Image style={{width: 26, height: 26}}
                                       source={require('~/assets/images/direct.png')}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.flexEndAligned}>
                                <Image style={{width: 22, height: 25}}
                                       source={require('~/assets/images/collection.png')}/>
                            </TouchableOpacity>

                        </View>
                        <View style={styles.cardStatsCounter}>
                            <View style={{ flexGrow: 1}}>
                                <Text style={styles.likeCounter}>{this.state.likeCount} Likes</Text>
                                {commentCount > 0 ? <TouchableOpacity>
                                    <Text onPress={() => this.openComments(idPoste)}
                                          style={styles.viewMoreBtn}> View {`${commentCount} comments`}</Text>
                                </TouchableOpacity> : <Text>0 comments</Text>}
                                {visiteur &&
                                <CommentItem token={token} linesType="singleLine" idComment={idComment} context="Home"
                                             NumberOfLines={1} visiteur_id={visiteur.id} author={visiteur.prenom}
                                             message={firstcomment} createdAt={visiteur.created_at}/>}
                                <AvatarInput idPoste={idPoste} style={{ position:'absolute', flexGrow: 1,width: Dimensions.get('window').width}}/>
                            </View>
                        </View>
                    </>
                    }
                </TouchableOpacity>
            </View>
        );
    }
}

export default PostItem;
