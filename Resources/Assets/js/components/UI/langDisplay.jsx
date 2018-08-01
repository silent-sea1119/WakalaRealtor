import React, { Component } from 'react';

class LangDisplay extends Component {
    render() {
        return (
            <div className="langDisplay">
                {
                    this.props.languages.map((item, i) => {
                        return (
                            <div className="langDisplay__lang f_normal f_text-center" key={i}>
                                <div className="langDisplay__lang__lang">{item.Name}</div>
                                <div className="langDisplay__lang__country">{item.CountryCode}</div>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}


export default LangDisplay;