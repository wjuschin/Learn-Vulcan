import { registerComponent } from 'meteor/vulcan:core';
import React from 'react';
import { Categories } from '../../modules/categories/collection.js';

const Sidebar = () => {
  
  return (
    <div>
      <div className="sidebar">
        <div className="posts-list-header-catgeories">
          <Components.CategoriesSidebar />
        </div>
      </div>
    </div>
  )
}

Sidebar.displayName = "Sidebar";

registerComponent('Sidebar', Sidebar);