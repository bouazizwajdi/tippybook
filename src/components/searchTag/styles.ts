import {Dimensions, StyleSheet} from "react-native";
import {colors} from "~/utils/theme";

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderColor: colors.exlight_gray,
        borderWidth: 2,
        borderRadius: 8,
        padding:8,
        alignItems: 'center',
        justifyContent: 'flex-start',
        height:40,
        maxHeight:40
    },
    tag: {
        fontWeight: 'bold'
    },
    fragment: {
        flex: 1,
        flexDirection: 'column'
    },
    spinner:{
        marginLeft: (Dimensions.get("window").width / 2) - 20,
        marginTop: 30,
        marginRight: 'auto'
    }
});

export default styles;
