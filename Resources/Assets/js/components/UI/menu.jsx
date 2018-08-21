import React, { Component } from 'react';

class Menu extends Component {
    render() {
        var menu = this.props.menu;
        var config = this.props.config;

        return (

            <div className={this.props.opposite != undefined && !this.props.opposite ? config.class + "--opposite" : config.class }>
                    {
                        menu.map((item, i) => {

                            return (
                                <Section key={i} links={item} parent={this}/>
                            );

                        })
                    }
            </div>

        );
    }
}

class Section extends Component {
    render() {
        var links = this.props.links;
        var config = this.props.parent.props.config;

        return (
            <div className={config.class + "__section"}>
                {
                    links.map((item, i) => {

                        return (
                            <a href={item.url} key={i}>
                                <div className={config.class + "__link f_tab_h1"}>{item.text}</div>
                            </a>
                        );

                    })
                }
            </div>

        );
    }
}

export default Menu;