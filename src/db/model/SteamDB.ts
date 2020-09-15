import { DataTypes, Model, NOW, Sequelize } from 'sequelize';
import { TagDB } from './TagDB';
import { CategoryDB } from './CategoryDB';
import { ReviewDB } from './ReviewDB';

export interface SteamI {
  id: number;
  href: string;
  name?: string;
  price?: number;
  tags?: string[];
  categories?: string[];
  reviews?: number;
  review?: string;
  reviewId?: number;
  updatedAt?: Date;
  createdAt?: Date;
}

export class SteamDB extends Model<SteamI> implements SteamI {
  id!: number;
  name!: string | undefined;
  href!: string;
  price!: number;
  reviews!: number;

  readonly updatedAt!: Date;
  readonly createdAt!: Date;

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
        reviews: {
          type: DataTypes.NUMBER,
        },
      },
      {
        timestamps: true,
        tableName: 'steam',
        sequelize,
      },
    );
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
    const reviewsDb = await ReviewDB.createBySteam(steamDatas);
    await Promise.all(
      steamDatas.map((s) =>
        SteamDB.update(
          {
            name: s.name,
            price: s.price,
            reviews: s.reviews,
            reviewId: reviewsDb.find((r) => r.name === s.review)?.id,
            updatedAt: NOW as any,
          },
          { where: { id: s.id } },
        ),
      ),
    );
    return SteamDB.updateTagsAndCategories(steamDatas);
  }
}
