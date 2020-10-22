import React from 'react';
import './cellRenderers.scss';

const RowsRenderer = ({ data, columns }) => {
  if (data.length) {
    return data.map((d) => {
      const Row = columns.map((c, idx) => {
        const key = data.id + '_' + idx;
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

export function GenericTable({ data, columns}) {
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