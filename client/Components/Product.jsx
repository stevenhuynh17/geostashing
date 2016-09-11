import React from 'react';

const Product = (props) => (
  <li className="collection-item avatar product">
    <img
      src={
        props.info.images[0]
        ? props.info.images[0].url
        : '/default-image.svg'}
      className="responsive-img circle" alt=""/>
    <span className="title">{props.info.name}</span>
    <p>
      <span className="price">${props.info.price}</span><br/>
      by {props.info.seller.name}<br/>
      {props.info.description}
    </p>
    <a href="#!" className="secondary-content">
      {props.info.location.lng}, {props.info.location.lat}
    </a>
  </li>
);

Product.propTypes = { info: React.PropTypes.object };

export default Product;
