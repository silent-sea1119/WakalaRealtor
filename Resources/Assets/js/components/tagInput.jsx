import React, { Component } from 'react';
import webUrl from '../abstract/variables';
import axios from 'axios';

class TagInput extends Component {
    constructor(props){
        super(props);

        this.state = {
            name: "",
            activeInput:false,
            lastTyped: Date.now(),
            suggestions:[]
        }

        this.handleNameChange = this.handleNameChange.bind(this);
        this.toggleInput = this.toggleInput.bind(this);
        this.addTag = this.addTag.bind(this);
        this.selectTag = this.selectTag.bind(this);
    }

    toggleInput(){
        var state = this.state;
        state.activeInput = state.activeInput == true ? false : true;
        state.suggestions =[];
        state.name = "";
        this.setState(state);
    }

    handleNameChange(e){
        var c = this;
        var state = c.state;
        state.name = e.target.value;
        state.lastTyped = Date.now();
        c.setState(state);

        setTimeout(()=>{
            var last = c.state.lastTyped;

            if ((Date.now() - last)>=1000) {
                c.getTagSuggestions();
            }
        },1000);
    }

    addTag(){
        if(this.state.name == ""){  return; }

        var component = this;
        var url = webUrl + "admin/tag/" + this.state.name;
        var errorPopup = component.props.main.state.errorPopup;

        axios({
            url:url,
            method:"GET"
        }).then((response)=>{
            var data = response.data;
            
            switch (data.error) {
                case 0: {
                    component.selectTag(data.content);
                    component.toggleInput();
                    break;
                }
                case 1:{
                    errorPopup.displayError("Tag already exists. Please select it in the Tag Sugeestions.");
                    break;
                }
                case 2:{
                    errorPopup.displayError("Error accessing server. Please try again later.");
                    break;
                }
            }
        }).catch(()=>{
            errorPopup.displayError("Error accessing server. Please try again later.");
        })

    }

    selectTag(item){
        var state = this.props.parent.state;

        var index = state.tags.findIndex((elem)=>{   
            return elem.id == item.id;
        })

        if(index >= 0){     return;     }

        state.tags.push(item);
        this.props.parent.setState(state);

        state = this.state;
        index = state.suggestions.findIndex((elem)=>{    
            return elem.id == item.id;
        })

        if(index >=0 ){
            state.suggestions.splice(index,1);
            this.setState(state);
        }
    }

    getTagSuggestions(){
        if(this.state.name == ""){  return; }

        var component = this;
        var url = webUrl + "admin/tags/" + this.state.name;
        var state = component.state;

        axios({
            url:url,
            method:"GET"
        }).then((response)=>{
            var data = response.data;
            switch (data.error) {
                case 0: {
                    state.suggestions = data.content;
                    component.setState(state);
                    break;
                }
            }

        }).catch(()=>{
            component.props.main.state.errorPopup.displayError("Error accessing server. Please try again later.");
        })

    }

    render() {
        var tags = this.props.parent.state.tags;

        return (
            <div className="tagInput">
                {
                    tags.map((item, i) => {
                        return (<Tag tag={item} parent={this.props.parent} key={i} index={i}/>);
                    })
                }

                <div className={this.state.activeInput == true ? "tagInput__input--active" : "tagInput__input--disabled"}>
                    <div className="tagInput__input__name">
                        <input type="text" className="text_input_2 f_input_1" value={this.state.name} onChange={this.handleNameChange} />
                    </div>

                    <div className="tagInput__input__buttons">

                        <div className="tagInput__input__add">
                            <div className="btn_icon--normal" onClick={() => { this.toggleInput() }}>
                                <svg className="icon">
                                    <use xlinkHref="#add" />
                                </svg>
                            </div>
                        </div>
                        
                       
                        <div className="tagInput__input__cancel">
                            <div className="btn_icon--normal" onClick={() => { this.toggleInput() }}>
                                <svg className="icon">
                                    <use xlinkHref="#back" />
                                </svg>
                            </div>
                        </div>

                        <div className="tagInput__input__confirm">
                            <div className="btn_icon--normal" onClick={() => { this.addTag() }}>
                                <svg className="icon">
                                    <use xlinkHref="#check" />
                                </svg>
                            </div>
                        </div>

                    </div>

                </div>

                <div className="tagInput__suggestions">
                    {
                        this.state.suggestions.map((item, i) => {
                            return (<div className="tagS f_normal" key={i} onClick={()=>{this.selectTag(item)}}>{"#" + item.name}</div>);
                        })
                    }
                </div>
            </div>
        );
    }
}


class Tag extends Component {
    constructor(props){
        super(props);

        this.removeTag = this.removeTag.bind(this);
    }

    removeTag(){
        var state = this.props.parent.state;
        state.tags.splice(this.props.index,1);
        this.props.parent.setState(state);
    }

    render() {
        var tag = this.props.tag;
        return (
            <div className="tag">
                <div className="tag__cancel">
                    <div className="btn_icon--white" onClick={() => { this.removeTag() }}>
                        <svg className="icon">
                            <use xlinkHref="#close" />
                        </svg>
                    </div>
                </div>
                <div className="tag__name f_normal">{ tag.name}</div>
            </div>    
        );
    }
}

export default TagInput;