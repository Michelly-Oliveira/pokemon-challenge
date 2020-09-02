import React, { useState, useEffect, useCallback } from "react";
import { FiSearch } from "react-icons/fi";

import Header from "../../components/Header";
import Card from "../../components/Card";

import api from "../../services/api";

import { Container, InputContainer, Input, CardContainer } from "./style";
import formatPokemon from "../../utils/formatPokemon";

interface ResultsProps {
  name: string;
  url: string;
}

export interface PokemonProps {
  name: string;
  id: number;
  types: string[];
  url: string;
  weight: number;
  height: number;
  stats: {
    base_stat: number;
    stat_name: string;
  }[];
}

const Home: React.FC = () => {
  const [pokemonsList, setPokemonsList] = useState<PokemonProps[]>([]);
  const [searchedPokemon, setSearchedPokemon] = useState<PokemonProps[]>();

  useEffect(() => {
    async function getPokemonList(): Promise<void> {
      const response = await api.get("pokemon?limit=100&offset=0");

      const urlsForPokemons = response.data.results;

      const pokemons: PokemonProps[] = await Promise.all(
        urlsForPokemons.map(async (pokemon: ResultsProps) => {
          const pokemonData = await api.get(`${pokemon.url}`);

          const formattedPokemon = formatPokemon(pokemonData.data);

          return formattedPokemon;
        })
      );

      setPokemonsList(pokemons);
    }

    getPokemonList();
  }, []);

  const handleNameInput = useCallback(
    async (text: string) => {
      const formatText = text.toLowerCase();

      let displayPokemon = [];

      const findPokemon = pokemonsList.filter((pokemon) =>
        pokemon.name.includes(formatText)
      );

      displayPokemon = [...findPokemon];

      if (formatText && findPokemon.length === 0) {
        const response = await api.get(`pokemon/${formatText}`);

        const formattedPokemon = formatPokemon(response.data);

        displayPokemon = [formattedPokemon];
      }

      setSearchedPokemon(displayPokemon);
    },
    [pokemonsList]
  );

  return (
    <>
      <Header />

      <Container>
        <InputContainer>
          <FiSearch size={20} style={{ margin: "auto 10px" }} />
          <Input
            onChange={(e) => handleNameInput(e.target.value)}
            placeholder="Type the Pokemon name"
          />
        </InputContainer>

        <CardContainer>
          {(searchedPokemon &&
            searchedPokemon.map((pokemon) => (
              <Card key={pokemon.id} pokemon={pokemon} />
            ))) ||
            pokemonsList.map((pokemon) => (
              <Card key={pokemon.id} pokemon={pokemon} />
            ))}
        </CardContainer>
      </Container>
    </>
  );
};

export default Home;
