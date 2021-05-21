import React  from 'react';
import Layout from "../../constants/Layout";
import YouTube from "react-native-youtube";

const MyYoutube = ({videoId}) => {
    return (
      <YouTube
        topBar={true}
        videoId={videoId}
        apiKey={'AIzaSyA9WqJ-Kq25xGh_VT-0n_g4O_' + videoId}
        style={{
          alignSelf: 'stretch',
          height: Layout.window.width * .5625,
          borderRadius: 4,
          overflow: 'hidden'
        }}
      />
    );
}

export default MyYoutube;