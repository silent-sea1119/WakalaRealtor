import React, { Component } from 'react';
import Countdown from "react-countdown-now";

class ECountdown extends Component {
    render() {
        var cdClass = this.props.class + " ";

        const renderer = ({ total, days ,hours, minutes, seconds, completed }) => {
            if (completed) {
                cdClass += "cd--done ";
            }
            else {
                if (days == 0 && hours < 3) {
                    cdClass += "cd--warning ";
                }
                else {
                    cdClass += "cd ";
                }
            }

            return (
                <div className={cdClass}>
                    <div className="cd__u text-center">{days}</div>
                    <div className="cd__u text-center">{hours}</div>
                    <div className="cd__u text-center">{minutes}</div>
                    <div className="cd__u text-center">{seconds}</div>
                </div>
            );
        };

        return (
            <Countdown date={this.props.date} renderer={renderer} />
        );
    }
}

export default ECountdown ;