import React, {useState} from 'react';
import {View, Button, Text, Header as NativeHeader} from "native-base";
import Colors from "../constants/Colors";
import {StyleSheet, TouchableOpacity} from "react-native";
import Icons from "./Icons";
import Styles from "../constants/Styles";
import Progress from "./Progress";
import {getPercent} from "../actions/courses";
import RepeatImage from "./RepeatImage";

const Header = ({title, children, subtitle, headerLeftClick, headerRightClick, right_icon, statusBarColor, back = true, close = false, progress = null, confetti}) => {
  const [centerWidth, setCenterWidth] = useState(0);
  if (children) return (
    <NativeHeader androidStatusBarColor={statusBarColor || Colors.statusBar} iosBarStyle="light-content" hasSubtitle
                  noShadow style={styles.header}>
      <View style={styles.container}>
        {children}
      </View>
    </NativeHeader>
  );
  const setWidth = (event) => {
    let {width} = event.nativeEvent.layout;
    setCenterWidth(width + 32);
  };
  return (
    <>
      <NativeHeader androidStatusBarColor={statusBarColor || Colors.statusBar} iosBarStyle="light-content" hasSubtitle noShadow
                    style={styles.header}>
        {confetti ? <RepeatImage page/> : null}
        <View style={styles.container}>
          {back || close
            ?
            <Button transparent style={styles.btn}>
              <TouchableOpacity
                hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}
                onPress={headerLeftClick}>
                {close
                  ?
                  Icons.close(32, '#ffffff')
                  :
                  Icons.back_btn(32, '#ffffff')
                }
              </TouchableOpacity>
            </Button>
            :
            null
          }
          <View style={styles.center}>
            {progress
              ?
              <>
                <View style={{width: '100%'}} onLayout={setWidth}>
                  <Progress progress={getPercent(progress.all, progress.done)}
                            width={centerWidth}
                            color={Colors.tintColor} color2={'#FCEB55'}
                            unfilledColor={'#525559'}/>
                </View>

              </>
              :
              <>
                <Text style={[Styles.item_title, {color: Colors.text}]} numberOfLines={1}
                      ellipsizeMode='tail'>{title}</Text>
                {subtitle ?
                  <Text style={styles.subtitle} numberOfLines={1} ellipsizeMode='tail'>{subtitle}</Text> : null}
              </>
            }
          </View>
          {right_icon
            ?
            <Button transparent style={[styles.btn]} onPress={headerRightClick}>
              {typeof right_icon  === 'string' ? Icons[right_icon](32, '#ffffff') : <Text/>}
            </Button>
            :
            null
          }
          {progress || right_icon
            ?
            null
            :
            <View style={styles.btn}/>
          }
        </View>
      </NativeHeader>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0,
    borderBottomWidth: 0,
    backgroundColor: Colors.second_bg,
    // backgroundColor: 'green',
  },
  btn: {
    flex: 0,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    height: '100%',
    minWidth: 24,
  },
  center: {
    position: 'relative',
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  title: {
    color: Colors.tintColor,
  },
  subtitle: {
    color: Colors.text_muted
  },

});

export default Header;
