import React, { Component } from 'react';

class ValidationAlert extends Component {
    render() {
        var icon = {};

        switch (this.props.state) {
            case 0: {
                icon = {
                    class: "btn_icon--normal",
                    style: { display: 'none' },
                    svg: "#check"
                }
                break;
            }
            case 1: {
                icon = {
                    class: "btn_icon--success",
                    style: { display: 'block' },
                    svg: "#check"
                }
                break;
            }
            case 2: {
                icon = {
                    class: "btn_icon--failed",
                    style: { display: 'block' },
                    svg: "#exclamation"
                }
                break;
            }
        }

        return (
            <div className={icon.class} style={icon.style}>
                <svg className="icon">
                    <use xlinkHref={icon.svg} />
                </svg>
            </div>
        );
    }
}

export default ValidationAlert;