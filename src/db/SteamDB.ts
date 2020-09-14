import { Sequelize, DataTypes, Model } from 'sequelize';
import { TagDB } from './TagDB';
import { CategoryDB } from './CategoryDB';

export interface SteamI {
  id: number;
  href: string;
  name: string;
  price: number;
  updatedAt?: Date;
  createdAt?: Date;
}

export class SteamDB extends Model<SteamI> implements SteamI {
  id!: number;
  name!: string;
  href!: string;
  price!: number;

  readonly updatedAt!: Date;
  readonly createdAt!: Date;

  static initTypes(sequelize: Sequelize) {
    SteamDB.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
        },
        href: {
          type: DataTypes.STRING,
        },
        name: {
          type: DataTypes.STRING,
        },
        price: {
          type: DataTypes.FLOAT.UNSIGNED,
        },
      },
      {
        timestamps: true,
        tableName: 'steam',
        sequelize,
      },
    );
  }

  static initRelation() {
    SteamDB.belongsToMany(TagDB, {
      through: 'tag-steam',
      foreignKey: 'steamId',
      otherKey: 'tagId',
      timestamps: false,
    });
    SteamDB.belongsToMany(CategoryDB, {
      through: 'category-steam',
      foreignKey: 'steamId',
      otherKey: 'categoryId',
      timestamps: false,
    });
  }
}
