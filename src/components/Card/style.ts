import styled from "styled-components";

export const Container = styled.div`
  background: #3e3b47;
  width: 320px;
  height: 240px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  text-align: center;
  cursor: pointer;
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
  font-size: 20px;
  margin-bottom: 26px;
  text-transform: capitalize;

  span {
    color: #ff9000;
  }
`;

export const Types = styled.p`
  font-size: 16px;
  text-transform: capitalize;

  span {
    color: #ff9000;
  }
`;
