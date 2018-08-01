import React, { Component } from 'react';

class PagesMenu extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var menu = this.props.menu;

        return (

            <div className="aMenu">

                {
                    menu.map((item, i) => {

                        return (
                            <Section key={i} section={item} />
                        );

                    })
                }

            </div>

        );
    }
}

class Section extends Component {
    render() {
        var categories = this.props.section;
        console.log(links);

        return (

            <div className="aMenu__section">
                    {
                        categories.map((item, i) => {

                            return (
                                <Category key={i} Category={item} />
                            );

                        })
                    }
            </div>

        );
    }
}


class Category extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showLinks: false
        }

        this.toggleCategory = this.toggleCategory.bind(this);
    }

    toggleCategory() {
        var state = this.state;
        if (state.showLinks == false) {
            state.showLinks = true;
        }
        else {
            state.showLinks = false;
        }

        this.setState(state);
    }

    render() {
        var links = this.props.category;
        console.log(links);

        return (

            <div className="aMenu__category">
                <div className={this.state.showLinks == true ? "aMenu__category__name--active" : "aMenu__category__name"}
                     onClick={() => { this.toggleCategory() }}></div>
                <div className={this.state.showLinks == false ? "aMenu__category__links--active" : "aMenu__category__links--disabled" }>
                    {
                        links.map((item, i) => {

                            return (
                                <a href={item.url} key={i}>
                                    <div className={"aMenu__link f_tab_h1 f_text-capitalize " + item.text} ></div>
                                </a>
                            );

                        })
                    }
                </div>
            </div>

        );
    }
}
export default AccordianMenu;