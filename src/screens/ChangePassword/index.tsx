import React, {useEffect} from "react";
import {Container, Content, Button, Footer, Spinner, Left, Body, Right, Header} from "native-base";
import {
    ActivityIndicator,


    KeyboardAvoidingView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import styles from "~/screens/Login/styles";
import LoginScreen from "react-native-login-screen";
import {SafeAreaView} from "react-navigation";
import {Image} from "react-native-elements";
import {colors} from "~/utils/theme";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

let token = ''
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

const ChangePassword = (props) => {

    const loadDataCurrentUser = async () => {

        try {
            const response = await axios.get(`https://api.trippybook.com/api/visiteur/currentUser`, {headers: {'Authorization': token}});
            if (response.status === 200) {
                console.log('loadDataCurrentUser' + Math.random());
                setData({
                    ...data,
                    visiteur: response.data.visiteur
                })
                setIsLoading(false)
            }
        } catch (error) {
            alert(error);
        }
    }
    useEffect(() => {
        retrieveData()
        setTimeout(()=>{loadDataCurrentUser()},1000)
    }, []);
    const [isLoading, setIsLoading] = React.useState(false)
    const [data, setData] = React.useState({
        visiteur: {},
        errorsValidation:{},
        hasError: false,
        err_confirm_password: "",
        err_current_password: "",
        err_new_paswword: "",
        confirm_password: "",
        current_password: "",
        new_paswword: "",
    })
    const handleChange = (name, val) => {
        setData({
            ...data,
            err_confirm_password: "",
            err_current_password: "",
            err_new_paswword: "",
            [name]: val

        })
        console.log(name + ' ' + val)
    }
    const connect = async () => {

        if (data.confirm_password != '' && data.current_password != '' && data.new_paswword != '') {
            setIsLoading(true);
            try {
                const response = await axios.post(`https://api.trippybook.com/api/visiteur/updatePassword`, data, {headers: {'Authorization': token}});
            
                setIsLoading(false);
                props.navigation.navigate('Profile');


            } catch (error) {
                if(error.response.data.errorsValidation.current_password) {
                    setData({...data, hasError: true, err_current_password: error.response.data.errorsValidation.current_password[0]})
                    console.log(data.err_current_password)
                }
                if(error.response.data.errorsValidation.confirm_password) {
                    setData({...data, hasError: true, err_confirm_password: error.response.data.errorsValidation.confirm_password[0]})
                    console.log(data.err_confirm_password)
                }

                if(error.response.data.errorsValidation.new_paswword) {
                    setData({...data, hasError: true, err_new_paswword: error.response.data.errorsValidation.new_paswword[0]})
                    console.log(data.err_new_paswword)
                }
                console.log(JSON.stringify(error.response.data.errorsValidation));
                setIsLoading(false);
            }
        } else {
            alert('les champs ne doit pas être vide')

        }
    }

    const goBack = () => {
        props.navigation.goBack();
    };
    return (
        <Container>
            <Header style={{backgroundColor: colors.white}}>
                <Left>
                    <Button transparent onPress={goBack}>
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
                        }}>{!data.visiteur ? null : data.visiteur.nom + ' ' + data.visiteur.prenom}</Text>
                    </TouchableOpacity>
                </Body>
                <Right>

                </Right>
            </Header>
            <ActivityIndicator color={colors.dark_gray}
                     style={[styles.spinner, {display: isLoading ? 'flex' : 'none'}]}/>
            <Content padder style={{display: isLoading ? 'none' : 'flex'}}>
                <SafeAreaView/>

                <View style={styles.inputZone}>

                    <TextInput value={data.current_password} underlineColorAndroid='transparent'
                               textContentType={'password'}
                               secureTextEntry={true}
                               autoCapitalize={'none'}
                               style={styles.inputStyle} onChangeText={(val) => handleChange('current_password', val)}
                               placeholder={'Current password '}/>
                </View>
                {data.err_current_password? <View style={[styles.inputZone,{  marginBottom: 0, marginTop: 0,}]}>
                    <Text style={{color:'red'}}>{data.err_current_password}</Text>
                </View>:null}
                <View style={styles.inputZone}>

                    <TextInput value={data.new_paswword} underlineColorAndroid='transparent'
                               textContentType={'password'}
                               secureTextEntry={true}
                               autoCapitalize={'none'}
                               style={styles.inputStyle} onChangeText={(val) => handleChange('new_paswword', val)}
                               placeholder={'New password'}/>
                </View>
                {data.err_new_paswword?  <View style={[styles.inputZone,{  marginBottom: 0, marginTop: 0,}]}>
                    <Text style={{color:'red'}}>{data.err_new_paswword}</Text>
                </View>:null}
                <View style={styles.inputZone}>

                    <TextInput value={data.confirm_password} underlineColorAndroid='transparent'
                               textContentType={'password'}
                               secureTextEntry={true}
                               autoCapitalize={'none'}
                               style={styles.inputStyle} onChangeText={(val) => handleChange('confirm_password', val)}
                               placeholder={'Confirm password'}/>
                </View>


                {data.err_confirm_password? <View style={[styles.inputZone,{  marginBottom: 0, marginTop: 0,}]}>
                   <Text style={{color:'red'}}>{data.err_confirm_password}</Text>
                </View>:null}
                <View style={styles.inputZone}>
                    <Button style={styles.btndark} onPress={() => {
                        connect()
                    }}>
                        <Text style={{
                            color: '#fff',
                            textAlign: 'center',textTransform: 'uppercase',letterSpacing:2,
                            width: '100%',
                            fontWeight: 'bold'
                        }}>Validate</Text>
                    </Button>
                </View>

            </Content>
        </Container>
    )

}
export default ChangePassword;