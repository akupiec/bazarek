import React from 'react';
import { ReactComponent as Star } from './star.svg'
import { ReactComponent as StarHalf } from './star-half.svg'
import { ReactComponent as StarFill } from './star-fill.svg'
import './startCell.scss'

export const StarCellRenderer = (rowData) => {
  const icon = getIcon(rowData.review, rowData.reviewId)
  return <div className="review-cell"> {icon} </div>;
};

const getIcon = (reviewName, reviewId) => {
  switch(reviewId) {
    case 1:
      return <StarFill className="red" title={reviewName}/>
    case 2:
      return <StarHalf className="red" title={reviewName}/>
    case 3:
      return <Star className="red" title={reviewName}/>
    case 4:
      return <Star title={reviewName}/>
    case 5:
      return <StarHalf title={reviewName}/>
    case 6:
      return <StarFill title={reviewName}/>
    case 7:
      return <Star className="gold" title={reviewName}/>
    case 8:
      return <StarHalf className="gold" title={reviewName}/>
    case 9:
      return <StarFill className="gold" title={reviewName}/>
  }
}