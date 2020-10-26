import React from 'react';

export const PriceCellRenderer = (rowData) => {
  let price = rowData.price;
  return <div> {price} </div>;
};