import React, { Component } from 'react';
import {webUrl,defaultArticleCoverPic} from '../../abstract/variables';
import CommentingSystem from '../commentingSystem';
import ErrorPopup from "../UI/errorPopup";
import moment from "moment";
import axios from "axios";
import StickyBox from 'react-sticky-content';
import ButtonWithIcon from './UI/buttonWithIcon';

class Article extends Component {
    constructor(props){
        super(props);

        this.state = {
            userId:"",
            coverPhotoUrl:'',
            reaction:0,
            stat:{
                likes:0,
                dislikes:0
            },
            errorPopup:{},
            buttons:[],
            article:{
                id:document.getElementById("articleComponent").dataset.article,
                data:{},
            },
            profileUpdateState:false,
            ajax:{
                retrieveProfileData:{
                        attempts:0,
                },
                getArticle: {
                    attempts: 0
                }
            }
        };

        this.reloadAjaxRequest = this.reloadAjaxRequest.bind(this);
        this.setCoverPhoto = this.setCoverPhoto.bind(this);
        this.reactToArticle = this.reactToArticle.bind(this);
        this.getArticle = this.getArticle.bind(this);
        this.checkReaction = this.checkReaction.bind(this);
    }

    componentDidMount() {
        this.getArticle();
    }

    reloadAjaxRequest(option) {
        var state = this.state;

        switch(option){
            case 1:{

                if (state.ajax.retrieveProfileData.attempts < 10) {
                    state.ajax.retrieveProfileData.attempts += 1;
                    this.setState(state);
                    this.retrieveProfileData();
                }
                else {
                    state.errorPopup.displayError("Access to server failed. Try again Later! ");
                    state.ajax.retrieveProfileData.attempts = 0;
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

    setCoverPhoto(){
        var state = this.state;
        var article = state.article.data.post;
        state.coverPhotoUrl = article.image != undefined ? webUrl + 'repo/' + article.image.name + "." + article.image.type : defaultArticleCoverPic;
        this.setState(state);
    }

    getArticle() {
        var component = this;
        var state = this.state;

        axios({
            url: webUrl + "getArticle/" + state.article.id,
            method:"GET"
        }).then((response)=>{
            var data = response.data;

            switch (data.error) {
                case 0:{
                        state.article.data = data.content;
                        state.likes = data.content.likes == undefined ? 0 : data.content.likes.length;
                        component.setState(state);

                        setTimeout(() => {
                            component.setCoverPhoto();
                        }, 1000);
                        break;
                    }
            }
        }).catch((response)=>{
            if(response.status != 200){
                component.reloadAjaxRequest(3);
            }
        })

    }

    reactToArticle(reaction = 1) {
        var component = this;
        var state = component.state;
        var url = webUrl + "articleReaction/" + this.state.article.data.post.id + "/" ;
        url+= state.reaction == reaction ? 0 : reaction;

        axios({
            url:url,
            method:"GET"
        }).then((response)=>{
            var data = response.data;

            switch (data.error) {
                case 0: {
                    var ind = state.article.stats.findIndex((item) => {
                        return item.user == state.userId;
                    })

                    if (ind < 0){
                        state.article.stats[ind].reaction = state.reaction == reaction ? 0 : reaction;
                    }

                    switch (state.reaction) {
                        case 0: {
                            switch (reaction) {
                                case 1: {
                                    state.stats.likes++;
                                    break;
                                }
                                case 2: {
                                    state.stats.dislikes++;
                                    break;
                                }
                            }
                            break;
                        }
                        case 1: {
                            switch (reaction) {
                                case 2: {
                                    state.stats.likes--;
                                    state.stats.dislikes++;
                                    break;
                                }
                            }
                            break;
                        }
                        case 2: {
                            switch (reaction) {
                                case 1: {
                                    state.stats.dislikes--;
                                    state.stats.likes++;
                                    break;
                                }
                            }
                            break;
                        }
                    }

                    component.setState(state);
                    component.checkReaction();
                    break;
                }
                default:{
                    component.state.errorPopup.displayError('We received an error message. Please try again later!');
                }
            }

        }).catch((response)=>{
            if(resposne.status != 200){
                component.state.errorPopup.displayError('Error accessing server. Please try again later!');
            }
        })
    }


    checkReaction() {
        var article = this.state.article.data.post;
        var state = this.state;

        var reaction = article.stats.find((item) => {
            return item.user == state.userId;
        })

        state.reaction = reaction == undefined ? 0 : reaction.reaction;

        state.buttons[0].state.status = state.reaction == 2 ? 5 : 0;
        state.buttons[0].state.label = state.reaction == 2 ? "Disliked" : "Dislike";
        state.buttons[1].state.status = state.reaction == 1 ? 6 : 0;
        state.buttons[1].state.label = state.reaction == 2 ? "Liked" : "Like";

        this.setState(state);
    }

    render() {
        var article = this.state.article.data.post;
        if (article == undefined) { return <div></div>; }

        var coverImage = {
            backgroundImage: "url('" + this.state.coverPhotoUrl + "')",
            backgroundSize:'cover',
            backgroundPosition:'center'
        }

        var time = moment(this.state.article.data.log.created_at,"YYYY-MM-DD HH:mm:ss").utc(3).local();
        var ctime = moment.duration(time.diff(moment()),'milliseconds').humanize();

        return (
            <div className="home">
                <ErrorPopup parent={this} />

                <div className="pageTop">
                    <div className="pageTop__background" style={coverImage}></div>
                    <div className="pageTop__foreground"></div>
                </div>

                <div className="section">

                    <StickyBox >
                        <div className="section__1"></div>
                    </StickyBox>
                    
                    <StickyBox >
                        
                        <div className="section__2">
                            <div className="navigation">
                                <div className="navigation__home">
                                    <a href={webUrl}>
                                        <div className="btnIcon_1">
                                            <div className="btnIcon_1__icon">
                                                <svg className="icon">
                                                    <use xlinkHref="#home" />
                                                </svg>
                                            </div>
                                            <div className="btnIcon_1__label f_normal f_text-center">Home</div>
                                        </div>
                                    </a>
                                </div>



                                <div className="navigation__stat">
                                    <div className="navigation__stat__view">
                                        <div className="navigation__stat__icon">
                                            <div className="iconBtn--normal">
                                                <svg className="icon">
                                                    <use xlinkHref="#view" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="navigation__stat__value f_h2 f_text-bold">{article.stat.views}</div>
                                    </div>

                                    <div className="navigation__stat__likes">
                                        <div className="navigation__stat__icon">
                                            <div className="iconBtn--normal">
                                                <svg className="icon">
                                                    <use xlinkHref="#like" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="navigation__stat__value f_h2 f_text-bold">{this.state.likes}</div>
                                    </div>

                                    <div className="navigation__stat__com">
                                        <div className="navigation__stat__icon">
                                            <div className="iconBtn--normal">
                                                <svg className="icon">
                                                    <use xlinkHref="#communication" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="navigation__stat__value f_h2 f_text-bold">{article.stat.comments}</div>
                                    </div>

                                </div>

                                <div className="navigation__buttons">
                                    <div className="navigation__buttons__button">
                                        <ButtonWithIcon
                                            parent={this}
                                            status={ this.state.reaction == 2 ? 5 : 0}
                                            config={{
                                                class: "btnIcon_2",
                                                action: () => { this.reactToArticle(1)},
                                                label: this.state.reaction == 2 ? "Disliked" : "Dislike",
                                                icon: "dislike"
                                            }}
                                        />
                                    </div>
                                    <div className="navigation__buttons__button">
                                        <ButtonWithIcon 
                                            parent={this}
                                            status={this.state.reaction == 1 ? 6 : 0}
                                            config={{
                                                class:"btnIcon_2",
                                                action: () => { this.reactToArticle(1) },
                                                label: this.state.reaction == 1 ? "Liked" : "Like",
                                                icon:"like"
                                            }}
                                        />
                                    </div>
                                </div>

                            </div>

                            <div className="article">
                                <div className="article__content">
                                    <div className="article__primary">

                                        <div className="article__title f_title f_text-capitalize">{article.title}</div>
                                        
                                        <div className="article__author f_h2 f_text-capitalize">{article.author}</div>
                                        <div className="article__time f_normal">{ctime + " ago"}</div>

                                    </div>
                                    <div className="article__tags">
                                        {
                                            article.tags.map((item, i) => {
                                                return (<div className="article__tag f_normal" key={i}>{item.name}</div>);
                                            })
                                        }
                                    </div>

                                    <div className="article__text">
                                        <div className="ck--1" dangerouslySetInnerHTML={{ __html: article.body }}></div>
                                    </div>

                                </div>

                            <div className="article__commentSection">
                                <CommentingSystem commentingOn={1} article={this.state.article.data} />
                            </div> 

                            </div>

                        </div>

                    </StickyBox>

                    

                    <StickyBox >
                        <div className="section__3"></div>
                    </StickyBox>
                    
                </div>  
            </div>
        );
    }
}


export default Article;