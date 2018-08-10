import React from 'react';
import ReactDOM from 'react-dom';
import AdminHeader from '../../components/Header/adminHeader';
import Sidebar from "../../components/Admin/sidebar";

ReactDOM.render(<AdminHeader />,
    document.getElementById('adminHeaderComponent')
);

ReactDOM.render(<Sidebar />,
    document.getElementById('adminSidebarComponent')
);


