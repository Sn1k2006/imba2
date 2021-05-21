import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Keyboard, Platform
} from 'react-native';
import {View, Text, Root} from 'native-base';
import Colors from "../../constants/Colors";
import Styles from "../../constants/Styles";
import CustomBtn from "../elements/CustomBtn";
import Icons from "../Icons";
import CustomInput from "../elements/CustomInput";
import {createBlog, separateFinishedCourses} from "../../actions/blog";
import {toast, translate} from "../../utils";
import CardLogo from "../CardLogo";

const ERRORS = {name: false, description: false, link: false, card_id: false};

const CreateBlog = ({visible = false, onClose, courses, data, handleOk, courses_filtered = false}) => {
  const [loading, setLoading] = useState(false);
  const [finished_courses, setCourses] = useState([]);
  const [modalData, setModalData] = useState({});
  const [errors, setErrors] = useState(ERRORS);
  useEffect(() => {
    if (visible) {
      const res_courses = courses_filtered ? courses : separateFinishedCourses(courses);
      setCourses(res_courses);
      setModalData(data);
      setErrors(ERRORS);
      if(Platform.OS === 'android') {
        setTimeout(() => {
          StatusBar.setBackgroundColor('#00000080', false);
        }, 400);
      }
    } else {
      if(Platform.OS === 'android') {
        StatusBar.setBackgroundColor(Colors.statusBar, false);
      }
    }
  }, [visible]);

  const handleChange = (type, id) => (e) => {
    if (type === 'card_id') {
      hideKeyboard();
      e = id;
    }
    if (errors[type]) {
      setErrors((prevState) => {
        return {...prevState, [type]: false};
      });
    }
    setModalData(prevState => {
      return {...prevState, [type]: e}
    })
  };

  const handleSubmit = async () => {
    let error = {};
    if (!modalData?.name) error.name = true;
    if (!modalData?.description) error.description = true;
    if (!modalData?.link) error.link = true;
    if (!modalData?.card_id) error.card_id = true;
    if (Object.keys(error).length) {
      return setErrors((prevState) => {
        return {...prevState, ...error};
      });
    }
    setLoading(true);
    let blog = null;
    try {
      if (modalData.id) {
        blog = modalData;
      } else {
        blog = await createBlog(modalData);
      }
      await handleOk(blog);
      onClose();
    } catch (e) {
      toast(e.message);
    } finally {
      setLoading(false);
    }
  };
  const hideKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <Root>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={{flex: 1}}/>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={hideKeyboard}>
        <View style={styles.content}>
          <ScrollView
              style={{marginHorizontal: -40}}
              showsHorizontalScrollIndicator={false}
              alwaysBounceVertical={false}
              keyboardShouldPersistTaps={'always'}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 40}}>
              <Text style={Styles.title}>{modalData?.id ? translate('Edit') : translate('Add')} {translate('blog')}</Text>
              <TouchableOpacity
                onPress={onClose} style={{marginRight: -16}}
                hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}>
                {Icons.close(32, Colors.text_muted)}
              </TouchableOpacity>
            </View>
            <View style={{paddingHorizontal: 40}}>
              <CustomInput
                left_icon={'tag'}
                containerStyle={styles.item}
                onChange={handleChange('name')}
                value={modalData?.name || ''}
                error={errors.name}
                placeholder={translate('Title')}
              />
              <CustomInput
                left_icon={'paper'}
                containerStyle={styles.item}
                onChange={handleChange('description')}
                value={modalData?.description || ''}
                error={errors.description}
                placeholder={translate('Description')}
              />
              <CustomInput
                left_icon={'link'}
                containerStyle={styles.item}
                onChange={handleChange('link')}
                value={modalData?.link || ''}
                keyboardType={'url'}
                placeholder={translate('Link')}
                error={errors.link}
              />
              <Text style={[Styles.item_title, styles.item, {marginBottom: 16}, errors.card_id ? styles.error_cards : {}]}>
                {translate('COURSE_BLOG')}
              </Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}  keyboardShouldPersistTaps={'always'}>
              <View style={[{flexDirection: 'row', marginHorizontal: -12, paddingLeft: 36, paddingRight: 36}]}>
                {finished_courses?.map(course => (
                  <TouchableWithoutFeedback key={course.id} onPress={handleChange('card_id', course.id)}>
                    <View style={styles.course_item}>
                      <CardLogo
                        image={course.image}
                        size={56}
                        container_style={[styles.logo, modalData?.card_id === course.id ? {borderColor: Colors.secondColor} : {}]}
                        borderRadius={10}/>
                      <Text style={[Styles.small_text_muted, styles.course_name]} numberOfLines={3}
                            ellipsizeMode='tail'>{course.name}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                ))}
              </View>
            </ScrollView>
            <CustomBtn title={modalData?.id ? translate('Save') : translate('Add')} wrap_style={[styles.item, {paddingBottom: 24,}]} onPress={handleSubmit}
                       loading={loading} width={247}/>
          </ScrollView>
        </View>
        </TouchableWithoutFeedback>
      </View>
      </Root>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    justifyContent: 'space-between',
    backgroundColor: '#00000080',

  },
  content: {
    flex: 0,
    paddingTop: 28,
    paddingHorizontal: 40,
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    backgroundColor: Colors.second_bg
  },
  logo: {
    borderWidth: 1,
    padding: 2,
    borderColor: '#ffffff',
  },
  item: {
    marginTop: 32,
  },
  course_item: {
    alignItems: 'center',
    width: 72,
    marginHorizontal: 8
  },
  course_name: {
    textAlign: 'center',
    paddingTop: 8
  },
  error_cards: {
    flex: 0,
    alignSelf: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: Colors.thirdColor
  }
});

export default CreateBlog;
