export interface PokemonData {
  name: string;
  url: string;
  id: number;
}

export interface PokemonCardData {
  name: string;
  infoText: string;
  types_ger: string[];
  types_en: string[];
  img_url?: string;
  game_index: number;
  stats?: Stats[];
}

export interface PokeInfo {
  species_url: string;
  stats: Stats[];
}

export interface Stats {
  name: string;
  base_stat: number;
}

export interface PokeData {
  species_url: string;
  types_en: string[];
  stats?: Stats[];
  img_url?: string;
}
