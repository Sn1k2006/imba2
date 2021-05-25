import React, {Component} from 'react';
import {StyleSheet, StatusBar, Platform} from 'react-native';
import {Text, View} from "native-base";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import {observer} from "mobx-react";
import {translate} from "../../utils";
import Styles from "../../constants/Styles";
import {WebView} from "react-native-webview";

@observer
class MyVideo extends Component {

  state = {
    error: false,
    loaded: false,
  };

  componentWillUnmount() {
    StatusBar.setBarStyle('light-content');
    // Orientation.removeOrientationListener(this._orientationDidChange);
  }

  componentDidMount() {

  }


  _orientationDidChange = (e) => {
    let progress_width = 150;
    if (e.window.width > 360) progress_width = e.window.width - 200;
    this.setState({progress_width});
  };


  videoError = () => {
    this.setState({error: true});
  };
  onLoad = () => {
    this.setState({loaded: true});
  };

  onProgress = (data) => {
    this.setState({progress: data.currentTime / this.state.duration});
  };

  onEnd = () => {
    this._video?.seek(0);
  };
  renderError = () => {
    return (
      <View style={styles.err_wrap}>
        <Text style={Styles.text_muted}>{translate('ERROR_VIDEO')}</Text>
      </View>
    )
  };

  render() {
    if (this.state.error) return this.renderError();
    const {uri, padding = 32} = this.props;
    const width = Layout.window.width - padding;
    const height = width * .5625;
    return (
        <View style={styles.container}>
          <WebView
            source={
              {
                html: ` 
                  <html><body style="padding: 0; margin: 0;background-color:${Colors.bg};">
                    <video id="video" width="100%" height="100%" style="background-color:${Colors.bg};" controls>
                      <source src="${uri}#t=0.001" type="video/mp4" > 
                    </video>
                  </body></html>
                  `,
              }
            }
            ref={(video) => this._video = video}
            style={{flex: 1, width, height, opacity: 0.99}}
            mediaPlaybackRequiresUserAction={false}
            onLoad={this.onLoad}
            allowsInlineMediaPlayback={true}
            javaScriptEnabled={true}
            onError={this.videoError}
            onHttpError={this.videoError}
            renderError={this.videoError}
            injectedJavaScript={`document.getElementsByTagName("video")[0].pause();`}
            scrollEnabled={false}
            allowsFullscreenVideo={true}
          />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    alignItems: 'center',
    overflow: 'hidden',
  },
  err_wrap: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    flex: 1,
    height: 100,
    backgroundColor: Colors.bg,
  },
  container_full: {
    flex: 1,
    height: '100%',
    position: 'relative',
    width: '100%',
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center'
  },
  backgroundVideo: {
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // bottom: 0,
    // right: 0,
    backgroundColor: Colors.bg,
  },

});

export default MyVideo;
