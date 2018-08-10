import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import webUrl from '../abstract/variables';
import { toggleView } from '../abstract/functions';
import qq from "../../../plugins/fineUploader/fine-uploader";
import Popup from './UI/popup';
import axios from 'axios';
import Button from './UI/button';
import TextInput from './UI/textInput';

class Repo extends Component {

    constructor(props) {
        super(props);

        /* SELECTION TYPES 
        1 -- single image - Return as background image
        2 -- single image - Return as image source
        3 -- multiple images
        4 -- single document file
        5 -- multiple document files
         */

        switch (this.props.sType) {
            case 0: {
                types = null;
                rCount = null;
            }
            case 1:
            case 2:
            case 3:
                {
                    //Rquired amount of images need to be specified rCount

                    var types = this.props.types;
                    var rCount = this.props.rCount;

                    if (types == null) { types = ['png', 'jpg', 'jpeg']; }
                    break;
                }

            case 4:
            case 5:
                {
                    var types = this.props.types;
                    var rCount = this.props.rCount;

                    if (types == null) { types = ['doc', 'docx']; }
                    break;
                }

            case 'default': return;
        }

        this.loadRepoContent = this.loadRepoContent.bind(this);
        this.refreshRepoFileSelection = this.refreshRepoFileSelection.bind(this);
        this.changeFolderDirectory = this.changeFolderDirectory.bind(this);
        this.repoFileSelected = this.repoFileSelected.bind(this);
        this.retrieveRepoContent = this.retrieveRepoContent.bind(this);
        this.exitRepo = this.exitRepo.bind(this);
        this.reloadAjaxRequest = this.reloadAjaxRequest.bind(this);
        this.toggleDeleteFileConfirmationPopUp = this.toggleDeleteFileConfirmationPopUp.bind(this);
        this.loadDeleteFileConfirmationPopUp = this.loadDeleteFileConfirmationPopUp.bind(this);
        this.toggleDeleteFolderConfirmationPopUp = this.toggleDeleteFolderConfirmationPopUp.bind(this);
        this.loadDeleteFolderConfirmationPopUp = this.loadDeleteFolderConfirmationPopUp.bind(this);

        this.state = {
            folder_ids: ['root'],
            folder_dirs: ['root'],
            folders_loaded: [],
            folders: [],
            files: [],
          /*   stats: {
                occupied: 0,
                totalSize: 0
            }, */
            togglePopup: false,
            popup: 0,
            fileInFocus: {},
            folderInFocus: {},
            selected_files: [],
            selection_type: this.props.sType,
            required_types: types,
            required_count: rCount,
            refresh: false,
            url: {
                retrieveRepoContentByFolder: webUrl + "admin/retrieveRepoContentByFolder/",
                contentdir: webUrl + "repo",
                uploadFiletoRepo: webUrl + 'admin/uploadFiletoRepo',
                createFolderinRepo: webUrl + 'admin/repoFolder/root',
                deleteFolderFromRepo: webUrl + 'admin/repoFolder/',
                deleteFileFromRepo: webUrl + "admin/repoFile/"
            },
            popups: [],
            loaded: false,
            ajax: {
                retrieveRepoContent: {
                    attempts: 0,
                    error: 0
                }
            },
            createFolderDisplay:false,
            uploadFileDisplay:false
        }
    }

    componentDidMount() {
        var state = this.state;
        state.loaded = true;
        this.setState(state);
        this.loadRepoContent();
    }

    refreshRepoFileSelection() {
        var selectedFiles = this.state.selected_files;

        for (var i = 0; selectedFiles[i] != null; i++) {
            var file = document.getElementById('#fl-' + selectedFiles[i]);
            var classname = file.className;
            classname.replace('repoFile','repoFile--selected');
            file.setAttribute('class',classname);
        }
    }

    repoFileSelected() {
        var sFiles = this.state.selected_files;

        console.log("Selected Files are :" + sFiles);

        if (sFiles.length == 0) { return; }

        var selectionType = this.state.selection_type;

        console.log("Selection type is : " + selectionType);

        switch (selectionType) {
            case 1:
                {
                    var file = sFiles[0].file;
                    var preview = document.querySelector(".repoImagePreview");
                    preview.setAttribute('style', "background:" + "url(\"" + this.state.url.contentdir +  "/" + file.name + "." + file.type + "\") center ; background-size:cover;");

                    preview.dataset.image = JSON.stringify(file);

                    this.exitRepo();
                    break;
                }
            case 2: {
                var file = sFiles[0].file;
                var preview = document.querySelector('.repoImagePreview img');
                preview.setAttribute('src',this.state.url.contentdir +  "/" + file.name + "." + file.type);
                preview.dataset.image = file;

                this.exitRepo();
                break;
            }
            case 4:
            case 5: {
                var parent = this.props.parent;
                var state = parent.state;
                state.selectedFiles = this.state.selected_files;
                parent.setState(state);

                this.exitRepo();
                break;
            }
        }
    }

    exitRepo() {
        this.props.parent.toggleRepo();
    }

    loadRepoContent() {
        var fids = this.state.folder_ids;
        var fid = fids[fids.length - 1];

        var fLoaded = this.state.folders_loaded;

        for (var i = 0; fLoaded[i] != null; i++) {
            if (fLoaded[i].id == fid) {
                var states = this.state;

                states.folders = fLoaded[i].subFolders;
                states.files = fLoaded[i].subFiles;

                this.setState(states);

                return;
            }
        }

        this.retrieveRepoContent();
    }

    reloadAjaxRequest(option) {
        var state = this.state;

        switch (option) {
            case 1: {

                if (state.ajax.retrieveRepoContent.attempts < 10) {
                    state.ajax.retrieveRepoContent.attempts += 1;
                    this.setState(state);
                    this.retrieveRepoContent();
                }
                else {
                    state.ajax.retrieveRepoContent.error = "Access to server failed. Try again Later! ";
                    this.setState(state);
                }
                break;
            }
        }

    }

    /* API */

    retrieveRepoContent() {
        var state = this.state;
        var fids = state.folder_ids;
        var fid = fids[fids.length - 1];
        var sFiles = state.selected_files;
        var repo = this;

        axios({
            url: state.url.retrieveRepoContentByFolder + fid,
            method: "GET",
        }).then((response)=>{
            var data = response.data;

            switch (data.error) {
                case 0: {
                    // repoContent(data.content);
                    state.folders = data.content.folders;
                    state.files = data.content.files;
                    state.stats = data.content.stats;

                    //This code checks if the folder has already been loaded. If so, it overwrite a loaded folder with an updated list of subFolders.

                    var loadedFolderExists = false, lFolderIndex = 0;

                    for (var i = 0; state.folders_loaded[i] != null; i++) {
                        if (state.folders_loaded[i].id == fid) {
                            loadedFolderExists = true;
                            lFolderIndex = i;
                            break;
                        }
                    }

                    var fLoaded = {
                        id: fid,
                        subFolders: data.content.folders,
                        subFiles: data.content.files,
                    };

                    if (loadedFolderExists) {
                        state.folders_loaded[lFolderIndex] = fLoaded;
                    }
                    else {
                        state.folders_loaded.push(fLoaded);
                    }

                    //^^ This code checks if the folder has already been loaded. If so, it overwrite a loaded folder with an updated list of subFolders.

                    repo.setState(state);

                    if (sFiles != null) {
                        repo.refreshRepoFileSelection();
                    }
                }
            }

            state.ajax.retrieveRepoContent.attempts = 0;
            repo.setState(state);
        }).catch(()=>{
            repo.reloadAjaxRequest(1);
        })

    }

    /* API */

    changeFolderDirectory(folderId, folderName) {
        var states = this.state;

        states.folder_ids.push(folderId);
        states.folder_dirs.push(folderName);

        this.setState(states);
        this.loadRepoContent();

    }

    toggleDeleteFileConfirmationPopUp() {
        this.state.popups[0].toggleContent();
    }

    loadDeleteFileConfirmationPopUp() {
        if (this.state.loaded == true) {
            return (<Popup component={<DeleteFileConfirmationPopUp repo={this} />} parent={this} />);
        }
    }

    toggleDeleteFolderConfirmationPopUp() {
        this.state.popups[1].toggleContent();
    }

    loadDeleteFolderConfirmationPopUp() {
        if (this.state.loaded == true) {
            return (<Popup component={<DeleteFolderConfirmationPopUp repo={this} />} parent={this} />);
        }
    }

    render() {
        return (
            <div className="repo SB">
                <RepoFileView main={this} />
                <RepoCategoryView main={this} />

                {this.loadDeleteFileConfirmationPopUp()}
                {this.loadDeleteFolderConfirmationPopUp()}
            </div>
        );
    }
}

class DeleteFileConfirmationPopUp extends Component {
    constructor(props) {
        super(props);
        this.confirm = this.confirm.bind(this);
    }

    confirm() {
        this.props.repo.state.fileInFocus.deleteFileFromRepo(true);
        this.props.repo.toggleDeleteFileConfirmationPopUp();
    }

    render() {
        return (
            <div className="deletePP">
                <div className="deletePP__content">
                    <div className="deletePP__text f_text-center f_h1">This file is currently being used. Are you sure you wish to delete the file?</div>
                </div>

                <div className="deletePP__buttons">
                    <div className="deletePP__buttons__button">
                        <div className="btn_1--danger f_button_2 f_text-capitalize" onClick={() => { this.props.repo.toggleDeleteFileConfirmationPopUp() }}>Cancel</div>
                    </div>

                    <div className="deletePP__buttons__button">
                        <div className="btn_1--success f_button_2 f_text-capitalize" onClick={() => { this.confirm() }}>Confirm</div>
                    </div>

                </div>
            </div>
        );
    }
}


class DeleteFolderConfirmationPopUp extends Component {
    constructor(props) {
        super(props);
        this.confirm = this.confirm.bind(this);
    }

    confirm() {
        this.props.repo.state.folderInFocus.deleteFolderFromRepo(true);
        this.props.repo.toggleDeleteFolderConfirmationPopUp();
    }

    render() {
        return (
            <div className="deletePP">
                <div className="deletePP__content">
                    <div className="deletePP__text f_text-center f_h1">This folder contains files that are currently being used. If you proceed, all subfiles and subfolder shall be deleted. Are you sure you wish to delete the folder?</div>
                </div>

                <div className="deletePP__buttons">
                    <div className="deletePP__buttons__button">
                        <div className="btn_1--danger f_button_2 f_text-capitalize" onClick={() => { this.props.repo.toggleDeleteFolderConfirmationPopUp() }}>Cancel</div>
                    </div>

                    <div className="deletePP__buttons__button">
                        <div className="btn_1--success f_button_2 f_text-capitalize" onClick={() => { this.confirm() }}>Confirm</div>
                    </div>

                </div>
            </div>
        );
    }
}


class RepoCategoryView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var repo = this.props.main;
        const inActive = {
            display: 'none'
        }

        const active = {
            display: 'block'
        }

        return (
            <div className="repo__categoryView">
                <div className="repo__categoryView__menu">
                    <div className="repo__categoryView__head btn_1--normal f_button_1 f_text-uppercase">All</div>
                </div>

                <div className="repo__categoryView__menu" style={repo.state.selection_type == 0 ? inActive : active}>
                    <div className="repo__categoryView__head btn_1--success f_button_1 f_text-capitalize" onClick={() => { repo.repoFileSelected() }}>select</div>
                    <div className="repo__categoryView__head btn_1--danger f_button_1 f_text-capitalize" onClick={() => { repo.exitRepo() }} >cancel</div>
                </div>

            </div>
        );
    }
}

class RepoFileView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            toggleButtons: false
        }

        this.setRepoDirName = this.setRepoDirName.bind(this);
        this.changeToPrevFolderDir = this.changeToPrevFolderDir.bind(this);
        this.toggleButtons = this.toggleButtons.bind(this);
        this.toggleCreateFolderDisplay = this.toggleCreateFolderDisplay.bind(this);
        this.toggleUploadFileDisplay = this.toggleUploadFileDisplay.bind(this);
    }

    setRepoDirName() {
        var dirNames = this.props.main.state.folder_dirs;
        var dir = "root";

        for (var i = 1; dirNames[i] != null; i++) {
            dir += " / " + dirNames[i];
        }

        return dir;
    }


    changeToPrevFolderDir() {
        var repo = this.props.main;
        if (repo.state.folder_ids.length <= 1) { return; }

        var states = repo.state;

        states.folder_ids.pop();
        states.folder_dirs.pop();

        repo.setState(states);
        repo.loadRepoContent();
    }

    toggleButtons() {
        var state = this.state;
        state.toggleButtons = state.toggleButtons ? false : true;
        this.setState(state);
    }

    toggleCreateFolderDisplay(){
        var state = this.props.main.state;
        state.createFolderDisplay = state.createFolderDisplay ? false: true;
        this.props.main.setState(state);
    }

    toggleUploadFileDisplay() {
        var state = this.props.main.state;
        state.uploadFileDisplay = state.uploadFileDisplay ? false : true;
        this.props.main.setState(state);
    }

    render() {
        var repo = this.props.main;
        var fids = repo.state.folder_ids;

        return (
            <div className="repo__fileView">

               {/*  <RepoStatistics repo={repo} /> */}
                <RepoFileUpload 
                    values={{
                        folderId: fids[fids.length - 1],
                        repo: repo
                    }}
                    />
                <RepoCreateFolder 
                    values={{
                        folderId: fids[fids.length - 1],
                        repo: repo
                    }} />

                <div className="repo__fileView__topBar ">
                    <div className="repo__fileView__topBar__fName f_h1">{this.setRepoDirName()}</div>

                    <div className="repo__fileView__topBar__toggle" onClick={() => { this.toggleButtons() }}>
                        <div className="btn_icon--normal">
                            <svg className="icon">
                                <use xlinkHref="#menu" />
                            </svg>
                        </div>
                    </div>

                    <div className={this.state.toggleButtons == true ? "repo__fileView__topBar__buttons--active" : "repo__fileView__topBar__buttons"}>

                        <div className="repo__fileView__topBar__button" onClick={() => { this.changeToPrevFolderDir() }}>
                            <div className="btn_1 f_button_2 f_text-capitalize">Return</div>
                        </div>

                        <div className="repo__fileView__topBar__button" onClick={() => { this.toggleUploadFileDisplay() }}>
                            <div className="btn_1 f_button_2 f_text-capitalize">Upload</div>
                        </div>

                        <div className="repo__fileView__topBar__button" onClick={() => { this.toggleCreateFolderDisplay() }}>
                            <div className="btn_1 f_button_2 f_text-capitalize">New Folder</div>
                        </div>

                        <div className="repo__fileView__topBar__button" onClick={() => { repo.retrieveRepoContent() }}>
                            <div className="btn_1--warning f_button_2 f_text-capitalize">Reload</div>
                        </div>

                    </div>

                </div>


                <RepoContent main={repo} />

            </div>
        );
    }
}

/* 
class RepoStatistics extends Component {
    render() {
        var stats = this.props.repo.state.stats;

        var free = stats.occupied == undefined ? 0 : ((stats.totalSize - stats.occupied) / stats.totalSize) * 100;
        var occupied = stats.occupied == undefined ? 0 : (stats.occupied / stats.totalSize) * 100;

        return (
            <div className="repoStat">
                <div className="repoStat__topBar">
                    <div className="repoStat__topBar__title f_h2">Space</div>
                </div>

                <div className="repoStat__bar">
                    <div className="repoStat__occupied f_normal f_text-center" style={{ width: occupied + "%" }}>
                        {humanReadable(occupied) + "% (" + prettyBytes(stats.occupied) + ") Occupied Space"}
                    </div>
                    <div className="repoStat__free f_normal f_text-center" style={{ width: free + "%" }}>
                        {humanReadable(free) + "% (" + prettyBytes((stats.totalSize - stats.occupied)) + ") Free Space"}
                    </div>
                </div>
            </div>
        );
    }
} */


class RepoFileUpload extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pending_upload_file: "",
            ajax: {
                uploadFiletoRepo: {
                    attempts: 0,
                    error: 0
                }
            }
        }

        this.setRepoFileUploadedName = this.setRepoFileUploadedName.bind(this);
        this.uploadFiletoRepo = this.uploadFiletoRepo.bind(this);
        this.qqTemplate = this.qqTemplate.bind(this);
        this.reloadAjaxRequest = this.reloadAjaxRequest.bind(this);
        this.toggleUploadFileDisplay = this.toggleUploadFileDisplay.bind(this);
    }

    componentDidMount() {
        const s = document.createElement('script');
        s.type = 'text/template';
        s.id = 'qq-template'
        s.async = false;
        s.innerHTML = ReactDOMServer.renderToString(this.qqTemplate());
        this.instance.appendChild(s);

        /*  console.log(s); */
    }

    componentDidUpdate() {
        var repo = this.props.values.repo;

        document.getElementById('uploader').innerHTML = "";
        //$('#uploader').html("");

        var uploader = new qq.FineUploader({
            element: this.uploader,
            debug: true,
            chunking: {
                enabled: true,
                concurrent: {
                    enabled: true
                },
                success: {
                    endpoint: 'uploadtoRepoCompleted'
                }
            },
            enableAuto: true,
            maxAutoAttempts: 10,
            autoUpload: false,
            request: {
                endpoint: repo.state.url.uploadFiletoRepo,
                params: {
                    folderId: this.props.values.folderId
                }
            },
            validation: {
                allowedExtensions: ["jpg", 'jpeg', 'png', 'doc', 'docx', 'xls', 'pdf', 'gif'],
                itemLimit: 10
            },
            enableTooltip: true,
            callbacks: {
                onComplete: function () {
                    repo.retrieveRepoContent();
                }
            }
        });

        document.querySelector('.qq-trigger-upload').addEventListener("click",(params)=>{
            uploader.uploadStoredFiles()
        })

        /* 
            $('.qq-trigger-upload').click(function (params) {
            uploader.uploadStoredFiles();
        }); */
    }

    setRepoFileUploadedName() {
        var fileName = document.querySelector('#repoUploadedFile').value;
        var state = this.state;
        state.pending_upload_file = fileName;
        this.setState(state);
    }

    reloadAjaxRequest(option) {
        var state = this.state;

        switch (option) {
            case 1: {

                if (state.ajax.uploadFiletoRepo.attempts < 10) {
                    state.ajax.uploadFiletoRepo.attempts += 1;
                    this.setState(state);
                    this.uploadFiletoRepo();
                }
                else {
                    state.ajax.uploadFiletoRepo.error = "Access to server failed. Try again Later! ";
                    this.setState(state);
                }
                break;
            }
        }

    }

    qqTemplate() {
        return (
            <div className="qq-uploader-selector qq-uploader qq-gallery" qq-drop-area-text="Drop files here">
                <div className="qq-total-progress-bar-container-selector qq-total-progress-bar-container">
                    <div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" className="qq-total-progress-bar-selector qq-progress-bar qq-total-progress-bar"></div>
                </div>

                <div className="qq-upload-drop-area-selector qq-upload-drop-area" qq-hide-dropzone="true">
                    <span className="qq-upload-drop-area-f_text-selector"></span>
                </div>

                <div className="qq-upload-button-selector qq-upload-button ">
                    <div className="btn_1 f_button_1">Select a file</div>
                </div>

                <div className="qq-trigger-upload">
                    <div className="btn_1 f_button_1">Upload</div>
                </div>

                <span className="qq-drop-processing-selector qq-drop-processing">
                    <span>Processing dropped files...</span>
                    <span className="qq-drop-processing-spinner-selector qq-drop-processing-spinner"></span>
                </span>

                <ul className="qq-upload-list-selector qq-upload-list" role="region" aria-live="polite" aria-relevant="additions removals">
                    <li>
                        <span role="status" className="qq-upload-status-f_text-selector qq-upload-status-text"></span>
                        <div className="qq-progress-bar-container-selector qq-progress-bar-container">
                            <div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" className="qq-progress-bar-selector qq-progress-bar"></div>
                        </div>
                        <span className="qq-upload-spinner-selector qq-upload-spinner"></span>
                        <div className="qq-thumbnail-wrapper">
                            <img className="qq-thumbnail-selector" qq-max-size="120" qq-server-scale="true" />
                        </div>
                        <button type="button" className="qq-upload-cancel-selector qq-upload-cancel">X</button>
                        <button type="button" className="qq-upload-retry-selector qq-upload-retry">
                            <span className="qq-btn qq-retry-icon" aria-label="Retry"></span>
                            Retry
                        </button>

                        <div className="qq-file-info">
                            <div className="qq-file-name">
                                <span className="qq-upload-file-selector qq-upload-file"></span>
                                <span className="qq-edit-filename-icon-selector qq-btn qq-edit-filename-icon" aria-label="Edit filename"></span>
                            </div>
                            <input className="qq-edit-filename-selector qq-edit-filename" tabIndex="0" type="text" />
                            <span className="qq-upload-size-selector qq-upload-size"></span>
                            <button type="button" className="qq-btn qq-upload-delete-selector qq-upload-delete">
                                <span className="qq-btn qq-delete-icon" aria-label="Delete"></span>
                            </button>
                            <button type="button" className="qq-btn qq-upload-pause-selector qq-upload-pause">
                                <span className="qq-btn qq-pause-icon" aria-label="Pause"></span>
                            </button>
                            <button type="button" className="qq-btn qq-upload-continue-selector qq-upload-continue">
                                <span className="qq-btn qq-continue-icon" aria-label="Continue"></span>
                            </button>
                        </div>
                    </li>
                </ul>

                <dialog className="qq-alert-dialog-selector">
                    <div className="qq-dialog-message-selector"></div>
                    <div className="qq-dialog-buttons">
                        <button type="button" className="qq-cancel-button-selector">Close</button>
                    </div>
                </dialog>

                <dialog className="qq-confirm-dialog-selector">
                    <div className="qq-dialog-message-selector"></div>
                    <div className="qq-dialog-buttons">
                        <button type="button" className="qq-cancel-button-selector">No</button>
                        <button type="button" className="qq-ok-button-selector">Yes</button>
                    </div>
                </dialog>

                <dialog className="qq-prompt-dialog-selector">
                    <div className="qq-dialog-message-selector"></div>
                    <input type="text" />
                    <div className="qq-dialog-buttons">
                        <button type="button" className="qq-cancel-button-selector">Cancel</button>
                        <button type="button" className="qq-ok-button-selector">Ok</button>
                    </div>
                </dialog>
            </div>
        );
    }

    toggleUploadFileDisplay(){
        var state = this.props.values.repo;
        state.uploadFileDisplay = state.uploadFileDisplay ? false :true;
        this.props.values.repo.setState(state);
    }
    
    /* API */

    uploadFiletoRepo() {
        /* var formData = new FormData($('#repoFileUpload__form')[0]);
        var errorBox = $('.repoFileUpload__errorBox');
        var button = $('.repoFileUpload__button .btn_1'); */

        var formData = new FormData(document.getElementById('repoFileUpload__form')[0]);
        //var errorBox = document.querySelector('.repoFileUpload__errorBox');
        //var button = document.querySelector('.repoFileUpload__button .btn_1');

        var repo = this.props.values.repo;
        var component = this;
        formData.append('folderId', this.props.values.folderId)

        axios({
            url:repo.state.url.uploadFileToRepo,
            method:"POST",
            data:formData
        }).then((response)=>{
            var data = response.data;

            switch (data.error) {
                case 0: {
                    component.toggleUploadFileDisplay()
                    repo.retrieveRepoContent();
                    break;
                }
                case 1: {
                    break;
                }
            }

            state.ajax.uploadFiletoRepo.attempts = 0;
            component.setState(state);
        }).catch(()=>{
            component.reloadAjaxRequest(1);
        })

    };

    /* API */


    render() {

        return (
            <div className={this.props.values.repo.state.uploadFileDisplay ? "repoFileUpload--active" : "repoFileUpload--disabled"} ref={el => (this.instance = el)}>
                <div className="repoFileUpload__main">

                    <div id="uploader" ref={(u) => { this.uploader = u; }}>
                        <div></div>
                    </div>

                </div>
            </div>

        );
    }
}

class RepoCreateFolder extends Component {

    constructor(props) {
        super(props)

        this.state = {
            buttons: [],
            textInputs:[],
            ajax: {
                createFolderinRepo: {
                    attempts: 0,
                    error: 0
                }
            }
        }
        this.createFolderinRepo = this.createFolderinRepo.bind(this);
        this.reloadAjaxRequest = this.reloadAjaxRequest.bind(this);
        this.toggleCreateFolderDisplay = this.toggleCreateFolderDisplay.bind(this);
    }


    reloadAjaxRequest(option) {
        var state = this.state;
        switch (option) {
            case 1: {

                if (state.ajax.createFolderinRepo.attempts < 10) {
                    state.ajax.createFolderinRepo.attempts += 1;
                    this.setState(state);
                    this.createFolderinRepo();
                }
                else {
                    this.state.vaiues.repo.state.errorPopup.displayError("Access to server failed. Try again Later! ");
                    state.ajax.createFolderinRepo.attempts = 0;
                    this.setState(state);
                }
                break;
            }
        }

    }

    toggleCreateFolderDisplay(){
        var state = this.props.values.repo.state;
        state.toggleCreateFolderDisplay = state.toggleCreateFolderDisplay ? false :true;
        this.props.values.repo.setState(state);
    }

    /* API */

    createFolderinRepo() {
        var inputName = this.state.textInputs[0];

        if (inputName.state.inputValue == "") {
            inputName.focus();
            return;
        }

        var folderId = this.props.values.folderId;
        var repo = this.props.values.repo;

        var component = this;
        var state = this.state;

        state.buttons[0].state.status = 3;
        component.setState(state);

        axios({
            url: repo.state.url.createFolderinRepo,
            method: "POST",
            data:{
                parentId:folderId,
                name:state.textInputs[0].state.inputValue
            }
        }).then((response)=>{
            switch (response.data.error) {
                case 0: {
                    state.buttons[0].state.status = 2;
                    component.setState(state);
                    
                    component.toggleCreateFolderDisplay();
                    repo.retrieveRepoContent();
                    break;
                }
                case 1: {
                    state.buttons[0].state.status = 1;
                    break;
                }
            }

            state.ajax.createFolderinRepo.attempts = 0;
            component.setState(state);
        });

    }

    /* API */

    render() {

        return (
            <div className={this.props.values.repo.state.createFolderDisplay ? "repoCreateFolder--active": "repoCreateFolder--disabled" }>
                <form id="repoCreateFolder__form" action="#" method="post" encType="multipart/form-data">
                    <div className="repoCreateFolder__input">
                        <TextInput parent={this} status={0} config={{
                            type: "text_input_3",
                            label: "Folder Name:",
                            inputValue: ""
                        }}/>

                        <div className="repoCreateFolder__button">
                            <Button parent={this} status={0} config={{label:"Add",action:this.createFolderinRepo,type:'btn_1',text:''}}/>
                        </div>
                    </div>

                </form>

            </div>
        );
    }
}

class RepoContent extends Component {
    render() {
        var repo = this.props.main;
        return (
            <div className="repo__content SB">
                {repo.state.folders.map((item, i) => {
                    return <RepoFolder folder={item} key={i} index={item._id} main={repo} />
                })}
                {repo.state.files.map((item, i) => {
                    return <RepoFile file={item} key={i} index={item._id} main={repo} />
                })}
            </div>
        );
    }
}

class RepoFolder extends Component {
    constructor(props) {
        super(props);
        var folders = this.props.main.state.folders;
        var folder = this.props.folder;
        var display = false;

        for (var i = 0; folders[i] != null; i++) {
            if (folders[i]._id == this.props.index) {
                display = true;
                break;
            }
        }

        var fName = folder.name;
        if (fName.length > 10) {
            fName = fName.substr(0, 10) + " ...";
        }

        this.state = {
            folder: folder,
            folder_index: this.props.index,
            displayName: fName,
            display: display,
            toggle:false
        }

        this.deleteFolderFromRepo = this.deleteFolderFromRepo.bind(this);
        this.toggleFolderView = this.toggleFolderView.bind(this);
    }

    toggleFolderView(){
        var state =  this.state;
        state.toggle = state.toggle ? false : true;
        this.setState(state);
    }


    /* API  */
    deleteFolderFromRepo(delChoice = false) {
        var repo = this.props.main;
        var url = repo.state.url.deleteFolderFromRepo + this.state.folder.id;

        axios({
            url:url,
            method: delChoice ? "DELETE" : "GET"
        }).then((response)=>{
            switch (response.data.error) {
                case 0: {
                    repo.retrieveRepoContent();
                    break;
                }
                case 1: {
                    repo.state.folderInFocus = this;
                    repo.toggleDeleteFolderConfirmationPopUp();
                    break;
                }
            }
        });

    }
    /* API  */

    render() {
        const inActive = {
            display: 'none'
        }

        const active = {
            display: 'block'
        }

        return (
            <div className="repoFolder" id={"fd-" + this.state.folder_index} style={this.state.display == false ? inActive : active}>
                <div className={this.state.toggle ? "repoFolder__back" : "repoFolder__front" }>
                    <div className="repoFolder__preview">
                        <svg className="repoFolder__icon icon" onClick={() => { this.props.main.changeFolderDirectory(this.state.folder.id, this.state.folder.name) }}>
                            <use xlinkHref="#folder-1" />
                        </svg>
                    </div>

                    <div className="repoFolder__front__bottom">
                        <div className="repoFolder__name f_normal">{this.state.displayName}</div>
                        <div className="repoFolder__menuBtn" >
                            <div className="btn_icon--white" onClick={() => { this.toggleFolderView() }}>
                                <svg className="icon">
                                    <use xlinkHref="#back" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={this.state.toggle ? "repoFolder__front":"repoFolder__back" }>
                    <div className="repoFolder__menu">

                        <div className="repoFolder__menu__option">
                            <div className="btn_icon" onClick={() => { this.props.main.changeFolderDirectory(this.state.folder.id, this.state.folder.name) }}>
                                <svg className="icon">
                                    <use xlinkHref="#view" />
                                </svg>
                            </div>
                        </div>

                        <div className="repoFolder__menu__option--delete ">
                            <div className="btn_icon--danger" onClick={() => { this.deleteFolderFromRepo(false) }}>
                                <svg className="icon">
                                    <use xlinkHref="#trash" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="repoFolder__back__bottom" >
                        <div className="repoFolder__back__bottom__box" ></div>
                        <div className="repoFolder__menuBtn" onClick={() => { this.toggleFolderView() }}>
                            <div className="btn_icon--normal">
                                <svg className="icon">
                                    <use xlinkHref="#back" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

class RepoFile extends Component {
    constructor(props) {
        super(props);

        var files = this.props.main.state.files;
        var file = this.props.file;
        var display = false;

        for (var i = 0; files[i] != null; i++) {
            if (files[i]._id == this.props.index) {
                display = true;
                break;
            }
        }

        var fName = file.originalName;

        if (fName.length > 10) {
            fName = fName.substr(0, 10) + " ...";
        }

        this.state = {
            displayName: fName,
            display: display,
            dir: this.props.main.state.url.contentdir,
            selected: false,
            toggle:false,
            selectedClass: {
                true: 'repoFile--selected',
                false: 'repoFile'
            }
        }

        this.repoFileByType = this.repoFileByType.bind(this);
        this.repoFileSelect = this.repoFileSelect.bind(this);
        this.deleteFileFromRepo = this.deleteFileFromRepo.bind(this);
        this.checkIfSelected = this.checkIfSelected.bind(this);
        this.toggleFileView = this.toggleFileView.bind(this);
    }

    checkIfSelected() {
        var selected = false;
        var selectedFiles = this.props.main.state.selected_files;

        for (var i = 0; selectedFiles[i] != null; i++) {
            if (selectedFiles[i].id == this.props.index) {
                selected = true;
                break;
            }
        }

        var states = this.state;
        states.selected = selected;
        this.setState(states);
    }

    toggleFileView(){
        var state =  this.state;
        state.toggle = state.toggle ? false : true;
        this.setState(state);
    }

    repoFileSelect() {
        var repo = this.props.main;
        var state = repo.state;
        var selectedFiles = state.selected_files;

        if (this.state.selected == true) {
            for (var i = 0; selectedFiles[i] != null; i++) {
                if (selectedFiles[i].id == this.props.index) {
                    selectedFiles.splice(i);
                }
            }

            state.selected_files = selectedFiles;
            repo.setState(state);
            this.checkIfSelected();

            return;
        }
        else {

            var fileCount = state.required_count;
            if (fileCount == null) { return; }

            if (selectedFiles.length >= fileCount) { return; }

            var requiredTypes = state.required_types;
            var fileType = this.props.file.type;
            var found = false;

            for (var i = 0; requiredTypes[i] != null; i++) {
                if (fileType == requiredTypes[i]) { found = true; break; }
            }

            if (found == false) { return };

            state.selected_files.push({
                id: this.props.index,
                file: this.props.file
            });

            repo.setState(state);
            this.checkIfSelected();

            //console.log('It is selected');
        }

    }

    repoFileByType() {

        switch (this.props.file.type) {
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif':
                {
                    return <RepoImageFile repoFile={this} />;
                }
            case 'doc':
            case 'pdf':
            case 'docx':
            case 'xls':
                {
                    return <RepoDocFile repoFile={this} />;
                }
            default: {
                return <div></div>;
            }
        }

    }


    /* API */

    deleteFileFromRepo(delChoice) {
        var repo = this.props.main;

        if (!delChoice) {
            repo.state.fileInFocus = this;
            repo.toggleDeleteFileConfirmationPopUp();
            return;
        }

        axios({
            url: repo.state.url.deleteFileFromRepo + this.props.file.id,
            method: delChoice ? "DELETE" : "GET"
        }).then((response)=>{
            switch (response.data.error) {
                case 0: {
                    repo.retrieveRepoContent();
                    break;
                }
                case 1: {
                    break;
                }
            }
        });
    }

    /* API */

    render() {
        return (
            this.repoFileByType()
        );
    }
}

class RepoImageFile extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var file = this.props.repoFile.props.file;
        var state = this.props.repoFile.state;
        var fileId = this.props.repoFile.props.index;


        const fileImage = {
            background: "url('" + state.dir + "/" + file.name + "/thumb_150_150.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }

        const inActive = {
            display: 'none'
        }

        const active = {
            display: 'block'
        }


        return (
            <div className={state.selected ? state.selectedClass.true : state.selectedClass.false}
                id={"fl-" + fileId}
                style={!state.display ? inActive : active}
            >

                <div className={state.toggle ? "repoFile__back" : "repoFile__front"}>
                    <div className="repoFile__preview" style={fileImage} onClick={() => { this.props.repoFile.repoFileSelect() }}>
                    </div>
                    <div className="repoFile__front__bottom">
                        <div className="repoFile__name f_normal">{state.displayName}</div>
                        <div className="repoFile__menuBtn" onClick={() => { this.props.repoFile.toggleFileView() }}>
                            <div className="btn_icon--white">
                                <svg className="icon">
                                    <use xlinkHref="#back" />
                                </svg>
                            </div>
                        </div>
                    </div>

                </div>

                <div className={state.toggle ? "repoFile__front" : "repoFile__back"}>
                    <div className="repoFile__menu">
                        <div className="repoFile__menu__option">
                            <a href={state.dir +  "/" + file.name + "." + file.type} target="_blank">

                                <div className="btn_icon">
                                    <svg className="icon">
                                        <use xlinkHref="#view" />
                                    </svg>
                                </div>

                            </a>
                        </div>

                        <div className="repoFile__menu__option--delete ">
                            <div className="btn_icon--danger" onClick={() => { this.props.repoFile.deleteFileFromRepo(false) }}>
                                <svg className="icon">
                                    <use xlinkHref="#trash" />
                                </svg>
                            </div>

                        </div>

                    </div>
                    <div className="repoFile__back__bottom" >
                        <div className="repoFile__back__bottom__box" ></div>
                        <div className="repoFile__menuBtn icon_return">
                            <div className="btn_icon--normal" onClick={() => { this.props.repoFile.toggleFileView() }}>
                                <svg className="icon">
                                    <use xlinkHref="#back" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

class RepoDocFile extends Component {
    render() {
        var file = this.props.repoFile.props.file;
        var fileId = this.props.repoFile.props.index;
        var state = this.props.repoFile.state;
        var icon = "";

        switch (file.type) {
            case 'doc':
            case 'docx': {
                icon = "doc";
                break;
            }
            case 'pdf': {
                icon = "pdf";
                break;
            }
            case 'xls': {
                icon = "xls";
                break;
            }
            default:
        }

        return (
            <div className={state.selected == true ? state.selectedClass.true : state.selectedClass.false}
                id={"fl-" + fileId}>

                <div className="repoFile__front" onClick={() => { this.props.repoFile.repoFileSelect() }}>
                    <div className="repoFile__preview">
                        <svg className="repoFile__icon icon">
                            <use xlinkHref={"#" + icon} />
                        </svg>
                    </div>
                    <div className="repoFile__front__bottom">
                        <div className="repoFile__name f_normal">{state.displayName}</div>
                        <div className="repoFile__menuBtn" >
                            <div className="btn_icon--white" onClick={() => { this.props.repoFile.toggleFileView() }}>
                                <svg className="icon">
                                    <use xlinkHref="#back" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="repoFile__back">
                    <div className="repoFile__menu">

                        <div className="repoFile__menu__option ">
                            <a href={this.props.repoFile.state.dir +  "/" + file.name + "." + file.type} target="_blank" >
                                <div className="btn_icon">
                                    <svg className="icon">
                                        <use xlinkHref="#view" />
                                    </svg>
                                </div>
                            </a>
                        </div>

                        <div className="repoFile__menu__option--delete ">

                            <div className="btn_icon--danger" onClick={() => { this.props.repoFile.deleteFileFromRepo(false) }}>
                                <svg className="icon">
                                    <use xlinkHref="#trash" />
                                </svg>
                            </div>

                        </div>
                    </div>

                    <div className="repoFile__back__bottom" >
                        <div className="repoFile__back__bottom__box" ></div>
                        <div className="repoFile__menuBtn icon_return">
                            <div className="btn_icon--normal" onClick={() => { this.props.repoFile.toggleFileView() }}>
                                <svg className="icon">
                                    <use xlinkHref="#back" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default Repo;
