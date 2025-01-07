export interface PokemonData {
  name: string;
  url: string;
  id: number;
}

export interface Pokemon {
  name: string;
  name_en: string;
  info_texts: string[];
  types_ger: string[];
  types_en: string[];
  img_url: string;
  small_img_url: string;
  game_index: number;
  species_url: string;
  stats: Stats[];
  weight: number;
  height: number;
  genera: string;
  evolution_chain_url: string;
  evolution_chain: EvolutionChain[];
}

export interface EvolutionChain {
  trigger: string;
  min_level?: number;
}

export interface PokemonCardData {
  name: string;
  info_text: string;
  types_ger: string[];
  types_en: string[];
  img_url?: string;
  game_index: number;
  species_url?: string;
  stats?: Stats[];
}

export interface Stats {
  name: string;
  base_stat: number;
}

export interface PokeInfo {
  species_url: string;
  stats: Stats[];
}


export interface PokeData {
  species_url: string;
  types_en: string[];
  stats?: Stats[];
  img_url?: string;
}
