import { Transaction, Model, Sequelize, QueryTypes, NOW } from 'sequelize';
import { GenericTable } from './model/GenericTable';
import { SteamDB } from './model/SteamDB';
import { BazarekDB } from './model/BazarekDB';
import { TagDB } from './model/TagDB';
import { CategoryDB } from './model/CategoryDB';
import { QueryOptionsWithType } from 'sequelize/types/lib/query-interface';
import { ReviewDB } from './model/ReviewDB';

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

    this.isReady = this.useTables(SteamDB, BazarekDB, TagDB, CategoryDB, ReviewDB);

    //catches ctrl+c event
    process.on('SIGINT', () => {
      // this.logStream.close();
      this.db.close();
    });
  }

  useTables(...tableDBs: GenericTable[]) {
    tableDBs.forEach((table) => {
      table.initTypes(this.db);
    });

    tableDBs.forEach((table) => {
      table.initRelation();
    });
    return this.db.sync();
  }

  async insupsRaw<T = any>(data: T[], model: any): Promise<any> {
    return await this.db.transaction({ type: Transaction.TYPES.IMMEDIATE }, async (transaction) => {
      const promises = data.map((d) => {
        const where = { id: (d as any).id };
        return model
          .findOrCreate({ where, defaults: d, transaction })
          .then(([newModel, created]: [Model<T>, boolean]) => {
            if (created) {
              return newModel;
            } else {
              newModel.changed('updatedAt' as any, true);
              return newModel.save({ transaction });
            }
          });
      });
      return Promise.all(promises);
    });
  }

  async insert<T>(data: any, model: any): Promise<any> {
    return model.create(data).catch(() => {});
  }

  findAll<T>(model: any, options: any): Promise<T[]> {
    return model.findAll(options);
  }

  count(model: any, options: any): Promise<number> {
    return model.count(options);
  }
}
