import React from 'react';
import {
    View, RefreshControl, ScrollView
} from "react-native";
import {
    Button,
    Container, Header, Body, Content, Left, Right, Title
} from "native-base";
import {colors} from "~/utils/theme";
import PostItems from "~/components/postItems/index";
import {NavigationScreenProp} from "react-navigation";
import styles from "~/screens/Detail/styles";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface IDetailProps {
    navigation: NavigationScreenProp<any>
}

export default class PostDetail extends React.PureComponent<IDetailProps, any> {


    constructor(props: IDetailProps) {
        super(props);
        this.state = {
            refreshing: false,
            setRefreshing: false,
            isModalOpen: false,
            orderedStories: null,
            selectedStory: null
        };
    }

    onRefresh = () => {
        this.setState({setRefreshing: true});
        this.wait(2000).then(() => {
            this.setState({setRefreshing: false});
        });
    };

    goBack = () => {
        const {navigation} = this.props;
        navigation.goBack();
    };

    render() {
        const {refreshing} = this.state;
        const {navigation} = this.props;
        return (
            <Container>
                <Header style={{backgroundColor: colors.white}}>
                    <Left>
                        <Button transparent onPress={this.goBack}>
                            <Icon style={{color: colors.black,fontSize:32}}
                                  name='chevron-left'/>
                        </Button>
                    </Left>
                    <Body>
                        <Title>Posts</Title>
                    </Body>
                    <Right>

                    </Right>
                </Header>
                <Content>
                    <ScrollView
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={() => this.onRefresh}/>
                        }
                        contentInsetAdjustmentBehavior="automatic"
                        style={styles.scrollView}>
                        <View>
                            <PostItems navigation={navigation}/>
                        </View>
                    </ScrollView>

                </Content>
            </Container>
        );
    }
}

