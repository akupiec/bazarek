import { Reviews } from './Reviews';
import { Categories } from './Categories';

export interface SteamMap {
  steamHref: string;
  steamId: number
  tags: string[];
  reviewSummary: Reviews | string;
  responses: string;
  categories: Categories[];
  updateDate?: string;
}
