import React, { Component } from 'react';

class MenuType2 extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var links = this.props.links;

        return (


            <div className="menuType2">
                {
                    links.map((item, i) => {

                        return (
                            <a href={links[i].url} key={i}>
                                <div className={"menuType2__link"} >
                                    <div className={"btn_2 f_tab_h1 f_text-capitalize " + links[i].text}></div>
                                </div>
                            </a>
                        );

                    })
                }
            </div>

        );
    }
}

export default MenuType2;
