import React from 'react';
import styled from "styled-components";
import { Layout } from 'antd';
import TranslatedText from '../../../common/components/translated_text';
import TranslationsMap from './translationsMap';

export const AnswerText = styled.p`
font-size: 18px;
`;

export const Container = ({children}) => {
  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <ContainerWrapper>
        {children}
      </ContainerWrapper>
    </div>
  )
}


const ContainerWrapper = styled.div`
    width: 500px;
    background-color: rgba(255, 255, 255, .3);
    width: 65%;

    @media only screen and (min-width: 960px) {
        /* styles for browsers larger than 960px; */
        width: 70%;
    }
    @media only screen and (min-width: 1440px) {
        /* styles for browsers larger than 1440px; */
        width: 60%;
      }
    @media only screen and (min-width: 2000px) {
        /* for sumo sized (mac) screens */
        width: 50%;
      }
    @media only screen and (max-device-width: 480px) {
       /* styles for mobile browsers smaller than 480px; (iPhone) */
       width: 100%;
      }
    @media only screen and (device-width: 768px) {
       /* default iPad screens */
       width: 100%;
      }
    /* different techniques for iPad screening */
    @media only screen and (min-device-width: 481px) and (max-device-width: 1024px) and (orientation:portrait) {
      /* For portrait layouts only */
      width: 100%;
    }

    @media only screen and (min-device-width: 481px) and (max-device-width: 1024px) and (orientation:landscape) {
      /* For landscape layouts only */
      width: 100%;
    }
`;

export const QuestionContainer = styled.div`
    background-color: rgba(255, 255, 255, .1);
    padding: 5px;
    margin-bottom: 18px;
    text-align: justify;
`;

export const Circle = styled.div`
margin: 5px;
padding: 10px;
justify-content: center;
text-align: center;
align-items: center;
border-radius: 50%;
font-size: 17px;
display: inline-block;
border: 2px solid #333333;
background-color: white;
`;

export const AnswerContainer = styled.div`
  margin-top: 5px;
  margin-left: 2.5em;
`;

export const QuestionTitle = ({text, index, translation_id}) => {

  const Container = styled.div`
    padding: 0px 5px 5px 0px;
    font-weight: bold;
    text-align: left;
    font-size: 24px;
    align-items:center;
    display: flex;
  `;

  const RowElement = styled.div`
    display: inline;
`;

  return (
    <Container>
      <RowElement >
        <Circle><div style={{minWidth: 15}}>{index + 1}</div></Circle> 
      </RowElement>
      <RowElement>
      <TranslatedText defaultText={text} textArray={TranslationsMap[`${translation_id}_question`]} />
      </RowElement>
    </Container>
  )
}