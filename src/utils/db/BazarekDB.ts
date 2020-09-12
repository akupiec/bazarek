import { Sequelize, DataTypes, Model } from 'sequelize';

export interface BazarekI {
  id: number;
  name: string;
  price?: number;
  offers: number;
  steamId?: number;
  updatedAt?: Date;
}

export class BazarekDB extends Model<BazarekI> implements BazarekI {
  id!: number;
  name!: string;
  price!: number;
  offers!: number;
  steamId!: number;

  readonly updatedAt!: Date;

  static initTypes(sequelize: Sequelize) {
    BazarekDB.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
        },
        price: {
          type: DataTypes.FLOAT.UNSIGNED,
        },
        offers: {
          type: DataTypes.TINYINT.UNSIGNED,
        },
        steamId: {
          type: DataTypes.INTEGER.UNSIGNED,
        },
      },
      {
        timestamps: true,
        createdAt: false,
        tableName: 'bazarek',
        sequelize, // passing the `sequelize` instance is required
      },
    );
  }
}
