import {Dimensions, StyleSheet} from "react-native";
import {colors} from "~/utils/theme";

const styles = StyleSheet.create({
   container: {
    flex: 1,
    padding: 20,
    flexDirection: "row"
  },
   mainContainer:{
        flex:1,
        flexDirection:'row',
        height: 40,
        borderRadius: 20,

    },
     secondContainer:{

        flexDirection:'row',
        height: 40,
        borderRadius: 20,
    },
    btndark:{
        backgroundColor:colors.fullDarkBlue,
        width:'95%',
        margin:'auto',
        color:'#fff',
        textAlign:"center",
        textTransform:'uppercase'
    },
    inputZone:{
        flexDirection:'row',
        flex:10,
        justifyContent: 'center'
    },
    avatarStyle:{
        width:25,
        height:25,
        alignSelf:'center',
        borderRadius: 10,
        marginVertical:12
    },
    inputStyle:{
        fontSize:13,
        fontWeight:"400",
        marginLeft:10, padding:3,
        flex:6
    },
      modal: {
        height: Dimensions.get("window").height,
        width: Dimensions.get("window").width,
        flex: 1,position:"absolute",zIndex:1,borderWidth:1
    },
    toggleEmojii:{
        alignContent:'center'
    }
});
export default styles;
