import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {View} from 'native-base';
import {observer} from "mobx-react";
import Layout from "../../constants/Layout";
import CardsSwiperItem from "./CardsSwiperItem";
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Colors from "../../constants/Colors";
import {action, observable} from "mobx";
import Spinner from "../Spinner";

@observer
class CardsSwiper extends Component {
  @observable loading = false;
  @action toggleLoading = () => {
    this.loading = true;
    setTimeout(() => this.loading = false, 0)
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevProps.courses?.length !== this.props.courses?.length) {
      this.toggleLoading();
    }
    // if (prevProps.continue_el_loading !== this.props.continue_el_loading && !this.props.continue_el_loading) {
    //   this.carousel.snapToItem(0, false);
    // }
  }

  render() {
    let {courses = [], active_course : indexProps,handleRoute, changeIndex,setSwiperRef} = this.props;

    return (
      <>
        <View style={styles.container}>
          {this.loading
            ?
            <View style={{height: 300}}>
              <Spinner />
            </View>
            :
            <Carousel
              onSnapToItem={changeIndex}
              // layout={'default'}
              onScrollToIndexFailed={() => null}
              inactiveSlideOpacity={1}
              inactiveSlideScale={0.82}
              style={styles.swiper}
              firstItem={indexProps}
              ref={(c) => {
                setSwiperRef(c)
                this.carousel = c;
              }}
              data={courses}
              renderItem={({item, index}) => <CardsSwiperItem
                  course={item} i={index} active={index === indexProps}
                                                              handleRoute={handleRoute}
                                                              key={item.id} PADDING={0} index={indexProps}/>}
              sliderWidth={Layout.window.width}
              itemWidth={280}
            />
          }
        </View>
        <Pagination
          dotsLength={courses.length}
          activeDotIndex={indexProps}
          containerStyle={{paddingTop: 16, paddingBottom: 8, justifyContent: 'center'}}
          dotContainerStyle={{marginHorizontal: 4, }}
          dotStyle={{
            width: 32,
            height: 6,
            backgroundColor: Colors.tintColor,
          }}
          inactiveDotStyle={{
            width: 12,
            height: 12,
            marginHorizontal: -4,
            backgroundColor: Colors.text_muted,
          }}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swiper: {
    overflow: 'visible',
    height: 260,
  },
  pagination: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 16
  }
});

export default CardsSwiper;
