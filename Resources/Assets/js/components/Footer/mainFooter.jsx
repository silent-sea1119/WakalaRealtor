import React, { Component } from 'react';
import webUrl from '../../abstract/variables';

class Footer extends Component {
    constructor(props) {
        super(props);

        var start = parseInt($('#footerComponent').data('start'));
        start = start == null ? 1 : start;

        this.state = {
            start: start,
            mode: start
        }

        this.setMode = this.setMode.bind(this);
    }

    componentDidUpdate() {
        setTimeout(() => {
            $('html, body').animate(
                {
                    scrollTop: $('html, body').scrollTop() + $(".footer").height()
                },
                300
            );

        }, 500);

    }

    setMode() {
        var state = this.state;
        state.mode = state.mode == 2 ? state.start : state.mode + 1;
        this.setState(state);
    }

    render() {
        return (
            <div className="footer">
                <div className={this.state.mode == 0 ? "footer__toggle--mini" : "footer__toggle"} onClick={() => { this.setMode() }}>
                    <svg className="icon">
                        <use xlinkHref="#bookmark" />
                    </svg>
                </div>
                <div className={this.state.mode == 2 ? "footer__full--active" : "footer__full--disabled"}>
                    <div className="footer__full">

                        <a href={webUrl}>
                            <div className="footer__logo">
                                <img src={webUrl + 'assets/images/edulink.png'} />
                            </div>
                        </a>

                        <div className="footer__section">
                            <div className="footer__section__title f_h1">About</div>
                            <div className="footer__section__content f_normal">
                                <p>Edulink</p>
                                <p>Neorifa</p>
                                <p>Events</p>
                                <p>Contact</p>
                            </div>
                        </div>

                        <div className="footer__section">
                            <div className="footer__section__title f_h1">Support</div>
                            <div className="footer__section__content f_normal">
                                <p>Help Center</p>
                                <p>Terms and Conditions</p>
                            </div>
                        </div>

                    </div>
                </div>


                <div className={this.state.mode == 1 || this.state.mode == 2 ? "footer__mini--active" : "footer__mini--disabled"}>
                    <div className="footer__mini">
                        <div className="footer__cr f_comment_1">Copyright © 2018 Neorifa. All rights reserved.</div>
                    </div>
                </div>

                <div id="footer__anchor"></div>
            </div>
        );
    }
}

export default Footer;