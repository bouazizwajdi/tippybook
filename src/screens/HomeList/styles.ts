import {Dimensions, StyleSheet} from "react-native";
import {colors} from "~/utils/theme";

const styles = StyleSheet.create({
    paddingContainer: {
        flexDirection: 'column',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10
    },
    container: {
    flex:1,
        flexDirection: "column",
        
    },
    avatar: {
        height: 64,
        width: 64,
        position:'relative',
        backgroundColor:colors.white,
        borderRadius: 32,
        zIndex:100
    },
    containerAvatar: {
        height: 71,
        flexDirection: 'column',
        width: 71,
        borderRadius: 35.5,
        backgroundColor:colors.white,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputStyle: {
        fontSize: 13,
        height: 40,
        fontWeight: "400",
        marginHorizontal: 10,
        marginVertical: 15,
        padding: 3,
        paddingLeft: 10,
        borderWidth: 1,
        borderColor: colors.light_gray,
        borderRadius: 20,
        flex: 1
    },
    marginContainer: {
        marginTop: 16
    },
    scrollView: {},
    storiesContainer: {
        flexDirection: 'row'
    },
    fragment: {
        flex: 1,
        flexDirection: 'column'
    },
    storyListContainer: {
        marginTop: 50
    },
    countable: {
        fontWeight: 'bold',
        fontSize: 15
    },
    icon: {
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modal: {
        height: Dimensions.get("window").height,
        width: Dimensions.get("window").width,
        flex: 1
    }
});
export default styles;
