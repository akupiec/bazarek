import React from 'react';

export const HrefCellRenderer = (rowData) => {
  return <div className="hrefs">
    <a href={rowData.steamHref} target="_blank"><i className="ico steam-ico" /></a>
    <a href={'https://bazar.lowcygier.pl' + rowData.bazarekHref} target="_blank"><i className="ico bazarek-ico" /></a>
  </div>;
};