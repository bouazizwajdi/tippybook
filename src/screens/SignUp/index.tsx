import React from "react";
import {Body, Container, Content, Button, Footer, Header, Left, Right, Spinner, Title} from "native-base";
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
import styles from "~/screens/SignUp/styles";
import LoginScreen from "react-native-login-screen";
import {SafeAreaView} from "react-navigation";
import {Image} from "react-native-elements";
import {colors} from "~/utils/theme";
import axios from "axios";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SignUp = (props) => {
    const storeData = async (mytoken: any) => {
        try {
            await AsyncStorage.setItem(
                'myToken', mytoken
            );
        } catch (error) {
            alert(error)// Error saving data
        }
    };
    const storeDataId = async (idUser:any) => {
        try {
            await AsyncStorage.setItem(
                'idUser' ,idUser
            );
        } catch (error) {
            alert(error)// Error saving data
        }
    };
    const retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('myToken');
            if (value !== null) {
                // We have data!!
                //  alert(value);
            }
        } catch (error) {
            alert(error)// Error data
        }
    };
    const [isLoading, setIsLoading] = React.useState(false)
    const [data, setData] = React.useState({
        confirm_password: "",
        email: "",
        nom: "",
        password: "",
        prenom: "",
    })
    const handleChange = (name, val) => {
        setData({
            ...data,
            [name]: val
        })
    }
    const connect = async () => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
 
        if (data.email != '' && data.password != '' && data.password.length>=8) {
            if (reg.test(data.email) != false) {
                setIsLoading(true);
                try {
                    let id = ''
                    let token = ''
                  
                    const response = await axios.post(`https://api.trippybook.com/api/visiteur/register`, data);
              
                    if (response.status === 200) {
                        if(!response.data.success){
                            alert(JSON.stringify(response.data.errorsValidation))
                            return ;
                        }
                
                        token = response.data.token_type + ' ' + response.data.access_token
                       
                       alert("Compte crée à vérifier")
                        setIsLoading(false);
                      /*  const resCurrent = await axios.get('https://api.trippybook.com/api/visiteur/currentUser', {headers: {'Authorization': token}})
                   alert("connnnn "+JSON.stringify(resCurrent))
                        if (resCurrent.status === 200) {
                            id = resCurrent.data.id.toString()
                        }
                     //   alert(JSON.stringify(response.data))
                        storeData(token)
                        storeDataId(id)
                        retrieveData()
                        setIsLoading(false);
                        setData({
                            confirm_password: "",
                            email: "",
                            nom: "",
                            password: "",
                            prenom: "",
                        })
                        props.navigation.navigate('MapsView');

                   */ } else {
                         
                        console.log(JSON.stringify(response))
                        throw new Error("Invalid Credentials !");
                        setIsLoading(false);
                    }
                } catch (error) {
                
                   {
                    if (error.response) {
               console.log(JSON.stringify(error.response.data));
               console.log(JSON.stringify(error.response.status));
             console.log(JSON.stringify(error.response.headers));
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log('Error======'+ error);
            }
                }
                    setIsLoading(false);
                }


            } else {
                console.log("Email is not Correct");
            }

        } else {
            alert('Input Cant be null and password must be over 8 charcter')

        }
    }
    const goBack = () => {
        props.navigation.navigate('Login');
    };
    /*constructor(props: any) {
        super(props);
        this.state = {
            email: '',
            password: '',
        };
        this.connect = this.connect.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    connect(){
        this.setState({email: '', password: ''})
    }
    handleChange(text){
        this.setState({email: text})
    }*/

    return (
        <Container>

            <Header style={{backgroundColor: colors.white}}>

                <Body>
                    <TouchableOpacity onPress={goBack} style={{marginLeft: 4,position:'absolute',right:0}}>
                        <Icon style={{color: colors.black, fontSize: 32}}
                              name='chevron-left'/>
                    </TouchableOpacity>
                    <Text style={{color:'#000',textTransform: 'uppercase', textAlign: 'center', width: '100%', fontWeight: 'bold'}}>Sign
                        Up</Text>
                </Body>
            </Header>
            <ActivityIndicator color={colors.dark_gray}
                     style={[styles.spinner, {display: isLoading ? 'flex' : 'none'}]}/>
            <Content padder style={{display: isLoading ? 'none' : 'flex',backgroundColor:'#f5f5f5'}}>
                <SafeAreaView/>
                <View style={styles.imageContainer}>
                    <Image
                        style={styles.logo}
                        source={require('~/assets/images/logo.png')}
                    />
                </View>
                <View style={styles.inputZone}>

                    <TextInput value={data.nom} underlineColorAndroid='transparent' textContentType={'name'}
                               autoCapitalize={'none'}
                               style={styles.inputStyle} onChangeText={(val) => handleChange('nom', val)}
                               placeholder={'Your Last name'}/>
                </View>
                <View style={styles.inputZone}>

                    <TextInput value={data.prenom} underlineColorAndroid='transparent' textContentType={'name'}
                               autoCapitalize={'none'}
                               style={styles.inputStyle} onChangeText={(val) => handleChange('prenom', val)}
                               placeholder={'Your First name'}/>
                </View>
                <View style={styles.inputZone}>

                    <TextInput value={data.email} underlineColorAndroid='transparent' textContentType={'emailAddress'}
                               autoCapitalize={'none'}
                               style={styles.inputStyle} onChangeText={(val) => handleChange('email', val)}
                               placeholder={'Your email'}/>
                </View>
                <View style={styles.inputZone}>

                    <TextInput value={data.password} style={styles.inputStyle} underlineColorAndroid='transparent'
                               textContentType={'password'} secureTextEntry={true}
                               onChangeText={(val) => handleChange('password', val)} placeholder={'Your password'}/>

                </View>
                <View style={styles.inputZone}>

                    <TextInput value={data.confirm_password} style={styles.inputStyle}
                               underlineColorAndroid='transparent'
                               textContentType={'password'} secureTextEntry={true}
                               onChangeText={(val) => handleChange('confirm_password', val)}
                               placeholder={'Confirm password'}/>

                </View>
                <View style={styles.inputZone}>
                    <Button style={styles.btndark} onPress={() => {
                        connect()
                    }}>
                        <Text style={{color: '#fff',
                            textAlign: 'center',textTransform: 'uppercase',letterSpacing:2,
                            width: '100%', fontWeight: 'bold'}}>Sign
                            Up </Text>
                    </Button>
                </View>
                {/*  <LoginScreen
                        logoImageSource={require('~/assets/images/logo.png')}
                        onLoginPress={() => {this.connect()}}
                        onHaveAccountPress={() => {}}
                        onEmailChange={(email: string) => {
                            alert(email)
                            this.handleChange(email)
                        }}
                        onPasswordChange={(password: string) => {
                            this.handleChange(password)
                        }}
                    />*/}
            </Content>
        </Container>
    )

}
export default SignUp;