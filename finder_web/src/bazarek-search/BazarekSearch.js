import React from 'react';
import { BazarekTable } from './BazarekTable';
import { HrefCellRenderer } from './GenericTable/CellRenderers/HrefCellRenderer';
import { PriceCellRenderer } from './GenericTable/CellRenderers/PriceCellRenderer';
import { StarCellRenderer } from './GenericTable/CellRenderers/StarCellRenderer';
import { StatusCellRenderer } from './GenericTable/CellRenderers/StausCellRenderer';

export function BazarekSearch() {
  const columns = [
    { key: 'name', label: 'Name', value: 'name' },
    { label: 'Hrefs', value: HrefCellRenderer },
    { key: 'price', label: 'Price', value: PriceCellRenderer },
    { key: 'reviews', label: 'Reviews', value: StarCellRenderer },
    { key: 'status', label: 'Status', value: StatusCellRenderer },
  ];

  return <>
    <h1 className="display-4">Search Bazarek Game</h1>
    <BazarekTable columns={columns} />
  </>;
}