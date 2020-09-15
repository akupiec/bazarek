import { Op } from 'sequelize';
import moment from 'moment';

export const START_PAGE = 1;
export const LAST_PAGE = 1;
export const needUpdateOptions = {
  where: { updatedAt: { [Op.lt]: moment().subtract(20, 'minutes') } },
};