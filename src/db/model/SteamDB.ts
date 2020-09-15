import { DataTypes, HasManySetAssociationsMixin, Model, NOW, Sequelize } from 'sequelize';
import { TagDB } from './TagDB';
import { CategoryDB } from './CategoryDB';

export interface SteamI {
  id: number;
  href: string;
  name?: string;
  price?: number;
  tags?: string[];
  categories?: string[];
  updatedAt?: Date;
  createdAt?: Date;
}

export class SteamDB extends Model<SteamI> implements SteamI {
  id!: number;
  name!: string | undefined;
  href!: string;
  price!: number;

  readonly updatedAt!: Date;
  readonly createdAt!: Date;

  setTagDBs!: HasManySetAssociationsMixin<TagDB, number>;
  setCategoryDBs!: HasManySetAssociationsMixin<CategoryDB, number>;

  static initTypes(sequelize: Sequelize) {
    SteamDB.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
        },
        href: {
          type: DataTypes.STRING,
        },
        name: {
          type: DataTypes.STRING,
        },
        price: {
          type: DataTypes.FLOAT.UNSIGNED,
        },
      },
      {
        timestamps: true,
        tableName: 'steam',
        sequelize,
      },
    );
  }

  async updateRawData(data: SteamI) {
    const tagsPro = data.tags?.map((t: string) =>
      TagDB.findOrCreate({ where: { name: t }, defaults: { name: t } }).then((a) => a[0]),
    );
    const categoriesPro = data.categories?.map((t: string) =>
      CategoryDB.findOrCreate({ where: { name: t }, defaults: { name: t } }).then((a) => a[0]),
    );
    const tags = await Promise.all(tagsPro || []);
    const categories = await Promise.all(categoriesPro || []);
    await this.setTagDBs(tags as TagDB[], {});
    await this.setCategoryDBs(categories as CategoryDB[], {});
    this.name = data.name;
    return this.save();
  }

  static initRelation() {
    SteamDB.belongsToMany(TagDB, {
      through: 'tag-steam',
      foreignKey: 'steamId',
      otherKey: 'tagId',
      timestamps: false,
    });
    SteamDB.belongsToMany(CategoryDB, {
      through: 'category-steam',
      foreignKey: 'steamId',
      otherKey: 'categoryId',
      timestamps: false,
    });
  }

  static async updateTagsAndCategories(steamDatas: SteamI[]) {
    const tagsRaw = new Set<string>();
    const categoriesRaw = new Set<string>();
    steamDatas.map((s) => {
      s.tags?.forEach((t) => tagsRaw.add(t));
      s.categories?.forEach((t) => categoriesRaw.add(t));
    });
    const tags = await TagDB.bulkMyCreate(Array.from(tagsRaw));
    const categories = await CategoryDB.bulkMyCreate(Array.from(categoriesRaw));
    const steamTag: any = [];
    const steamCategory: any[] = [];

    steamDatas.forEach((s) => {
      const tagsToAdd = tags.filter((ta) => s.tags?.includes(ta.name)).map((t) => [s.id, t.id]);
      steamTag.push(...tagsToAdd);
      const categoriesToAdd = categories
        .filter((ca) => s.categories?.includes(ca.name))
        .map((c) => [s.id, c.id]);
      steamCategory.push(...categoriesToAdd);
    });
    await TagDB.updateJoinTable(steamTag);
    await CategoryDB.updateJoinTable(steamCategory);
  }

  static async updateAll(steamDatas: SteamI[]) {
    await Promise.all(
      steamDatas.map((s) =>
        SteamDB.update(
          { name: s.name, price: s.price, updatedAt: NOW as any },
          { where: { id: s.id } },
        ),
      ),
    );
    return SteamDB.updateTagsAndCategories(steamDatas);
  }
}
