import { SteamDB } from './SteamDB';
import { NamedI, NamedJoinTable } from './NamedJoinTable';

export class TagDB extends NamedJoinTable implements NamedI {
  protected static joinTableName = 'tag-steam';
  protected static otherKey = 'steamId';
  protected static foreignKey = 'tagId';
  protected static table = 'tag';

  static initRelation() {
    TagDB.belongsToMany(SteamDB, {
      through: this.joinTableName,
      foreignKey: this.foreignKey,
      otherKey: this.otherKey,
      timestamps: false,
    });
  }
}
