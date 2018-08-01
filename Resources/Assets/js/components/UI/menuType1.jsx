import React, { Component } from 'react';

class MenuType1 extends Component {
    render() {
        var menu = this.props.menu;
        //console.log(menu);

        return (

            <div className={this.props.opposite == undefined ? "menuType1" : "menuType1--opposite"}>

                    {
                        menu.map((item, i) => {

                            return (
                                <Section key={i} links={item}/>
                            );

                        })
                    }

            </div>

        );
    }
}

class Section extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var links = this.props.links;
        //console.log(links);

        return (

                <div className="menuType1__section">

                    {
                        links.map((item, i) => {

                            return (
                                <a href={links[i].url} key={i}>
                                    <div className={"menuType1__link f_tab_h1 f_text-capitalize " + links[i].text} ></div>
                                </a>
                            );

                        })
                    }

                </div>

        );
    }
}

export default MenuType1;