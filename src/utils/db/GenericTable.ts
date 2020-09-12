import { Sequelize, Model } from 'sequelize';

export type GenericTable = { initTypes(db: Sequelize): void };
