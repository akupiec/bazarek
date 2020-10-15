import React from 'react';

const HrefCellRenderer = (rowData) => {
  return <div> {rowData.Href} && {rowData.Bazarek.Href} </div>;
};

const PriceCellRenderer = (rowData) => {
  const bazarekPrice = rowData.Bazarek.Price || Infinity;
  const steamPrice = rowData.Price || Infinity;
  const price = bazarekPrice < steamPrice ? bazarekPrice : steamPrice;
  return <div> {price} </div>;
};

const RowsRenderer = ({ data, columns }) => {
  if (data.length) {
    return data.map((d) => {
      const Row = columns.map((c) => {
        if (typeof c.value === 'function') {
          return <td>{c.value(d)}</td>;
        }
        return <td>{d[c.value]}</td>;
      });

      return <tr>{Row}</tr>;
    });
  }
  return <></>;
};

export function GenericTable({ data }) {

  const columns = [
    { label: 'Name', value: 'Name' },
    { label: 'Href', value: HrefCellRenderer },
    { label: 'Price', value: PriceCellRenderer },
  ];

  const Columns = columns.map(c => <th scope="col">{c.label}</th>);
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