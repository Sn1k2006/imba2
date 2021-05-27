import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {observable, action, toJS} from 'mobx';
import {withNavigation} from 'react-navigation';
import {finishedLearning} from '../../actions/courses';
import {toast, translate} from '../../utils';
import {StyleSheet, View, Text} from 'react-native';
import {Content} from 'native-base';
import CustomBtn from '../../components/elements/CustomBtn';
import Styles from '../../constants/Styles';
import CustomInput from '../../components/elements/CustomInput';
import Colors from '../../constants/Colors';
import RadialGradientLayout from '../../components/RadialGradientLayout';

@observer
class PollContainer extends Component {
  @observable btn_loading = false;
  @observable is_result = false;
  @observable results = null;
  @observable errors = [];

  @action init = () => {
    const {json, settings} = this.props?.data;
    if (settings?.results) {
      this.results = settings.results;
      this.is_result = true;
    } else {
      let res = [];
      if (json?.body) {
        json.body.map(item => res.push({question: item.text, answer: ''}))
      }
      this.results = res;
    }
  }

  @action handleChange = (i) => (e) => {
    this.results[i].answer = e;
    if (this.errors.length) this.errors = [];
  }

  componentDidMount() {
    this.init();
  }

  @action handleSubmit = async () => {
    let errors = [];
    this.results.map((item, i) => {
      if (!item.answer) return errors.push(i);
    });
    if (errors.length) return this.errors = errors;
    this.btn_loading = true;
    try {
      if (!this.props.data.progress) await finishedLearning(this.props.data.id, {results: toJS(this.results)});
      this.props.handleBack();
    } catch (e) {
      this.btn_loading = false;
      toast(e.message);
    }
  };

  render() {
    const {data} = this.props;
    return (
      <>
        <RadialGradientLayout />
        <Content contentContainerStyle={{flexGrow: 1}}>
          {data?.profile?.status === 'check'
            ?
            <Text style={[Styles.text, styles.text_review]}>{translate('POLL_REVIEW')}</Text>
            :
            null
          }
          <View style={styles.container}>
            <View>
              {data?.json?.body?.map((question, i) => (
                <View key={i} style={styles.item}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={Styles.text_muted_16}>{i + 1}.</Text>
                    <View style={{flex: 1, paddingLeft: 8}}>
                      <Text style={[Styles.input, {paddingBottom: 32}]}>{question.text}</Text>
                      {data?.settings?.results
                        ?
                        <Text
                          style={[Styles.item_title, {color: Colors.tintColor}]}>{data.settings.results[i].answer}</Text>
                        :
                        <CustomInput
                          error={this.errors.includes(i)}
                          value={this.results?.[i]?.answer}
                          onChange={this.handleChange(i)}
                          style={{paddingLeft: 0}}
                          placeholder={translate('Answer')}
                        />
                      }
                    </View>

                  </View>

                </View>
              ))}
            </View>
            <CustomBtn
              wrap_style={styles.btn}
              disabled={false}
              title={translate(!this.is_result ? 'Next' : 'Back')}
              width={247}
              onPress={this.handleSubmit} loading={this.btn_loading} />
          </View>
        </Content>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  item: {
    paddingBottom: 48,
  },
  btn: {
    marginVertical: 32
  },
  text_review: {
    padding: 24,
    textAlign: 'center'

  }
});


export default withNavigation(PollContainer);
