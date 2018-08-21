import BalloonEditor from '@ckeditor/ckeditor5-build-balloon';
import CKEditor from '@ckeditor/ckeditor5-react';
import humanize from '@nlib/human-readable';
import axios from 'axios';
import moment from 'moment';
import React, { Component } from 'react';
import { defaultArticleCoverPic, webUrl } from '../../abstract/variables';
import Repo from '../repo';
import TagInput from '../tagInput';
import Button from "../UI/button";
import ButtonWithIcon from '../UI/buttonWithIcon';
import ErrorPopup from '../UI/errorPopup';
import MultiLineText from '../UI/MultiLineTextInput';
import Popup from '../UI/popup';
import TextInput from "../UI/textInput";

class Posts extends Component {
    constructor(props) {
        super(props);

        this.state = {
            view: 1,
            errorPopup:{},
            AddArticle:{},
            EditArticle:{},
            PostsView:{}
        }

        this.setView = this.setView.bind(this);
    }

    setView(option) {
        var state = this.state;
        state.view = option;
        this.setState(state);
    }


    render() {
        var view = this.state.view;

        return (

            <div id="section_1" className="SB">
                <ErrorPopup parent={this} />

                <div className={view == 1 ? "view--active SB" : "view--disabled"}>
                    <PostsView parent={this}/>
                </div>

                <div className={view == 2 ? "view--active SB" : "view--disabled"}>
                    <AddArticle parent={this} />
                </div>

                <div className={view == 3 ? "view--active SB" : "view--disabled"}>
                    <EditArticle parent={this} articleId={0} />
                </div>

            </div>
        );
    }
}


class PostsView extends Component {
    constructor(props) {
        super(props);

        var Viewable = {
            article:true,
            event: true,
            notice: true
        };

        this.state = {
            viewable:Viewable,
            content:[],
            offset:0,
            buttons:[],
            errorPopup:{},
            viewType: {
                article: 1,
                event: 1,
                notice: 1
            }
        }

        this.getPosts = this.getPosts.bind(this);
    }

    componentDidMount(){
        this.getPosts();
    }

    getPosts(reset = false) {
        var c = this;
        var state = c.state;

        if(reset){
            state.offset = 0;
            state.content = [];
        }

        axios({
            url: webUrl + "admin/getPosts/" + state.offset,
            method:"GET"
        }).catch((response) => {
            
            switch(response.status){
                case 202:{
                    break;
                }
                default:{
                    setTimeout(() => {
                        c.getPosts();
                    }, 1000)
                    break
                }
            }

        }).then((response)=>{
            var data = response.data;

            switch(data.error){
                case 0:{

                    if(data.content.length == 0){
                        state.errorPopup.displayError("There are no more articles to retrieve. Continue creating more.");
                        break;
                    }

                    state.content = state.content.concat(data.content) ;
                    state.offset += data.content.length;
                    c.setState(state);
                    break;
                }
            }
        })

    }

    render() {
        var c = this;
        return (

            <div id="content">
                    <ErrorPopup parent={this}/>
                    <div className="topBar row">
                        <div className="topBar__title f_h1 f_text-left">Posts</div>
                        <div className="topBar__right">
                        
                        <div className="topBar__right__add">
                            <ButtonWithIcon
                                parent={this}
                                status={0}
                                config={{
                                    class: "btnIcon_1",
                                    action: () => {
                                        c.props.parent.setView(2);
                                    },
                                    label: "Article",
                                    icon: "add-2"
                                }}
                            />
                        </div>

                        </div>
                    </div>

                    <div className="content__view">
                        {
                            this.state.content.map((item, i) => {
                                switch (item.log.type) {
                                    case 1: {
                                        if (!this.state.viewable.article) { return; }

                                        switch (this.state.viewType.article) {
                                            case 1: { return <Article post={item} key={i} parent={this}/>; }
                                        }

                                        break;
                                    }
                                }
                            })
                        }
                    </div>
                    

                    <div className="loadBtn">
                        <Button 
                            parent={this}
                            status={0} 
                            config={{
                                type:"btn_1",
                                label:"More",
                                text:"",
                                action:()=>{
                                    c.getPosts()
                                }
                            }}/>
                    </div>
                </div>
    
        );
    }
}

class Article extends Component {
     render() {
        var post = this.props.post;
        var parent = this.props.parent.props.parent;

        const image = {
            background: 'url("' + webUrl + "repo/" + post.post.image.name + "/thumb_150_150.jpg" + '")',
            backgroundPosition: 'center',
            backgroundSize: 'cover'
        }

        var time = moment(post.log.created_at, "YYYY-MM-DD HH:mm:ss").utc(3).local();
        var ctime = moment.duration(time.diff(moment()), 'milliseconds').humanize();
        
        return (
            <div className="art--1__con" id={"p-" + post.log.id}>
                <div className="art--1__con__up" style={image}
                    onClick={
                        () => {
                            parent.setView(3)
                            parent.state.EditArticle.state.articleId = post.post.id;
                            parent.state.EditArticle.getArticle();
                        }}
                    ></div>
                <div className="art--1__con__down">

                    <div className="art--1__title f_h1 f_text-capitalize">{post.post.title}</div>
                    <div className="art--1__author f_comment_1 f_text-capitalize">{"Written by: " + post.post.author}</div>
                    <div className="art--1__time f_comment_1 f_text-capitalize ">{ctime + " ago"}</div>
                    <div className="art--1__text f_normal">{post.post.summary}</div>

                    <div className="art--1__stat">
                        <div className="art--1__stat__view">
                            <div className="art--1__stat__icon">
                                <div className="btn_icon--normal">
                                    <svg className="icon">
                                        <use xlinkHref="#view" />
                                    </svg>
                                </div>
                            </div>
                            <div className="art--1__stat__value f_h2 f_text-bold">{humanize(post.post.stat.views)}</div>
                        </div>

                        <div className="art--1__stat__likes">
                            <div className="art--1__stat__icon">
                                <div className="btn_icon--normal">
                                    <svg className="icon">
                                        <use xlinkHref="#like" />
                                    </svg>
                                </div>
                            </div>
                            <div className="art--1__stat__value f_h2 f_text-bold">{humanize(post.post.stat.reactions)}</div>
                        </div>

                        <div className="art--1__stat__com">
                            <div className="art--1__stat__icon">
                                <div className="btn_icon--normal">
                                    <svg className="icon">
                                        <use xlinkHref="#communication" />
                                    </svg>
                                </div>
                            </div>
                            <div className="art--1__stat__value f_h2 f_text-bold">{humanize(post.post.stat.comments)}</div>
                        </div>



                        <a href={webUrl + "admin/editArticle/" + post.log.id}>
                            <div className="art--1__edit">
                                <div className="btn_icon--success">
                                    <svg className="icon">
                                        <use xlinkHref="#edit" />
                                    </svg>
                                </div>
                            </div>
                        </a>

                    </div>
                </div>
            </div>
        );
    }
}

class AddArticle extends Component {
    constructor(props) {
        super(props);

        this.article_submit = this.article_submit.bind(this);
        this.loadRepo = this.loadRepo.bind(this);
        this.toggleRepo = this.toggleRepo.bind(this);
        this.onArticleBodyChange = this.onArticleBodyChange.bind(this);

        this.state = {
            toggleRepo: false,
            loaded: false,
            popups: [],
            errorPopup: {},
            tags: [],
            textInputs: [],
            buttons: [],
            editor: {},
            form: {
                body: "<p>Start editing now!</p>"
            }
        }

    }

    componentDidMount() {
        var state = this.state;
        state.loaded = true;
        this.setState(state);

        var pstate = this.props.parent.state;
        pstate.AddArticle = this;
        this.props.parent.setState(pstate);
    }

    onArticleBodyChange(event, editor) {
        var state = this.state;
        state.form.body = editor.getData().substr(0, 60000);
        this.setState(state);
    }

    article_submit() {
        var imageFile = document.querySelector('.repoImagePreview').dataset.image;       //Check if image has been selected

        if (imageFile == undefined || imageFile.length == 0) {
            this.toggleRepo();
            return;
        }
        else {
            imageFile = JSON.parse(imageFile);
        }

        var textInputs = this.state.textInputs;

        textInputs.forEach((elem) => {
            if (elem.state.inputValue == "") {
                elem.focus();
            }
        })

        if (this.state.form.body == "") {
            document.querySelector("#art__text").focus();
            return;
        }

        var tags = [];

        this.state.tags.forEach((elem) => {
            tags.push(elem.id)
        });

        var formData = {
            art__image: imageFile.id,
            art__title: textInputs[0].state.inputValue,
            art__author: textInputs[1].state.inputValue,
            art__body: this.state.form.body,
            art__summary: textInputs[1].state.inputValue,
            art__tags: JSON.stringify(tags)
        };

        var errorPopup = this.props.parent.state.errorPopup;
        var state = this.state;
        var c = this;
        state.buttons[0].state.inputValue = 3;
        this.setState(state);

        axios({
            url: webUrl + "admin/article/0",
            method: "POST",
            data: formData
        }).then((response) => {
            var data = response.data;

            switch (data.error) {
                case 0: {
                    state.buttons[0].state.inputValue = 2;
                    c.setState(state);
                    window.location.href = webUrl + "admin/posts";
                    break;
                }
                case 1: {
                    state.buttons[0].state.inputValue = 1;
                    c.setState(state);
                    errorPopup.displayError("Failed to save the article. Please try again");
                    break;
                }
            }

            
        }).catch((response) => {
            if (response.status != 200) {
                state.buttons[0].state.inputValue = 1;
                c.setState(state);
                errorPopup.displayError("Failed to access server. Please try again in a few minutes.");
            }
        })

    }

    toggleRepo() {
        this.state.popups[0].toggleContent();
    }

    loadRepo() {
        if (this.state.loaded == true) {
            return (<Popup component={<Repo parent={this} sType={1} rCount={1} token={this.props.token} userType={3} />} parent={this} />);
        }
    }

    render() {
        var c = this;
        var placeholder = {
            backgroundImage: "url('" + defaultArticleCoverPic + "')",
            backgroundPosition: 'center',
            backgroundSize: 'cover'
        }

        BalloonEditor.defaultConfig.toolbar.items = [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            'imageUpload',
            'blockQuote',
            'undo',
            'redo'
        ];

        return (
            <div id="content--full">

                <div className="base">
                    <form method="post" encType="multipart/form-data">
                        {/* <!-- IMAGE SELECT AREA--> */}

                        <div className="art__image">
                            <div id="img_select">
                                <div id="img_select__img" className="repoImagePreview" style={placeholder}>
                                    <input type="hidden" id="art_selected_image" name="image" />
                                </div>
                                <div id="img_select__buttons">

                                    <ButtonWithIcon 
                                        parent={this}
                                        status={0}
                                        config={{
                                            class:"btnIcon_1",
                                            action: this.toggleRepo,
                                            label:"Repo",
                                            icon:"repo"
                                            }}
                                        />
                                        
                                </div>
                            </div>

                        </div>

                        {/* <!-- IMAGE SELECT AREA--> */}

                        <div className="art__form" >
                            {/* <!-- ARTICLE TITLE AREA--> */}
                            <div className="art__title">
                                <TextInput
                                    parent={this}
                                    status={0}
                                    config={{
                                        text: "",
                                        floatingLabel:true,
                                        label: "Title",
                                        type: "text_input",
                                        placeholder:"Article Title",
                                        comment: "Maximum characters allowed is (80)."
                                    }} />
                            </div>
                            {/* <!-- ARTICLE TITLE AREA--> */}

                            {/* <!-- ARTICLE AUTHOR AREA--> */}
                            <div className="art__author">
                                <TextInput
                                    parent={this}
                                    status={0}
                                    config={{
                                        text: "",
                                        floatingLabel: true,
                                        label: "Author",
                                        type: "text_input",
                                        placeholder: "John Doe",
                                        comment: "Maximum characters allowed is (80)."
                                    }} />

                            </div>
                            {/* <!-- ARTICLE AUTHOR AREA--> */}

                            {/* <!-- ARTICLE TEXT AREA--> */}
                            <div className="art__textBox">
                                <div className="art__textBox__label f_h1">Body Text</div>
                                <div className="art__textBox__input ck--1">
                                    <CKEditor
                                        editor={BalloonEditor}
                                        data={this.state.form.body}
                                        onChange={this.onArticleBodyChange}
                                    />
                                </div>

                                <div className="comment f_comment_1">Maximum characters allowed is (60000). Currently, its ( {this.state.form.body.length} ) </div>

                            </div>
                            {/* <!-- ARTICLE TEXT AREA--> */}

                            {/* <!-- ARTICLE SUMMARY AREA--> */}
                            <div className="art__summaryBox">
                                <MultiLineText
                                    parent={this}
                                    status={0}
                                    config={{
                                        text: "",
                                        label: "Summary",
                                        type: "mul_text_input",
                                        comment: "Maximum characters allowed is (200)."
                                    }} />

                            </div>
                            {/* <!-- ARTICLE SUMMARY AREA--> */}


                            <div className="art__summaryBox">
                                <div className="art__summaryBox__label f_h1">Tags</div>
                                <div className="art__summaryBox__input" >
                                    <TagInput main={this} parent={this} />
                                </div>
                            </div>

                            <div className="form__buttons">
                                <div className="form__buttons__button">
                                    <Button
                                        parent={this}
                                        status={0}
                                        config={{
                                            label: "Save",
                                            action: this.article_submit,
                                            type: "btn_1",
                                            text: ""
                                        }} />
                                </div>

                                <div className="form__buttons__button">
                                    <Button
                                        parent={this}
                                        status={0}
                                        config={{
                                            label: "Back",
                                            action: ()=>{
                                                c.props.parent.setView(1);
                                            },
                                            type: "btn_1",
                                            text: ""
                                        }} />
                                </div>
                            </div>

                        </div>
                    </form>
                </div>


                {this.loadRepo()}
            </div>
        );
    }
}


class EditArticle extends Component {
    constructor(props) {
        super(props);

        this.reloadAjaxRequest = this.reloadAjaxRequest.bind(this);
        this.getArticle = this.getArticle.bind(this);
        this.setCoverImage = this.setCoverImage.bind(this);
        this.setArticleData = this.setArticleData.bind(this);
        this.handleArticleBodyChange = this.handleArticleBodyChange.bind(this);
        this.toggleRepo = this.toggleRepo.bind(this);
        this.loadRepo = this.loadRepo.bind(this);
        this.article_submit = this.article_submit.bind(this);

        this.state = {
            ajax: {
                getArticle: {
                    error: "",
                    attempts: 0
                },
                getExtraData: {
                    error: "",
                    attempts: 0
                }
            },
            articleId: 0,
            article: {
                log: {
                    id: "",
                    type: "",
                    created_at: ""
                },
                post: {
                    title: "",
                    author: "",
                    body: "",
                    summary: "",
                    id: "",
                    tags: []
                }
            },
            toggleRepo: false,
            textInputs: [],
            buttons: [],
            form: {
                body: ""
            },
            updated: false,
            popups: [],
            tags: []
        }

    }

    componentDidMount() {
        var state = this.state;
        state.loaded = true;
        this.setState(state);

        var state = this.props.parent.state;
        state.EditArticle = this;
        this.props.parent.setState(state);

        this.getArticle();
    }

    reloadAjaxRequest(option) {
        var state = this.state;

        switch (option) {
            case 1: {

                if (state.ajax.getArticle.attempts < 10) {
                    state.ajax.getArticle.attempts += 1;
                    this.setState(state);
                    this.getArticle();
                }
                else {
                    this.props.parent.state.errorPopup.displayError("Access to server failed. Try again Later! ");
                    state.ajax.getArticle.attempts = 0;
                    this.setState(state);
                }
                break;
            }
        }
    }

    getArticle() {
        var component = this;
        var state = component.state;
        var url = webUrl + "admin/article/" + state.articleId;

        axios({
            url: url,
            method: "GET"
        }).catch((response) => {
            if (response.status != 200) {
                component.reloadAjaxRequest(1);
            }
        }).then((response) => {
            var data = response.data;

            switch (data.error) {
                case 0: {
                    state.updated = true;
                    state.article = data.content;
                    component.setState(state);
                    component.setArticleData();
                    component.setCoverImage();
                    break;
                }
            }
        })

    }

    setCoverImage() {
        var state = this.state;

        if (state.article.post.image != undefined) {
            var preview = document.querySelector(".repoImagePreview");
            preview.setAttribute('style', "background:" + "url(\"" + webUrl + 'repo/' + state.article.post.image.name + "." + state.article.post.image.type + "\") center ; background-size:cover;");

            preview.dataset.image = JSON.stringify(state.article.post.image);
        }
    }

    setArticleData() {
        var state = this.state;
        var article = state.article.post;

        if (article != null) {
            state.textInputs[0].state.inputValue = article.title;
            state.textInputs[1].state.inputValue = article.author;
            state.textInputs[2].state.inputValue = article.summary;
            state.form.body = article.body;
            state.tags = article.tags;
            this.setState(state);
        }
        else {
            this.props.parent.getArticle();
        }
    }

    handleArticleBodyChange(event, editor) {
        var state = this.state;
        state.form.body = editor.getData().substr(0, 60000);
        this.setState(state);
    }

    article_submit() {
        var imageFile = document.querySelector('.repoImagePreview').dataset.image;       //Check if image has been selected

        if (imageFile == undefined || imageFile.length == 0) {
            this.toggleRepo();
            return;
        }
        else {
            imageFile = JSON.parse(imageFile);
        }

        var textInputs = this.state.textInputs;

        textInputs.forEach((elem) => {
            if (elem.state.inputValue == "") {
                elem.focus();
            }
        })

        if (this.state.form.body == "") {
            document.querySelector(".form__textBox").focus();
            return;
        }

        var tags = [];

        this.state.tags.forEach((elem) => {
            tags.push(elem.id)
        });

        var formData = {
            art__image: imageFile.id,
            art__title: textInputs[0].state.inputValue,
            art__author: textInputs[1].state.inputValue,
            art__body: this.state.form.body,
            art__summary: textInputs[2].state.inputValue,
            art__tags: JSON.stringify(tags)
        };

        var errorPopup = this.props.parent.state.errorPopup;

        axios({
            url: webUrl + "admin/article/" + this.state.article.post.id,
            method: "PUT",
            data: formData
        }).then((response) => {
            var data = response.data;

            switch (data.error) {
                case 0: {
                    window.location.href = webUrl + "admin/posts";
                    break;
                }
                case 1: {
                    errorPopup.displayError("Article does not exist! If you have an concerns, contact developer!");
                    break;
                }
                case 2: {
                    errorPopup.displayError("Failed to save the article. Please try again!");
                    break;
                }
            }
        }).catch((response) => {
            if (response.status != 200) {
                errorPopup.displayError("Failed to access server. Please try again in a few minutes.");
            }
        })

    }

    toggleRepo() {
        this.state.popups[0].toggleContent();
    }

    loadRepo() {
        if (this.state.loaded == true) {
            return (<Popup component={<Repo parent={this} sType={1} rCount={1} token={this.props.token} userType={3} />} parent={this} />);
        }
    }

    render() {
        if (this.state.article.post == undefined || this.state.article.post.title == undefined) { return <div></div>; }
        var c = this;
                
        return (
            <div>
                <div className={this.state.toggleRepo ? "base--disabled" : "base"}>
                    <form method="post" encType="multipart/form-data">
                        <input type="hidden" name="article" value={this.state.article.post.id} />
                        {/* <!-- IMAGE SELECT AREA--> */}

                        <div className="form__image">
                            <div id="img_select">
                                <div id="img_select__img" className="repoImagePreview">
                                    <input type="hidden" id="art_selected_image" name="image" />
                                </div>

                                <div id="img_select__buttons">
                                    <ButtonWithIcon
                                        parent={this}
                                        status={0}
                                        config={{
                                            class: "btnIcon_1",
                                            action: this.toggleRepo,
                                            label: "Repo",
                                            icon: "repo"
                                        }}
                                    />
                                </div>

                            </div>

                        </div>

                        {/* <!-- IMAGE SELECT AREA--> */}

                        <div className="form__box">
                            {/* <!-- ARTICLE TITLE AREA--> */}
                            <div className="form__title">
                                <TextInput
                                    parent={this}
                                    status={0}
                                    config={{
                                        text: "",
                                        floatingLabel:true,
                                        label: "Title",
                                        type: "text_input",
                                        comment: "Maximum characters allowed is (80)."
                                    }} />

                            </div>
                            {/* <!-- ARTICLE TITLE AREA--> */}

                            {/* <!-- ARTICLE AUTHOR AREA--> */}
                            <div className="form__author">
                                <TextInput
                                    parent={this}
                                    status={0}
                                    config={{
                                        text: "",
                                        floatingLabel: true,
                                        label: "Author",
                                        type: "text_input",
                                        comment: "Maximum characters allowed is (80)."
                                    }} />

                            </div>
                            {/* <!-- ARTICLE AUTHOR AREA--> */}



                            {/* <!-- ARTICLE TEXT AREA--> */}
                            <div className="form__textBox">
                                <div className="form__textBox__label f_label_1 f_text-capitalize">Body</div>
                                <div className="form__textBox__input ck--1">
                                    <CKEditor
                                        editor={BalloonEditor}
                                        data={this.state.form.body}
                                        onChange={this.handleArticleBodyChange}
                                    />
                                </div>
                                <div className="comment f_comment_1 f_text-capitalize">Maximum characters allowed is (60000). Currently, its ( {this.state.form.body.length} )</div>
                            </div>
                            {/* <!-- ARTICLE TEXT AREA--> */}



                            {/* <!-- ARTICLE SUMMARY AREA--> */}
                            <div className="form__summaryBox">
                                <MultiLineText
                                    parent={this}
                                    status={0}
                                    config={{
                                        text: "",
                                        label: "Summary",
                                        type: "mul_text_input",
                                        comment: "Maximum characters allowed is (200)."
                                    }} />

                            </div>
                            {/* <!-- ARTICLE SUMMARY AREA--> */}



                            <div className="form__tagInput">
                                <div className="form__tagInput__label f_label_1 f_text-capitalize">Tags</div>
                                <div className="form__tagInput__input" >
                                    <TagInput main={this.props.parent} parent={this} />
                                </div>
                            </div>


                            <div className="form__buttons">
                                <div className="form__buttons__button">
                                    <Button 
                                        parent={this} 
                                        status={0} 
                                        config={{
                                            label: "Save",
                                            action: this.article_submit,
                                            type: "btn_1",
                                            text: ""
                                        }} />
                                </div>

                                <div className="form__buttons__button">
                                    <Button
                                        parent={this}
                                        status={0}
                                        config={{
                                            label: "Back",
                                            action: () => {
                                                c.props.parent.setView(1);
                                            },
                                            type: "btn_1",
                                            text: ""
                                        }} />
                                </div>
                            </div>

                        </div>
                    </form>
                </div>

                {this.loadRepo()}
            </div>
        );
    }
}


export default Posts;