import React from 'react';
import { ReactComponent as Star } from './star.svg'
import { ReactComponent as StarHalf } from './star-half.svg'
import { ReactComponent as StarFill } from './star-fill.svg'
import './startCell.scss'

export const StarCellRenderer = (rowData) => {
  const icon = getIcon(rowData.Review)
  return <div className="review-cell"> {icon} </div>;
};

const getIcon = (review = {}) => {
  switch(review?.ID) {
    case 1:
      return <StarFill className="red" title={review.Name}/>
    case 2:
      return <StarHalf className="red" title={review.Name}/>
    case 3:
      return <Star className="red" title={review.Name}/>
    case 4:
      return <Star title={review.Name}/>
    case 5:
      return <StarHalf title={review.Name}/>
    case 6:
      return <StarFill title={review.Name}/>
    case 7:
      return <Star className="gold" title={review.Name}/>
    case 8:
      return <StarHalf className="gold" title={review.Name}/>
    case 9:
      return <StarFill className="gold" title={review.Name}/>
  }
}