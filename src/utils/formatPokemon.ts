import { PokemonProps } from "../pages/Home";

function formatPokemon(pokemon: any): PokemonProps {
  return {
    name: pokemon.name,
    id: pokemon.id,
    types: pokemon.types.map((type: any) => type.type.name),
    url: pokemon.sprites.other.dream_world.front_default,
    weight: pokemon.weight,
    height: pokemon.height,
    stats: pokemon.stats.map((stat: any) => ({
      base_stat: stat.base_stat,
      stat_name: stat.stat.name,
    })),
  };
}

export default formatPokemon;
