import React, { useState, useEffect, useCallback } from "react";
import { Link, RouteComponentProps, useLocation } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

import Header from "../../components/Header";
import Card from "../../components/Card";

import api from "../../services/api";
import formatPokemon from "../../utils/formatPokemon";

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

// Add the prop pokemon to the state from useLocation
interface LocationStateProps extends RouteComponentProps {
  pokemon: PokemonProps;
}

// Specify which stats to use
interface AttributesProps extends PokemonProps {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
}

interface FamilyProps {
  evolutions: PokemonProps[];
  evolved: PokemonProps;
}

const Details: React.FC = () => {
  const location = useLocation<LocationStateProps>();

  // Start state with an empty object and inform that the type is AttributeProps - so it isn't undefined
  const [attributes, setAttributes] = useState<AttributesProps>(
    {} as AttributesProps
  );
  // Start state with an empty object and inform that the type is FamilyProps - so it isn't undefined
  const [family, setFamily] = useState<FamilyProps>({} as FamilyProps);

  const getFamilyTree = useCallback(async (pokemon_id: number): Promise<
    void
  > => {
    const familyUrls = await api.get(`pokemon-species/${pokemon_id}`);

    // Store the family data
    const storeFamily = {} as FamilyProps;

    // Check if pokemon has any evolution
    if (familyUrls.data.evolution_chain) {
      // Get only the end of the url: pokemon-species/id
      const url = familyUrls.data.evolution_chain.url.match(/v2(.*)/);

      // url[1] = pokemon-species/id
      const evolutions = await api.get(`${url[1]}`);

      // Get id of the evolutions
      // A pokemon can have up to 2 evolutions, and each evolution has a different path

      const evolutionsResultArray = [];

      // Get id of the first evolution
      const getFirstEvolution = evolutions.data.chain.evolves_to[0].species.url.match(
        /pokemon-species\/(.*)\//
      );

      // Don't show data if evolution is the same as the pokemon being shown
      if (getFirstEvolution[1] && Number(getFirstEvolution[1]) !== pokemon_id) {
        const pokemonFirstEvolution = await api.get(
          `pokemon/${getFirstEvolution[1]}`
        );

        const formattedFirstEvolution = formatPokemon(
          pokemonFirstEvolution.data
        );

        evolutionsResultArray.push(formattedFirstEvolution);
      }

      // Get id of the second evolution if exists
      // Make sure the prop exists (array length greater than 0) because not all pokemon have more than 1 evolution
      const getSecondEvolution =
        evolutions.data.chain.evolves_to[0].evolves_to.length > 0 &&
        evolutions.data.chain.evolves_to[0].evolves_to[0].species.url.match(
          /pokemon-species\/(.*)\//
        );

      // Don't show data if evolution is the same as the pokemon being shown
      if (
        getSecondEvolution[1] &&
        Number(getSecondEvolution[1]) !== pokemon_id
      ) {
        const pokemonSecondEvolution = await api.get(
          `pokemon/${getSecondEvolution[1]}`
        );

        const formattedSecondEvolution = formatPokemon(
          pokemonSecondEvolution.data
        );

        evolutionsResultArray.push(formattedSecondEvolution);
      }

      Object.assign(storeFamily, {
        evolutions: evolutionsResultArray,
      });
    }

    // Check if pokemon has a previous form
    if (familyUrls.data.evolves_from_species) {
      const url = familyUrls.data.evolves_from_species.url.match(
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

      getFamilyTree(attributes.id);
    }

    getPokemonAttributes();
  }, [attributes.id, location.state, getFamilyTree]);

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
