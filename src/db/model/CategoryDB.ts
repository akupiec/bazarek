import { SteamDB } from './SteamDB';
import { NamedI, NamedJoinTable } from './NamedJoinTable';

export class CategoryDB extends NamedJoinTable implements NamedI {
  protected static joinTableName = 'category-steam';
  protected static otherKey = 'steamId';
  protected static foreignKey = 'categoryId';
  protected static table = 'category';

  static initRelation() {
    CategoryDB.belongsToMany(SteamDB, {
      through: this.joinTableName,
      foreignKey: this.foreignKey,
      otherKey: this.otherKey,
      timestamps: false,
    });
  }
}
