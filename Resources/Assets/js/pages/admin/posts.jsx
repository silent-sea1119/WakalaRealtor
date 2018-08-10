import React from 'react';
import ReactDOM from 'react-dom';
import PostsView from '../../components/Admin/posts';

ReactDOM.render( 
    <PostsView view={[1,0,0]}/> ,
    document.getElementById('postsViewComponent')
);