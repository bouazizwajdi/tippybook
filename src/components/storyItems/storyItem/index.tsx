import React, {useState} from 'react'
import {StyleSheet, TouchableOpacity, View, Text, Dimensions, Modal} from "react-native";
import {Avatar} from 'react-native-elements';
import {colors} from "~/utils/theme";
import LinearGradient from "react-native-linear-gradient";
import SvgUri from "react-native-svg-uri";
import styles from "~/components/storyItems/storyItem/styles";
import CameraType from "~/cameraType";
import * as ImagePicker from "react-native-image-picker";
import {Body, Button, Header, Left, Right} from "native-base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const StoryItem: React.StatelessComponent = (props: any) => {
    const [openModal, setOpenModal] = useState(false)
    return (
        <>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <LinearGradient
                    colors={props.title == 'add story' ? ['transparent', 'transparent'] : [colors.turkois, colors.extraLightRed, colors.orangeLight]}
                    style={{
                        height: 76,
                        width: 76,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 38,
                        marginLeft: 15
                    }}
                >
                    <TouchableOpacity onPress={props.clicked}>
                        <View style={styles.container}>
                            <Avatar rounded size="large"
                                    containerStyle={styles.avatar}
                                    source={{uri: props.image}}
                            />
                            {props.title == 'add story'  ? <View style={styles.btnPlusBg}>
                                <TouchableOpacity onPress={() => setOpenModal(true)}>
                                    <SvgUri style={styles.btnPlus} source={require('~/assets/svg/plus.svg')}/>
                                </TouchableOpacity>
                            </View> : null}
                        </View>
                    </TouchableOpacity>
                </LinearGradient>

                <Text style={styles.profileName}>{props.title}</Text>

            </View>

            <Modal
                style={{
                    height: Dimensions.get("window").height,
                    width: Dimensions.get("window").width,
                    flex: 1, position: "absolute", zIndex: 1, borderWidth: 1,
                }}
                transparent={true}
                animationType="slide"
                visible={openModal}
                onRequestClose={() => {
                    setOpenModal(false);
                }}
            >
                <Header style={{backgroundColor: colors.white, borderBottomWidth: 0}}>
                    <Left style={{flex: 1}}>

                    </Left>
                    <Body style={{flex: 3}}>
                        <Text style={{fontWeight: 'bold', textAlign: 'center', width: '100%',}}>Add story</Text>
                    </Body>
 
                    <Right  style={{flex:1,marginTop:50}}>

                        <Button transparent onPress={() => setOpenModal(false)}>
                            <Icon style={{color: colors.white, fontSize: 70}} name='close'/>
                        </Button>
                    </Right>
                </Header>
                <CameraType goBack={()=>setOpenModal(false)}/>
            </Modal>
        </>
    );

};

export default StoryItem;
