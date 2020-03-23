import { SteamMap } from './SteamMap';
import { Bazar } from './Bazar';

export interface BazarSteam extends Bazar, SteamMap {
    price: number;
}
