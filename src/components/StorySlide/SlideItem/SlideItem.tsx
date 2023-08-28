import React, { Fragment, PureComponent } from "react";
import {View, Image, Dimensions, StyleSheet} from "react-native";
import SlideHeader from "~/components/StorySlide/SlideHearder/SlideHeader";

export default class SlideItem extends PureComponent {



  render() {
    // @ts-ignore
    const {story: { src, avatar, id },user, image, footerComponent} = this.props;
 
    return (

      <Fragment>

        <View style={styles.container}>
          <Image
            style={styles.image} resizeMode={'contain'}
            source={{uri:'https://ressources.trippybook.com/assets/'+src}}

          />
          <SlideHeader {...{ user, image, }}/>
        </View>
        {footerComponent && (
          <View style={styles.footer}>{footerComponent}</View>
        )}
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
});
