import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";

import { PokemonProps } from "../../pages/Home";

import { Container, Index, Image, Name, Types } from "./style";

interface CardProps {
  pokemon: PokemonProps;
}

const Card: React.FC<CardProps> = ({ pokemon }) => {
  const history = useHistory();

  const handleGoToDetailsPage = useCallback(() => {
    // Pass the pokemon data to the details page
    history.push("details", { pokemon: pokemon });
  }, [history, pokemon]);

  return (
    <Container onClick={handleGoToDetailsPage}>
      <Index>#{pokemon.id}</Index>

      <Image src={pokemon.url} />
      <Name>
        Name: <span>{pokemon.name}</span>
      </Name>
      <Types>
        Types: <span>{pokemon.types.join(", ")}</span>
      </Types>
    </Container>
  );
};

export default Card;
