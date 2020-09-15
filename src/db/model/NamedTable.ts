import { DataTypes, Model, Sequelize, Transaction } from 'sequelize';

export interface NamedI {
  id?: number;
  name: string;
}

export class NamedTable extends Model<NamedI> {
  id!: number;
  name!: string;

  protected static table = '';

  static initTypes(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING,
          unique: true,
        },
      },
      {
        timestamps: false,
        tableName: this.table,
        sequelize,
      },
    );
  }

  static async bulkMyCreate(data: string[]) {
    const db = this.sequelize as Sequelize;
    return db.transaction({ type: Transaction.TYPES.IMMEDIATE }, async (transaction) => {
      const promises = data.map((d) => {
        const where = { name: d };
        const defaults = { name: d };
        return this.findOrCreate({ where, defaults, transaction }).then(
          ([newModel]: [NamedTable, boolean]) => {
            return newModel;
          },
        );
      });
      return Promise.all(promises);
    });
  }
}
