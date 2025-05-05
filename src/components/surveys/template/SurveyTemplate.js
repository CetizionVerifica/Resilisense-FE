import React, {useState, useRef, useEffect} from 'react'
import { Link, withRouter } from 'react-router-dom'; // import the react-router-dom components
import { useRequest } from '../../../hook/useRequest';
import { Dropdown, Menu, Radio, Spin } from 'antd';
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
import FreeText from './Freetext';
import TranslatedText, { TranslationActions, TranslationProvider, useTranslationData } from '../../../common/components/translated_text';
import { Languages, Translations } from './configuration';
import TranslationsMap from './translationsMap';
import { Select } from 'antd';

const { Header, Footer, Sider, Content } = Layout;
const { Option } = Select;

const SurveyTemplate = ({completed, data, retrieveData = () => {}, readOnly, pressCompleteRef = null }) => {
    
    const renderContent = ({questionnaire}) => {
      return (
        <Container  >
          <Row align="middle" type="flex" justify="center" style={{backgroundColor: 'transparent'}}>
            <Col justify="center" align="middle">  
              <QuestionContainer>
                <Description>
                  <TranslatedText textArray={TranslationsMap[`${questionnaire.translation_id}_description`]} defaultText={questionnaire.description} />
                </Description>
                {readOnly ? <Success><TranslatedText textArray={Translations.alert_completed}/></Success> : null}
                {pressCompleteRef && pressCompleteRef.current && !completed ? <Warning><TranslatedText textArray={Translations.alert_not_completed}/></Warning> : null}
              </QuestionContainer>
              {
                questionnaire.questions.map(({_id, translation_id, answers, max_selections, question, type, isAnswred}, i) => {
                  return (
                    <QuestionValitationWrapper key={_id} isAnswred={isAnswred}>
                      {type === 'order' ? 
                      <OrderQuestion translation_id={translation_id} readOnly={readOnly} questionID={_id} index={i} objectID={data._id} key={_id} question={question} answers={answers} /> :
                      type === 'checkbox' ?
                      <CheckboxQuestion translation_id={translation_id} max_selections={max_selections} readOnly={readOnly} index={i}  questionID={_id} objectID={data._id} key={_id} question={question} answers={answers} /> :
                      type === 'free_text' ? 
                      <FreeText translation_id={translation_id} readOnly={readOnly} index={i}  questionID={_id} objectID={data._id} key={_id} question={question} answers={answers} /> :
                      <RadioGroupQuestion translation_id={translation_id} readOnly={readOnly} index={i}  questionID={_id} objectID={data._id} key={_id} question={question} answers={answers} />}
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
      <TranslationProvider>
        <div>
          {
            <DndProvider backend={HTML5Backend}>
            <Layout style={{height:"100vh", overflowY: 'scroll'}}>
                <SurveyHeader>{data.questionnaire.title}</SurveyHeader>
                <Content style={{justifyContent: 'center', alignItems: 'center'}}>
                {
                  renderContent(data)
                }
                </Content>
                <MFooter onPress={() => {
                    if (pressCompleteRef) {
                      pressCompleteRef.current = true;
                    }
                    retrieveData(true);
                  }} />
            </Layout>
            </DndProvider>
          }        
        </div>
      </TranslationProvider>
    )
};

const QuestionValitationWrapper = ({children, isAnswred}) => {
  return (
    <QuestionWrapper>
      {!isAnswred ? 
      <RequiredMessage>
        <TranslatedText textArray={Translations.wanring_question_requires_answer}/>          
        </RequiredMessage> : null}
      {children}
    </QuestionWrapper>
  )
}

const MFooter = ({onPress}) => {
  return (
    <Footer >
    <Row align="middle" type="flex" justify="center">
      <Button size={"large"} type="primary" onClick={onPress}>
        <TranslatedText textArray={Translations.btn_done}/>
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
      <Title><TranslatedText textArray={Translations.header_instroduction} /></Title>
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
      <LanguagesDropdown />
      {children}
    </Header>
  );
}

const QuestionWrapper = styled.div`
text-align: left;
`;

const RequiredMessage = styled.p`
color: red;
font-size: 0.8rem;
`;

const Success = ({children}) => {
  return (
    <Alert
    banner
    type="success"
    message={<div style={{fontSize: 14, fontWeight: 'bolder'}}>{children}</div>}
  />
  )
}

const Warning = ({children}) => {
  return (
    <Alert
    banner
    message={<div style={{fontSize: 14, fontWeight: 'bolder'}}>{children}</div>}
  />
  )
};

const LanguagesDropdown = () => {
  const {translationDispatch, languageIndex} = useTranslationData();
  const [data, setData] = React.useState(Languages[languageIndex || 0]);

  const changeSelection = (_index) => {
    console.log("Value:", _index, Languages);
    translationDispatch(TranslationActions.switchLanguage(Languages[_index].index));
    setData(Languages[_index]);
  }

  // React.useEffect(() => {
  //   translationDispatch(TranslationActions.switchLanguage(index))
  // }, [state]);

  return (
    <Select style={{ width: 120 }} value={data.value} onChange={changeSelection}>
      {Languages.map(({index, value}, _index) => (
          <Option key={index}>
            {value}
          </Option>
      ))}
    </Select>
  )
}

export default SurveyTemplate;
