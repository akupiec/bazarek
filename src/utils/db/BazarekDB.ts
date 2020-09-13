import {
  BelongsToGetAssociationMixin,
  DataTypes,
  HasOneCreateAssociationMixin,
  Model,
  Sequelize,
} from 'sequelize';
import { SteamDB } from './SteamDB';

export interface BazarekI {
  id: number;
  offerId?: number;
  name: string;
  price?: number;
  offers: number;
  steamId?: number;
  updatedAt?: Date;
}

export class BazarekDB extends Model<BazarekI> implements BazarekI {
  id!: number;
  offerId!: number;
  name!: string;
  price!: number;
  offers!: number;
  steamId?: number;

  readonly updatedAt!: Date;

  getSteamDB!: BelongsToGetAssociationMixin<SteamDB>;
  createSteamDB!: HasOneCreateAssociationMixin<SteamDB>;

  static initTypes(sequelize: Sequelize) {
    BazarekDB.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
        },
        offerId: {
          type: DataTypes.INTEGER.UNSIGNED,
          unique: true,
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

  static initRelation() {
    BazarekDB.belongsTo(SteamDB);
  }
}
