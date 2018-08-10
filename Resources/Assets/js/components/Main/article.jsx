import React, { Component } from 'react';
import {webUrl,defaultArticleCoverPic} from '../../abstract/variables';
import CommentingSystem from '../commentingSystem';
import ErrorPopup from "../UI/errorPopup";
import moment from "moment";
import axios from "axios";
import StickyBox from 'react-sticky-content';

class Article extends Component {
    constructor(props){
        super(props);

        this.state = {
            user:{},
            coverPhotoUrl:'',
            liked:false,
            likes:0,
            errorPopup:{},
            article:{
                id:document.getElementById("articleComponent").dataset.article,
                data:{},
            },
            profileUpdateState:false,
            ajax:{
                retrieveProfileData:{
                        attempts:0,
                        error:""
                },
                getArticle: {
                    attempts: 0,
                    error: ""
                }
            },
            scrollFixPoint:[
                {
                    offset:0,
                    state:0
                }
            ]
        };

        this.reloadAjaxRequest = this.reloadAjaxRequest.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.setScrollOffset = this.setScrollOffset.bind(this);
        this.setCoverPhoto = this.setCoverPhoto.bind(this);
        this.likeArticle = this.likeArticle.bind(this);
        this.getArticle = this.getArticle.bind(this);
    }

    componentDidMount() {
        this.getArticle();
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    setScrollOffset(){
        var state = this.state;
        var headerheight = $(".header").height();
        state.scrollFixPoint.offset = $("#section_1").offset().top - headerheight;
        this.setState(state);
    }

    handleScroll(e) {
        var state = this.state;
        var offset = state.scrollFixPoint[0].offset;

        var scrollYpos = $(document).scrollTop();

        if (scrollYpos > offset && state.scrollFixPoint[0] == 0) {
            state.scrollFixPoint[0] = 1;
            this.setState(state);
        }
        else if (scrollYpos < offset && state.scrollFixPoint[0] == 1) {
            state.scrollFixPoint[0] = 0;
            this.setState(state);
        }

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

    likeArticle() {
        var component = this;
        var state = component.state;
        var url = webUrl + "likeArticle/" + this.state.article.data.post.id;

        state.liked == false ? url += "/true" : url += "/false";

        axios({
            url:url,
            method:"GET"
        }).then((response)=>{
            var data = response.data;

            switch (data.error) {
                case 0: {
                    if (state.liked) {
                        state.liked = false;
                        state.likes -= 1;
                    }
                    else {
                        state.liked = true;
                        state.likes += 1;
                    }

                    component.setState(state);
                    break;
                }
                case 1: {
                    window.location.href = webUrl + "login";
                    break;
                }
            }

        }).catch((response)=>{
            if(resposne.status != 200){
                component.state.errorPopup.displayError('Error accessing server. Please try again later');
            }
        })
    }


    render() {
        var article = this.state.article.data.post;
        if (article == undefined) { return <div></div>; }

        var coverImage = {
            backgroundImage: "url('" + this.state.coverPhotoUrl + "')",
            backgroundSize:'cover',
            backgroundPosition:'center'
        }

        var section1Class = "section__1";
        var section3Class = "section__3";

        if(this.state.scrollFixPoint[0].state == 1){
            section1Class += "--float";
            section3Class += "--float";
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
                        <div id="section_1" className={section1Class}>
                            {/* <MiniProfileView user={this.state.profile.institution} userType={3} currentUser={this.state.user} />  */}
                        </div>
                    </StickyBox>
                    
                    <StickyBox >
                        
                        <div className="section__2">
                            <div className="navigation">
                                {/* <div className="navigation__home">
                                <a href={webUrl + this.state.insID}>
                                    <div className="btnIcon_1">
                                        <div className="btnIcon_1__icon">
                                            <svg className="icon">
                                                <use xlinkHref="#home" />
                                            </svg>
                                        </div>
                                        <div className="btnIcon_1__label f_normal t-6 f_text-center f_text-capitalize"></div>
                                    </div>
                                </a>
                            </div> */}



                                <div className="navigation__stat">
                                    <div className="navigation__stat__view">
                                        <div className="navigation__stat__icon">
                                            <div className="btn_icon--normal">
                                                <svg className="icon">
                                                    <use xlinkHref="#view" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="navigation__stat__value f_h2 f_text-bold">{article.stat.views}</div>
                                    </div>

                                    <div className="navigation__stat__likes">
                                        <div className="navigation__stat__icon">
                                            <div className="btn_icon--normal">
                                                <svg className="icon">
                                                    <use xlinkHref="#like" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="navigation__stat__value f_h2 f_text-bold">{this.state.likes}</div>
                                    </div>

                                    <div className="navigation__stat__com">
                                        <div className="navigation__stat__icon">
                                            <div className="btn_icon--normal">
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
                                        <div className={this.state.liked == true ? "btnIcon_2--success" : "btnIcon_2"} onClick={() => { this.likeArticle() }}>
                                            <div className="btnIcon_2__icon">
                                                <svg className="icon">
                                                    <use xlinkHref="#like" />
                                                </svg>
                                            </div>
                                            <div className="btnIcon_2__label f_normal">{this.state.liked == true ? "Liked" : "Like"}</div>
                                        </div>
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
                        <div className={section3Class}>
                        </div>
                    </StickyBox>
                    
                </div>  
            </div>
        );
    }
}


export default Article;