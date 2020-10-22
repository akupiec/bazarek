import React from 'react';
import { BazarekTable } from './BazarekTable';
import { HrefCellRenderer } from './GenericTable/CellRenderers/HrefCellRenderer';
import { PriceCellRenderer } from './GenericTable/CellRenderers/PriceCellRenderer';
import { StarCellRenderer } from './GenericTable/CellRenderers/StarCellRenderer';

export function BazarekSearch() {
  const columns = [
    { key: 'name', label: 'Name', value: 'Name' },
    { label: 'Hrefs', value: HrefCellRenderer },
    { key: 'price', label: 'Price', value: PriceCellRenderer },
    { key: 'reviews', label: 'Reviews', value: StarCellRenderer },
  ];

  return <>
    <div className="px-3 py-3 pt-md-5 pb-m d-4 mx-auto">
      <h1 className="display-4">Search Bazarek Game</h1>
    </div>
    <BazarekTable columns={columns} />
  </>;
}