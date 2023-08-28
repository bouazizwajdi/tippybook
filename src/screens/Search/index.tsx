import React from 'react';
import {
    Text,
    TextInput, TouchableOpacity, View,

} from "react-native";

import {colors} from "~/utils/theme";

export default class Search extends React.PureComponent<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
        };
    }


    componentDidMount() {

    }

    render() {
        return (
               <View>
                   <TextInput onChangeText={(val) =>this.props.onSearch(val)}  style={{ fontSize: 13,
                height: 40,
                fontWeight: "400",
                padding: 3,
                paddingLeft: 10,
                borderWidth: 1,
                borderColor: colors.white,
                marginVertical:10,
                backgroundColor:colors.white,
                    flex: 1}} textContentType={'name'} placeholder={'search...'} value={this.props.searchTerm} />
                   <TouchableOpacity onPress={()=>this.props.go()}><Text>🔍</Text></TouchableOpacity>
               </View>

        );
    }
}

