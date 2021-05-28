import {StyleSheet} from 'react-native';
import Fonts from "./Fonts";
import Colors from "./Colors";

const content = {
  paddingVertical: 16,
  paddingHorizontal: 16,
};
const text = {
  color: Colors.text,
  fontSize: 14,
  lineHeight: 20,
  fontFamily: Fonts.regular,
};
const item_text = {
  color: Colors.item_text,
  fontSize: 14,
  lineHeight: 20,
  fontFamily: Fonts.regular,
};
const small_text = {
  color: Colors.text,
  fontSize: 12,
  lineHeight: 17,
  fontFamily: Fonts.regular,
};
const text_muted = {
  color: Colors.text_muted,
  fontSize: 14,
  lineHeight: 20,
  fontFamily: Fonts.regular,
};
const text_muted_12 = {
  color: Colors.text_muted,
  fontSize: 12,
  lineHeight: 14,
  fontFamily: Fonts.regular,
};
const text_muted_16 = {
  color: Colors.text_muted,
  fontSize: 16,
  lineHeight: 20,
  fontFamily: Fonts.regular,
};
const small_text_muted = {
  color: Colors.text_muted,
  fontSize: 12,
  lineHeight: 17,
  fontFamily: Fonts.regular,
};
const title = {
  color: Colors.text,
  fontSize: 24,
  lineHeight: 28,
  fontFamily: Fonts.bold,
};
const title_20 = {
  fontFamily: Fonts.medium,
  color: '#ffffff',
  fontSize: 20,
  lineHeight: 28,
  fontWeight: 'bold',
  textAlign: 'center'
};
const item_title = {
  color: Colors.text,
  fontSize: 17,
  lineHeight: 20,
  fontFamily: Fonts.medium
};

const title_bold = {
  textAlign: 'center',
  fontWeight: 'bold',
  color: Colors.text,
  fontSize: 24,
  lineHeight: 28
};
const btn_text = {
  fontSize: 17,
  lineHeight: 20,
  fontFamily: Fonts.regular,
};
const input = {
  color: Colors.text,
  fontSize: 16,
  lineHeight: 20,
  fontFamily: Fonts.regular,
};
const page_padding = {
  paddingTop: 55
};
const shadow = {
  shadowColor: Colors.shadow,
  shadowOpacity: 1,
  shadowRadius: 5,
  shadowOffset: {width: 0, height: 0},
  backgroundColor: Colors.bg,
  elevation: 3,
};

const tab = {
  color: Colors.text_muted,
  fontSize: Fonts.text_size,
  lineHeight: Fonts.text_lineHeight,
};
const active_tab = {
  color: Colors.secondColor,
  fontSize: Fonts.text_size,
  lineHeight: Fonts.text_lineHeight,
};
export default StyleSheet.create({
  active_tab,
  tab,
  text,
  title,
  title_bold,
  btn_text,
  text_muted,
  input,
  small_text,
  content,
  small_text_muted,
  page_padding,
  shadow,
  item_title,
  item_text,
  title_20,
  text_muted_16,
  text_muted_12,
})
