import { SteamMap } from '../../interfaces/SteamMap';
import { Bazar } from '../../interfaces/Bazar';

export interface BazarSteam extends Bazar, SteamMap {
    price: number;
}
