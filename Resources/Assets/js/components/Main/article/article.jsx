import React, { Component } from 'react';
import webUrl from "../../../abstract/variables";
import humanize from "@nlib/human-readable";

class Article1 extends Component {
    render() {
        var post = this.props.post;

        const image = {
            background: 'url("' + webUrl + "repo/" + post.post.image.name + '/thumb_150_150.jpg")',
            backgroundPosition: 'center',
            backgroundSize: 'cover'
        }

        return (
            <div className="art--1__con" id={"p-" + post.log.id}>
                <div className="art--1__con__left" style={image}></div>

                <div className="art--1__con__right">
                    <a href={webUrl + "article/" + post.post.id} target="_blank">
                        <div className="art--1__link">
                            <div className="art--1__title f_h1 f_text-capitalize">{post.post.title}</div>
                            <svg className="icon">
                                <use xlinkHref="#view" />
                            </svg>
                        </div>
                    </a>

                    <div className="art--1__summary f_normal">{post.post.summary}</div>

                    <div className="art--1__stat">
                        <div className="art--1__stat__view">
                            <div className="art--1__stat__icon">
                                <div className="iconBtn--normal">
                                    <svg className="icon">
                                        <use xlinkHref="#view" />
                                    </svg>
                                </div>
                            </div>
                            <div className="art--1__stat__value f_h2 f_text-bold">{humanize(post.post.stat.views)}</div>
                        </div>

                        <div className="art--1__stat__likes">
                            <div className="art--1__stat__icon">
                                <div className="iconBtn--normal">
                                    <svg className="icon">
                                        <use xlinkHref="#like" />
                                    </svg>
                                </div>
                            </div>
                            <div className="art--1__stat__value f_h2 f_text-bold">{humanize(post.post.stat.reactions)}</div>
                        </div>

                        <div className="art--1__stat__com">
                            <div className="art--1__stat__icon">
                                <div className="iconBtn--normal">
                                    <svg className="icon">
                                        <use xlinkHref="#communication" />
                                    </svg>
                                </div>
                            </div>
                            <div className="art--1__stat__value f_h2 f_text-bold">{humanize(post.post.stat.comments)}</div>
                        </div>


                    </div>
                </div>
            </div>
        );
    }
}

class Article2 extends Component {
    render() {
        var post = this.props.post;

        const image = {
            background: 'url("' + webUrl + "repo/" + post.post.image.name + '/thumb_150_150.jpg")',
            backgroundPosition: 'center',
            backgroundSize: 'cover'
        }

        return (
            <div className="art--2__con" id={"p-" + post.log.id}>
                <div className="art--2__con__left" style={image}></div>

                <div className="art--2__con__right">
                    <a href={webUrl + "article/" + post.post.id}>
                        <div className="art--2__link">
                            <div className="art--2__title f_comment_1 f_text-capitalize">{post.post.title}</div>
                        </div>
                    </a>

                    <div className="art--2__tags">
                        {
                            post.tags.map((item, i) => {
                                return (<div className="art--2__tag f_comment_1" key={i}>{item.name}</div>);
                            })
                        }
                    </div>
                    
                    <div className="art--2__stat">
                        <div className="art--2__stat__view">
                            <div className="art--2__stat__icon">
                                <div className="iconBtn--normal">
                                    <svg className="icon">
                                        <use xlinkHref="#view" />
                                    </svg>
                                </div>
                            </div>
                            <div className="art--2__stat__value f_comment_1 f_text-bold">{humanize(post.post.stat.views)}</div>
                        </div>

                        <div className="art--2__stat__likes">
                            <div className="art--2__stat__icon">
                                <div className="iconBtn--normal">
                                    <svg className="icon">
                                        <use xlinkHref="#like" />
                                    </svg>
                                </div>
                            </div>
                            <div className="art--2__stat__value f_comment_1 f_text-bold">{humanize(post.post.stat.reactions)}</div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export {
    Article1,
    Article2
};