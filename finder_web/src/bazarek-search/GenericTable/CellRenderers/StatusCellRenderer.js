import React from 'react';
import { saveCustomGame } from '../../../utils/finder.service';
import { ReactComponent as Heart } from './heart.svg';
import { ReactComponent as BagCheck } from './bag-check.svg';
import { ReactComponent as CartX } from './cart-x.svg';
import { ReactComponent as XOctagon } from './x-octagon.svg';

export const StatusCellRenderer = (rowData, setRowData) => {

  const send = (type) => {
    const newType = type === rowData?.type ? undefined : type;
    saveCustomGame(rowData.id, newType).then(() => {
      setRowData({ ...rowData, type: newType });
    });
  };
  const btnClass = (type) => {
    let str = 'btn btn-outline-secondary';
    str += type === rowData?.type ? ' active' : '';
    return str;
  };

  return <div>
    <div className="btn-group">
      <button type="button" onClick={() => send('Love')} className={btnClass('Love')}>
        <Heart />
      </button>

      <button type="button" onClick={() => send('Hate')} className={btnClass('Hate')}>
        <XOctagon />
      </button>

      <button type="button" onClick={() => send('Own')} className={btnClass('Own')}>
        <BagCheck />
      </button>

      <button type="button" onClick={() => send('GiveAway')} className={btnClass('GiveAway')}>
        <CartX />
      </button>
    </div>
  </div>;
};