import React from 'react';

export const HrefCellRenderer = (rowData) => {
  return <div className="hrefs">
    <a href={rowData.Href} target="_blank"><i className="ico steam-ico" /></a>
    <a href={rowData.Bazarek?.Href} target="_blank"><i className="ico bazarek-ico" /></a>
  </div>;
};