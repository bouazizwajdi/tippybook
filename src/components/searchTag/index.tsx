import React, {Fragment, useEffect, useState} from 'react'
import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    Image, Dimensions,

} from "react-native";
import styles from "~/components/searchTag/styles";
import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import {colors} from "~/utils/theme";
import {Body, Button, Container, Header, Left, Right, Spinner} from "native-base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Separator from "~/components/separator";

let token = ''
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
let visiteurId = ''
const retrieveDataId = async () => {
    try {
        const value = await AsyncStorage.getItem('idUser');
        if (value) {
            visiteurId = value
            // We have data!!
        }
    } catch (error) {
        alert(error)// Error data
    }
};
const SearchTag = (props: any) => {
    const [list, setList] = useState({})
    const [listProfil, setListProfil] = useState([])
    const [listAdresses, setListAdresses] = useState([])
    const [listPublication, setListPublication] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadingMoreProfil, setLoadingMoreProfil] = useState(false)
    const [loadingMoreAdresses, setLoadingMoreAdresses] = useState(false)
    const [loadingMorePublication, setLoadingMorePublication] = useState(false)
    const [pageProfil, setPageProfil] = useState(1)
    const [pageAdresses, setPageAdresses] = useState(1)
    const [pagePublication, setPagePublication] = useState(1)
    const [lastPageProfil, setLastPageProfil] = useState(1)
    const [lastPageAdresses, setLastPageAdresses] = useState(1)
    const [lastPagePublication, setLastPagePublication] = useState(1)
    const loadData = async () => {
        if (token) {
            const response = await axios.post(`https://api.trippybook.com/api/visiteur/searchNavBar`, {searchFilter: props.navigation.state.params.searchTerm}, {headers: {'Authorization': token}});
            if (response.status === 200) {
                setList(response.data)
                setLastPageProfil(response.data.visiteurs.last_page)
                setLastPageAdresses(response.data.adresses.last_page)
                setLastPagePublication(response.data.publications.last_page)
                setLoading(false)
            }
        }
    }
    const loadDataProfil = async (url:any,page) => {
        if (token) {
            const response = await axios.post(url, {searchFilter: props.navigation.state.params.searchTerm}, {headers: {'Authorization': token}});
            if (response.status === 200) {
                if(page>2){
                setListProfil(listProfil=>[...listProfil,...response.data.visiteurs.data])
            }else {
                    setListProfil(response.data.visiteurs.data)

                }
                setLoadingMoreProfil(false)
            }
        }
    }
    const handleScrollProfil = () => {
            setLoadingMoreProfil(true)
            let page1 = pageProfil + 1
            setPageProfil(page1)
            setTimeout(()=>loadDataProfil(`https://api.trippybook.com/api/visiteur/searchNavBarVisiteur?page=` + page1,page1),1500)

    }
    const loadDataAdresses = async (url:any,page) => {
        if (token) {
            const response = await axios.post(url, {searchFilter: props.navigation.state.params.searchTerm}, {headers: {'Authorization': token}});
            if (response.status === 200) {
                if(page>2){
                setListAdresses(listAdresses=>[...listAdresses,...response.data.adresses.data])
            }else {
                    setListAdresses(response.data.adresses.data)

                }
                setLoadingMoreAdresses(false)
            }
        }
    }
    const handleScrollAdresses = () => {
            setLoadingMoreAdresses(true)
            let page1 = pageAdresses + 1
            setPageAdresses(page1)
            setTimeout(()=>loadDataAdresses(`https://api.trippybook.com/api/visiteur/searchNavBarAdresses?page=` + page1,page1),1500)

    }
    const loadDataPublication = async (url:any,page) => {
        setLoadingMorePublication(true)
        if (token) {
           try {
               const response = await axios.post(url, {searchFilter: props.navigation.state.params.searchTerm}, {headers: {'Authorization': token}});
               if (response.status === 200) {
                   if(page>2){
                       setListPublication(listPublication=>[...listPublication,...response.data.publications.data])
                   }else {
                       setListPublication(response.data.publications.data)

                   }
                   setLoadingMorePublication(false)
               }
           }catch (e){
               alert(e)
               setLoadingMorePublication(false)
           }

        }
    }
    const handleScrollPublication = () => {
            let page1 = pagePublication + 1
            setPagePublication(page1)
            setTimeout(()=>loadDataPublication(`https://api.trippybook.com/api/visiteur/searchNavBarPub?page=` + page1,page1),1500)

    }
    const handleUnfollow = async (adresseId) => {
        if (token !== '') {
            try {
                const res = await axios.post('https://api.trippybook.com/api/visiteur/unfollow', {
                    adresseId: adresseId,
                    visiteurId: visiteurId
                }, {headers: {'Authorization': token}})
                if (res.status == 200) {
                    loadData()
                    // alert(JSON.stringify(res.data))

                }
            } catch (e) {
                alert(e)
            }
        }
    }
    const handlefollow = async (adresseId) => {
        if (token !== '') {
            try {
                const res = await axios.post('https://api.trippybook.com/api/visiteur/followByAdress', {
                    adresseId: adresseId,
                }, {headers: {'Authorization': token}})
                if (res.status == 200) {
                    loadData()
                }

            } catch (e) {
                alert(e)
            }
        }
    }
    useEffect(() => {
        retrieveData()
        retrieveDataId()
        setTimeout(() => {
            loadData()
        }, 1500)
    }, [])
    return (
        <SafeAreaView style={{flex: 1, flexDirection: 'column'}}>
            <Container>
                <Header style={{backgroundColor: colors.white}}>
                    <Left>
                        <Button transparent onPress={() => props.navigation.goBack()}>
                            <Icon style={{color: colors.black, fontSize: 32}}
                                  name='chevron-left'/>
                        </Button>
                    </Left>
                    <Body>
                        <TouchableOpacity>
                            <Text style={{fontSize: 18, color: colors.black, fontWeight: 'bold'}}>Result</Text>
                        </TouchableOpacity>
                    </Body>
                    <Right>

                    </Right>

                </Header>
                <ScrollView >
                    {loading ? <ActivityIndicator color={colors.black} style={{fontSize: 32}}/> :
                    <ScrollView style={{padding: 15}}
                                contentInsetAdjustmentBehavior="automatic">

                        {list.visiteurs.data.length || list.adresses.data.length || list.publications.data.length ?
                            <>
                                {list.visiteurs.data.length ?
                                    <>
                                        <Text style={{
                                            fontSize: 18,
                                            color: colors.black,
                                            fontWeight: 'bold',
                                            marginVertical: 15,

                                        }}>
                                            Profiles({list.visiteurs.total}) :
                                        </Text>
                                        {list.visiteurs.data.map((visiteur) =>
                                            <TouchableOpacity
                                                onPress={() => props.navigation.navigate('ProfileVisiteur', {idVisiteur: visiteur.id})}
                                                key={visiteur.id} style={{
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                padding: 15,
                                                alignItems: 'center',
                                                backgroundColor: '#f5f5f5',
                                                marginBottom: 15
                                            }}>
                                                <View style={{alignItems: 'center', width: '20%'}}>

                                                    <Image
                                                        style={{
                                                            width: 50,
                                                            height: 50,
                                                            borderRadius: 50 / 2,
                                                            overflow: "hidden"
                                                        }}
                                                        source={{uri: 'https://ressources.trippybook.com/assets/' + visiteur.photo}}
                                                    />
                                                </View>
                                                <View style={{alignItems: 'flex-start', width: '60%'}}>
                                                    <Text>{visiteur.nom} {visiteur.prenom}</Text>
                                                    <Text>{visiteur.mutualFriend} mutual friends</Text>
                                                </View>
                                                <View style={{alignItems: 'center', width: '20%'}}>
                                                    {visiteur.isFriend ? <Text style={{
                                                        padding: 5,
                                                        fontWeight: 'bold',
                                                        backgroundColor: '#fff',
                                                        borderRadius: 4
                                                    }}>Friend</Text> : null}
                                                </View>
                                            </TouchableOpacity>
                                        )}
                                        {listProfil.length==0?null:
                                            listProfil.map((visiteur) =>
                                            <TouchableOpacity
                                                onPress={() => props.navigation.navigate('ProfileVisiteur', {idVisiteur: visiteur.id})}
                                                key={visiteur.id} style={{
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                padding: 15,
                                                alignItems: 'center',
                                                backgroundColor: '#f5f5f5',
                                                marginBottom: 15
                                            }}>
                                                <View style={{alignItems: 'center', width: '20%'}}>

                                                    <Image
                                                        style={{
                                                            width: 50,
                                                            height: 50,
                                                            borderRadius: 50 / 2,
                                                            overflow: "hidden"
                                                        }}
                                                        source={{uri: 'https://ressources.trippybook.com/assets/' + visiteur.photo}}
                                                    />
                                                </View>
                                                <View style={{alignItems: 'flex-start', width: '60%'}}>
                                                    <Text>{visiteur.nom} {visiteur.prenom}</Text>
                                                    <Text>{visiteur.mutualFriend} mutual friends</Text>
                                                </View>
                                                <View style={{alignItems: 'center', width: '20%'}}>
                                                    {visiteur.isFriend ? <Text style={{
                                                        padding: 5,
                                                        fontWeight: 'bold',
                                                        backgroundColor: '#fff',
                                                        borderRadius: 4
                                                    }}>Friend</Text> : null}
                                                </View>
                                            </TouchableOpacity>
                                        )}
                                        <Spinner color={colors.dark_gray}
                                                 style={[styles.spinner, {display: loadingMoreProfil ? 'flex' : 'none'}]}/>
                                        {lastPageProfil==pageProfil?null:
                                            <TouchableOpacity onPress={handleScrollProfil}
                                                           style={{backgroundColor: '#2e58a6',textAlign:'center', width: '100%',paddingVertical:7}}>
                                            <Text style={{textAlign:'center',color:'#fff'}}>Show more page ({pageProfil} / {lastPageProfil})</Text>
                                        </TouchableOpacity>}
                                        <Separator/>

                                    </> : null
                                }
                                {list.adresses.data.length ? <>
                                    <Text style={{
                                        fontSize: 18,
                                        color: colors.black,
                                        fontWeight: 'bold',
                                        marginVertical: 15
                                    }}>
                                        Adresses ({list.adresses.total}) :
                                    </Text>
                                    {list.adresses.data.map((adr) =>
                                        <View key={adr.id} style={{
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            padding: 15,
                                            alignItems: 'center',
                                            backgroundColor: '#f5f5f5',
                                            marginBottom: 15
                                        }}>
                                            <View style={{alignItems: 'center', width: '20%'}}>
                                                <Image style={{width: 50, height: 50, borderRadius: 50 / 2}}
                                                       source={{uri: "https://ressources.trippybook.com/assets/" + adr.logo}}/>
                                            </View>
                                            <View style={{alignItems: 'flex-start', width: '50%'}}>
                                                <TouchableOpacity onPress={() => {
                                                    props.navigation.navigate('HomeList', {idAdr: adr.id})
                                                }}>
                                                    <Text style={{
                                                        fontWeight: 'bold',
                                                        textAlign: "left"
                                                    }}>{adr.rs}</Text>
                                                    <Text style={{fontSize: 12}}>{adr.adresse}</Text>

                                                </TouchableOpacity>
                                            </View>
                                            <View style={{alignItems: 'center', width: '30%'}}>
                                                {adr.isFollowed ?
                                                    <Button bordered dark onPress={() => handleUnfollow(adr.id)}
                                                            style={{
                                                                marginLeft: 10,
                                                                justifyContent: 'center',
                                                                height: 30,
                                                                padding: 10,
                                                                marginTop: 10
                                                            }}>
                                                        <Text>Unfollow</Text>
                                                    </Button> :
                                                    <Button bordered dark onPress={() => handlefollow(adr.id)}
                                                            style={{
                                                                marginLeft: 10,
                                                                justifyContent: 'center',
                                                                height: 30,
                                                                padding: 10,
                                                                marginTop: 10
                                                            }}>
                                                        <Text>Follow</Text>
                                                    </Button>}
                                            </View>
                                        </View>
                                    )}
                                    {listAdresses.length==0?null:listAdresses.map((adr) =>
                                        <View key={adr.id} style={{
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            padding: 15,
                                            alignItems: 'center',
                                            backgroundColor: '#f5f5f5',
                                            marginBottom: 15
                                        }}>
                                            <View style={{alignItems: 'center', width: '20%'}}>
                                                <Image style={{width: 50, height: 50, borderRadius: 50 / 2}}
                                                       source={{uri: "https://ressources.trippybook.com/assets/" + adr.logo}}/>
                                            </View>
                                            <View style={{alignItems: 'flex-start', width: '50%'}}>
                                                <TouchableOpacity onPress={() => {
                                                    props.navigation.navigate('HomeList', {idAdr: adr.id})
                                                }}>
                                                    <Text style={{
                                                        fontWeight: 'bold',
                                                        textAlign: "left"
                                                    }}>{adr.rs}</Text>
                                                    <Text style={{fontSize: 12}}>{adr.adresse}</Text>

                                                </TouchableOpacity>
                                            </View>
                                            <View style={{alignItems: 'center', width: '30%'}}>
                                                {adr.isFollowed ?
                                                    <Button bordered dark onPress={() => handleUnfollow(adr.id)}
                                                            style={{
                                                                marginLeft: 10,
                                                                justifyContent: 'center',
                                                                height: 30,
                                                                padding: 10,
                                                                marginTop: 10
                                                            }}>
                                                        <Text>Unfollow</Text>
                                                    </Button> :
                                                    <Button bordered dark onPress={() => handlefollow(adr.id)}
                                                            style={{
                                                                marginLeft: 10,
                                                                justifyContent: 'center',
                                                                height: 30,
                                                                padding: 10,
                                                                marginTop: 10
                                                            }}>
                                                        <Text>Follow</Text>
                                                    </Button>}
                                            </View>
                                        </View>
                                    )}
                                    <Spinner color={colors.dark_gray}
                                             style={[styles.spinner, {display: loadingMoreAdresses ? 'flex' : 'none'}]}/>
                                    {lastPageAdresses==pageAdresses?null:
                                        <TouchableOpacity onPress={handleScrollAdresses}
                                                          style={{backgroundColor: '#2e58a6',textAlign:'center', width: '100%',paddingVertical:7}}>
                                            <Text style={{textAlign:'center',color:'#fff'}}>Show more page ({pageAdresses} / {lastPageAdresses})</Text>
                                        </TouchableOpacity>}
                                        <Separator/>
                                </> : null
                                }
                                {list.publications.data.length ?
                                    <>
                                        <Text style={{
                                            fontSize: 18,
                                            color: colors.black,
                                            fontWeight: 'bold',
                                            marginVertical: 15
                                        }}>
                                            Publications ({list.publications.total}) :
                                        </Text>
                                        {list.publications.data.map((pub) =>
                                                <View key={pub.id} style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'center',
                                                    padding: 15,
                                                    alignItems: 'center',
                                                    backgroundColor: '#f5f5f5',
                                                    marginBottom: 15
                                                }}>
                                                    <View style={{alignItems: 'center', width: '40%'}}>
                                                        {pub.medias.length?<Image style={{width: 50, height: 50, borderRadius: 4}}
                                                                source={{uri: "https://ressources.trippybook.com/assets/" + pub.medias[0].src}}/>:
                                                            <Image style={{width: 50, height: 50, borderRadius: 4}}
                                                                source={{uri: "https://ressources.trippybook.com/assets/" + pub.adresse.logo}}/>}
                                                    </View>
                                                    <View style={{alignItems: 'flex-start', width: '80%'}}>
                                                        <TouchableOpacity onPress={() => {
                                                            props.navigation.navigate('HomeList', {idAdr: pub.adresse.id})

                                                        }}>
                                                            <Text style={{
                                                                fontWeight: 'bold',
                                                                textAlign: "center"
                                                            }}>{pub.adresse.rs}</Text>
                                                            <Text style={{fontSize: 12}}>{pub.text_pub}</Text>


                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            )

                                        }
                                        {listPublication.length==0?null:
                                            listPublication.map((pub) =>
                                                <View key={pub.id} style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'center',
                                                    padding: 15,
                                                    alignItems: 'center',
                                                    backgroundColor: '#f5f5f5',
                                                    marginBottom: 15
                                                }}>
                                                    <View style={{alignItems: 'center', width: '40%'}}>
                                                        {pub.medias.length?<Image style={{width: 50, height: 50, borderRadius: 4}}
                                                                source={{uri: "https://ressources.trippybook.com/assets/" + pub.medias[0].src}}/>:
                                                            <Image style={{width: 50, height: 50, borderRadius: 4}}
                                                                source={{uri: "https://ressources.trippybook.com/assets/" + pub.adresse.logo}}/>}
                                                    </View>
                                                    <View style={{alignItems: 'flex-start', width: '80%'}}>
                                                        <TouchableOpacity onPress={() => {
                                                            props.navigation.navigate('HomeList', {idAdr: pub.adresse.id})

                                                        }}>
                                                            <Text style={{
                                                                fontWeight: 'bold',
                                                                textAlign: "center"
                                                            }}>{pub.adresse.rs}</Text>
                                                            <Text style={{fontSize: 12}}>{pub.text_pub}</Text>


                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            )

                                        }
                                        <Spinner color={colors.dark_gray}
                                                 style={[styles.spinner, {display: loadingMorePublication ? 'flex' : 'none'}]}/>
                                        {lastPagePublication==pagePublication?null:
                                            <TouchableOpacity onPress={handleScrollPublication}
                                                              style={{backgroundColor: '#2e58a6',textAlign:'center', width: '100%',paddingVertical:7}}>
                                                <Text style={{textAlign:'center',color:'#fff'}}>Show more page ({pagePublication} / {lastPagePublication})</Text>
                                            </TouchableOpacity>}
                                    </> : null
                                }
                            </>
                            :
                            <Text style={{fontSize: 18, color: colors.black, fontWeight: 'bold', marginBottom: 15}}>
                                No result found
                            </Text>}

                    </ScrollView>
                }
                </ScrollView>
            </Container>
        </SafeAreaView>
    )
};
export default SearchTag;
