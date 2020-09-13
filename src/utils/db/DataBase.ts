import { Transaction, Model, Sequelize } from 'sequelize';
import { GenericTable } from './GenericTable';
import { SteamDB } from './SteamDB';
import { BazarekDB } from './BazarekDB';

const fs = require('fs');

export class DataBase {
  private db!: Sequelize;
  public isReady: Promise<Sequelize>;

  // private readonly logStream = fs.createWriteStream('./sql.log', { flags: 'w' });

  constructor() {
    this.db = new Sequelize('sqlite:chinook.db', {
      // logging: (msg) => this.logStream.write(msg),
      logging: false,
    });

    this.useTable(SteamDB);
    this.useTable(BazarekDB);
    this.initRelations(SteamDB);
    this.initRelations(BazarekDB);
    this.isReady = this.db.sync();

    //catches ctrl+c event
    process.on('SIGINT', () => {
      // this.logStream.close();
      this.db.close();
    });
  }

  useTable(tableDB: GenericTable) {
    tableDB.initTypes(this.db);
  }

  initRelations(tableDB: GenericTable) {
    tableDB.initRelation();
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

  async insertRaw<T>(data: T[], model: any): Promise<any> {
    return await this.db.transaction({ type: Transaction.TYPES.EXCLUSIVE }, async (transaction) => {
      const promises = data.map((d) => {
        return model.create(d, { transaction }).catch(() => {});
      });
      await Promise.all(promises);
      return transaction.commit();
    });
  }

  async insert<T>(data: any, model: any): Promise<any> {
    return model.create(data).catch((a: any) => {
      console.log(a);
    });
  }

  findAll<T>(model: any, where: any): Promise<T[]> {
    return model.findAll({ where });
  }
}
