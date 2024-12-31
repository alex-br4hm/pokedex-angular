export interface PokemonData {
  name: string;
  url: string;
  id: number;
}

export interface Pokemon {

}

export interface PokemonCardData {
  name: string;
  infoText: string;
  typesGer: string[];
  typesEn: string[];
  img_url: string;
  game_index: number;
  stats?: Stats[];
}

export interface Stats {
  name: string;
  base_stat: number;
}

