import React, { Component } from 'react';

class Button2 extends Component {
    render() {
        var status = "";

        switch (this.props.status) {
            case 0: { status = "normal"; break; }
            case 1: { status = "failed"; break; }
            case 2: { status = "success"; break; }
            case 3: { status = "loading"; break; }
            case 4: { status = "warning"; break; }
            case 5: { status = "danger"; break; }
        }

        const classValue = this.props.type + "--" + status + " f_button_2 f_text-capitalize " + this.props.text;
        
        return (
            <button type="button" className={classValue} onClick={() => { this.props.action  }}></button>
        );
    }
}

export default Button2;