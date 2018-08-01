import React, { Component } from 'react';
import webUrl from '../../abstract/variables';
import MenuType1 from '../UI/menuType1';

class MainHeader extends Component {
    constructor(props) {
        super(props);

        this.handleScroll = this.handleScroll.bind(this);
        this.togglePopupMenu = this.togglePopupMenu.bind(this);

        this.state = {
            toggleHeader: 0,
            togglePopupMenu: 0,
        }
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll(e) {
        var offset = 2;
        var state = this.state;

        var scrollYpos = $(document).scrollTop();

        if (scrollYpos > offset && state.toggleHeader == 0) {
            state.toggleHeader = 1;
            this.setState(state);

        }
        else if (scrollYpos < offset && state.toggleHeader == 1) {
            state.toggleHeader = 0;
            this.setState(state);
        }

    }

    togglePopupMenu(menu) {
        var state = this.state;
        state.togglePopupMenu == menu ? state.togglePopupMenu = 0 : state.togglePopupMenu = menu;
        this.setState(state);
    }

    render() {
        var headerClass = " header container-fluid ";
        this.state.toggleHeader == 0 ? headerClass += "header--normal" : headerClass += "header--float";
        var popupMenu = "popupMenu";

        var menuLinks = [
            [
                {
                    url: webUrl + 'login',
                    text: 't-10'
                },
                {
                    url: webUrl + 'sign_up',
                    text: 't-55'
                }
            ]
        ];

        return (
            <div className={headerClass}>
                <div className="row">
                    <div className="header__left">
                        <a href={webUrl}>
                            <div className="header__logo">
                                <img src={webUrl + 'assets/images/edulink.png'} />
                            </div>
                        </a>
                        <div className="header__title f_banner_1">Edulink</div>
                    </div>

                    <div className="header__right">
                        <div className="header__right__menuBtn btn_icon--normal" onClick={() => { this.togglePopupMenu(1) }}>
                            <svg className="icon">
                                <use xlinkHref="#menu" />
                            </svg>
                        </div>

                        <div className="header__signin">
                            <a href={webUrl + 'login'}>
                                <div className="btn_1 f_button_2 t-10 f_text-capitalize"></div>
                            </a>
                        </div>

                        <div className="header__signup">
                            <a href={webUrl + 'sign_up'}>
                                <div className="btn_1 f_button_2 t-55 f_text-capitalize"></div>
                            </a>
                        </div>

                        <div className="header__right__text f_normal f_text-capitalize t-56"></div>


                    </div>
                </div>

                <div className={this.state.togglePopupMenu == 1 ? popupMenu + "--active" : popupMenu + "--disabled"}>
                    <div className="popupMenu__mainMenu">
                        <MenuType1 menu={menuLinks} opposite={true} />
                    </div>
                </div>

            </div>




        );
    }
}

export default MainHeader;