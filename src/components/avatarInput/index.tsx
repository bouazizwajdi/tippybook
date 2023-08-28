import * as React from 'react';
import {FC, useEffect, useState} from 'react';
import {MentionInput, MentionSuggestionsProps, Suggestion} from 'react-native-controlled-mentions';
import {
    Pressable,
    SafeAreaView,
    Text,
    View,
    KeyboardAvoidingView,
    Platform, Dimensions, TouchableOpacity, TextInput, Image,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from "axios";
import styles from "~/components/avatarInput/styles";
import {Avatar} from "react-native-elements";
import {Button, Input, Spinner} from "native-base";
import {colors} from "~/utils/theme";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

let adresse = [];
let token = ''
let id = ''
let photoUser = ''
const retrieveData = async () => {
    try {
        const value = await AsyncStorage.getItem('myToken');
        if (value !== null) {
            // We have data!!
            token = value;

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
            id = value
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
            photoUser = photo1
        }
    } catch (error) {
        console.log(error)// Error data
    }
};
const users = [
    {id: '1', name: 'David Tabaka'},
    {id: '2', name: 'Mary'},
    {id: '3', name: 'Tony'},
    {id: '4', name: 'Mike'},
    {id: '5', name: 'Grey'},
];

const hashtags = [
    {id: 'todo', name: 'todo'},
    {id: 'help', name: 'help'},
    {id: 'loveyou', name: 'loveyou'},
];

const renderSuggestions: (suggestions: Suggestion[]) => FC<MentionSuggestionsProps> = (suggestions) => ({
                                                                                                            keyword,
                                                                                                            onSuggestionPress
                                                                                                        }) => {
    if (keyword == null) {
        return null;
    }

    return (
        <View>
            {suggestions
                .filter((one) =>
                    one.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())
                )
                .map((one) => (
                    <Pressable
                        key={one.id}
                        onPress={() => onSuggestionPress(one)}
                        style={{padding: 12}}>
                        <Text>{one.name}</Text>
                    </Pressable>
                ))}
        </View>
    );
};


const AvatarInput = (props) => {
    useEffect(() => {

        retrieveData()
        retrieveDataId()
        retrieveDataPhoto()
        setTimeout(() => loadData(), 1500)
        setTimeout(() => loadDataTags(""), 1500)
        setTimeout(() => {
            if (data.loading1) {
                console.log('loadDataTags ===' + mockData)
                setData({...data, loading1: false})
            } else {
                console.log('nooo mockdata')
            }
        }, 2500)
    }, []);
    const [mockData, setMockData] = useState([])
    const loadData = async () => {

        try {
            const response = await axios.get(`https://api.trippybook.com/api/visiteur/feeds?page=1`, {headers: {'Authorization': token}});
            if (response.status === 200) {
                setData({
                    ...data,
                    loading: false
                })
            }
        } catch (error) {
            alert(error);
        }
    }
    const loadDataTags = async (val: string) => {
        setData({...data, loading1: true})
        setMockData([])
        try {
            const res = await axios.post('https://api.trippybook.com/api/visiteur/getTagFriends',
                {tagSearchKeyPrenom: val, searchKeyArray: [val]},
                {headers: {'Authorization': token}})
            let mockDataTemp = []
            if (res.status === 200) {
                console.log('200 tags val ==' + val)
                let objMock = {}
                for (let i = 0; i < res.data.results.length; i++) {
                    objMock = {
                        id: res.data.results[i].id,
                        name: res.data.results[i].rs?res.data.results[i].rs+' ❤':res.data.results[i].nom+' '+res.data.results[i].prenom,
                    }
                    if (objMock.name)
                        mockDataTemp.push(objMock);
                    console.log(mockDataTemp)
                }
                setMockData(mockDataTemp)

            }

        } catch (e) {
            console.log(e.message)
        }

    }
    const comment = async () => {
        console.log('commentaire1 === ' + data.commentaire1)
        console.log('mockData === ' + JSON.stringify(mockData))

        let myarrData = []
        let adrName = ''
        let adrId = ''
        let obj = {}

        if (data.commentaire1.includes('@')) {
            let myarr = data.commentaire1.split('@')
            console.log(myarr)
            for (let i = 0; i < myarr.length; i++) {
                let myadrstr = myarr[i].split('](')[0]
                adrName = myadrstr.replace('[', '')
                console.log(adrName)

                let myIdstr = myarr[i].split('](')[1]
                console.log(myIdstr)

                adrId = myIdstr
                if (adrId) {
                    if (adrId.includes(' ')) {
                        obj = {id: adrId.split(' ')[0].replace(/[^0-9]+/g, ''), rs: adrName}
                    } else {
                        obj = {id: adrId.replace(/[^0-9]+/g, ''), rs: adrName}
                    }
                    myarrData.push(obj)
                }
            }
            console.log(myarrData)

        }

        while(data.commentaire1.includes('@')){
            let indexD=(data.commentaire1).indexOf("@")
            let indexE=(data.commentaire1).indexOf(")")
            let interText=(data.commentaire1).substring(indexD,(indexE+1))
            console.log(interText)
            data.commentaire1=(data.commentaire1).replace(interText,"")
        }

        if (data.commentaire1 != '') {
            try {
                const response = await axios.post(`https://api.trippybook.com/api/visiteur/commentaire`, {
                    commentable_id: data.idPoste,
                    commentable_type: "App\\Models\\Publication",
                    reaction_type: 1,
                    taggedAdresses: myarrData,
                    taggedFriends: [],
                    texte_com: data.commentaire1,
                    visiteur_id: id
                }, {headers: {'Authorization': token}});
                // alert(response.status)
                if (response.status === 200) {
                 //   alert(` You have created: ${JSON.stringify(response.data)}`);
                    setData({
                        ...data,
                        commentaire1: ''
                    })
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

        } else {
            alert('les champs ne doit pas être vide')

        }
    }
    const [data, setData] = useState({
        refreshing: false,
        setRefreshing: false,
        loading: true,
        loading1: true,
        id: '',
        commentaire1: '',
        commentaire2: '',
        finish: false,
        mockData: [],
        tags: [],
        selectedText: '',
        selectedItems: [],
        idPoste: props.idPoste
    })

    const renderMentionSuggestions = renderSuggestions(mockData);

    const renderHashtagSuggestions = renderSuggestions(hashtags);
    return (
        <KeyboardAvoidingView
            enabled={Platform.OS === 'ios'}
            behavior="padding"
            style={{flex: 1,justifyContent: 'center', flexDirection: 'row'}}
        >
            <TouchableOpacity style={{width: '10%', marginHorizontal: 'auto', marginVertical: 'auto'}}>
                <Avatar
                    containerStyle={styles.avatarStyle}
                    rounded
                    source={{uri: 'https://ressources.trippybook.com/assets/' + photoUser}}
                />
            </TouchableOpacity>
            <SafeAreaView
                style={{width: '80%', minHeight: 40}}
            >

                 <MentionInput
                    value={data.commentaire1}
                    onChange={(val: string) => {
                        let mycom = ''
                        let myArr = val.split(' ')
                        let lengthval = myArr.length
                        console.log('lengthval' + lengthval)
                        if (val.includes('@')) {

                            let myarr = val.split('@')
                            let mynewval = val.split('@')[myarr.length - 1]
                            loadDataTags(mynewval)

                            setTimeout(() => {
                                if (mockData.length) {
                                    //console.log('loadDataTagschange ===' + JSON.stringify(mockData))
                                } else {
                                   // console.log('nooo mockdata')
                                }
                            }, 1500)

                        }

                        setData({
                            ...data,
                            commentaire1: val,
                            commentaire2: val.includes('@') ? mycom : val,
                        })

                        console.log('my comm2 ==' + data.commentaire2)
                    }}

                    partTypes={[
                        {
                            trigger: '@',
                            renderSuggestions: renderMentionSuggestions,
                        },
                        /*{
                            trigger: '#',
                            allowedSpacesCount: 0,
                            renderSuggestions: renderHashtagSuggestions,
                            textStyle: {fontWeight: 'bold', color: 'grey'},
                        },*/
                        {
                            pattern: /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.(xn--)?[a-z0-9-]{2,20}\b([-a-zA-Z0-9@:%_\+\[\],.~#?&\/=]*[-a-zA-Z0-9@:%_\+\]~#?&\/=])*/gi,
                            textStyle: {color: 'blue'},
                        },
                    ]}
                    style={{minHeight: 40}}
                    placeholder="Add a comment..."
                    underlineColorAndroid='transparent'
                />
            </SafeAreaView>
            <Button transparent style={{width: '10%',justifyContent:'center'}} onPress={comment}><Text>
                <Icon style={{color: colors.black, fontSize: 20}}
                      name='send'/>
            </Text></Button>
        </KeyboardAvoidingView>
    );
};

export default AvatarInput;