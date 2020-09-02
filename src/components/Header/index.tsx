import React from "react";

import logo from "../../assets/logo.svg";

import { Container, Logo, Title } from "./style";

const Header: React.FC = () => (
  <Container>
    <Logo src={logo} />
    <Title>Pokemon Challenge</Title>
  </Container>
);

export default Header;
