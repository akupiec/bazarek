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

  replace(tableName: string, columns: string, values: any) {
    const sql = `REPLACE INTO ${tableName} ${columns} VALUES ${values}`;
    this.run(sql);
  }

  replaceObj(tableName: string, data: any) {
    return this.replaceObjs(tableName, [data]);
  }

  async replaceObjs(tableName: string, data: any[], ignoredKeys: string[] = []) {
    if (!data.length) {
      return;
    }
    const cols = Object.keys(data[0]).concat(...ignoredKeys);
    const vals = data.map((row) => {
      const ret = [];
      cols.forEach((col) => {
        const value = row[col] || 'NULL';
        if (typeof value === 'string') {
          ret.push(`'${value.replace(/'/gm, `''`)}'`);
        } else {
          ret.push(value);
        }
      });
      const values = ret.join(',').replace(`'NULL'`, 'null');
      return `(${values})`;
    });

    const columns = `(${cols.join(',')})`;
    const values = vals.join(',');
    const updatSet = Object.keys(data[0])
      .map((key) => `${key}=${key}`)
      .join(',');
    const sql = `INSERT INTO ${tableName} ${columns} VALUES ${values} ON CONFLICT(id) DO UPDATE SET ${updatSet}`;

    return this.run(sql);
  }

  run(sql: string) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, (err) => {
        if (err) {
          console.error(err, sql);
          reject(err);
        }
        resolve(err);
      });
    });
  }

  all(sql: string): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      this.db.all(sql, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  upsert(tableName: string, data: any[], noChangeKeys: string[]) {}
}
