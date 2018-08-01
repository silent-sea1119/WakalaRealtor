import React, { Component } from 'react';

class ErrorPopup extends Component {
    constructor(props){
        super(props);

        this.state = {
            errors:[]
        }

        this.displayError = this.displayError.bind(this);
    }

    componentDidMount(){
        var state = this.props.parent.state;
        state.errorPopup = this;
        this.props.parent.setState(state);
    }

    componentDidUpdate(){
        var state = this.props.parent.state;
        if (state.errorPopup == null){
            state.errorPopup = this
            this.props.parent.setState(state);
        }
    }

    displayError(text){
        var state = this.state;
        state.errors.push({
            text:text
        });

        this.setState(state);
    }

    render() {
        return (
            <div className="ePP">
               { 
                   this.state.errors.map((item,i)=>{
                        return <Error error={item} key={i} />
                        })
               }
            </div>
        );
    }
}

class Error extends Component {
    constructor(props){
        super(props);

        this.state = {
            togglePopup:false
        }

        this.togglePopup = this.togglePopup.bind(this);
    }

    componentDidMount(){
        var com = this;
        com.togglePopup();

        setTimeout((item)=>{
           com.togglePopup();
        },5000);
    }

    togglePopup(){
        var state = this.state;
        state.togglePopup = state.togglePopup ==  false ? true : false;
        this.setState(state);
    }

    render() {
        return (
            <div className={this.state.togglePopup == false ? "ePP__error--disabled" : "ePP__error--active"}>
                <div className="ePP__error__icon">
                    <svg className="icon">
                        <use xlinkHref="#warning" />
                    </svg>
                </div>
                <div className="ePP__error__content f_normal">
                    {this.props.error.text}
                </div>
            </div>
        );
    }
}

export default ErrorPopup;