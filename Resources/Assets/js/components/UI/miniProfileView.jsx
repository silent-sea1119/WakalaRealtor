import React, { Component } from 'react';
import webUrl from '../../abstract/variables';

class MiniProfileView extends Component {
    constructor(props){
        super(props);

        this.setView = this.setView.bind(this);
    }

    setView() {
        switch (this.props.userType) {
            case 3: {
                return (<InstitutionView parent={this} />);
                break;
            }
        }
    }

    render() {
        return (
            this.setView()
        );
    }
}

class InstitutionView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            insLogo: []
        }

        this.setPic = this.setPic.bind(this);
    }

    componentDidMount() {
        this.setPic();
    }

    setPic() {
        var ins = this.props.parent.props.user;
        var state = this.state;

        if (ins.insLogo != undefined) {
            var dir = webUrl + 'accounts/institution/' + ins.id + "/" + ins.insLogo.name + "/";

            state.insLogo = [
                dir + "dp_50_50.png",
                dir + "dp_150_150.png",
                dir + "dp_300_300.png"
            ];
        }
        else {
            state.insLogo = [
                webUrl + 'assets/images/admin-grey.png',
                webUrl + 'assets/images/admin-grey.png'
            ];
        }

        this.setState(state);
    }

    render() {
        var institution = this.props.parent.props.user;
        var user = this.props.parent.props.currentUser;
        var applyBtn = {};

        user.type == 1 && user.ins_id == undefined ? applyBtn = { display: 'block' } : applyBtn = { display: 'none' };

        return (
            <div className="insDetails">
                <div className="insDetails__logo">
                    <img src={this.state.insLogo[1]} alt={institution.name + " logo"} />
                </div>

                <div className="insDetails__name f_h2 f_text-center">{institution.name}</div>

                <div className="insDetails__buttons" style={applyBtn}>

                    <div className={"insDetails__buttons__button"} >
                        <a href={webUrl + 'student/applyToIns/' + institution.code}>
                            <div className={"btnIcon_1"}>
                                <div className="btnIcon_1__icon">
                                    <svg className="icon">
                                        <use xlinkHref="#note" />
                                    </svg>
                                </div>
                                <div className="btnIcon_1__label f_tab_h1 f_text-capitalize t-74 f_text-capitalize"></div>
                            </div>
                        </a>
                    </div>

                </div>

            </div>
        );
    }
}

export default MiniProfileView;