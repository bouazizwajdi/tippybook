import React from "react";
import MapView,{PROVIDER_GOOGLE} from 'react-native-maps';

export default class Maps extends Component<Props> {
    constructor(props){
        super(props);
 
        this.state ={
              region :{
                  latitude: 42.78825,
                  longitude: 74.4324,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
              }
            }
        }


    onRegionChange(region) {
        this.setState({region});
    }

    render() {
        return (
            <MapView
            provider={PROVIDER_GOOGLE}
            style={{flex:1}}
                region={this.state.region}
                onRegionChange={(region) => this.onRegionChange(region)}
                showUserLocation
            />
            
        );
    }
}