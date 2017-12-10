import { ModalTrigger, Components, registerComponent, withList, Utils } from "meteor/vulcan:core";
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'meteor/vulcan:i18n';
import Button from 'react-bootstrap/lib/Button';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import { withRouter } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap';
import { Categories } from '../../modules/categories/index.js';
import { withApollo } from 'react-apollo';

class CategoriesSidebar extends PureComponent {

  constructor() {
    super();
    this.getCurrentCategoriesArray = this.getCurrentCategoriesArray.bind(this);
    this.getCategoryLink = this.getCategoryLink.bind(this);
  }

  getCurrentCategoriesArray() {
    const currentCategories = _.clone(this.props.location.query.cat);
    if (currentCategories) {
      return Array.isArray(currentCategories) ? currentCategories : [currentCategories]
    } else {
      return [];
    }
  }

  getCategoryLink(slug) {
    const categories = this.getCurrentCategoriesArray();
    return {
      pathname: Utils.getRoutePath('posts.list'),
      query: {
        ...this.props.location.query,
        cat: categories.includes(slug) ? _.without(categories, slug) : categories.concat([slug])
      }
    }
  }

  getNestedCategories() {
    const categories = this.props.results;

    // check if a category is currently active in the route
    const currentCategorySlug = this.props.router.location.query && this.props.router.location.query.cat;
    const currentCategory = Categories.findOneInStore(this.props.client.store, {slug: currentCategorySlug});
    const parentCategories = Categories.getParents(currentCategory, this.props.client.store);

    // decorate categories with active and expanded properties
    const categoriesClone = _.map(categories, category => {
      return {
        ...category, // we don't want to modify the objects we got from props
        active: currentCategory && category.slug === currentCategory.slug, 
        expanded: parentCategories && _.contains(_.pluck(parentCategories, 'slug'), category.slug)
      };
    }); 

    const nestedCategories = Utils.unflatten(categoriesClone, {idProperty: '_id', parentIdProperty: 'parentId'});

    return nestedCategories;
  }

  render() {

    const allCategoriesQuery = _.clone(this.props.router.location.query);
    delete allCategoriesQuery.cat;
    const nestedCategories = this.getNestedCategories();
  }
}

CategoriesList.propTypes = {
  results: PropTypes.array,
};


const options = {
  collection: Categories,
  queryName: 'categoriesListQuery',
  fragmentName: 'CategoriesList',
  limit: 0,
  pollInterval: 0,
};

registerComponent('CategoriesSidebar', CategoriesList, withRouter, withApollo, [withList, options]);
