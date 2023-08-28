import React from 'react'
import {StyleSheet, TouchableOpacity, View} from "react-native";
import {Image, Text} from "react-native-elements";
import {Button, Header, Left, Right, Title, Body} from 'native-base'
import {colors} from "~/utils/theme";

const HeaderToolbar: React.StatelessComponent = (props: any) => {

    return (
        <Header style={{backgroundColor: colors.white}}>

            <Body style={{display:'flex',justifyContent:'center',alignContent:'center',flexDirection:'row'}}>
                {props.context == 'HomeList' ?
                    <Button transparent style={{marginLeft: 4,position:'absolute',right:0}}>
                        <TouchableOpacity onPress={props.onClicked}>
                            <Image style={{width: 32, height: 28}}
                                   source={require('~/assets/images/chevron_left.png')}/>
                        </TouchableOpacity>
                    </Button> : null}
                    <TouchableOpacity >
                    {props.context == 'Home' || props.context == 'HomeList' ?
                        <Image
                            style={{width:125,height:25}}
                            source={require('~/assets/images/logo.png')}
                        /> :
                        <Text style={{textAlign:'center',fontWeight:'bold'}}>{props.context}</Text>
                    }
                </TouchableOpacity>
            </Body>

        </Header>

    );
};
export default HeaderToolbar;
