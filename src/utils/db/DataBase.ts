import { Transaction, Model, Sequelize } from 'sequelize';
import { GenericTable } from './GenericTable';

const fs = require('fs');

export class DataBase {
  private readonly db!: Sequelize;

  // private readonly logStream = fs.createWriteStream('./sql.log', { flags: 'w' });

  constructor() {
    this.db = new Sequelize('sqlite:chinook.db', {
      // logging: (msg) => this.logStream.write(msg),
      logging: false,
    });

    //catches ctrl+c event
    process.on('SIGINT', () => {
      // this.logStream.close();
      this.db.close();
    });
  }

  useTable(tableDB: GenericTable) {
    tableDB.initTypes(this.db);
    this.db.sync();
  }

  async insupsRaw<T>(data: T[], model: any): Promise<any> {
    return await this.db.transaction({ type: Transaction.TYPES.IMMEDIATE }, async (transaction) => {
      const promises = data.map((d) => {
        const where = { id: (d as any).id };
        return model
          .findOrCreate({ where, defaults: d, transaction })
          .then(([model, created]: [Model<T>, boolean]) => {
            if (created) {
              return model;
            } else {
              return model.update(d as any, {
                where,
                fields: ['price', 'offers'],
                transaction,
              });
            }
          });
      });
      return Promise.all(promises);
    });
  }
}
