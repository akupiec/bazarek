import { SteamDB, SteamI } from '../../db/model/SteamDB';
import { myAxios as axios } from '../api';
import { JSDOM } from 'jsdom';
import { findNodeAndGetFloat, findNodeAndGetInt, findNodeAndGetText } from './general';

export class Steam {
  static getSteamData(steam: SteamDB): Promise<SteamI> {
    const href = `https://store.steampowered.com/app/${steam.id}`;
    return axios
      .get(href, {
        retry: 3,
        retryDelay: 3000,
        headers: { Cookie: 'wants_mature_content=1; birthtime=628470001;' },
      } as any)
      .then((resp) => {
        const a = new JSDOM(resp.data);
        const name = findNodeAndGetText(a, '.apphub_AppName');
        const tags = this.findSteamTags(a);
        const review = findNodeAndGetText(a, '.user_reviews .game_review_summary ');
        const reviews = findNodeAndGetInt(a, '.user_reviews .responsive_hidden');
        const price = findNodeAndGetFloat(a, '.game_purchase_price');
        const categories = this.findSteamCategory(a);
        const ret: SteamI = {
          id: steam.id,
          href: steam.href,
          tags,
          name,
          categories,
          price,
          review,
          reviews,
        };
        return ret;
      });
  }

  private static findSteamTags(a: JSDOM) {
    const tagsStr = findNodeAndGetText(a, '.popular_tags_ctn > div.glance_tags');
    let tags = tagsStr?.slice(0, -1).split('\n') || [];
    tags = tags.map((t) => t.trim()).filter((t) => !!t);
    return tags;
  }

  private static findSteamCategory(a: JSDOM) {
    return Array.from(a.window.document.querySelectorAll('#category_block  .name')).map((a: any) =>
      a.textContent.trim(),
    );
  }
}
