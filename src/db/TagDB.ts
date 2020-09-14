import { DataTypes, Model, Sequelize } from 'sequelize';
import { SteamDB } from './SteamDB';

export interface TagI {
  id: number;
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
        },
        name: {
          type: DataTypes.STRING,
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
}
