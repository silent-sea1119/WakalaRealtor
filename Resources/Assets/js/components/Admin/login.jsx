import React, { Component } from 'react';
import webUrl from '../../abstract/variables';
import axios from 'axios';
import Button from '../UI/button';

class Login extends Component {
    constructor(props) {
        super(props);

        this.adminLogin = this.adminLogin.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.setAuthorization = this.setAuthorization.bind(this);

        this.state = {
            username: "",
            password: "",
            error: 0,
            buttons:[]
        }
    }

    componentDidUpdate() {
        if (this.state.error != 0) {
            setTimeout(() => {
                var state = this.state;
                state.error = 0;
                this.setState(state);
            }, 3000);
        }
    }
    handleUsernameChange(e) {
        if (e == undefined) { return; }

        var state = this.state;
        state.username = e.target.value;
        this.setState(state);
    }

    handlePasswordChange(e) {
        if (e == undefined) { return; }

        var state = this.state;
        state.password = e.target.value.substr(0, 15);
        this.setState(state);
    }

    setAuthorization (token){
        var api = axios.create({
            baseUrl:webUrl
        });

        api.interceptors.request.use((config) => {
            config.headers.Authorization = 'JWT ' + token;
            return config;
        });
    }

    adminLogin() {
        var state = this.state;
        var component = this;

        var formData = {
            username:state.username,
            password:state.password
        };

        state.buttons[0].state.status = 3;
        component.setState(state);

        axios({
            url: webUrl + 'admin/loginAuth',
            method:"POST",
            data: formData
        }).then((response)=>{
            console.log("Log in successful! Error:" + response.data.error);
            console.log(response);
 
            switch (response.data.error) {
                case 0: {
                    //localStorage.setItem('currentUser', response.user);
                    component.setAuthorization(response.access_token);
                    localStorage.setItem('access_token',response.access_token);
                    localStorage.setItem('refresh_token',response.refresh_token);
                    window.location.href = webUrl + "admin/posts";
                    break;
                }
                case 1:
                case 2:
                case 3:{
                    state.error = response.data.error;
                    state.buttons[0].state.status = 1;
                    component.setState(state);
                    break;
                }
            }
        }).catch(()=>{
            state.error = 404;
            component.setState(state);
        })

    };


    render() {

        var errorText = "";

        switch (this.state.error) {
            case 1: {
                errorText = "User doesn't exist. Please enter a valid username";
                break;
            }
            case 2:
            case 3:{
                errorText = "Username or password is incorrect. Please try again.";
                break;
            }
            case 11: {
                errorText = "Incorrect input value. Please input an email or phone number.";
                break;
            }
            case 404: {
                errorText = "Access to server failed. Please try again. ";
                break;
            }
        }

        const back_img = {
            background: "url('"+ webUrl + "assets/images/back--11.jpg')",
            backgroundPosition:'center',
            backgroundSize: 'cover'
        }

        return (
            <div>
                <div id="back_img" style={back_img}></div>
                <div id="loginForm">
                    <div id="loginForm__form">

                        <div id="icon_sec">
                            <div id="icon">
                                <img src={webUrl + 'assets/images/logo.png'} />
                            </div>
                        </div>

                        <form method="post">
                            <div id="username_tb">
                                <input type="text" className="f_input_1 text_input_2" name="username"
                                    placeholder="Username" value={this.state.username} onChange={this.handleUsernameChange} />
                            </div>

                            <div id="pass_tb" >
                                <input type="password" className="f_input_1 text_input_2" name="password"
                                    placeholder="Password" value={this.state.password} onChange={this.handlePasswordChange} />
                            </div>

                            <div id="loginForm__errorComment" className={this.state.error != 0 ? "errorComment--active f_comment_1" : "errorComment--disabled f_comment_1"}>
                                {errorText}
                            </div>

                            <div id="login_btn">
                                <Button parent={this} status={0} config={{text:"",label:"Log In",type:"btn_1",action:this.adminLogin}}/>
                            </div>




                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;