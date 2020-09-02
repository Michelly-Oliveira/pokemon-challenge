import React, { useState, useEffect, useCallback } from "react";
import { Link, RouteComponentProps, useLocation } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

import Header from "../../components/Header";
import Card from "../../components/Card";

import api from "../../services/api";
import { PokemonProps } from "../Home";

import {
  BackButton,
  CardContainer,
  Index,
  Image,
  Name,
  Info,
  Detail,
  Stats,
  StatsTitle,
  Stat,
  StatName,
  StatBar,
  StatValue,
  FamilyTree,
  FamilyTitle,
  FamilyCardsContainer,
} from "./style";

import formatPokemon from "../../utils/formatPokemon";

interface LocationStateProps extends RouteComponentProps {
  pokemon: PokemonProps;
}

interface AttributesProps {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  weight: number;
  height: number;
  id: number;
  name: string;
  url: string;
}

interface FamilyProps {
  evolutions: PokemonProps[];
  evolved: PokemonProps;
}

const Details: React.FC = () => {
  const location = useLocation<LocationStateProps>();

  const [attributes, setAttributes] = useState<AttributesProps>(
    {} as AttributesProps
  );
  const [family, setFamily] = useState<FamilyProps>({} as FamilyProps);

  const getFamily = useCallback(async (pokemon_id: number): Promise<void> => {
    const checkFamily = await api.get(`pokemon-species/${pokemon_id}`);

    const storeFamily = {} as FamilyProps;

    // Check if pokemon has any evolution
    if (checkFamily.data.evolution_chain) {
      // Get the end of the url: pokemon-species/id
      const url = checkFamily.data.evolution_chain.url.match(/v2(.*)/);

      const evolutions = await api.get(`${url[1]}`);

      // Get id of the evolution
      // A pokemon can have up to 2 evolutions, and each evolution has a different path
      const getFirstEvolution = evolutions.data.chain.evolves_to[0].species.url.match(
        /pokemon-species\/(.*)\//
      );
      // Make sure the prop exists
      const getSecondEvolution =
        evolutions.data.chain.evolves_to[0].evolves_to.length > 0 &&
        evolutions.data.chain.evolves_to[0].evolves_to[0].species.url.match(
          /pokemon-species\/(.*)\//
        );
      console.log(getSecondEvolution[1]);

      const evolutionsArray = [];

      // Don't show data if evolution is the same as the pokemon being shown
      if (
        getFirstEvolution[1] !== undefined &&
        Number(getFirstEvolution[1]) !== pokemon_id
      ) {
        const pokemonFirstEvolution = await api.get(
          `pokemon/${getFirstEvolution[1]}`
        );

        const formattedFirstEvolution = formatPokemon(
          pokemonFirstEvolution.data
        );

        evolutionsArray.push(formattedFirstEvolution);
      }

      // Don't show data if evolution is the same as the pokemon being shown
      if (
        getSecondEvolution[1] !== undefined &&
        Number(getSecondEvolution[1]) !== pokemon_id
      ) {
        const pokemonSecondEvolution = await api.get(
          `pokemon/${getSecondEvolution[1]}`
        );

        const formattedSecondEvolution = formatPokemon(
          pokemonSecondEvolution.data
        );

        evolutionsArray.push(formattedSecondEvolution);
      }

      Object.assign(storeFamily, {
        evolutions: evolutionsArray,
      });
    }

    // Check if pokemon has a previous form
    if (checkFamily.data.evolves_from_species) {
      const url = checkFamily.data.evolves_from_species.url.match(
        /pokemon-species\/(.*)\//
      );

      const evolutionsId = storeFamily.evolutions.map(
        (evolution) => evolution.id
      );

      // On the third evolution, a past form appears both on the evolutions array as in the evolves_from_species
      // If it is equal, only show one
      if (
        Number(url[1]) !== evolutionsId[0] &&
        Number(url[1]) !== evolutionsId[1]
      ) {
        const evolved = await api.get(`pokemon/${url[1]}`);

        const formattedEvolved = formatPokemon(evolved.data);

        Object.assign(storeFamily, {
          evolved: formattedEvolved,
        });
      }
    }

    setFamily(storeFamily);
  }, []);

  useEffect(() => {
    async function getPokemonAttributes(): Promise<void> {
      const attr = {} as AttributesProps;

      Object.assign(attr, {
        weight: location.state.pokemon.weight,
        height: location.state.pokemon.height,
        id: location.state.pokemon.id,
        name: location.state.pokemon.name,
        url: location.state.pokemon.url,
      });

      location.state.pokemon.stats.forEach((stat) => {
        if (
          stat.stat_name !== "special-attack" &&
          stat.stat_name !== "special-defense"
        ) {
          Object.assign(attr, {
            [stat.stat_name]: stat.base_stat,
          });
        }
      });

      setAttributes(attr);

      getFamily(attributes.id);
    }

    getPokemonAttributes();
  }, [attributes.id, location.state, getFamily]);

  return (
    <>
      <Header />

      <BackButton>
        <Link to="/">
          <FiArrowLeft />
          Back
        </Link>
      </BackButton>

      <CardContainer>
        <Index>#{attributes.id}</Index>

        <Image src={attributes.url} />
        <Name>{attributes.name}</Name>

        <Info>
          <Detail>
            {attributes.weight} KG <br />
            <span>Weight</span>
          </Detail>

          <Detail>
            {attributes.height} M <br />
            <span>Height</span>
          </Detail>
        </Info>

        <Stats>
          <StatsTitle>Stats</StatsTitle>
          <Stat>
            <StatName>HP</StatName>
            <StatBar percentage={attributes.hp}>
              <div></div>
              <StatValue>{attributes.hp}/100</StatValue>
            </StatBar>
          </Stat>

          <Stat>
            <StatName>ATK</StatName>
            <StatBar percentage={attributes.attack}>
              <div></div>
              <StatValue>{attributes.attack}/100</StatValue>
            </StatBar>
          </Stat>

          <Stat>
            <StatName>DEF</StatName>
            <StatBar percentage={attributes.defense}>
              <div></div>
              <StatValue>{attributes.defense}/100</StatValue>
            </StatBar>
          </Stat>

          <Stat>
            <StatName>SPD</StatName>
            <StatBar percentage={attributes.speed}>
              <div></div>
              <StatValue>{attributes.speed}/100</StatValue>
            </StatBar>
          </Stat>
        </Stats>
      </CardContainer>

      {(family.evolutions || family.evolved) && (
        <FamilyTree>
          <FamilyTitle>Family Tree</FamilyTitle>

          <FamilyCardsContainer>
            {family.evolved && <Card pokemon={family.evolved} />}
            {family.evolutions &&
              family.evolutions.map((evolution) => (
                <Card key={evolution.id} pokemon={evolution} />
              ))}
          </FamilyCardsContainer>
        </FamilyTree>
      )}
    </>
  );
};

export default Details;
