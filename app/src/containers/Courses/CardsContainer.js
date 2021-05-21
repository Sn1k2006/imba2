import React, {Component} from 'react';

import {inject, observer} from 'mobx-react';
import {observable, action, toJS} from 'mobx';
import Spinner from "../../components/Spinner";
import Cards from "../../components/Cards";
import {getCoursesList} from "../../actions/courses";
import {toast} from "../../utils";
import NoResults from "../../components/NoResults";

@inject('appStore')
@observer
class CardsContainer extends Component {
  state = {
    active_course: 0
  }
  @observable loading = true;
  @observable swiper_ref = null;
  @observable visible_blog = false;
  @observable data = null;
  @observable meta = null;

  @action init = async (active_course = 0) => {
    this.setState({active_course})
    const data = this.props.data?.data;
    if(this.data && this.data[0].id !== data?.[0].id) this.swiper_ref.snapToItem(0, false);
    this.data = data;
    this.meta = this.props.data?.meta?.pagination;
    this.loading = false;
  };
  @action get = async (page = 1) => {
    try {
      let res = await getCoursesList(page);
      this.data = res?.data;
      this.meta = res?.meta?.pagination;
    } catch (e) {
      toast(e.message);
    }
  };

  @action setSwiperRef = (ref) => {
    this.swiper_ref = ref;
  };
  @action openBlogModal = () => {
    this.visible_blog = true;
  };
  @action closeBlogModal = () => {
    this.visible_blog = false;
  };
  @action changeActiveCourseIdx = (active_course) => {
    active_course = Math.floor(active_course);
    if (active_course !== this.state.active_course) {
      this.setState({active_course});
    }
  };

  componentDidMount() {
    this.init(0);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.data !== this.props.data) {
      this.init(prevState.active_course);
    }
  }

  addBlog = async () => {
    try {
      this.closeBlogModal();
    } catch (e) {
      toast(e.message);
    }
  };

  render() {
    if (this.loading) return <Spinner page/>;
    if (!this.data) return <NoResults/>;
    return (
        <Cards
          continue_el_loading={this.props.continue_el_loading}
          data={toJS(this.data)}
          meta={toJS(this.meta)}
          setSwiperRef={this.setSwiperRef}
          changeActiveCourseIdx={this.changeActiveCourseIdx}
          active_course={this.state.active_course}
          get={this.get}
          openBlogModal={this.openBlogModal}
          subscribed={this.props.appStore.subscribed}
        />
    );
  }
}

export default CardsContainer;
