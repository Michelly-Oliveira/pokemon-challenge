import styled, { css } from "styled-components";

interface StatBarProps {
  percentage: number;
}

export const BackButton = styled.div`
  margin: 20px 0 0 40px;

  a {
    color: #ff9000;
    text-decoration: none;
    display: flex;
    align-items: center;

    svg {
      margin-right: 5px;
    }
  }
`;

export const CardContainer = styled.div`
  background: #3e3b47;
  width: 320px;
  height: 444;
  border-radius: 8px;
  margin: 20px auto 26px;
  display: flex;
  flex-direction: column;
  text-align: center;
`;

export const Index = styled.div`
  color: #666360;
  font-weight: bold;
  font-size: 24px;
  position: relative;
  top: 12px;
  left: 25px;
  text-align: left;
`;

export const Image = styled.img`
  width: 100px;
  height: 100px;
  margin: 0 auto 13px;
`;

export const Name = styled.p`
  font-size: 24px;
  margin-bottom: 26px;
  color: #ff9000;
  text-transform: capitalize;
`;

export const Info = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

export const Detail = styled.p`
  font-size: 18px;
  margin-bottom: 12px;

  span {
    color: #666360;
    font-size: 16px;
  }
`;

export const Stats = styled.div``;

export const StatsTitle = styled.p`
  font-size: 18px;
  margin-bottom: 20px;
`;

export const Stat = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 13px;
`;

export const StatName = styled.p`
  font-size: 16px;
  width: 32px;
`;

export const StatBar = styled.div<StatBarProps>`
  width: 241px;
  border-radius: 20px;
  background: #c4c4c4;

  div {
    ${(props) =>
      css`
        width: ${props.percentage}%;
        max-width: 100%;
        background: #ff9000;
        border-radius: 20px;
      `}
  }
`;

export const StatValue = styled.div`
  text-align: end;
  padding-right: 10px;
`;

export const FamilyTree = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FamilyTitle = styled.p`
  font-size: 20px;
  margin: 26px 0 10px 38px;
`;

export const FamilyCardsContainer = styled.div`
  display: flex;
  margin-left: 38px;

  & > div {
    margin: 0 23px 23px 0;
  }
`;
