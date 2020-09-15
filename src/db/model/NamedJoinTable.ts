import { QueryTypes } from 'sequelize';
import { NamedTable } from './NamedTable';

export class NamedJoinTable extends NamedTable {
  protected static joinTableName = '';
  protected static otherKey = '';
  protected static foreignKey = '';

  static async updateJoinTable(steamTag: any[]) {
    return Promise.all(
      steamTag.map((s) => {
        this.sequelize
          ?.query(
            `INSERT INTO "${this.joinTableName}"(${this.otherKey}, ${this.foreignKey}) VALUES (?, ?)`,
            {
              type: QueryTypes.INSERT,
              replacements: s,
            },
          )
          .catch(() => {});
      }),
    );
  }
}
