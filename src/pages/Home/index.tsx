import React, { useState, useEffect, useCallback } from "react";
import { FiSearch } from "react-icons/fi";
import InfiniteScroll from "react-infinite-scroller";

import Header from "../../components/Header";
import Card from "../../components/Card";

import api from "../../services/api";
import formatPokemon from "../../utils/formatPokemon";

import {
  Container,
  InputContainer,
  Input,
  CardContainer,
  LoadingText,
} from "./style";

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
  const [nextUrl, setNextUrl] = useState();

  const getPokemonList = useCallback(async (): Promise<void> => {
    const response = await api.get(`pokemon?${nextUrl}`);

    setNextUrl(response.data.next.match(/pokemon\?(.*)/)[1]);

    const urlsForPokemons = response.data.results;

    const pokemons: PokemonProps[] = await Promise.all(
      urlsForPokemons.map(async (pokemon: ResultsProps) => {
        const pokemonData = await api.get(`${pokemon.url}`);

        const formattedPokemon = formatPokemon(pokemonData.data);

        return formattedPokemon;
      })
    );

    setPokemonsList((state) => [...state, ...pokemons]);
  }, [nextUrl]);

  useEffect(() => {
    async function initialLoad(): Promise<void> {
      const response = await api.get(`pokemon?limit=100&offset=0`);

      const urlsForPokemons = response.data.results;
      setNextUrl(response.data.next.match(/pokemon\?(.*)/)[1]);

      // Each iteration through the urlsForPokemon returns a promise, so we end up with an array of promises. to get the actual result from each item we use Promise.all(): promise that resolves into an array of results when all provided promises have resolved
      const pokemons: PokemonProps[] = await Promise.all(
        urlsForPokemons.map(async (pokemon: ResultsProps) => {
          const pokemonData = await api.get(`${pokemon.url}`);

          const formattedPokemon = formatPokemon(pokemonData.data);

          return formattedPokemon;
        })
      );

      setPokemonsList(pokemons);
    }

    initialLoad();
  }, []);

  const handleNameInput = useCallback(
    async (text: string) => {
      const formatText = text.toLowerCase();

      // Store the pokemons that match the text provided by the user
      let displayPokemon = [];

      // Search on the pokemons list  each time the user types
      const findPokemon = pokemonsList.filter((pokemon) =>
        pokemon.name.includes(formatText)
      );

      displayPokemon = [...findPokemon];

      // If the text input is not empty and no matching pokemon was found on the pokemons list, search the API
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

        {/* If no text was typed, display the pokemonsList - data from the api. Otherwise, display the searchedPokemon */}
        <InfiniteScroll
          initialLoad={false}
          loader={<LoadingText key={0}>Loading...</LoadingText>}
          loadMore={getPokemonList}
          hasMore={!!nextUrl}
          threshold={20}
        >
          <CardContainer>
            {(searchedPokemon &&
              searchedPokemon.map((pokemon) => (
                <Card key={pokemon.id} pokemon={pokemon} />
              ))) ||
              pokemonsList.map((pokemon) => (
                <Card key={pokemon.id} pokemon={pokemon} />
              ))}
          </CardContainer>
        </InfiniteScroll>
      </Container>
    </>
  );
};

export default Home;
