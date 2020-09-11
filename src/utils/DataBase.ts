import { Database } from 'sqlite3';

export class DataBase {
  private db!: Database;

  constructor() {
    this.db = new Database('chinook.db', (err) => {
      if (err) {
        console.error(err.message);
        process.exit(-1);
      }
    });
  }

  createTable(query) {
    return this.db.run(query);
  }

  replace(tableName: string, columns: string, values: string) {
    const sql = `REPLACE INTO ${tableName} ${columns} VALUES ${values}`;
    return this.db.run(sql, (err) => {
      if (err) {
        console.error(err, sql);
        process.exit(-1);
      }
    });
  }

  replaceObjs(tableName: string, data: any[]) {
    if (!data.length) {
      return;
    }
    const cols = Object.keys(data[0]);
    const vals = data.map((row) => {
      const ret = [];
      cols.forEach((col) => {
        const value = row[col];
        if (typeof value === 'string') {
          ret.push(`'${value.replace(/'/gm, `''`)}'`);
        } else {
          ret.push(value);
        }
      });
      return `(${ret.join(',')})`;
    });

    return this.replace(tableName, `(${cols.join(',')})`, vals.join(','));
  }
}
