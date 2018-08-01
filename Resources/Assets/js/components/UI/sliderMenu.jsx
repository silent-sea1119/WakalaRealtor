import React, { Component } from 'react';
import webUrl from '../../abstract/variables';

class SliderMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showLinks: this.props.presetCategory == undefined ? -1 : this.props.presetCategory
        }

        this.toggleCategory = this.toggleCategory.bind(this);
    }

    toggleCategory(option) {
        var state = this.state;
        state.showLinks = state.showLinks == option ? -1 : option;
        this.setState(state);
    }
    
    render() {
        var menu = this.props.menu;

        if(menu.length == 0 ){
            return <div></div>;
        }

        return (

            <div className="sMenu">
                <div className="sMenu__menu">
                    {
                        menu.map((item, i) => {
                            return (
                                <div className={this.state.showLinks == i ? "sMenu__category__name--active f_tab_h1" : "sMenu__category__name f_tab_h1"}
                                    onClick={() => { this.toggleCategory(i) }}>{item.name}</div>
                            );
                        })
                    }
                </div>
                
                {
                    menu.map((item, i) => {
                        return (
                            <Category key={i} category={item} active={this.state.showLinks == i ? true : false} insCode={this.props.insCode} />
                        );
                    })
                }
                
            </div>

        );
    }
}

class Category extends Component {
    render() {
        var category = this.props.category;

        if (category.length == 0) {
            return <div></div>;
        }


        return (

            <div className="sMenu__category">

                <div className={this.props.active == true ? "sMenu__category__links--active" : "sMenu__category__links--disabled" }>
                    {
                        category.pages.map((item, i) => {

                            return (
                                <a href={webUrl + "page/" + this.props.insCode + "/" + item.id} key={i}>
                                    <div className="sMenu__category__link f_tab_h2 text-capitalize" >{item.title}</div>
                                </a>
                            );

                        })
                    }
                </div>
            </div>

        );
    }
}
export default SliderMenu;