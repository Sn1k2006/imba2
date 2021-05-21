import {createAppContainer} from 'react-navigation';
import {Platform} from 'react-native'
import {createStackNavigator, TransitionPresets} from 'react-navigation-stack';
import ProfileScreen from "../screens/profile/ProfileScreen";
import CardsScreen from "../screens/courses/CardsScreen";
import HomeAuthScreen from "../screens/auth/HomeAuthScreen";

import LoginScreen from "../screens/auth/LoginScreen";
import RecoveryScreen from "../screens/auth/RecoveryScreen";
import CourseScreen from "../screens/courses/CourseScreen";
import NewsScreen from "../screens/news/NewsScreen";
import NewsArticleScreen from "../screens/news/NewsArticleScreen";
import ToolsArticleScreen from "../screens/courses/ToolsArticleScreen";
import PinCodeScreen from "../screens/auth/PinCodeScreen";
import NewPasswordScreen from "../screens/auth/NewPasswordScreen";
import SubscribeScreen from "../screens/SubscribeScreen";
import TestScreen from "../screens/courses/TestScreen";
import EventsScreen from "../screens/EventsScreen";
import CalendarScreen from "../screens/CalendarScreen";
import DiscordScreen from "../screens/auth/DiscordScreen";

const config = {
  animation: 'timing',
  config: {
    duration: 0,
  },
};
const animatedConfig =   {
    ...TransitionPresets.DefaultTransition,

};
const withoutAnimateConfig =  {
    transitionSpec: {
      open: config,
      close: config,

  },
};
const navigateConfig = {
  headerMode: 'none',
  defaultNavigationOptions: Platform.OS === 'ios' ? animatedConfig : withoutAnimateConfig
};
const AuthNav = createStackNavigator({
  Home: HomeAuthScreen,
  Login: LoginScreen,
  Recovery: RecoveryScreen,
  PinCode: PinCodeScreen,
  Discord: DiscordScreen,
  NewPassword: NewPasswordScreen,
}, {
  initialRouteName: 'Home',
  ...navigateConfig
});
//
// export const CoursesNavigator = createStackNavigator({
//   Courses: CardsScreen,
//   Course: CourseScreen,
//   ToolsArticle: ToolsArticleScreen,
// }, {
//   ...stackConfig
// });
//
// export const  NewsNavigator = createStackNavigator({
//   News: NewsScreen,
//   NewsArticle: NewsArticleScreen,
//   // Course: CourseScreen,
// }, {
//   ...stackConfig
// });
//
// export const ProfileNavigator = createStackNavigator({
//   Profile: ProfileScreen,
// }, {
//   ...stackConfig
// });

const AppNav = createStackNavigator({
  // Courses: CoursesNavigator,
  // News: NewsNavigator,
  // Profile: ProfileNavigator,
  Courses: CardsScreen,
  Test: TestScreen,
  Course: CourseScreen,
  ToolsArticle: ToolsArticleScreen,
  News: NewsScreen,
  Events: EventsScreen,
  Calendar: CalendarScreen,
  NewsArticle: NewsArticleScreen,
  Profile: ProfileScreen,
  Subscribe: SubscribeScreen
}, {
  // initialRouteName: 'Subscribe',
  ...navigateConfig
});



export const AppNavigator =  createAppContainer(AppNav);
export const AuthNavigator =  createAppContainer(AuthNav);
