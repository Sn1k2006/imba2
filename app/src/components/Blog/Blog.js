import React, {Component} from 'react';
import {StyleSheet, FlatList, Platform} from 'react-native';
import {View} from 'native-base';
import {withNavigation} from 'react-navigation';
import {action, observable, toJS} from "mobx";
import {inject, observer} from "mobx-react";
import {toast, translate} from "../../utils";
import {complainOnBlog, deleteBlog, getBlogsList, updateBlog} from "../../actions/blog";
import Layout from "../../constants/Layout";
import Spinner from "../Spinner";
import AttentionBg from "../AttentionBg";
import Colors from "../../constants/Colors";
import BlogModal from "./BlogModal";
import BlogHeadFilters from "./BlogHeadFilters";
import CustomBtn from "../elements/CustomBtn";
import BlogListItem from "./BlogListItem";
import FiltersModal from "./FiltersModal";
import NoResults from "../NoResults";
import BlogOwnModal from "./BlogOwnModal";
import CreateBlog from "./CreateBlog";

const STARTFILTERS = {sort_by: null, search: '', cards_id: []};

@inject('userStore')
@observer
class Blog extends Component {

  @observable preload = false;
  @observable loading = true;
  @observable visible = false;
  @observable edit_blog_visible = false;
  @observable filters_modal = false;
  @observable filters = STARTFILTERS;
  @observable modal_data = null;
  @observable data = null;
  @observable meta = {};

  @action showModal = (data) => {
    this.modal_data = data;
    this.visible = true;
  };
  @action closeModal = () => {
    this.visible = false;
    this.modal_data = null;
  };
  @action showEditBlogModal = () => {
    this.edit_blog_visible = true;
  };
  @action closeEditBlogModal = () => {
    this.edit_blog_visible = false;
  };
  @action showFiltersModal = () => {
    this.filters_modal = true;
  };
  @action closeFiltersModal = () => {
    this.filters_modal = false;
  };
  @action changeFilter = (type) => async (value) => {
    if (type === 'search') {
      this.filters.search = value;
    } else {
      this.filters = {...this.filters, ...value};
      this.closeFiltersModal();
    }
    await this.getBlogs();
  };
  @action getBlogs = async () => {
    try {
      this.data = null;
      this.loading = true;
      const res = await getBlogsList(1, this.props.own, toJS(this.filters));
      this.data = res?.data || [];
      this.meta = res?.meta?.pagination || {};
    } catch (e) {
      toast(e.message);
    }
    this.loading = false;
  };

  @action init = () => {
    const {blog} = this.props;
    this.data = blog?.data || [];
    this.meta = blog?.meta?.pagination || {};
    this.filters = STARTFILTERS;
    this.loading = false
  };
  @action handleEndReached = async () => {
    if (this.meta.current_page < this.meta.total_pages && !this.preload) {
      try {
        this.preload = true;
        const result = await getBlogsList(this.meta.current_page + 1, Number(this.props.own));
        this.data = [...toJS(this.data), ...result.data];
        this.meta = result?.meta?.pagination || {};
      } catch (e) {
        toast(e.message);
      }
      this.preload = false;
    }
    this.props.setEndReached(this.props.own ? 'end_reached_tab_2' : 'end_reached_tab_1');

  };

  //Добавляет элемент блога к списку, вызывается в компоненте Profile
  @action addToBlog = () => {
    this.data = [this.props.addItemToBlog, ...this.data];
  };

  @action removeBlog = async () => {
    try {
      await deleteBlog(this.modal_data.id);
      const idx = this.data.findIndex(blog => blog.id === this.modal_data.id);
      this.data = [...this.data.slice(0, idx), ...this.data.slice(idx + 1)];
      this.props.removeBlogFromScreen(this.modal_data.id); // удаляю из начального массива
      this.closeModal();
    } catch (e) {
      toast(e.message);
    }
    // this.data = [this.props.addItemToBlog, ...this.data];
  };
  @action complainBlog = async (id, status) => {
    try {
      await complainOnBlog(id, status);
      const idx = this.data.findIndex(blog => blog.id === id);
      this.data = [...this.data.slice(0, idx), ...this.data.slice(idx + 1)];
      this.closeModal();
    } catch (e) {
      toast(e.message);
    }
    // this.data = [this.props.addItemToBlog, ...this.data];
  };

  componentDidMount() {
    this.init();
  }


  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.addItemToBlog?.id !== this.props.addItemToBlog?.id) {
      this.addToBlog();
    }
    if (!this.loading && prevProps.loading_tab && !this.props.loading_tab) {
      this.init();
    }
    if (this.props.end_reached && !prevProps.end_reached) this.handleEndReached()
  }

  renderFooter = () => {
    return <View style={{paddingBottom: this.props.finished_courses?.length ? 80 : 0}}>{this.preload ?
      <Spinner/> : null}</View>
  };

  renderHeader = () => {
    if (!this.props.blog?.data?.length) return null;
    return <BlogHeadFilters
      showFilters={this.showFiltersModal}
      fillFilters={this.filters.sort_by || this.filters.cards_id?.length}
      onSearchChange={this.changeFilter('search')}/>
  };

  renderEmpty = () => {
    if (this.filters.cards_id?.length) return <NoResults/>;
    const haveFinishedCourses = this.props.finished_courses?.length;
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <AttentionBg
          color={Colors.secondColor}
          title={this.props.own ? translate('EMPTY_BLOG_TITLE_1') : translate('EMPTY_BLOG_TITLE_2')}
          text={this.props.own ? (haveFinishedCourses ? translate('EMPTY_BLOG_TEXT_1') : translate('EMPTY_BLOG_TEXT_2')) : translate('EMPTY_BLOG_TEXT_2')}
          title_bottom={haveFinishedCourses && this.props.own}
          icon={'blog_man'}
        />
        {haveFinishedCourses && this.props.own
          ?
          <CustomBtn title={translate('Add')} width={246} right_icon='plus' onPress={this.props.addBlog}/>
          :
          null
        }
      </View>
    )
  };

  handleBlogEdit = async (data) => {
    const {id, name, description, link, card_id} = data;
    let res = {};
    if (name !== this.modal_data.name) res.name = name;
    if (description !== this.modal_data.description) res.description = description;
    if (link !== this.modal_data.link) res.link = link;
    if (card_id !== this.modal_data.card_id) res.card_id = card_id;
    if (Object.keys(res).length) {
      try {
        res = await updateBlog({...res, id});
        this.modal_data = res;
        let idx = this.data.findIndex(item => item.id === id);
        if (idx !== -1) {
          this.data[idx] = this.modal_data;
        }
      } catch (e) {
        toast(e.message)
      }
    }
  };

  render() {
    // if (this.props.loading_tab) return <View
    //   style={{flex: 1, backgroundColor: Colors.bg, width: Layout.window.width}}><Spinner/></View>;
    return (
      <View style={{
        width: Layout.window.width,
        minHeight: (Layout.window.height - this.props.header_height - (Platform.OS === 'ios' ? 40 : 60)),

      }}>
        {this.props.loading_tab
          ?
          <Spinner/>
          :
          <>
            <FlatList
              data={this.data || []}
              extraData={[this.data]}
              alwaysBounceVertical={false}
              // keyboardShouldPersistTaps={'always'}
              renderItem={({item}) => <BlogListItem data={item} openModal={this.showModal} own={this.props.own}
                                                    user={this.props.userStore?.user}/>}
              ListHeaderComponent={this.renderHeader()}
              ListFooterComponent={this.renderFooter()}
              ListEmptyComponent={this.renderEmpty()}
              style={{flex: 1}}
              contentContainerStyle={{flex: 1}}
              keyExtractor={item => String(item.id)}
            />

            <FiltersModal
              courses={this.props.courses?.data}
              handleOk={this.changeFilter()}
              filters={toJS(this.filters)}
              visible={this.filters_modal}
              onClose={this.closeFiltersModal}/>
            {this.props.own
              ?
              <>
                <BlogOwnModal
                  user={this.props.userStore?.user}
                  data={toJS(this.modal_data)}
                  visible={toJS(this.visible)}
                  closeModal={this.closeModal}
                  editBlogOpen={this.showEditBlogModal}
                  removeBlog={this.removeBlog}
                />
                <CreateBlog
                  data={toJS(this.modal_data)}
                  visible={toJS(this.edit_blog_visible)}
                  onClose={this.closeEditBlogModal}
                  handleOk={this.handleBlogEdit}
                  courses={this.props.finished_courses}
                />
              </>
              :
              <BlogModal
                complainBlog={this.complainBlog}
                data={toJS(this.modal_data)}
                visible={toJS(this.visible)}
                closeModal={this.closeModal}
              />
            }
          </>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: Colors.bg
    // backgroundColor: 'green'
  },

  search_line: {
    justifyContent: 'flex-start',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    height: 72,
    backgroundColor: Colors.bg,
    width: '100%',
    paddingHorizontal: 16,
    flexDirection: 'row',
    paddingBottom: 24
  }
});

export default withNavigation(Blog);
