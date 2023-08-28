import React from 'react';

import Select2 from "react-native-select-two";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    TextInput,
    KeyboardAvoidingView
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import SearchableDropdown from 'react-native-searchable-dropdown';
import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "react-native-image-picker"
import {colors} from "~/utils/theme";
import axios, {AxiosRequestConfig} from "axios";

import {Button, Container, Spinner} from "native-base";
import GetLocation from 'react-native-get-location'
import Geocoder from 'react-native-geocoding';

let mockData = []
let selectedText = "Add adresse"
let myLat = 0
let myLng = 0
Geocoder.init("AIzaSyAxFuYPwYBJtV4l-osmhXClJ_qbuuXCpQ8");
const getMimeType = (ext) => {
    // mime type mapping for few of the sample file types
    switch (ext) {
        case 'pdf':
            return 'application/pdf';
        case 'jpg':
            return 'image/jpeg';
        case 'jpeg':
            return 'image/jpeg';
        case 'png':
            return 'image/png';
        case 'mp4':
            return 'video/mp4';
        default:
            return 'video/mp4';
    }
}
export default class Publish extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            selectedItems: [],
            loading: true,
            loading1: true,
            loading2: true,
            token: '',
            id: '',
            selectedText: 'Add adresse',
            adresse_id: '',
            resourcePath: {}, posteText: ''

        };

        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 4500,
        })
            .then(location => {

                myLat = location.latitude
                myLng = location.longitude


                    /*  Geocoder.from(location.latitude,location.longitude)
                   .then(json => {
                           var addressComponent = json.results[0].address_components[0];
                       console.log(addressComponent);
                   })*/
                    .catch(error => alert("error"));
            })


    }

    wait = (timeout: number) => {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    };
    loadData = async () => {
        try {
            if (this.state.token != '' && this.state.id != '') {
                const response = await axios.get(`https://api.trippybook.com/api/visiteur/adresses`, {headers: {'Authorization': this.state.token}});
                console.log(response.status)
                if (response.status === 200) {
                    let objMock = {}
                    mockData = []
                    for (let i = 0; i < response.data.adresses.length; i++) {
                        objMock = {
                            id: response.data.adresses[i].id,
                            name: response.data.adresses[i].rs,
                            checked: false,
                        }
                        mockData.push(objMock);

                    }

                    if (mockData.length) {
                        this.setState({loading: false})

                    } else {
                        alert('no data')
                    }

                }
            } else {
                alert('token invalide')
            }
        } catch (error) {
            console.log(error);
        }

    }

    componentDidMount(): void {
        this.wait(2000).then(() => {

            this.retrieveData()
            this.retreiveDataId()
            setTimeout(() => this.loadData(), 1000)

        });
    }

    cameraLaunch = (type) => {
        let options = {}
        if (type == 1) options = {
            mediaType: 'video',
            videoQuality: 'medium',
            durationLimit: 30000,
            thumbnail: true,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.2,
            storageOptions: {

                skipBackup: true,
                maxHeight: 50,
                maxWidth: 50,
                path: 'images',

            },

        };
        else
            options = {
                mediaType: 'image',


                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.2,
                storageOptions: {

                    skipBackup: true,
                    maxHeight: 50,
                    maxWidth: 50,
                    path: 'images',

                },

            };


        ImagePicker.launchCamera(options, (res) => {


            if (res.didCancel) {

                console.log('User cancelled image picker');

            } else if (res.error) {

                console.log('ImagePicker Error: ', res.error);

            } else if (res.customButton) {

                console.log('User tapped custom button: ', res.customButton);

                //  alert(res.customButton);

            } else {

                //const source = {uri: res.uri};


                this.setState({

                    filePath: res,

                    fileData: res.assets[0].base64,

                    fileUri: res.assets[0].uri

                }, () => {
                    // console.log('filePath ' + JSON.stringify(this.state.filePath))
                    // console.log('fileData ' + JSON.stringify(this.state.fileData[0].base64))
                    // console.log('fileUri ' + JSON.stringify(this.state.fileUri))
                });

            }

        });

    }
    imageGalleryLaunch = (type) => {

        let options = {}
        if (type == 1) options = {
            selectionLimit: 5,
            mediaType: 'video',
            videoQuality: 'medium',
            includeBase64: true,
            durationLimit: 30000,
            thumbnail: true,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.2,
            storageOptions: {

                skipBackup: true


            },

        };
        else
            options = {

                selectionLimit: 5,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.2,
                storageOptions: {

                    skipBackup: true,
                    maxHeight: 50,
                    maxWidth: 50,
                    path: 'images',

                },

            };

        ImagePicker.launchImageLibrary(options, (res) => {


            if (res.didCancel) {

                console.log('User cancelled image picker');

            } else if (res.error) {

                console.log('ImagePicker Error: ', res.error);

            } else if (res.customButton) {

                console.log('User tapped custom button: ', res.customButton);

                // alert(res.customButton);

            } else {

                //const source = {uri: res.uri};


                this.setState({

                    filePath: res,

                    fileData: res.assets[0].uri.toString(),

                    fileUri: res.assets[0].uri

                });

            }

        });

    }

    handleChangeAdr = (name: string, val: string) => {

        this.setState({[name]: val[0]})

    }
    handleChange = (name: string, val: string) => {
        this.setState({[name]: val})
    }
    comment = async () => {
        let body = new FormData()


        let isAdress = false
        if (!this.state.adresse_id && this.state.selectedText && myLng != 0) {
            body.append("ville", "Sfax, Tunisie")

            body.append("lng", myLng)
            body.append("lat", myLat)
            body.append("latMin", myLat - 0.5)
            body.append("latMax", myLat + 0.5)
            body.append("lngMin", myLng - 0.5)
            body.append("lngMax", myLng + 0.5)

            body.append("rs", this.state.selectedText)
            isAdress = true
        } else if (this.state.adresse_id) {
            body.append('adresse_id', this.state.adresse_id)
            isAdress = true
        }

        if ((this.state.posteText != '') && isAdress && this.state.filePath) {
            let file = 'file[0]'

            try {
                let myuri = this.state.fileUri
                let sourceAsString = ""
                let fileName = ""
                let path = ""

                for (let i = 0; i < ((this.state.filePath).assets).length > 0; i++) {


                    sourceAsString = this.state.filePath.assets[i].uri
                    console.log("data " + this.state.filePath.assets[i].uri)
                    fileName = sourceAsString.split('/').pop();
                    path = sourceAsString.lastIndexOf("/");
                    console.log(fileName + " " + path)
                    let type = "mp4"
                    fileName = "video.mp4"
                    try {
                        const extArr = /\.(\w+)$/.exec(fileName);
                        if (extArr && extArr.length > 0) {
                            type = getMimeType(extArr[1]);
                            fileName = sourceAsString.split('/').pop();

                        }

                    } catch (e) {
                        alert(e)
                    }

                    if (fileName.indexOf(".") == -1)
                        fileName += '.mp4'


                    /* body.append("file[]",JSON.stringify(this.state.filePath
                     ))*/
                    body.append("file[]", {
                        name: fileName,
                        uri: this.state.filePath.assets[i].uri,

                        type

                    });
                }


                body.append('text_pub', this.state.posteText)
                body.append('visibility', "0")
                body.append('visiteur_id', this.state.id)
                console.log("test2")

                console.log(body)
                const uri = this.state.fileUri


                const config: AxiosRequestConfig = {
                    method: "post",
                    url: "https://api.trippybook.com/api/visiteur/publication",

                    headers: {

                        'Authorization': this.state.token,
                        'Content-Type': 'multipart/form-data',
                        // if backend supports u can use gzip request encoding
                        // "Content-Encoding": "gzip",
                    },
                    transformRequest: (data, headers) => {
                        // !!! override data to return formData
                        // since axios converts that to string
                        return body;
                    },
                    onUploadProgress: (progressEvent) => {
                        // use upload data, since it's an upload progress
                        // iOS: {"isTrusted": false, "lengthComputable": true, "loaded": 123, "total": 98902}
                    },
                    data: body,
                };
                const response = await axios.request(config);
                /*   const response = await axios.post(`https://api.trippybook.com/api/visiteur/publication`,{

                           body


                          } ,{headers: {'Authorization': this.state.token ,"Content-Type": "multipart/form-data" }},{timeout: 9000});
                      */
                console.log("Post Created ")
                if (response.status) {
                    //  alert(` You have created: ${JSON.stringify(response.data)}`);

                    this.setState({posteText: '', adresse_id: '', fileUri: ''}, () => {
                        this.props.navigation.navigate('Home')
                    })

                }


            } catch (error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
                console.log(error.config);
            }

        } else {
            alert('champs add a post and address cannot be null')
        }
    }
    retrieveData = async () => {
        try {
            const myToken = await AsyncStorage.getItem('myToken');
            if (myToken !== null) {
                // We have data!!
                this.setState({token: myToken}, () => {

                    this.setState({loading1: false})
                });

            }

        } catch (error) {
            alert(error)// Error data
        }
    };
    retreiveDataId = async () => {
        try {
            const idUser = await AsyncStorage.getItem('idUser');
            if (idUser !== null) {
                // We have data!!
                this.setState({id: idUser}, () => {
                    this.setState({loading2: false})
                });
            }
        } catch (e) {
            alert(e)
        }
    }

    render() {

        return (


            <View style={styles.container}>

                {this.state.loading ? <Spinner color={colors.dark_gray} style={{width: '100%', textAlign: 'center'}}/> :
                    <View style={[styles.container,{padding:0,marginVertical:15}]}>

                        {/*{this.state.fileUri ? <Image

                            source={{uri: this.state.fileUri}}

                            style={{width: 50, height: 50}}

                        /> : null}*/}

                        <Text style={{alignItems: 'center',backgroundColor:'#efeded',padding:5}}>
                            {this.state.filePath && this.state.filePath.assets[0].fileName}
                        </Text>

                        <View style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-around'
                        }}>
                            <TouchableOpacity onPress={() => this.cameraLaunch(1)} style={styles.button}>

                                <Text style={styles.buttonText}><Icon name={'videocam'}
                                                                      style={{fontSize: 28}}/></Text>

                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.cameraLaunch} style={styles.button}>

                                <Text style={styles.buttonText}><Icon name={'photo-camera'}
                                                                      style={{fontSize: 28}}/></Text>

                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.imageGalleryLaunch(1)} style={styles.button}>

                                <Text style={styles.buttonText}><Icon name={'video-library'}
                                                                      style={{fontSize: 28}}/></Text>

                            </TouchableOpacity>

                            <TouchableOpacity onPress={this.imageGalleryLaunch} style={styles.button}>

                                <Text style={styles.buttonText}><Icon name={'photo-library'}
                                                                      style={{fontSize: 28}}/></Text>

                            </TouchableOpacity>
                        </View>
                        <View style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignContent: 'center',
                            marginBottom: 25
                        }}>

                            <SearchableDropdown
                                onItemSelect={(val: any) => {
                                    const items = this.state.selectedItems;
                                    items.push(val)
                                    // this.setState({ selectedItems: items });
                                    this.setState({'adresse_id': val.id})
                                    this.setState({'selectedText': val.name})

                                    return val.name;
                                }}
                                containerStyle={{padding: 5,width:'100%',borderColor: 'white',backgroundColor:'white',borderRadius: 0}}


                                itemStyle={{
                                    padding: 10,
                                    marginTop: 2,
                                    backgroundColor: '#f5f5f5',
                                    borderColor: '#f5f5f5',
                                    borderWidth: 1,
                                    borderRadius: 0,
                                }}
                                itemTextStyle={{color: '#000'}}
                                itemsContainerStyle={{maxHeight: 140}}
                                items={mockData}
                                defaultIndex={0}
                                resetValue={false}
                                textInputProps={
                                    {
                                        placeholder: this.state.selectedText,
                                        underlineColorAndroid: "transparent",
                                        style: {
                                            padding: 12,
                                            color:'#000'
                                        },
                                        onTextChange: text => this.handleChange('selectedText', text)
                                    }
                                }
                                listProps={
                                    {
                                        nestedScrollEnabled: true,
                                    }
                                }
                            />


                        </View>
                        <View style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignContent: 'center',
                            marginBottom: 25
                        }}>
                            <TextInput numberOfLines={9} underlineColorAndroid='transparent' style={styles.inputStyle}
                                       onChangeText={(val: any) => this.handleChange('posteText', val)}
                                       multiline={true} placeholder='Add a post...'
                                       placeholderTextColor={colors.light_gray}
                                       value={this.state.posteText}
                            />
                        </View>
                        <View style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignContent: 'center'
                        }}>
                            <Button style={styles.btndark} onPress={this.comment}><Text style={{
                                color: '#fff',
                                textAlign: 'center',
                                width: '100%',
                                fontWeight: 'bold',textTransform: 'uppercase',letterSpacing:2
                            }}>Publish</Text></Button>
                        </View>
                    </View>
                }
            </View>


        );

    }

}


const styles = StyleSheet.create({

    btndark: {
        backgroundColor:colors.fullDarkBlue,
        width:'95%',
        margin:'auto',
        color:'#fff',
        textAlign:"center",
        textTransform:'uppercase'
    },
    container: {

        flex: 1,

        padding: 15,

        alignItems: 'flex-start',

        justifyContent: 'flex-start',

        backgroundColor: '#f5f5f5'

    },

    inputStyle: {
        fontSize: 13,
        fontWeight: "400",
        padding: 7,
        textAlignVertical: 'top',
        flex: 1,
        width: '100%',
        backgroundColor: colors.white,
    },
    button: {
        width: 60,
        height: 60,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        marginBottom: 25,
        marginRight: 'auto',
        marginLeft: 'auto',
    },

    buttonText: {
        textAlign: 'center',
        fontSize: 15,
        color: '#2e58a6'

    }

});