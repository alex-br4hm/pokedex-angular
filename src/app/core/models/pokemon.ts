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
  evolution_chain?: Evolution[];
}

export interface Stats {
  name: string;
  base_stat: number;
  value?: number;
}

export interface Evolution {
  game_index: number;
  img_url: string;
  name: string;
  evolves_to?: Evolution[];
}

export interface Filter {
  types: {
    [key: string]: boolean;
  };
  weightRange: {
    startValue: number;
    endValue: number;
  };
  heightRange: {
    startValue: number;
    endValue: number;
  };
  generation: {
    gen_1: boolean;
    gen_2: boolean;
  };
}

export interface FilterRange {
  max?: number;
  min?: number;
  currentStart?: number;
  currentEnd?: number;
}


