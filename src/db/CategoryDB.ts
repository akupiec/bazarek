import { DataTypes, Model, Sequelize } from 'sequelize';
import { SteamDB } from './SteamDB';

export interface CategoryI {
  id: number;
  name: string;
}

export class CategoryDB extends Model<CategoryI> implements CategoryI {
  id!: number;
  name!: string;

  static initTypes(sequelize: Sequelize) {
    CategoryDB.init(
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
