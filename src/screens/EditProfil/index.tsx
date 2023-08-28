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
import styles from "~/screens/Login/styles";
import LoginScreen from "react-native-login-screen";
import {SafeAreaView} from "react-navigation";
import {Image} from "react-native-elements";
import {colors} from "~/utils/theme";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from '@react-native-community/async-storage';
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
const EditProfil = (props) => {

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
        setTimeout(() => {
            loadDataCurrentUser()
        }, 1000)
    }, []);
    const [isLoading, setIsLoading] = React.useState(false)
    const [data, setData] = React.useState({
        visiteur: {}
    })
    const handleChange = (name, val) => {
        setData({
            visiteur: {
                ...data.visiteur,
                [name]: val
            }
        })
        console.log(name + ' ' + val)
    }
    const password = () => {
        props.navigation.navigate('ChangePassword')
    }
    const connect = async () => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

        if (data.visiteur.nom != '' && data.visiteur.prenom != '' && data.visiteur.tel != '' && data.visiteur.email != '' && data.visiteur.adresse != '') {
            if (reg.test(data.visiteur.email) != false) {
                setIsLoading(true);
                try {
                    const response = await axios.post(`https://api.trippybook.com/api/visiteur/profil/update`, data.visiteur, {headers: {'Authorization': token}});
                    if (response.status === 200) {
                        // alert(response.data.message)
                        setIsLoading(false);
                        props.navigation.navigate('Profile');

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
            <Content padder style={{display: isLoading ? 'none' : 'flex', backgroundColor: '#f5f5f5'}}>
                <View style={{display: 'flex', flexDirection: 'column', alignContent: 'center', alignItems: 'center'}}>
                    <SafeAreaView/>
                    <View style={styles.imageContainer}>
                        <Image
                            style={styles.avatarStyle}
                            source={{uri: 'https://ressources.trippybook.com/assets/' + data.visiteur.photo}}
                        />
                    </View>
                    <View style={styles.inputZone}>

                        <TextInput value={data.visiteur.nom} underlineColorAndroid='transparent'
                                   textContentType={'familyName'}
                                   autoCapitalize={'none'}
                                   style={styles.inputStyle} onChangeText={(val) => handleChange('nom', val)}
                                   placeholder={'Your last name'}/>
                    </View>
                    <View style={styles.inputZone}>

                        <TextInput value={data.visiteur.prenom} underlineColorAndroid='transparent'
                                   textContentType={'name'}
                                   autoCapitalize={'none'}
                                   style={styles.inputStyle} onChangeText={(val) => handleChange('prenom', val)}
                                   placeholder={'Your first name'}/>
                    </View>

                    <View style={styles.inputZone}>

                        <TextInput value={data.visiteur.email} underlineColorAndroid='transparent'
                                   textContentType={'emailAddress'}
                                   autoCapitalize={'none'}
                                   style={styles.inputStyle} onChangeText={(val) => handleChange('email', val)}
                                   placeholder={'Your email'}/>
                    </View>
                    <View style={styles.inputZone}>

                        <TextInput value={data.visiteur.tel} underlineColorAndroid='transparent'
                                   textContentType={'telephoneNumber'}
                                   autoCapitalize={'none'}
                                   style={styles.inputStyle} onChangeText={(val) => handleChange('tel', val)}
                                   placeholder={'Your phone'}/>
                    </View>
                    <View style={styles.inputZone}>

                        <TextInput value={data.visiteur.adresse} underlineColorAndroid='transparent'
                                   textContentType={'addressCityAndState'}
                                   autoCapitalize={'none'}
                                   style={styles.inputStyle} onChangeText={(val) => handleChange('adresse', val)}
                                   placeholder={'Your address'}/>
                    </View>
                    <View style={[styles.inputZone]}>
                        <Button bordered dark
                                style={[styles.btndark, {
                                    backgroundColor: 'transparent',
                                    borderColor: '#2e58a6'
                                }]} onPress={() => {
                            password()
                        }}>
                            <Text style={{color: '#2e58a6', padding: 10,textAlign: 'center',textTransform: 'uppercase',letterSpacing:2,
                                width: '100%',
                                fontWeight: 'bold'}}>Change password</Text>
                        </Button>
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
                            }}>Validate</Text>
                        </Button>
                    </View>


                </View>
            </Content>
        </Container>
    )

}
export default EditProfil;