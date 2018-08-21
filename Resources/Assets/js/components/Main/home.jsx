import humanize from '@nlib/human-readable';
import axios from 'axios';
import React, { Component } from 'react';
import Slider from "react-slick";
import webUrl from '../../abstract/variables';
import Button from '../UI/button';
import ErrorPopup from '../UI/errorPopup';


class Home extends Component {
    constructor(props){
        super(props);

        this.state = {
            view:1,
            errorPopup:{}
        }

        this.setView = this.setView.bind(this);
    }

    setView(option){
        var state = this.state;
        state.view = option;
        this.setState(state);
    }

    render() {
        var viewClass = "view__options";
        viewClass += "--" + this.state.view;

        return (

            <div id="section_1">
                <ErrorPopup parent={this} />
                <div className={viewClass} >
                    <div className={view == 1 ? "view__option--active" : "view__option--disabled"} onClick={() => { this.setView(1) }} >
                        <svg className="icon">
                            <use xlinkHref="#menu" />
                        </svg>
                    </div>
                    <div className={view == 2 ? "view__option--active" : "view__option--disabled"} onClick={()=>{this.setView(2)}}>
                        <svg className="icon">
                            <use xlinkHref="#magnifier" />
                        </svg>
                    </div>
                    <div className={view == 3 ? "view__option--active" : "view__option--disabled"} onClick={() => { this.setView(3) }}>
                        <svg className="icon">
                            <use xlinkHref="#info" />
                        </svg>
                    </div>
                </div>

                <div className={this.state.view == 1 ? "view--active" : "view--disabled"}>
                    <LandingView />
                </div>

                <div className={this.state.view == 2 ? "view--active" : "view--disabled"}>
                    <ArticlesView parent={this}/>
                </div>

                <div className={this.state.view == 3 ? "view--active" : "view--disabled"}>
                    <InfoView />
                </div>
            </div>
        );
    }
}

class LandingView extends Component {
    render() {
        var settings = {
            dots: true,
            infinite: true,
            speed: 500,
            autoPlaySpeed:3000,
            slidesToShow: 1,
            slidesToScroll: 1,/* 
            nextArrow: <NextArrow />,
            prevArrow: <PrevArrow /> */
        };

        return (
            <Slider {...settings}>
                <div>
                    <div className="lview--1 lview">
                        <div className="lview__content">
                            <div className="lview__title f_title ">Cultivating the Future</div>
                            <div className="lview__body f_h1">
                                Welcome to the Edulink platform, providing a network for students, teachers and educational institutions such as universities, professional schools and high schools, to share resources, ideas and information concerning the field of learning.
                            </div>
                            <div className="lview__buttons">
                                <div className="lview__button">
                                    <a href={webUrl + 'login'}>
                                        <div className="btn_1--edulink f_button_2 t-10 f_text-capitalize"></div>
                                    </a>
                                </div>

                                <div className="lview__button">
                                    <a href={webUrl + 'sign_up'}>
                                        <div className="btn_1--edulink f_button_2 t-55 f_text-capitalize"></div>
                                    </a>
                                </div>
                            </div>
                        </div>
                       
                    </div>
                </div>

                <div>
                    <div className="lview--2 lview">
                        <div className="lview__content">

                            <div className="lview__title f_title ">A student can </div>
                            <div className="lview__body f_h1">
                                <ul>
                                    <li>Communicate and share resources with teachers and students.</li>
                                    <li>Keep up with the latest info from institutions, students and teachers</li>
                                    <li>Manage their student info</li>
                                    <li>View their grades</li>
                                    <li>View and manage their school schedule</li>
                                    <li>Perform reviews and ratings</li>
                                    <li>And much more ...</li>
                                </ul>


                            </div>

                        </div>


                        <div className="lview__buttons">
                            <div className="lview__button">
                                <a href={webUrl + 'login'}>
                                    <div className="btn_1--edulink f_button_2 t-10 f_text-capitalize"></div>
                                </a>
                            </div>

                            <div className="lview__button">
                                <a href={webUrl + 'sign_up'}>
                                    <div className="btn_1--edulink f_button_2 t-55 f_text-capitalize"></div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="lview--3 lview">
                        <div className="lview__content">

                            <div className="lview__title f_title ">A teacher can </div>
                            <div className="lview__body f_h1">
                                <ul>
                                    <li>Manage their profile</li>
                                    <li>Communicate and share resources with teachers and students all over the world</li>
                                    <li>Keep up with the latest news from institutions, students and teachers</li>
                                    <li>Update and maintain student grades</li>
                                    <li>Execute attendance check</li>
                                    <li>And much more ...</li>
                                </ul>

                            </div>
                        </div>

                        <div className="lview__buttons">
                            <div className="lview__button">
                                <a href={webUrl + 'login'}>
                                    <div className="btn_1--edulink f_button_2 t-10 f_text-capitalize"></div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>



                <div>
                    <div className="lview--4 lview">
                        <div className="lview__content">

                            <div className="lview__title f_title ">An institution can </div>
                            <div className="lview__body f_h1">

                                <li>Manage a personalized subdomain</li>
                                <li>Manage students and Teaching staff</li>
                                <li>Easily and seemlessly schedule class timetables</li>
                                <li>Post news feeds</li>
                                <li>Monitor attendance</li>
                                <li>Manage online student applications</li>
                                
                            </div>
                        </div>

                        <div className="lview__buttons">
                            <div className="lview__button">
                                <a href={webUrl + 'insAdmin/login'}>
                                    <div className="btn_1--edulink f_button_2 t-10 f_text-capitalize"></div>
                                </a>
                            </div>

                            <div className="lview__button">
                                <a href={webUrl + 'insAdmin/registration'}>
                                    <div className="btn_1--edulink f_button_2 t-55 f_text-capitalize"></div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>




            </Slider>
        );
    }
}

class ArticlesView extends Component {
    constructor(props) {
        super(props);

        var Viewable = {
            product: true,
            event: true,
            notice: true
        };

        this.state = {
            viewable: Viewable,
            content: [],
            offset: 0,
            buttons: [],
            ajax:{
                getArticles:{
                    attempts:0
                }
            }
        }

        this.getArticles = this.getArticles.bind(this);
        this.reloadAjaxRequest = this.reloadAjaxRequest.bind(this);
    }

    componentDidMount() {
        this.getArticles();
    }

    reloadAjaxRequest(option) {
        var state = this.state;

        switch (option) {
            case 1: {

                if (state.ajax.getArticles.attempts < 10) {
                    state.ajax.getArticles.attempts += 1;
                    this.setState(state);
                    this.getArticles();
                }
                else {
                    this.props.parent.state.errorPopup.displayError("Access to server failed. Try again Later! ");
                    state.ajax.getArticles.attempts = 0;
                    this.setState(state);
                }
                break;
            }
        }

    }


    getArticles(reset = false) {
        var c = this;
        var state = c.state;
        var errorPopup = this.props.parent.state.errorPopup;
        if (reset) {
            state.offset = 0;
            state.content = [];
        }

        axios({
            url: webUrl + "getArticles/" + state.offset,
            method: "GET"
        }).catch((response) => {
            if(response.status != 200){
                setTimeout(() => {
                    c.reloadAjaxRequest(1);
                }, 1000)
            }

        }).then((response) => {
            var data = response.data;

            switch (data.error) {
                case 0: {

                    if (data.content.length == 0) {
                        errorPopup.displayError("There are no more Articles to retrieve. Continue creating more.");
                        break;
                    }

                    state.content = state.content.concat(data.content);
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
                <div className="content__view">
                    {
                        this.state.content.map((item, i) => {
                            return (<div className="pro" key={i}><Article post={item} parent={this} /></div>);
                        })
                    }
                </div>

                <div className="loadBtn">
                    <Button
                        parent={this}
                        status={0}
                        config={{
                            type: "btn_1",
                            label: "More",
                            text: "",
                            action: () => {
                                c.getArticles()
                            }
                        }} />
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
            background: 'url("' + webUrl + "repo/" + post.post.image.name + '/thumb_150_150.jpg")',
            backgroundPosition: 'center',
            backgroundSize: 'cover'
        }

        return (
            <div className="pro--1__con" id={"p-" + post.log.id}>
                <div className="pro--1__con__up" style={image}>
                    <a href={webUrl + "article/" + post.post.id}>
                        <div className="pro--1__link">
                            <div className="pro--1__title f_normal f_text-capitalize">{post.post.title}</div>
                            <svg className="icon">
                                <use xlinkHref="#view" />
                            </svg>
                        </div>
                    </a> 
                </div>

                <div className="pro--1__con__down">

                    <div className="pro--1__stat">
                        <div className="pro--1__stat__view">
                            <div className="pro--1__stat__icon">
                                <div className="iconBtn--normal">
                                    <svg className="icon">
                                        <use xlinkHref="#view" />
                                    </svg>
                                </div>
                            </div>
                            <div className="pro--1__stat__value f_h2 f_text-bold">{humanize(post.post.stat.views)}</div>
                        </div>

                        <div className="pro--1__stat__likes">
                            <div className="pro--1__stat__icon">
                                <div className="iconBtn--normal">
                                    <svg className="icon">
                                        <use xlinkHref="#like" />
                                    </svg>
                                </div>
                            </div>
                            <div className="pro--1__stat__value f_h2 f_text-bold">{humanize(post.post.stat.reactions)}</div>
                        </div>

                        <div className="pro--1__stat__com">
                            <div className="pro--1__stat__icon">
                                <div className="iconBtn--normal">
                                    <svg className="icon">
                                        <use xlinkHref="#communication" />
                                    </svg>
                                </div>
                            </div>
                            <div className="pro--1__stat__value f_h2 f_text-bold">{humanize(post.post.stat.comments)}</div>
                        </div>


                    </div>
                </div>
            </div>
        );
    }
}

class InfoView extends Component {
    render() {
        return (
            <div className="infoView SB">
                <div className="infoView__content">
                    <div className="infoView__1">
                        <div className="infoView__1__title f_title f_text-center">Want your institution to have an online presence?</div>
                        <div className="infoView__1__text f_h2 f_text-center">
                            From a personalized website, to a management system that easy and affordable to integrate according to the size of your institution, our platform is capable of providing the technological edge your institution needs.
                        </div>
                    </div>

                
                    <div className="infoView__2">
                        <div className="infoBox">
                            <div className="infoBox__icon">
                                <svg className="icon">
                                    <use xlinkHref="#lock-2" />
                                </svg>
                            </div>
                            <div className="infoBox__title f_h1 f_text-center">Secure</div>
                            <div className="infoBox__text f_h2 f_text-center">We offer a secure software solution for educational institutions to store and process important data concerrning the institution.</div>
                        </div>

                        <div className="infoBox">
                            <div className="infoBox__icon">
                                <svg className="icon">
                                    <use xlinkHref="#business" />
                                </svg>
                            </div>
                            <div className="infoBox__title f_h1 f_text-center">Reliable</div>
                            <div className="infoBox__text f_h2 f_text-center">We strive to offer a quality software solution that is available 24/7. Any maintenance routines is pre-informed before execution.</div>
                        </div>

                        <div className="infoBox">
                            <div className="infoBox__icon">
                                <svg className="icon">
                                    <use xlinkHref="#responsive-devices" />
                                </svg>
                            </div>
                            <div className="infoBox__title f_h1 f_text-center">Responsive</div>
                            <div className="infoBox__text f_h2 f_text-center">We offer a software solution that scales seemlessly across desktop and mobile devices.
                        </div>
                        </div>

                    </div>



                    <div className="infoView__3">
                        <div className="infoView__3__title f_title f_text-center">Register now for a 7 day trial.</div>
                        <div className="infoView__3__text f_h2 f_text-center">
                            Start integration in seconds. Develop an online presence in minutes.
                        </div>
                        <div className="infoView__3__buttons">
                            <div className="lview__button">
                                <a href={webUrl + 'insAdmin/registration'}>
                                    <div className="btn_1--white f_button_2 f_text-capitalize">Get Started</div>
                                </a>
                            </div>
                        </div>
                    </div>



                    <div className="infoView__1">
                        <div className="infoView__1__title f_title f_text-center">Starter Packages</div>
                        <div className="infoView__1__text f_h2 f_text-center">Edulink charges institutions registered to the platform according to the number of students enrolled using the platform (KES200 per student). We have the following starter packages available for newcomers that help you get started.</div>
                    </div>


                    <div className="infoView__2">

                       

                        <div className="infoBox">
                            <div className="infoBox__title f_h1 f_text-center">Basic</div>
                            <div className="infoBox__text f_h2 f_text-center">
                                A starter package for a low funded educational institution</div>
                            <div className="infoBox__list f_h2">
                                <ul>
                                    <li>Enroll 100 students free</li>
                                    <li>1 GB repository space</li>
                                    <li>A free personalized website</li>
                                </ul>
                            </div>  
                            <div className="infoBox__text f_comment_1">
                                Note: This is a one time payment. After exceeding the number of students you can enroll for free, you shall resume to the standard fee for student enrollment billed per month. ( 200 KSH per student) 
                            </div>    
                            <div className="infoBox__price f_normal f_text-center">
                                Only <strong className="f_h1" >10000 KSH</strong>
                            </div>                  
                        </div>


                        <div className="infoBox">
                            <div className="infoBox__title f_h1 f_text-center">Standard</div>
                            <div className="infoBox__text f_h2 f_text-center">
                                A Standard package for a well funded educational institution</div>
                            <div className="infoBox__list f_h2">
                                <ul>
                                    <li>Enroll 200 students free</li>
                                    <li>1 GB repository space</li>
                                    <li>A free personalized website</li>
                                </ul>
                            </div>
                            <div className="infoBox__text f_comment_1">
                                Note: This is a one time payment. After exceeding the number of students you can enroll for free, you shall resume to the standard fee for student enrollment billed per month. ( 200 KSH per student)
                            </div>
                            <div className="infoBox__price f_normal f_text-center">
                                Only <strong className="f_h1" >20000 KSH</strong>
                            </div>
                        </div>




                        <div className="infoBox">
                            <div className="infoBox__title f_h1 f_text-center">Premium</div>
                            <div className="infoBox__text f_h2 f_text-center">A premium package for a well established and funded educational institution</div>
                            <div className="infoBox__list f_h2">
                                <ul>
                                    <li>Enroll 500 students free</li>
                                    <li>1 GB repository space</li>
                                    <li>A free personalized website</li>
                                </ul>
                            </div>
                            <div className="infoBox__text f_comment_1">
                                Note: This is a one time payment. After exceeding the number of students you can enroll for free, you shall resume to the standard fee for student enrollment billed per month. ( 200 KSH per student)
                            </div>
                            <div className="infoBox__price f_normal f_text-center">
                                Only <strong className="f_h1" >40000 KSH</strong>
                            </div>
                        </div>

                    </div>



                </div>
            </div>
        );
    }
}


export default Home;