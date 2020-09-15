import { Sequelize } from 'sequelize';

export type GenericTable = { initTypes(db: Sequelize): void; initRelation(): void };
