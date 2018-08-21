import React, { Component } from 'react';

class ButtonWithIcon extends Component {
    constructor(props){
        super(props);

        /*
            <ButtonWithIcon
                parent={this}
                status={0}
                config={{
                    class:"btnIcon_1",
                    action: this.toggleRepo,
                    label:"Repo",
                    icon="repo"
                    }}
                />
        */

        this.state = {
            status: this.props.status,
            label:this.props.config.label == undefined ? "" : this.props.config.label
        }

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

    render() {
        var status = "";

        switch (this.state.status) {
            case 0: { status = "normal"; break; }
            case 1: { status = "fail"; break; }
            case 2: { status = "success"; break; }
            case 3: { status = "loading"; break; }
            case 4: { status = "warning"; break; }
            case 5: { status = "danger"; break; }
            case 6: { status = "success"; break; }
        }

        var config = this.props.config;

        return (
            <div className={config.class + "--" + status } onClick={config.action}>
                <div className={ config.class + "__icon"}>
                    <svg className="icon">
                        <use xlinkHref={"#" + config.icon} />
                    </svg>
                </div>
                <div className={ config.class + "__label f_normal"}>{this.state.label}</div>
            </div>
        );
    }
}

export default ButtonWithIcon;