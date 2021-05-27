import React  from 'react';
import {TouchableWithoutFeedback, StyleSheet, Keyboard} from 'react-native';
import {View, Text, ActionSheet} from 'native-base';
import CustomModal from "../elements/CustomModal";
import CustomBtn from "../elements/CustomBtn";
import Avatar from "../Avatar";
import Styles from "../../constants/Styles";
import Colors from "../../constants/Colors";
import Fonts from "../../constants/Fonts";
import Cropper from "../Cropper";
import CustomInput from "../elements/CustomInput";
import Icons from "../Icons";
import {changeUserPass} from "../../actions/auth";
import {toast, translate} from "../../utils";
import UserStore from '../../store/UserStore';
import {inject, observer} from "mobx-react";
import {action, observable, toJS} from "mobx";

const ERRORS = {name: false, password: false, new_password: false};

@inject('userStore', 'appStore')
@observer
class ProfileEditModal extends React.Component {
  timer = null;

  @observable accept_visible = false;
  @observable btn_loading = false;
  @observable btn_success = false;
  @observable new_password = false;
  @observable values = {name: '', password: '', new_password: ''};
  @observable errors = ERRORS;

  @action setAcceptVisible = (value) => {
    this.accept_visible = value;
  };
  @action setBtnLoading = (value) => {
    this.btn_loading = value;
  };
  @action setBtnSuccess = (value) => {
    this.btn_success = value;
  };
  @action setNewPassword = (value) => {
    this.new_password = value;
  };
  @action setValues = (value) => {
    this.values = value;
  };
  @action setErrors = (value, clear) => {
    if (clear) {
      value = {ERRORS}
    }
    this.errors = value;
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.visible !== this.props.visible && this.props.visible) {

      this.handleChangeValue('name', this.props.user?.name);
      this.setErrors(ERRORS);
      this.setBtnSuccess(false);
      this.setBtnLoading(false);
      this.setAcceptVisible(false)
    }
  }

  handleChangeValue = (type, value) => {
    if (this.errors[type]) {
      this.setErrors(false, true);
    }
    this.setValues({...toJS(this.values), [type]: value});
  };
  showActionSheet = async () => {
    ActionSheet.show(
      {
        options: [translate('MAKE_PHOTO'), translate('SELECT_PHOTO'), translate('REMOVE_AVATAR'), translate('Close')],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 3,
        title: translate('CHANGE_AVATAR')
      },
      buttonIndex => {
        if (buttonIndex === 0 || buttonIndex === 1) {
          this.uploadImage(buttonIndex);
        } else if (buttonIndex === 2) {
          this.props.userStore.updateUser({avatar: null})
        } else {

        }
      }
    )
  };
  toggle = (status) => () => {
    this.setErrors(ERRORS);
    this.setValues({name: this.props.user?.name, password: '', new_password: ''});
    this.setNewPassword(status);
  };
  handlePress = async () => {
    Keyboard.dismiss();
    clearTimeout(this.timer);
    let error = {};
    if (this.new_password) {
      if (!this.values?.password) error.password = true;
      if (!this.values?.new_password) error.new_password = true;
    } else {
      if (!this.values?.name) error.name = true;
    }
    if (Object.keys(error).length) {
      return this.setErrors({...toJS(this.values), ...error});
    }
    this.setBtnLoading(true);
    const {user} = this.props;
    try {
      if (this.new_password) {
        await changeUserPass(this.values.password, this.values.new_password);
        this.setValues({name: user?.name, password: '', new_password: ''});
      } else {
        await UserStore.updateUser({name: this.values.name});
      }
      this.setBtnSuccess(true);
      this.timer = setTimeout(() => this.setBtnSuccess(false), 1500);
    } catch (e) {
      toast(e.message);
    }
    this.setBtnLoading(false);
  };

  uploadImage = async (idx) => {
    let img;
    try {
      if (idx === 0) {
        img = await Cropper.camera();
      } else {
        img = await Cropper.gallery();
      }
      if (img) await UserStore.updateUser({avatar: img.id});
    } catch (e) {
      toast(e.message);
    }
  };

  showAcceptModal = () => {
    this.setAcceptVisible(true);
  };

  changeLang = () => {
    const {languages, ln, setLang, appStore: {app_info}} = this.props;
    let langs = [];
    if (languages) {
      Object.keys(languages).map(ln_item => {
        if(!app_info?.status_langs?.[ln_item]) return;
        let res = {text: languages[ln_item].native, id: ln_item};
        if (ln_item === ln) {
          res.icon = 'checkmark';
          res.iconColor = Colors.text_muted;
        }
        langs.push(res);
      });
    }
    ActionSheet.show(
      {
        options: [...langs, {text: translate('Close')}],
        // destructiveButtonIndex: 2,
        cancelButtonIndex: langs.length,
        title: translate('CHANGE_LANGUAGE')
      },
      async buttonIndex => {
        if (buttonIndex !== langs.length) {
          await setLang(langs[buttonIndex].id);
        }
      }
    )
  };

  render() {
    const {visible, closeModal, user} = this.props;

    return (
      <>
        <CustomModal
          visible={visible}
          onClose={closeModal}
          dark
          accept={this.accept_visible}
          onAcceptOk={UserStore.logOut}
          accept_text={translate('CONFIRM_LOGOUT')}
          onCloseAccept={() => this.setAcceptVisible(false)}
          accept_btn_text={translate('Logout')}
          right_icon={'lang'}
          rightIconClick={this.changeLang}
          left_icon={this.new_password ? 'back_btn' : 'logout'}
          left_icon_size={this.new_password ? 32 : 30}
          gradient
          leftIconClick={this.new_password ? this.toggle(false) : this.showAcceptModal}>
          <View style={styles.container}>
            <Avatar image={user?.avatar} progress={0} edit={this.showActionSheet}/>
          </View>
          <View style={{minHeight: user?.auth_type ? 100 : 140}}>
            {this.new_password
              ?
              <>
                <CustomInput
                  onChange={(e) => this.handleChangeValue('password', e)}
                  error={this.errors.password}
                  type={'password'}
                  placeholder={translate('OLD_PASSWORD')}
                  value={this.values.password}
                  left_icon={'pass_lock'}
                  containerStyle={{marginTop: 32}}/>
                <CustomInput
                  onChange={(e) => this.handleChangeValue('new_password', e)}
                  error={this.errors.new_password}
                  type={'password'}
                  placeholder={translate('New_password')}
                  value={this.values.new_password}
                  left_icon={'pass_lock'}
                  containerStyle={{marginTop: 32}}/>
              </>
              :
              <>
                <CustomInput
                  onChange={(e) => this.handleChangeValue('name', e)}
                  error={this.errors.name}
                  value={this.values.name}
                  left_icon={'user'}
                  containerStyle={{marginTop: 32}}/>
                {!user?.auth_type
                  ?
                  <TouchableWithoutFeedback onPress={this.toggle(true)}
                                            hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}>
                    <View style={styles.change_pass}>
                      {Icons.pass_lock(24, Colors.text_muted)}
                      <Text style={[Styles.text, styles.change_pass_text]}>{translate('Change_password')}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                  :
                  null
                }
              </>
            }
          </View>
          <CustomBtn
            disabled={!this.new_password && (this.values.name === user?.name && !this.btn_success)}
            loading={this.btn_loading}
            success={this.btn_success}
            title={this.new_password ? translate('Change_password') : translate('Save')}
            full
            onPress={this.handlePress}
            wrap_style={{marginTop: 44}}/>
        </CustomModal>
      </>
    );
  }
}

const styles = StyleSheet.create({
  name: {
    color: Colors.title,
    textAlign: 'center',
    paddingTop: 20,
    paddingHorizontal: 8,
  },
  blog_name: {
    paddingTop: 24,
    fontSize: 16,
    lineHeight: 19,
    paddingBottom: 16,
    color: Colors.secondColor,
    fontFamily: Fonts.medium,
    textAlign: 'center',
  },
  change_pass: {
    flexDirection: 'row',
    marginTop: 38,
    alignItems: 'center'
  },
  change_pass_text: {
    color: Colors.tintColor,
    paddingLeft: 16
  },
  body: {
    minHeight: 140
  }
});

export default ProfileEditModal;
