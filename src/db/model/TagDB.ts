import { DataTypes, Model, QueryTypes, Sequelize, Transaction } from 'sequelize';
import { SteamDB } from './SteamDB';

export interface TagI {
  id?: number;
  name: string;
}

export class TagDB extends Model<TagI> implements TagI {
  id!: number;
  name!: string;

  static initTypes(sequelize: Sequelize) {
    TagDB.init(
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
        tableName: 'tag',
        sequelize,
      },
    );
  }

  static initRelation() {
    TagDB.belongsToMany(SteamDB, {
      through: 'tag-steam',
      foreignKey: 'tagId',
      otherKey: 'steamId',
      timestamps: false,
    });
  }

  static async bulkMyCreate<T = TagDB>(data: string[]): Promise<TagDB[]> {
    const db = this.sequelize as Sequelize;
    return db.transaction({ type: Transaction.TYPES.IMMEDIATE }, async (transaction) => {
      const promises = data.map((d) => {
        const where = { name: d };
        const defaults = { name: d };
        return TagDB.findOrCreate({ where, defaults, transaction }).then(
          ([newModel]: [TagDB, boolean]) => {
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
          ?.query(`INSERT INTO "tag-steam"(steamId, tagId) VALUES (?, ?)`, {
            type: QueryTypes.INSERT,
            replacements: s,
          })
          .catch(() => {});
      }),
    );
  }
}
