import React, { Component } from 'react';
import Repo from '../repo';
import {webUrl,defaultArticleCoverPic} from '../../abstract/variables';
import Popup from '../UI/popup';
import ErrorPopup from '../UI/errorPopup';
import axios from 'axios';
import TagInput from '../tagInput';
import Button from '../UI/button';
import BalloonEditor from "@ckeditor/ckeditor5-build-balloon";
import CKEditor from "@ckeditor/ckeditor5-react";
import TextInput from '../UI/textInput';
import MultiLineText from '../UI/MultiLineTextInput';

class AddArticle extends Component {
    constructor(props){
        super(props);

        this.article_submit = this.article_submit.bind(this);
        this.handleAuthorChange = this.handleAuthorChange.bind(this);
        this.handleSummaryChange = this.handleSummaryChange.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.loadRepo = this.loadRepo.bind(this);
        this.toggleRepo = this.toggleRepo.bind(this);
        this.onArticleBodyChange = this.onArticleBodyChange.bind(this);

        this.state = {
            toggleRepo:false,
            loaded:false,
            popups:[],
            errorPopup:{},
            tags:[],
            textInputs:[],
            buttons:[],
            editor:{},
            form:{
                title:{
                    value:"",
                    error:""
                },
                author: {
                    value: "",
                    error: ""
                },
                body: "<p>Start editing now!</p>",
                summary: {
                    value: "",
                    error: ""
                }
            }
        }

    }

    componentDidMount(){
        var c = this;
        var state = this.state;
        state.loaded = true;
        this.setState(state);
    }

    onArticleBodyChange(event,editor){
        var state = this.state;
        state.form.body = editor.getData().substr(0,60000);
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
    
        if (form.body == "") {
            document.querySelector("#art__text").focus();
            return;
        }

        var tags = [];

        this.state.tags.forEach((elem)=>{
            tags.push(elem.id)
        });

        var formData = {
                art__image: imageFile.id,
                art__title:form.title.value,
                art__author:form.author.value,
                art__body:form.body,
                art__summary:form.summary.value,
                art__tags:tags
            };
        
        var errorPopup = this.state.errorPopup;

        axios({
            url:webUrl + "admin/article/0",
            method:"POST",
            data:formData
        }).then((response)=>{
            var data = response.data;

            switch(data.error){
                case 0:{
                    window.location.href = webUrl + "admin/posts";
                    break;
                }
                case 1:{
                    errorPopup.displayError("Failed to save the article. Please try again");
                    break;
                }
            }
        }).catch(()=>{
            errorPopup.displayError("Failed to access server. Please try again in a few minutes.");
        })

    }

    handleTitleChange(e){
        var state = this.state;
        state.form.title.value = e.target.value.substr(0,79);
        this.setState(state);
    }

    handleAuthorChange(e) {
        var state = this.state;
        state.form.author.value = e.target.value.substr(0, 29);
        this.setState(state);
    }

    handleSummaryChange(e) {
        var state = this.state;
        state.form.summary.value = e.target.value.substr(0, 199);
        this.setState(state);
    }

    toggleRepo() {
        this.state.popups[0].toggleContent();
    }

    loadRepo() {
        if (this.state.loaded == true) {
            return (<Popup component={<Repo parent={this} sType={1} rCount={1} token={this.props.token} userType={3} />} parent={this}/>);
        }
    }

    render() {
        var c = this;
        var placeholder = {
            backgroundImage: "url('" + defaultArticleCoverPic + "')",
            backgroundPosition:'center',
            backgroundSize:'cover'
        }

        console.log(BalloonEditor);

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
                <ErrorPopup parent={this}/>

                <div className="base">
                    <form method="post" encType="multipart/form-data" style={{ margin: 0, padding: 0 }}>
                        {/* <!-- IMAGE SELECT AREA--> */}

                        <div id="art__image">
                            <div id="img_select">
                                <div id="img_select__img" className="repoImagePreview" style={placeholder}>
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

                        <div id="art__form" >
                            {/* <!-- ARTICLE TITLE AREA--> */}
                            <div id="art__title">
                                <TextInput
                                    parent={this}
                                    status={0}
                                    config={{
                                        text: "",
                                        label: "Title",
                                        type: "text_input_4",
                                        comment: "Maximum characters allowed is (80). Currently, its ( " + this.state.form.title.value.length + " )"
                                    }} />
                            </div>
                            {/* <!-- ARTICLE TITLE AREA--> */}

                            {/* <!-- ARTICLE AUTHOR AREA--> */}
                            <div id="art__author">
                                <TextInput
                                    parent={this}
                                    status={0}
                                    config={{
                                        text: "",
                                        label: "Author",
                                        type: "text_input_4",
                                        comment: "Maximum characters allowed is (80). Currently, its ( " + this.state.form.author.value.length + " )"
                                    }} />
                                    
                            </div>
                            {/* <!-- ARTICLE AUTHOR AREA--> */}

                            {/* <!-- ARTICLE TEXT AREA--> */}
                            <div id="art__textBox">
                                <div id="art__textBox__label" className="f_h1 f_text-capitalize">Body Text</div>
                                <div id="art__textBox__input ck--1">
                                    <CKEditor
                                        editor={BalloonEditor}
                                        data={this.state.form.body}
                                        onChange={this.onArticleBodyChange}
                                    />
                                </div>

                                <div className="comment f_comment_1 f_text-capitalize">Maximum characters allowed is (60000). Currently, its ( {this.state.form.body.length} ) </div>

                            </div>
                            {/* <!-- ARTICLE TEXT AREA--> */}

                            {/* <!-- ARTICLE SUMMARY AREA--> */}
                            <div id="art__summaryBox">
                                <MultiLineText
                                    parent={this}
                                    status={0}
                                    config={{
                                        text: "",
                                        label: "Summary",
                                        type: "mul_text_input",
                                        comment: "Maximum characters allowed is (200). Currently, its ( " + this.state.form.summary.value.length + " )"
                                    }} />
                                    
                            </div>
                            {/* <!-- ARTICLE SUMMARY AREA--> */}


                            <div id="art__summaryBox">
                                <div id="art__summaryBox__label" className="f_h1 f_text-capitalize">Tags</div>
                                <div id="art__summaryBox__input" >
                                    <TagInput main={this} parent={this} />
                                </div>
                            </div>

                            <div id="art__save">
                                <Button parent={this} status={0} config={{
                                    label:"Save", 
                                    action:this.article_submit, 
                                    type:"btn_1",
                                    text:""}}/>
                            </div>

                        </div>
                    </form>
                </div>


                {this.loadRepo()}
            </div>
        );
    }
}

export default AddArticle;