import React, { Component } from 'react';

class IconButton extends Component {
    constructor(props){
        super(props);

        this.state = {
            status:this.props.status
        }
    }

    componentDidMount(){
        var state = this.props.parent.state;
        state.buttons.push(this);
        this.setState(state);
    }

    componentDidUpdate(){
        var c = this;
        var state = c.state;

        if(state.status == 1 || state.status != 2){
            setTimeout(()=>{
                state.status = 0;
                c.setState(state);
            },c.props.config.delay)
        }
    }

    render() {
        var status = "";
        var config = this.props.config;

        switch (this.state.status) {
            case 0: { status = "normal"; break; }
            case 1: { status = "failed"; break; }
            case 2: { status = "success"; break; }
            case 3: { status = "loading"; break; }
            case 4: { status = "warning"; break; }
            case 5: { status = "danger"; break; }
        }

        const classValue = config.class + "--" + status;
        
        return (
            <div className={classValue} onClick={   config.action  }>
                <svg className="icon">
                    <use xlinkHref={"#" + config.icon} />
                </svg>
            </div>
        );
    }
}

export default IconButton;