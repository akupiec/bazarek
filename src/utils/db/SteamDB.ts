import { Sequelize, DataTypes, Model } from 'sequelize';
import { BazarekDB } from './BazarekDB';

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
        sequelize, // passing the `sequelize` instance is required
      },
    );
  }

  static initRelation() {
    SteamDB.hasOne(BazarekDB);
  }
}
