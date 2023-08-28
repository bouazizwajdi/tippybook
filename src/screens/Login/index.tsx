import React from "react";
import {Container, Content, Button, Footer, Spinner} from "native-base";
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

const Login = (props) => {
    const storeData = async (mytoken: any) => {
        try {
            await AsyncStorage.setItem(
                'myToken', mytoken
            );
        } catch (error) {
            alert(error)// Error saving data
        }
    };
    const storeDataId = async (idUser: any) => {
        try {
            await AsyncStorage.setItem(
                'idUser', idUser
            );
        } catch (error) {
            alert(error)// Error saving data
        }
    };
    const storeDataPhoto = async (photo: any) => {
        try {
            await AsyncStorage.setItem(
                'photo', photo
            );
        } catch (error) {
            alert(error)// Error saving data
        }
    };
    const clearAll = async () => {
        try {
            await AsyncStorage.clear()
        } catch (e) {
            // clear error
        }

        console.log('Done.')
    }
    const retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('myToken');
            if (value) {
                // We have data!!
                console.log(JSON.stringify(value))
                console.log('value');
            }
        } catch (error) {
            alert(error)// Error data
        }
    };
    const retrieveDataId = async () => {
        try {
            const value = await AsyncStorage.getItem('idUser');
            if (value) {
                // We have data!!
                console.log( value)
            }
        } catch (error) {
            alert(error)// Error data
        }
    };
    const retrieveDataPhoto = async () => {
        try {
            const photo1 = await AsyncStorage.getItem('photo');

            if (photo1) {
                // We have data!!
                console.log(photo1)
            }
        } catch (error) {
            alert(error)// Error data
        }
    };
    const [isLoading, setIsLoading] = React.useState(false)
    const [data, setData] = React.useState({
        email: 'visiteur2@gmail.com', password: '123456789'
    })
    const handleChange = (name, val) => {
        setData({
            ...data,
            [name]: val
        })
    }
    const connect = async () => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

        if (data.email != '' && data.password != '') {
            if (reg.test(data.email) != false) {
                 clearAll()
                setIsLoading(true);
                try {
                    let id = ''
                    let token = ''
                    let photoUser = ''
                    const response = await axios.post(`https://api.trippybook.com/api/visiteur/login`, data);
                    // alert(response.status)
                    if (response.status === 200) {
                        // alert(` You have created: ${JSON.stringify(response.data)}`);
                        token = response.data.token_type + ' ' + response.data.access_token
                        const resCurrent = await axios.get('https://api.trippybook.com/api/visiteur/currentUser', {headers: {'Authorization': token}})
                        if (resCurrent.status === 200) {
                           // alert(JSON.stringify(resCurrent.data.visiteur.id))
                            id = resCurrent.data.visiteur.id.toString()
                            photoUser = resCurrent.data.visiteur.photo
                        }

                        storeData(token)
                        storeDataId(id)
                        storeDataPhoto(photoUser)
                        retrieveData()
                        retrieveDataId()
                        retrieveDataPhoto()
                        setIsLoading(false);
                        setData({password: '', email: ''})
                        props.navigation.navigate('MapsView');

                    } else {
                        throw new Error("Invalid Credentials !");
                    }
                } catch (error) {
                    alert(error);
                    setIsLoading(false);
                }


            } else {
                alert("Email is not Correct");
            }

        } else {
            alert('les champs ne doit pas être vide')

        }
    }
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
            <ActivityIndicator color={colors.dark_gray}
                     style={[styles.spinner, {display: isLoading ? 'flex' : 'none'}]}/>
            <Content padder style={{display: isLoading ? 'none' : 'flex'}}>
                <SafeAreaView/>
                <View style={styles.imageContainer}>
                    <Image
                        style={styles.logo}
                        source={require('~/assets/images/logo.png')}
                    />
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
                    <Button style={styles.btndark} onPress={() => {
                        connect()
                    }}>
                        <Text style={{
                            color: '#fff',
                            textAlign: 'center',textTransform: 'uppercase',letterSpacing:2,
                            width: '100%',
                            fontWeight: 'bold'
                        }}>Connexion</Text>
                    </Button>
                </View>
                <View style={styles.inputZone}>
                    <TouchableOpacity onPress={() => {
                        props.navigation.navigate('SignUp');
                    }}>
                        <Text style={{fontWeight: 'bold', fontSize: 15, color: 'gray'}}>I don't have an account yet Sign
                            up</Text>
                    </TouchableOpacity>
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
export default Login;