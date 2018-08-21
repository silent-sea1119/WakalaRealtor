import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class DropdownInput extends Component {
    constructor(props) {
        super(props);

        /*
            Config = {
                class:"btn_1",
                label:"Text",
                inputValue:""
            }
        */

        this.state = {
            defaultStatus:this.props.status,
            status: this.props.status,
            errorText:"",
            inputValue:this.props.config.inputValue == undefined ? "" : this.props.config.inputValue
        }

        this.handleValueChange = this.handleValueChange.bind(this);
        this.focus = this.focus.bind(this);
        this.setFloatingLabel = this.setFloatingLabel.bind(this);
    }

    componentDidMount() {
        var state = this.props.parent.state;
        state.dropdownInputs.push(this);
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
        state.inputValue = e.target.value;
        this.setState(state);
    }

    setFloatingLabel(){
        var label = this.props.config.floatingLabel;
        if( label != undefined && label){
            var name = this.props.config.label;
            return (
                <label htmlFor={name.replace(" ","")} >{name}</label>
            );
        }
    }

    focus() {
        ReactDOM.findDOMNode(this.refs.DropdownInput).focus();
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
        var errorClass = "f_comment_1 " + config.class + "__error--";
        var commentClass = "f_comment_1 " + config.class + "__comment--";

        var mainClass = config.class + "--" + status;
        mainClass += config.floatingLabel != undefined && config.floatingLabel ? " f_input_1 has-float-label" : "";


        return (
            <div className={mainClass} >
                <div className={config.class + "__label f_label_1" }>{config.label}</div>
    
                <select id={config.label.replace(" ","")} ref="DropdownInput" name="dd" className="f_input_dd" onChange={this.handleValueChange}>
                    <option value="">{config.placeholder == undefined ? "-- Select --" : config.placeholder}</option>
                    {
                        config.options.map((item,i)=>{
                            return (<option value={item.value} key={i}>{item.label}</option>)
                        })
                    }
                </select>
                
                {this.setFloatingLabel()}
                <div className={error ? commentClass + "disabled" : commentClass + "active"}>{config.comment}</div>
                <div className={error ? errorClass + "active" : errorClass + 'disabled'}>
                    {this.state.errorText}
                </div>

            </div>
        );
    }
}

export default DropdownInput;