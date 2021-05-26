import React from 'react';
import {View, Text} from 'native-base';
import {withNavigation} from 'react-navigation';
import {StyleSheet} from "react-native";
import CustomModal from "../elements/CustomModal";
import {translate} from "../../utils";
import Icons from "../Icons";
import Styles from "../../constants/Styles";
import Fonts from "../../constants/Fonts";
import Colors from "../../constants/Colors";
import CustomBtn from "../elements/CustomBtn";
import {inject, observer} from "mobx-react";

@inject('appStore')
@observer
class FreeCourseModal extends React.Component {
  goToSubscribe = () => {
    const {navigate} = this.props.navigation
    this.props.closeModal();
    const {visible} = this.props;
    let name = null;
    if (visible?.type === 'section' || visible?.type === 'direction') {
      name = visible?.name
    }
    navigate('Subscribe', {name, id: visible?.id, type: visible?.type, free: true, root: visible.root})
  }

  render() {
    const {visible, closeModal, appStore, first} = this.props
    return (
      <CustomModal visible={Boolean(visible)} onClose={closeModal} dark>
        <View style={styles.container}>
          {Icons.free_24()}
          <Text style={[Styles.title, styles.title]}>{translate('Free_course')}</Text>
          <Text style={[Styles.text, styles.text]}>{translate('FREE_TEXT')}</Text>
          <Text style={[Styles.text, styles.period]}>{translate('FREE_period')}</Text>
        </View>
        {first
          ?
          <>
            <CustomBtn onPress={closeModal} full title={translate('Proceed')} wrap_style={{marginTop: 32}}/>
            {!appStore.subscribed
              ?
              <CustomBtn
                onPress={this.goToSubscribe}
                full
                title={translate('FULL_ACCESS')}
                type={'outline'}
                wrap_style={{marginTop: 16}}
                btn_style={{borderColor: Colors.tintColor}}
                text_style={{color: Colors.tintColor}}
              />
              :
              null
            }
          </>
          :
          <>
            <CustomBtn  onPress={this.goToSubscribe} full title={translate('FULL_ACCESS')} wrap_style={{marginTop: 32}}/>
            {!appStore.subscribed
              ?
              <CustomBtn
                onPress={closeModal}
                full
                title={translate('Close')}
                type={'outline'}
                wrap_style={{marginTop: 16}}
                btn_style={{borderColor: Colors.tintColor}}
                text_style={{color: Colors.tintColor}}
              />
              :
              null
            }
          </>
        }
      </CustomModal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    paddingTop: 16,
    paddingBottom: 8,
    fontSize: 20,
    fontFamily: Fonts.medium,
    color: Colors.tintColor
  },
  text: {
    lineHeight: 24,
    textAlign: 'center'
  },
  period: {
    paddingTop: 8,
    color: '#FCEB55'
  }
});

export default withNavigation(FreeCourseModal);
