import React, { Component } from 'react';
import Repo from '../repo';
import webUrl from '../../abstract/variables';
import ErrorPopup from '../UI/errorPopup';
import Popup from '../UI/popup';
import axios from 'axios';
import TagInput from '../tagInput';
import Button from '../UI/button';
import TextInput from '../UI/textInput';
import CKEditor from '@ckeditor/ckeditor5-react';
import BalloonEditor from '@ckeditor/ckeditor5-build-balloon';
import MultiLineText from '../UI/MultiLineTextInput';

class EditArticle extends Component {
    constructor(props){
        super(props);

        this.reloadAjaxRequest = this.reloadAjaxRequest.bind(this);
        this.getArticle = this.getArticle.bind(this);
        this.setCoverImage = this.setCoverImage.bind(this);

        this.state = {
            ajax:{
                getArticle: {
                    error: "",
                    attempts: 0
                },
                getExtraData:{
                    error:"",
                    attempts:0
                }
            },
            articleId: document.querySelector("#editArticleComponent").dataset.article,
            article:{
                log:{
                    id:"",
                    type:"",
                    created_at:""
                },
                post:{
                    title:"",
                    author: "",
                    body: "",
                    summary: "",
                    id: "",
                    tags:[]
                }
            },
            updated:false,
            errorPopup:{}
        }

    }

    componentDidMount(){
        this.getArticle();
    }

    reloadAjaxRequest(option) {
        var state = this.state;

        switch (option) {
            case 1: {

                if (state.ajax.getExtraData.attempts < 10) {
                    state.ajax.getExtraData.attempts += 1;
                    this.setState(state);
                    this.getExtraData();
                }
                else {
                    state.errorPopup.displayError("Access to server failed. Try again Later! ");
                    state.ajax.getExtraData.attempts = 0;
                    this.setState(state);
                }
                break;
            }
            case 2: {

                if (state.ajax.getArticle.attempts < 10) {
                    state.ajax.getArticle.attempts += 1;
                    this.setState(state);
                    this.getArticle();
                }
                else {
                    state.errorPopup.displayError("Access to server failed. Try again Later! ");
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
        var url = webUrl + "admin/article/"+ state.articleId;

        axios({
            url:url,
            method:"GET"
        }).catch((response) => {
            if (response.status != 200) {
                component.reloadAjaxRequest(2);
            }
        }).then((response)=>{
            var data = response.data;

            switch (data.error) {
                case 0: {
                    state.updated = true;
                    state.article = data.content;
                    component.setState(state);
                    component.setCoverImage();
                    break;
                }
            }
        })

    }

    setCoverImage() {
        var state = this.state;

        if(state.article.post.image != undefined){
            var preview = document.querySelector(".repoImagePreview");
            preview.setAttribute('style', "background:" + "url(\"" + webUrl + 'repo/' + state.article.post.image.name + "." + state.article.post.image.type + "\") center ; background-size:cover;");

            preview.dataset.image = JSON.stringify( state.article.post.image);
        }
    }

    render() {
        if(this.state.article.post == undefined || this.state.article.post.title == undefined){   return <div></div>; }

        return (
            <div id="section_1">
                <ErrorPopup parent={this}/>
                <div className="article"><Edit parent={this}/></div>
            </div>

        );
    }
}

class Edit extends Component {
    constructor(props){
        super(props);

        this.state = {
            toggleRepo:false,
            textInputs:[],
            buttons:[],
            data: {
                currency: [],
                duration: []
            },
            form: {
                title: {
                    value: "",
                    error: ""
                },
                author: {
                    value: "",
                    error: ""
                },
                summary: {
                    value: "",
                    error: ""
                },
                body: ""
            },
            updated:false,
            popups: [],
            tags:[]
        }

        this.setArticleData = this.setArticleData.bind(this);
        this.handleArticleBodyChange = this.handleArticleBodyChange.bind(this);
        this.toggleRepo = this.toggleRepo.bind(this);
        this.loadRepo = this.loadRepo.bind(this);
        this.article_submit = this.article_submit.bind(this);
    }

    componentDidMount(){
        var state = this.state;
        state.loaded = true;
        this.setState(state);
        this.setArticleData();
    }

    componentDidUpdate(){
        if (this.props.parent.state.updated != this.state.updated){
            this.setArticleData();
        }
    }

    setArticleData() {
        var state = this.state;
        var article = this.props.parent.state.article.post;
        
        if (article != null) {

            state.textInputs[0].state.inputValue = article.title;
            state.textInputs[1].state.inputValue = article.author;
            state.textInputs[2].state.inputValue = article.summary;
            state.form.body = article.body;
            state.tags = article.tags;
            state.updated = this.props.parent.state.updated;
            
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

        textInputs.forEach((elem)=>{
            if(elem.state.inputValue == ""){
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

        var errorPopup = this.state.errorPopup;

        axios({
            url: webUrl + "admin/article/" + this.props.parent.state.article.post.id,
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
            if(response.status != 200){
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

        return (
            <div id="editArticle">
                <ErrorPopup parent={this}/>

                <div className={this.state.toggleRepo ? "base--disabled" : "base" }>
                    <form method="post" encType="multipart/form-data">
                        <input type="hidden" name="article" value={this.props.parent.state.article.post.id} />
                        {/* <!-- IMAGE SELECT AREA--> */}

                        <div className="form__image">
                            <div id="img_select">
                                <div id="img_select__img" className="repoImagePreview">
                                    <input type="hidden" id="art_selected_image" name="image" />
                                </div>

                                <div id="img_select__buttons">
                                    <div className="btnIcon_1" onClick={() => { this.toggleRepo() }}>
                                        <div className="btnIcon_1__icon">
                                            <svg className="icon">
                                                <use xlinkHref="#repo" />
                                            </svg>
                                        </div>
                                        <div className="btnIcon_1__label f_button_2 f_text-capitalize">Repo</div>
                                    </div>
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
                                        label: "Title",
                                        type: "text_input_4",
                                        comment:"Maximum characters allowed is (80). Currently, its ( "+ this.state.form.title.value.length + " )",
                                        inputValue:""
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
                                        label: "Author",
                                        type: "text_input_4",
                                        comment: "Maximum characters allowed is (80). Currently, its ( "+ this.state.form.author.value.length + " )",
                                        inputValue: ""
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
                                        comment: "Maximum characters allowed is (200). Currently, its ( " + this.state.form.summary.value.length + " )",
                                        inputValue: this.state.form.summary.value
                                    }} />

                            </div>
                            {/* <!-- ARTICLE SUMMARY AREA--> */}



                            <div className="form__tagInput">
                                <div className="form__tagInput__label f_label_1 f_text-capitalize">Tags</div>
                                <div className="form__tagInput__input" >
                                    <TagInput main={this.state.parent} parent={this} />
                                </div>
                            </div>


                            <div className="form__buttons">
                                <div className="form__buttons__button">
                                    <Button parent={this} status={0} config={{
                                        label: "Save",
                                        action: this.article_submit,
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


export default EditArticle;