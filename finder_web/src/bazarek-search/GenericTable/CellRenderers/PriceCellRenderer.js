import React from 'react';

export const PriceCellRenderer = (rowData) => {
  let price = rowData.Price;
  return <div> {price} </div>;
};