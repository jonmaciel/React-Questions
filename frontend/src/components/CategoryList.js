import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class CategoryList extends Component {
  render() {
    return (
      <div className="post-body">
        <h2 className="post-body-title">
          Category List
        </h2>
        <div className="post-body-posts">
          <ul>
          { Object.values(this.props.categories).map(category =>
              <li key={category.path}>
                <Link to={`/${category.path}`} >
                  {category.name}
                </Link>
              </li>
            )
          }
          </ul>
        </div>
      </div>
    );
  }
}

export default CategoryList;
