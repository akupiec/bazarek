import React from 'react';
import { PriceCellRenderer } from './CellRenderers/PriceCellRenderer';
import './cellRenderers.scss';
import { HrefCellRenderer } from './CellRenderers/HrefCellRenderer';
import { StarCellRenderer } from './CellRenderers/StarCellRenderer';

const RowsRenderer = ({ data, columns }) => {
  if (data.length) {
    return data.map((d) => {
      const Row = columns.map((c, idx) => {
        const key = data.id +'_' + idx;
        if (typeof c.value === 'function') {
          return <td key={key}>{c.value(d)}</td>;
        }
        return <td key={key}>{d[c.value]}</td>;
      });

      return <tr key={d.ID}>{Row}</tr>;
    });
  }
  return <></>;
};

export function GenericTable({ data }) {

  const columns = [
    { label: 'Name', value: 'Name' },
    { label: 'Hrefs', value: HrefCellRenderer },
    { label: 'Price', value: PriceCellRenderer },
    { label: 'Reviews', value: StarCellRenderer },
  ];

  const Columns = columns.map(c => <th scope="col" key={c.label}>{c.label}</th>);
  const Rows = RowsRenderer({ data, columns });

  return (
    <table className="table table-striped">
      <thead>
      <tr>
        {Columns}
      </tr>
      </thead>
      <tbody>
      {Rows}
      </tbody>
    </table>
  );
}