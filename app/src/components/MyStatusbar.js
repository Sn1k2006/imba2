import React from 'react';
import {View, StatusBar,  Platform} from 'react-native';
import Colors from "../constants/Colors";

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

const MyStatusBar = ({ backgroundColor = Colors.second_bg, padding = true, height, ...props }) => (
    <View style={{ backgroundColor, height: height || (padding ? STATUSBAR_HEIGHT : 0) }}>
        <StatusBar
            translucent
            barStyle="light-content"
            {...props}
            backgroundColor={backgroundColor}
            networkActivityIndicatorVisible={true}
        />
    </View>
);


export default MyStatusBar;
