import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image, Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "react-native-image-picker"
import {colors} from "~/utils/theme";
import axios, {AxiosRequestConfig} from "axios";
import {Button} from "native-base";

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

export default class CameraType extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filePath: '',
            fileData: '',
            fileUri: '',
            id: '',
            loading1: true,
            loading2: true,
            token: ''
        }

    }

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
            //alert(e)
        }
    }

    componentDidMount(): void {
        this.retrieveData()
        this.retreiveDataId()

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
            //alert(error)// Error data
        }
    };
    cameraLaunch = (type) => {
        let options = {}
        if (type == 1) options = {
            mediaType: 'video',
            videoQuality: 'medium',
            durationLimit: 30000,
            thumbnail: true,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 10,
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
                quality: 10,
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


            } else {

                //const source = {uri: res.uri};


                this.setState({
                    filePath: res,
                    fileData: res.assets[0].base64,
                    fileUri: res.assets[0].uri

                });

            }

        });

    }
    imageGalleryLaunch = (type) => {
        let options = {}
        if (type == 1) options = {
            selectionLimit: 1,
            mediaType: 'video',
            videoQuality: 'medium',
            includeBase64: true,
            durationLimit: 30000,
            thumbnail: true,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 10,
            storageOptions: {
                skipBackup: true
            },
        };
        else
            options = {
                selectionLimit: 1,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 10,
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
    comment = async () => {

        let file = 'file[0]'
        let body = new FormData()
        try {
            let myuri = this.state.fileUri
            let sourceAsString = ""
            let fileName = ""
            let path = ""
            console.log((this.state.filePath))
            for (let i = 0; i < ((this.state.filePath).assets).length; i++) {


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

                body.append("file", {
                    name: fileName,
                    uri: this.state.filePath.assets[i].uri,

                    type

                });
            }
            body.append('texte', '')
            body.append('visiteur_id', this.state.id)
            let that = this
            console.log(body)
            const uri = this.state.fileUri

            const config: AxiosRequestConfig = {
                method: "post",
                url: "https://api.trippybook.com/api/visiteur/storie",

                headers: {

                    'Authorization': this.state.token,
                    'Content-Type': 'multipart/form-data',

                },
                transformRequest: (data, headers) => {

                    return body;
                },
                onUploadProgress: (progressEvent) => {
                    // iOS: {"isTrusted": false, "lengthComputable": true, "loaded": 123, "total": 98902}
                    // use upload data, since it's an upload progress
                },
                data: body,
            };
            const response = await axios.request(config);
            console.log("responsee   " + response)
            if (response.status) {
                alert('Story Created');

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


    }


    render() {
        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    {this.state.fileUri ? <Image
                        source={{uri: this.state.fileUri}}
                        style={{width: 50, height: 50}}
                    /> : null}

                    <Text style={{alignItems: 'center'}}>
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
                </View>
                <View style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignContent: 'center'
                }}>
                    <Button style={styles.btndark} onPress={this.comment} onPressOut={ this.props.goBack}><Text style={{
                        color: '#fff',
                        textAlign: 'center', textTransform: 'uppercase', letterSpacing: 2,
                        width: '100%',
                        fontWeight: 'bold'
                    }}>Publish</Text></Button>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({

    btndark: {
        backgroundColor: colors.fullDarkBlue,
        width: '95%',
        margin: 'auto',
        color: '#fff',
        textAlign: "center",
        textTransform: 'uppercase'
    },
    container: {
        flex: 1,
        padding: 15,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: '#fff'
    },

    button: {
        width: 60,
        height: 60,
        backgroundColor: '#3740ff',
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
        color: '#fff'
    }

});