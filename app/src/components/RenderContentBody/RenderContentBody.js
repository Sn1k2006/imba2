import React from 'react';
import HTML from "react-native-render-html";
import {alterNode, makeTableRenderer,} from 'react-native-render-html-table-bridge';
import WebView from 'react-native-webview';
import {StyleSheet, Image, TouchableOpacity, Linking} from 'react-native';
import {View, Text} from 'native-base';
import {withNavigation} from 'react-navigation';

import Styles from "../../constants/Styles";
import Layout from "../../constants/Layout";
import {addHostToPath, convertSize, getImageMaxSize, logEvent, toast, translate} from "../../utils";
import MyVideo from "../MyVideo/MyVideo";
import Colors from "../../constants/Colors";
import Icons from "../Icons";
import MyYoutube from "../MyVideo/MyYoutube";
import NewsCoursesList from "../News/NewsCoursesList";
import FastImage from "react-native-fast-image";

const config = {
  WebViewComponent: WebView,

};

const renderers = {
  ol: (htmlAttribs, children, convertedCSSStyles, passProps) => <View key={passProps.key}>
    {React.Children.map(children, (child, i) => {
      return <View style={{flexDirection: 'row'}}>
        <Text style={[Styles.text_muted, {paddingRight: 8}]}>{i + 1}.</Text>
        {child}
      </View>;
    })}
  </View>,
  ul: (htmlAttribs, children, convertedCSSStyles, passProps) => <View key={passProps.key}>
    {React.Children.map(children, (child, i) => {
      return <View style={{flexDirection: 'row'}}>
        <Text style={[Styles.text_muted, {paddingRight: 8}]}>-</Text>
        {child}
      </View>;
    })}
  </View>,
  table: makeTableRenderer(config)
};

const htmlConfig = {
  alterNode,
  renderers,
  ignoredTags: ['img']
};

const RenderContentBody = ({content = [], courses, footer, navigation, style = {}, containerStyle = {}, image_padding = 0}) => {
  const html_style = {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.text,
    maxWidth: Layout.window.width - image_padding
  };
  const downloadFile = (file) => {
    Linking.canOpenURL(file).then(supported => {
      if (supported) {
        Linking.openURL(file);
      } else {
        toast("Don't know how to open URI: " + file);
      }
    });
  };
  const getImageSize = (image) => {
    return getImageMaxSize(image.image_width, image.image_height, image.image_width < 600 ? image.image_width : 600, image_padding)
  };
  const courseRoute = (data) => () => {
    logEvent('content_launch', {id: data.id});
    navigation.navigate('Course', {
      id: data.id,
      name: data.name,
      loading: true,
      prevRoute: navigation.state.routeName,
      free: data.free
    });
  };
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[{paddingTop: 24}, style]}>
        {content.map((item, i) => (
          <View key={'body' + i}>
            {item.type === 'heading'
              ?
              <Text style={[Styles.item_title, styles.item]}>{item.text}</Text>
              : null
            }
            {item.type === 'link'
              ?
              <View style={[styles.item]}>
                <TouchableOpacity onPress={() => downloadFile(item.link)}>
                  <Text style={styles.link} key={'link' + i}>{item.link}</Text>
                </TouchableOpacity>
              </View>
              : null}
            {item?.type === "material"
              ? item.content.map((content, j) => (
                <View key={'content' + j} style={styles.item}>
                  {content.type === 'text'
                    ?
                    content.text?.[0] !== '<'
                      ?
                      <Text style={Styles.text}>{content.text}</Text>
                      :
                      // <WebView html={content.text}/>
                      <HTML
                        ignoredStyles={[
                          'background-color',
                          'font-size',
                          'color',
                          'line-height',
                          'font-family',
                          'background',
                          'padding',
                          'margin',
                          'text-decoration',
                          'max-width',
                          'border-width',
                          'display',
                          'overflow',
                        ]}
                        html={content.text}
                        // containerStyle={{flex: 1, height: '100'}}
                        onLinkPress={(e, href) => downloadFile(href)}
                        tagsStyles={{
                          p: html_style,
                          pre: html_style,
                          section: {color: 'red'},
                          h1: {marginVertical: 16, ...html_style, fontSize: 22, lineHeight: 33},
                          h2: {marginVertical: 16, ...html_style, fontSize: 20, lineHeight: 30},
                          h3: {marginVertical: 16, ...html_style, fontSize: 18, lineHeight: 27},
                          h4: {marginVertical: 16, ...html_style},
                          div: html_style,
                          span: html_style,
                          ul: {margin: 0, ...html_style},
                          ol: {margin: 0, padding: 0, ...html_style},
                          li: {margin: 0, padding: 0, ...html_style},
                          img: {},
                        }}
                        // imagesInitialDimensions={{width: 300, height: 466}}
                        imagesMaxWidth={Layout.window.width - 48}
                        {...htmlConfig}
                      />
                    : null
                  }
                  {content.type === 'image' && content.image
                    ?
                    <View style={styles.item_image}>
                      <View style={styles.load_img}><Text style={Styles.text_muted}>{translate('LOADING_IMAGE')}</Text></View>
                      <FastImage
                        source={{uri: addHostToPath(content.image)}}
                        style={[styles.image, getImageSize(content.image)]}/>
                    </View>
                    : null
                  }

                  {content.type === 'video'
                    ?
                    <MyVideo uri={content.file.path} padding={48}/>
                    : null
                  }
                  {content.type === 'youtube'
                    ?
                    <MyYoutube videoId={content.youtube_id}/>
                    : null
                  }
                  {content.type === 'file'
                    ?
                    <TouchableOpacity onPress={() => downloadFile(content.file?.path)}>
                      <View style={[styles.file_wrap]}>
                        <View style={styles.file_icon}>
                          {Icons.file(22, '#fff')}
                        </View>
                        <View style={styles.file_name_wrap}>
                          <Text style={[Styles.item_text, styles.file_name]} numberOfLines={1}
                                ellipsizeMode='tail'>{content.file?.name}</Text>
                          <Text style={Styles.small_text_muted}>{convertSize(content.file?.size)}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    : null
                  }

                </View>
              ))
              : null
            }
          </View>
        ))}
        <NewsCoursesList courses={courses} full style={{marginHorizontal: 16}} maxWidth={156}/>
        {/*{courses?.length*/}
        {/*  ?*/}
        {/*  <ScrollView style={styles.courses} horizontal showsHorizontalScrollIndicator={false}>*/}
        {/*    {courses.map((course, i) => (*/}
        {/*      <View key={course.id}>*/}
        {/*        <TouchableOpacity onPress={courseRoute(course)}>*/}
        {/*          <View style={styles.course}>*/}
        {/*            <CardLogo image={course.image} size={56} icon='home' bgc={COLORS[i % 5]}/>*/}
        {/*            <Text style={[Styles.input, styles.course_name]} numberOfLines={2}*/}
        {/*                  ellipsizeMode='tail'>{course.name}</Text>*/}
        {/*          </View>*/}
        {/*        </TouchableOpacity>*/}
        {/*        {course.starting_soon ? <View style={styles.card_soon}>*/}
        {/*          <View style={styles.card_soon_stub}>{Icons.pass_lock(32)}</View>*/}
        {/*        </View> : null}*/}
        {/*      </View>*/}
        {/*    ))}*/}
        {/*  </ScrollView>*/}
        {/*  : null*/}
        {/*}*/}
        {footer
          ? footer()
          : null
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card_soon: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#ffffff00',
  },
  card_soon_stub: {
    backgroundColor: '#00000099',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    // backgroundColor: 'red',
    flex: 1,
    height: '100%',
    marginHorizontal: -24,
    marginTop: 40,
    overflow: 'hidden',
    // backgroundColor: Colors.item_bg,
    // paddingTop: 8,
  },
  item: {
    height: '100%',
    flex: 1,
    position: 'relative',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  item_image: {
    backgroundColor: Colors.item_bg,
    justifyContent: 'center',
    marginHorizontal: -24,
    // marginBottom: 16,
    alignItems: 'center',
  },
  image: {
    resizeMode: 'contain',
    alignSelf: 'center'
  },
  file_wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 24
  },
  file_icon: {
    marginRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    width: 32,
    height: 32,
    backgroundColor: Colors.secondColor,
    flex: 0
  },
  file_name_wrap: {
    overflow: 'hidden',
    flex: 1
  },
  file_name: {
    color: Colors.text
  },
  footer: {
    paddingBottom: 16,
    paddingHorizontal: 24
  },
  courses: {
    paddingVertical: 24,
  },
  course: {
    width: 56,
    justifyContent: 'center',
    marginHorizontal: 24,
    // backgroundColor: 'green'
  },
  course_name: {
    paddingTop: 8,
    textAlign: 'center'
  },
  link: {
    color: Colors.secondColor,
    marginVertical: 4
  },
  load_img: {
    position: 'absolute'
  }
});

export default withNavigation(RenderContentBody);


