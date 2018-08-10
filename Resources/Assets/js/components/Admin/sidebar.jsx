import React, { Component } from 'react';
import webUrl from '../../abstract/variables';

class SideBar extends Component {
    render() {

        const logo = webUrl + 'assets/images/admin-grey.png';

        return (
            <div id="adminSideBarMenu">
            
                <div className="navMenu" >
                    <div className="navMenu__subMenu">
                        <a href={webUrl + 'admin/posts'} >
                            <div className="navMenu__subMenu__hd f_tab_h1 f_text-capitalize" id="hd1">Posts</div>
                        </a>
                    </div>

                    <div className="navMenu__subMenu">
                        <a href={webUrl + 'admin/repo'} >
                            <div className="navMenu__subMenu__hd f_tab_h1 f_text-capitalize" id="hd1">Repo</div>
                        </a>
                    </div>


                </div>
            </div>
        );
    }
}

export default SideBar;