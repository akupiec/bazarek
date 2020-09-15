import { NamedTable } from './NamedTable';
import { SteamDB, SteamI } from './SteamDB';

export class ReviewDB extends NamedTable {
  protected static table = 'review';

  static initRelation() {
    ReviewDB.hasMany(SteamDB, {
      foreignKey: 'reviewId',
    });
  }

  static createBySteam(steamDatas: SteamI[]) {
    const reviews = steamDatas.map((s) => s.review).filter((s) => !!s) as string[];
    return this.bulkMyCreate(reviews);
  }
}
