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
  // evolutions: PokemonProps[];
  // evolved: PokemonProps;
  family: PokemonProps[];
}

const Details: React.FC = () => {
  const location = useLocation<LocationStateProps>();

  // Start state with an empty object and inform that the type is AttributeProps - so it isn't undefined
  const [attributes, setAttributes] = useState<AttributesProps>(
    {} as AttributesProps
  );
  // Start state with an empty object and inform that the type is FamilyProps - so it isn't undefined
  const [familyTree, setFamilyTree] = useState<FamilyProps>({} as FamilyProps);

  const getFamilyTree = useCallback(async (pokemon_id: number): Promise<
    void
  > => {
    const familyUrls = await api.get(`pokemon-species/${pokemon_id}`);

    // Store the family data
    const family = [];

    // Check if pokemon has any evolution
    if (familyUrls.data.evolution_chain) {
      // Get only the end of the url: pokemon-species/id
      const url = familyUrls.data.evolution_chain.url.match(/v2(.*)/);

      // url[1] = pokemon-species/id
      const evolutions = await api.get(`${url[1]}`);

      const firstForm = evolutions.data.chain.species.url;
      const firstFormId = firstForm.match(/pokemon-species\/(.*)\//)[1];

      if (firstFormId && Number(firstFormId) !== pokemon_id) {
        const pokemonFirstEvolution = await api.get(`pokemon/${firstFormId}`);

        const formattedFirstEvolution = formatPokemon(
          pokemonFirstEvolution.data
        );

        family.push(formattedFirstEvolution);
      }

      const secondForm = evolutions.data.chain.evolves_to[0].species.url || "";
      const secondFormId = secondForm.match(/pokemon-species\/(.*)\//)[1];

      if (secondFormId && Number(secondFormId) !== pokemon_id) {
        const pokemonSecondEvolution = await api.get(`pokemon/${secondFormId}`);

        const formattedSecondEvolution = formatPokemon(
          pokemonSecondEvolution.data
        );

        family.push(formattedSecondEvolution);
      }

      const thirdForm =
        evolutions.data.chain.evolves_to[0].evolves_to.length > 0 &&
        evolutions.data.chain.evolves_to[0].evolves_to[0].species.url.match(
          /pokemon-species\/(.*)\//
        );
      const thirdFormId = thirdForm[1];

      if (thirdFormId && Number(thirdFormId) !== pokemon_id) {
        const pokemonThirdEvolution = await api.get(`pokemon/${thirdFormId}`);

        const formattedThirdEvolution = formatPokemon(
          pokemonThirdEvolution.data
        );

        family.push(formattedThirdEvolution);
      }
    }

    setFamilyTree({ family });
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

      {familyTree.family && (
        <FamilyTree>
          <FamilyTitle>Family Tree</FamilyTitle>

          <FamilyCardsContainer>
            {familyTree.family.map((evolution) => (
              <Card key={evolution.id} pokemon={evolution} />
            ))}
          </FamilyCardsContainer>
        </FamilyTree>
      )}
    </>
  );
};

export default Details;
