import React, {useState, useRef, useEffect} from 'react'
import { Link, withRouter } from 'react-router-dom'; // import the react-router-dom components
import { useRequest } from '../../../hook/useRequest';
import { Spin } from 'antd';
import { Layout, Row, Col, Button, Alert } from 'antd';
import { Card } from './Card'
import update from 'immutability-helper';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styled from 'styled-components';
import OrderQuestion from './OrderQuestion';
import RadioGroupQuestion from './RadioGroup';
import { message } from "antd";
import CheckboxQuestion from './Checkbox';
import { QuestionContainer, Container } from './Common';

const { Header, Footer, Sider, Content } = Layout;

const SurveyTemplate = props => {
    const [{data, pending, error}, execute] = useRequest();
    const [completeSurveyResult, completeSurvey] = useRequest();
    const sideID = props.match.params.id;

    useEffect(() => {
      if (!pending && error) {
        const duration = 10000;
        message.error("Page not found..", duration);
      }
    }, [data, pending, error]);

    const retrieveData = (withValidation = false) => {
      execute(`/api/surveys/${sideID}?showNotAnswredQuestions=${withValidation}`, 'PATCH', result => result.data);
    }   
    
    useEffect(() => {
      if (!pending && !error && data.completed) {
        completeSurvey(`/api/surveys/${data._id}/complete`, 'PATCH', result => result.data);
      }
    }, [data]);
    
    useEffect(() => {
      retrieveData();
    }, [sideID]);

    const renderContent = ({questionnaire, completed}) => {
      return (
        <Container  >
          <Row align="middle" type="flex" justify="center" style={{backgroundColor: 'transparent'}}>
            <Col justify="center" align="middle">  
              <QuestionContainer>
                <Description>
                  {questionnaire.description}
                </Description>
              </QuestionContainer>
              {
                questionnaire.questions.map(({_id, answers, question, type, isAnswred}, i) => {
                  return (
                    <QuestionValitationWrapper isAnswred={isAnswred}>
                      {type === 'order' ? 
                      <OrderQuestion questionID={_id} index={i} objectID={data._id} key={_id} question={question} answers={answers} /> :
                      type === 'checkbox' ?
                      <CheckboxQuestion index={i}  questionID={_id} objectID={data._id} key={_id} question={question} answers={answers} /> :
                      <RadioGroupQuestion index={i}  questionID={_id} objectID={data._id} key={_id} question={question} answers={answers} />}
                    </QuestionValitationWrapper>
                  )                  
                })
              }
            </Col>          
          </Row>
          <Row align="middle" type="flex" justify="center">
          </Row>
          <Row align="middle" type="flex" justify="center">
          </Row>
        </Container>
      )
    }
  
    return (
      <div>
        {
          !completeSurveyResult.error && !completeSurveyResult.pending ? <Alert style={{margin: 20}} message="Survey Completed!" type="info" /> :<DndProvider backend={HTML5Backend}>
          <Layout style={{height:"100vh", overflowY: 'scroll'}}>
              <SurveyHeader>{!pending && !error ? data.questionnaire.title : ''}</SurveyHeader>
              <Content style={{justifyContent: 'center', alignItems: 'center'}}>
              {
                pending ?  <Row align="middle" type="flex" justify="center"><Spin size="large" style={{margin: 'auto', alignSelf: 'center'}} /></Row> : !error ? renderContent(data) : null
              }
              </Content>
              <MFooter onPress={() => {retrieveData(true)}} />
          </Layout>
          </DndProvider>
        }        
      </div>
    )
};

const QuestionValitationWrapper = ({children, isAnswred}) => {
  return (
    <QuestionWrapper>
      {!isAnswred ? <RequiredMessage>! This question requires an answer.</RequiredMessage> : null}
      {children}
    </QuestionWrapper>
  )
}

const MFooter = ({onPress}) => {
  return (
    <Footer >
    <Row align="middle" type="flex" justify="center">
      <Button size={"large"} type="primary" onClick={onPress}>
        DONE
      </Button>
    </Row>
  </Footer>
  );
};

const Description = ({children}) => {
  const Container = styled.div`
  padding: 20px 20px;
  display: flex;
  flex-flow: row wrap;
  overflow: hidden;
  font-size: 16px;
  font-family: roboto;
  line-height: 1.5;
  
  @media only screen and (max-width: 767px) {
      padding: 50px 20px;
  }
  
  @media (max-width: 580px) {
      padding: 15px;
  }
  `;

  const Title = styled.p`
    text-decoration: underline;
  `;

  return (
    <Container>
      <Title>Introduction to Corporate Social Responsibility Corporate Social Responsibility (CSR)</Title>
      {children}
    </Container>
  )
}

const SurveyHeader = ({children}) => {
  return (
    <Header style={{
      color: '#FFBA00',
      textAlign: 'center',
      backgroundColor: '#333',
      fontSize: 32,
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      overflow: 'hidden',
      minHeight: '20%'
    }}>
      {children}
    </Header>
  );
}

// padding: '12vh 40vh 12vh 40vh',

// const SurveyHeader = styled.div`
// text-align:center;
// color: #FFBA00;
// padding: 12vh 40vh 12vh 40vh;
// background: #333;
// font-size: 32px;
// `;

const QuestionWrapper = styled.div`
text-align: left;
`;

const RequiredMessage = styled.p`
color: red;
font-size: 0.8rem;
`;

export default withRouter(SurveyTemplate);

