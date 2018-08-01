import React, { Component } from 'react';

class Button extends Component {
    constructor(props){
        super(props);

        /*
            Config = {
                text:"Text",
                type:"btn_1",
                action:this.function,
                label:"Text"
            }
        */

        this.state = {
            status: this.props.status
        }

        this.setStatus = this.setStatus.bind(this);
    }

    componentDidMount(){
        var state = this.props.parent.state;
        state.buttons.push(this);
        this.props.parent.setState(state);
    }
    
    componentDidUpdate(){
        var state = this.state;
        if (state.status == 1 || state.status == 2) {
            var component = this;
            setTimeout(() => {
                state.status = 0;
                component.setState(state);
            }, 3000);
        }
    }

    setStatus(option){
        var state = this.state;
        state.status = option;
        this.setState(state);
    }

    render() {
        var status = "";

        switch (this.state.status) {
            case 0: { status = "normal"; break; }
            case 1: { status = "fail"; break; }
            case 2: { status = "success"; break; }
            case 3: { status = "loading"; break; }
            case 4: { status = "warning"; break; }
            case 5: { status = "danger"; break; }
        }

        var config = this.props.config;
        var classValue = config.type + "--" + status + " f_button_2 f_text-capitalize " + config.text;
        
        return (
            <button type="button" className={classValue} onClick={config.action}>{config.label == undefined ? "" : config.label}</button>
        );
    }
}

export default Button;