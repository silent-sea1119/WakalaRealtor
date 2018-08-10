import React, { Component } from 'react';
import webUrl from '../../abstract/variables';
import axios from 'axios';
import moment from 'moment';
import Button from "../UI/button";
import ErrorPopup from '../UI/errorPopup';
import humanize from '@nlib/human-readable';

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
                        <div className="topBar__title f_h1 f_text-left t-127 f_text-capitalize"></div>
                        <div className="topBar__right">
                        
                            <a href={webUrl + 'admin/addArticle'}>
                                <div className="topBar__right__add">
                                    <div className="btnIcon_1">
                                        <div className="btnIcon_1__icon">
                                            <svg className="icon">
                                                <use xlinkHref="#add-2" />
                                            </svg>
                                        </div>
                                        <div className="btnIcon_1__label f_button_1">Article</div>
                                </div>
                                </div>
                            </a>
                             {/* 
                            <a href={webUrl + 'admin/addNotice'}>
                                <div className="topBar__right__add">
                                    <div className="btnIcon_1">
                                        <div className="btnIcon_1__icon">
                                            <svg className="icon">
                                                <use xlinkHref="#add-2" />
                                            </svg>
                                        </div>
                                        <div className="btnIcon_1__label f_button_1">Notice</div>
                                    </div>
                                </div>
                            </a> */} 

                        </div>
                    </div>

                    {
                        this.state.content.map((item, i) => {
                            switch (item.log.type) {
                                case 1: {
                                    if (!this.state.viewable.article)  {   return;      }

                                    switch (this.state.viewType.article) {
                                        case 1: { return <Article post={item} key={i}/>; }
                                    }

                                    break;
                                }
                            }
                        })
                    }

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

        const image = {
            background: 'url("' + webUrl + "repo/" + post.post.image.name + "." + post.post.image.type + '")',
            backgroundPosition: 'center',
            backgroundSize: 'cover'
        }

        var time = moment(post.log.created_at, "YYYY-MM-DD HH:mm:ss").utc(3).local();
        var ctime = moment.duration(time.diff(moment()), 'milliseconds').humanize();
        
        return (
            <div className="art--1__con" id={"p-" + post.log.id}>
                <a href={webUrl + "admin/editArticle/" + post.post.id + "/false"}>
                    <div className="art--1__con__up" style={image}></div>
                </a>
                
                <div className="art--1__con__down">

                    <div className="art--1__title f_h1 f_text-capitalize">{post.post.title}</div>
                    <div className="art--1__author f_comment_1 f_text-capitalize t-160">{" " + post.post.author}</div>
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
                            <div className="art--1__stat__value f_h2 f_text-bold">{humanize(post.post.stat.likes)}</div>
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

/* 

class Notice extends Component {
    render() {
        var post = this.props.post;
        var ctime = Date.now() - Date.parse(post.log.created_at.date + " " + post.log.created_at.timezone);

        return (
            <div className="notice--1__con" id={"p-" + post.log.id}>
                <a href={webUrl + "admin/edit/" + post.log.id + "/false"}>
                    <div className="notice--1__con__left">
                        <svg className="icon">
                            <use xlinkHref="#warning" />
                        </svg>
                    </div>
                </a>

                <div className="notice--1__con__right">

                    <div className="notice--1__title f_h1 f_text-capitalize">{post.post.title.substr(0,15)}</div>
                    <div className="notice--1__author f_comment_1 f_text-capitalize t-160">{" " + post.post.author}</div>
                    <div className="notice--1__time f_comment_1 f_text-capitalize ">{humanizeDuration(ctime,{largest:1}) + " ago"}</div>
                    <div className="notice--1__text f_normal">{post.post.summary}</div>

                    <div className="notice--1__stat">
                        <div className="notice--1__stat__view">
                            <div className="notice--1__stat__icon">
                                <div className="btn_icon--normal">
                                    <svg className="icon">
                                        <use xlinkHref="#view" />
                                    </svg>
                                </div>
                            </div>
                            <div className="notice--1__stat__value f_h2 f_text-bold">{post.post.stat.views}</div>
                        </div>

                        <div className="notice--1__stat__likes">
                            <div className="notice--1__stat__icon">
                                <div className="btn_icon--normal">
                                    <svg className="icon">
                                        <use xlinkHref="#like" />
                                    </svg>
                                </div>
                            </div>
                            <div className="notice--1__stat__value f_h2 f_text-bold">{post.post.stat.likes}</div>
                        </div>

                        <div className="notice--1__stat__com">
                            <div className="notice--1__stat__icon">
                                <div className="btn_icon--normal">
                                    <svg className="icon">
                                        <use xlinkHref="#communication" />
                                    </svg>
                                </div>
                            </div>
                            <div className="notice--1__stat__value f_h2 f_text-bold">{post.post.stat.comments}</div>
                        </div>



                        <a href={webUrl + "admin/editNotice/" + post.log.id + "/true"}>
                            <div className="notice--1__edit">
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
} */


export default PostsView;