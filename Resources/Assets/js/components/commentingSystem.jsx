import React, { Component } from 'react';
import { webUrl, defaultUserPic} from "../abstract/variables";
import moment from "moment";
import Button from './UI/button';
import ErrorPopup from './UI/errorPopup';
import axios from 'axios';
import MultiLineTextInput from './UI/MultiLineTextInput';
import TextInput from './UI/textInput';

class CommentingSystem extends Component {
    constructor(props){
            super(props);

            this.setCommentInput = this.setCommentInput.bind(this);
            this.reloadAjaxRequest = this.reloadAjaxRequest.bind(this);
            this.setComments = this.setComments.bind(this);
            this.getComments = this.getComments.bind(this);
            this.toggleViewAll = this.toggleViewAll.bind(this);

            this.state = {
                errorPopup:{},
                preview:this.props.preview == undefined ? {state:false,count:0} : this.props.preview,
                userId:"",
                comments:{
                    data: [],
                    head: -1
                },
                ajax: {
                    getComments: {
                        attempts: 0,
                        error: ""
                    }
                }
            }
        }

    componentDidMount(){
        this.getComments();
    }

    setCommentInput(){
        return <CommentInput main={this} />
    }

    setComments() {
        var comments = this.state.comments;
        var preview = this.state.preview;

        if (comments != [] || comments != null) {
            return (
                comments.data.map((item,i)=>{
                    if(preview.state == true && preview.count <= i){   return;  }
                    else{
                        return <Comment key={i} comment={item} main={this} />;
                    }
                })
            );
        }
        else {
            return <NoCommentPlaceholder />;
        }
    }

    reloadAjaxRequest(option) {
        var state = this.state;

        switch (option) {
            case 1: {

                if (state.ajax.getComments.attempts < 5) {
                    state.ajax.getComments.attempts += 1;
                    this.setState(state);
                    this.getComments();
                }
                else {
                    state.errorPopup.displayError("Access to server failed. Try again Later! ");
                    state.ajax.getComments.attempts = 0;
                    this.setState(state);
                }
                break;
            }
        }

    }

    getComments() {
        var component = this;
        var state = this.state;
        var url = webUrl;

        switch(this.props.commentingOn){
            case 1:{
                url += "comment/" + this.props.article.post.id;
                break;
            }
        }

        url += state.comments.data.length == 0 || state.comments.data == undefined ? "/1/0" : "/1/" + state.comments.data.length;

        axios({
            url:url,
            method:"GET"
        }).then((response)=>{
            var data = response.data;
            switch (data.error) {
                case 0:{
                        if (data.content != []) {
                            state.comments.data = data.content.concat(state.comments.data);
                            state.userId = data.userId;
                            component.setState(state);
                        }

                        break;
                    }
            }
        }).catch((response)=>{
            if(response.status == 0){
                component.reloadAjaxRequest(3);
            }
        })

    }

    toggleViewAll(){
        var state = this.state;
        state.preview.state = state.preview.state == false ? true :false;
        this.setState(state);
    }

    setToggleViewAll(){
        var state = this.state;

        if(state.preview.count > 0 && state.comments.data.length > state.preview.count){
            var text = state.preview.state ? "View more ..." : "Collapse";
            return (<div className="commentSection__vMore f_normal" onClick={() => { this.toggleViewAll() }}>{text}</div>);
        }
        else {
            return (<div></div>);
        }
        
    }

    render() {
        return (
            <div className="commentSection">
                <ErrorPopup parent={this}/>
                <div className="commentSection__title f_h1">{this.state.comments.data.length + ' comments'}</div>
                {this.setCommentInput()}
                {this.setComments()}
                {this.setToggleViewAll()}
            </div>
        );
    }
}


class CommentInput extends Component {
    constructor(props){
        super(props);

        this.postComment = this.postComment.bind(this);
        this.reloadAjaxRequest = this.reloadAjaxRequest.bind(this);

        this.state = {
            textInputs:[],
            buttons:[],
            ajax:{
                postComment:{
                    attempts:0
                }
            }
        }
    }

    reloadAjaxRequest(option) {
        var state = this.state;

        switch (option) {
            case 1: {

                if (state.ajax.postComment.attempts < 10) {
                    state.ajax.postComment.attempts += 1;
                    this.setState(state);
                    this.postComment();
                }
                else {
                    this.props.parent.state.errorPopup.displayError("Access to server failed. Try again Later! ");
                    state.ajax.postComment.attempts = 0;
                    this.setState(state);
                }
                break;
            }
        }

    }

    postComment(){
        console.log("Submission has begun.");

        var component = this;
        var state = this.state;
        var textInputs = state.textInputs;

        textInputs.forEach((elem,i)=>{

            if(elem.state.inputValue == ""){
                elem.state.status = 1;
                elem.focus();
                return; 
            }
        })

        var formData = {
            name:textInputs[0].state.inputValue,
            email: textInputs[1].state.inputValue,
            comment: textInputs[2].state.inputValue
        }

        var url = webUrl + "comment/" + this.props.main.props.commentingOn + "/";

        switch(this.props.main.props.commentingOn){
            case 1:{
                url += this.props.main.props.article.log.id + "/0";
                break;
            }
        }

        state.buttons[0].setStatus(3);
        var errorPopup = this.props.main.state.errorPopup;

        axios({
            url:url,
            method:"POST",
            data:formData
        }).then((response)=>{

            switch (response.data.error) {
                case 0: {
                    state.buttons[0].setStatus(2);
                    component.props.main.getComments();
                    break;
                }
                case 1: {
                    errorPopup.displayError("Failed to send comment. Try again Later! ")
                    break;
                }
            }
        }).catch((response)=>{
            console.log(response);

            if(response.status != 200){
                state.buttons[0].setStatus(1);
                errorPopup.displayError("Access to server failed. Try again Later! ");
            }
        });

    }

    render() {
        var c = this;

        return (
            <div className="commentInput">
                <div className="commentInput__form">
                    <div className="commentInput__user">
                        <div className="commentInput__user__pic">
                            <img src={defaultUserPic[1]} />
                        </div>
                    </div>

                    <div className="commentInput__user__details">
                        <div className="commentInput__user__name">
                            <TextInput
                                parent={this}
                                status={0}
                                config={{
                                    label: "",
                                    length:60,
                                    type: "text_input_4",
                                    placeholder:"Name ...",
                                    comment: "Maximum characters allowed is (60)."
                                }} />
                        </div>

                        <div className="commentInput__user__email">
                            <TextInput
                                parent={this}
                                status={0}
                                config={{
                                    label: "",
                                    type: "text_input_4",
                                    placeholder: "Email Address ...",
                                    comment: "Maximum characters allowed is (80)."
                                }} />
                        </div>
                    </div>

                    <div className="commentInput__box">
                        <MultiLineTextInput 
                            parent={this}
                            status={0}
                            config={{
                                label:"Comment",
                                type:"mul_text_input",
                                placeholder: "Add a comment..."
                            }}
                        />


                        <div className="commentInput__sendBtn">
                            <Button 
                                parent={this} 
                                config={{ 
                                    type: "btn_1", 
                                    action: this.postComment, 
                                    label: "Send", 
                                    text: "" }} 
                                status={0} />
                        </div>
                    </div>

     
                </div>
            </div>
        );
    }
}


class NoCommentPlaceholder extends Component {
    render() {
        return (
            <div className="noComment">
                <div className="noComment__text f_normal">No one has commented on this post yet. Be the first. </div>
            </div>
        );
    }
}

class Comment extends Component {
    constructor(props){
        super(props);
        var stats = {
            likes:0,
            dislikes:0
        }

        this.props.comment.stats.forEach((s)=>{
            switch(s.reaction){
                case 1:{
                    stats.likes ++;
                    break;
                }
                case 2:{
                    stats.dislikes ++;
                    break;
                }
            }
        })

        this.state = {
            reaction:0,
            stats: stats
        }

        this.checkIfLiked = this.checkIfLiked.bind(this);
        this.reactToComment = this.reactToComment.bind(this);
    }

    componentDidMount(){
        this.checkIfLiked();
    }

    reactToComment(reaction = 1){
        var component = this;
        var state = component.state;

        //Reactions
        //1 - Like
        //2 - Dislike

        if(state.reaction == reaction){ return; }

        var url = webUrl + "commentReaction/" +  this.props.main.props.commentingOn +"/"+ this.props.comment.id + "/" + reaction;

        axios({
            url:url,
            method:"GET"
        }).catch((response) => {
            if (response.status != 200) {
                component.props.main.state.errorPopup.displayError("Access to server failed. Try again Later! ");
            }
        }).then((response)=>{
            
            switch(response.data.error){
                case 0: {
                    var prevReaction = state.reaction;
                    state.reaction = reaction;

                    switch (prevReaction){
                        case 0:{
                            switch (reaction) {
                                case 1: {
                                    state.likes++;
                                    break;
                                }
                                case 2: {
                                    state.dislikes++;
                                    break;
                                }
                            }
                            break;
                        }
                        case 1:{
                            switch (reaction) {
                                case 2: {
                                    state.likes--;
                                    state.dislikes++;
                                    break;
                                }
                            }
                            break;
                        }
                        case 2:{
                            switch (reaction) {
                                case 1: {
                                    state.dislikes--;
                                    state.likes++;
                                    break;
                                }
                            }
                            break;
                        }
                    }

                    component.setState(state);
                    component.checkIfLiked();
                    break;
                }
            }
        })
    }

    checkIfLiked(){
        var comment = this.props.comment;
        var state = this.state;
        var userId = this.props.main.state.userId;

        var reaction = comment.stats.find((item)=>{
            return item.user == userId;
        })

        console.log(userId);
        console.log(state);
        console.log(reaction);

        state.reaction = reaction == undefined ? 0 : reaction.reaction;
        this.setState(state);
    }

    render() {
        var comment = this.props.comment;
        var time = moment(comment.created_at, "YYYY-MM-DDTHH:mm:ss").utc(3).local();
        var reaction = this.state.reaction;

        return (
            <div className="comment" >
                <div className="comment__user">
                    <div className="comment__user__pic">
                        <img src={defaultUserPic[1]} />
                    </div>
                </div>

                <div className="comment__right">
                    <div className="comment__right__top">
                        <div className="comment__right__top__name f_h2">{comment.userName}</div>
                        <div className="comment__right__top__time f_normal">{moment.duration(moment().diff(time)).humanize() + " ago"}</div>
                    </div>

                    <div className="comment__text f_normal">{comment.comment}</div>

                    <div className="comment__bottom">
                        <div className="comment__buttons">
                            <div className="comment__buttons__button">
                                <div className={reaction == 1 ? "btnIcon_2--success" : "btnIcon_2"} onClick={()=>{this.reactToComment(1)}}>
                                    <div className="btnIcon_2__icon">
                                        <svg className="icon">
                                            <use xlinkHref="#like" />
                                        </svg>
                                    </div>
                                    <div className="btnIcon_2__label f_normal">{reaction == 1 ? "Liked" : "Like"}</div>
                                </div>
                            </div>

                            <div className="comment__buttons__button">
                                <div className={reaction == 2 ? "btnIcon_2--success" : "btnIcon_2"} onClick={() => { this.reactToComment(2) }}>
                                    <div className="btnIcon_2__icon">
                                        <svg className="icon">
                                            <use xlinkHref="#like" />
                                        </svg>
                                    </div>
                                    <div className="btnIcon_2__label f_normal">{reaction == 2? "Disliked" : "Dislike"}</div>
                                </div>
                            </div>

                        </div>

                        <div className="comment__stats">

                            <div className="comment__stats__likes">
                                <div className="comment__stats__icon">
                                    <div className="btn_icon--normal">
                                        <svg className="icon">
                                            <use xlinkHref="#like" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="comment__stats__values f_normal">{this.state.stats.dislikes}</div>
                            </div>


                            <div className="comment__stats__likes">
                                <div className="comment__stats__icon">
                                    <div className="btn_icon--normal">
                                        <svg className="icon">
                                            <use xlinkHref="#like" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="comment__stats__values f_normal">{this.state.stats.likes}</div>
                            </div>

                            
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default CommentingSystem;
