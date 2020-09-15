import { DataTypes, Model, QueryTypes, Sequelize, Transaction } from 'sequelize';
import { SteamDB } from './SteamDB';

export interface CategoryI {
  id?: number;
  name: string;
}

export class CategoryDB extends Model<CategoryI> implements CategoryI {
  id!: number;
  name!: string;

  static async bulkMyCreate<T = CategoryDB>(data: string[]): Promise<CategoryDB[]> {
    const db = this.sequelize as Sequelize;
    return db.transaction({ type: Transaction.TYPES.IMMEDIATE }, async (transaction) => {
      const promises = data.map((d) => {
        const where = { name: d };
        const defaults = { name: d };
        return CategoryDB.findOrCreate({ where, defaults, transaction }).then(
          ([newModel]: [CategoryDB, boolean]) => {
            return newModel;
          },
        );
      });
      return Promise.all(promises);
    });
  }

  static async updateJoinTable(steamTag: any[]) {
    return Promise.all(
      steamTag.map((s) => {
        this.sequelize
          ?.query(`INSERT INTO "category-steam"(steamId, categoryId) VALUES (?, ?)`, {
            type: QueryTypes.INSERT,
            replacements: s,
          })
          .catch(() => {});
      }),
    );
  }

  static initTypes(sequelize: Sequelize) {
    CategoryDB.init(
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
        tableName: 'category',
        sequelize,
      },
    );
  }

  static initRelation() {
    CategoryDB.belongsToMany(SteamDB, {
      through: 'category-steam',
      foreignKey: 'categoryId',
      otherKey: 'steamId',
      timestamps: false,
    });
  }
}
