import React, { Component } from 'react';

class TextInput extends Component {
    constructor(props) {
        super(props);

        /*
            Config = {
                type:"btn_1",
                label:"Text",
                inputValue:""
            }
        */

        this.state = {
            defaultStatus:this.props.status,
            status: this.props.status,
            errorText:"",
            inputValue:this.props.config.inputValue,
            inputLength: this.props.config.length == undefined ? 999 : this.props.config.length
        }

        this.handleValueChange = this.handleValueChange.bind(this);
        this.focus = this.focus.bind(this);
    }

    componentDidMount() {
        var state = this.props.parent.state;
        state.textInputs.push(this);
        this.props.parent.setState(state);
    }

    componentDidUpdate() {
        var state = this.state;
        if (state.status == 1 || state.status == 2) {
            var component = this;
            setTimeout(() => {
                state.status = state.defaultStatus;
                component.setState(state);
            }, 3000);
        }
    }

    handleValueChange(e){
        var state = this.state;
        state.inputValue = e.target.value.substr(0,state.inputLength);
        this.setState(state);
    }

    focus() {
        ReactDOM.findDOMNode(this.refs.textInput).focus();
    }

    render() {
        var status = "";
        var error = false;

        switch (this.state.status) {
            case 0: { status = "normal"; break; }
            case 1: { 
                status = "fail"; 
                error = this.state.errorText != "" ? true : null; 
                break; 
            }
            case 2: { 
                status = "success"; 
                error = this.state.errorText != "" ? true : null;
                break; 
            }
            case 3: { status = "loading"; break; }
            case 4: { status = "warning"; break; }
            case 5: { status = "danger"; break; }
        }

        var config = this.props.config;
        var errorClass = "f_comment_1 " + config.type + "__error--";
        var commentClass = "f_comment_1 " + config.type + "__comment--";

        return (
            <div className={config.type + "--" + status} >
                <div className={config.type + "__label f_label_1" }>{config.label}</div>

                <input 
                    ref="textInput" 
                    type="text" 
                    className="f_input_1" 
                    value={this.state.inputValue} 
                    onChange={this.handleValueChange}
                    placeholder={config.placeholder == undefined ? "" : config.placeholder}
                    />

                <div className={error ? commentClass + "disabled" : commentClass + "active"}>{config.comment}</div>
                <div className={error ? errorClass + "active" : errorClass + 'disabled'}>
                    {this.state.errorText}
                </div>

            </div>
        );
    }
}

export default TextInput;