import React from 'react';

export const PriceCellRenderer = (rowData) => {
  const bazarekPrice = rowData.Bazarek.Price || Infinity;
  const steamPrice = rowData.Price || Infinity;
  let price;
  let icon;
  if (bazarekPrice < steamPrice) {
    price = bazarekPrice;
    icon = <i className="ico bazarek-ico ico-xs" />;
  } else {
    price = steamPrice;
    icon = <i className="ico steam-ico ico-xs" />;
  }
  return <div> {price} {icon} </div>;
};