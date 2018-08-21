import React from 'react';
import ReactDOM from 'react-dom';
import Posts from '../../components/Admin/posts';

ReactDOM.render( 
    <Posts view={[1,0,0]}/> ,
    document.getElementById('postsViewComponent')
);