import React, { Component } from 'react';

class Popup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            toggleContent: false
        }

        this.setContent = this.setContent.bind(this);
        this.toggleContent = this.toggleContent.bind(this);
    }

    componentDidMount() {
        var state = this.props.parent.state;
        state.popups.push(this);
        this.props.parent.setState(state);
    }

    toggleContent() {
        var state = this.state;
        state.toggleContent == false ? state.toggleContent = true : state.toggleContent = false;
        this.setState(state);
    }

    setContent() {
        if (this.state.toggleContent == true) {
            return this.props.component;
        }
    }

    render() {
        var style = this.props.style == undefined ? {} : this.props.style;
        var exit = this.props.exit != undefined ? this.props.exit : false;
        
        return (
            <div className={this.state.toggleContent == false ? "popUp--disabled" : "popUp--active"}>
                <div className="popUp__content SB" style={style}>
                    <div className="popup__exit f_title" style={exit == true ? { display: 'block' } : { display: 'none' }} onClick={() => { this.toggleContent() }}>&times;</div>
                    {this.setContent()}
                </div>
            </div>
        );
    }
}

export default Popup;