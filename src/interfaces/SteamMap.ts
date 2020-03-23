import { Reviews } from './Reviews';
import { Categories } from './Categories';

export interface SteamMap {
  steamHref: string;
  tags: string[];
  reviewSummary: Reviews | string;
  responses: string;
  categories: Categories[];
}
