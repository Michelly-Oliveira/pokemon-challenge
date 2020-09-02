import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 40px;
`;

export const InputContainer = styled.div`
  width: 100%;
  height: 55px;
  border-radius: 10px;
  background: #232129;
  display: flex;
  align-items: center;
  color: #666360;
`;

export const Input = styled.input`
  flex: 1;
  margin-right: 10px;
  background: transparent;
  border: none;
  color: #666360;
`;

export const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 20px 0;

  @media (min-width: 1000px) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    grid-gap: 57px;
    justify-items: left;
    align-items: center;
  }

  & > div {
    margin: 0 auto 57px;

    @media (min-width: 1100px) {
      margin: 0;
    }
  }
`;
