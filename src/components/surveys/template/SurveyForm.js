import React, {useState, useRef, useEffect} from 'react'
import { Link, withRouter } from 'react-router-dom'; // import the react-router-dom components
import { useRequest } from '../../../hook/useRequest';
import { message, Spin, Alert } from "antd";
import SurveyTemplate from './SurveyTemplate';
import LayoutWrapper from '../../utility/layoutWrapper';

const SurveyForm = props => {
    const [{data, pending, error}, execute] = useRequest();
    const [completeSurveyResult, completeSurvey] = useRequest();
    const sideID = props.match.params.id;
    const pressComplete = useRef(false);

    useEffect(() => {
      if (!pending && error) {
        const duration = 10000;
        message.error("Page not found..", duration);
      }
    }, [data, pending, error]);

    const retrieveData = (withValidation = false) => {
      execute(`/api/surveys/side/${sideID}?showNotAnswredQuestions=${withValidation}`, 'PATCH', result => result.data);
    }   
    
    useEffect(() => {
      if (!pending && !error && data.completed && pressComplete.current) {
        pressComplete.current = false;
        completeSurvey(`/api/surveys/${data._id}/complete`, 'PATCH', result => result.data);
      }
    }, [data]);
    
    useEffect(() => {
      retrieveData();
    }, [sideID]);

    if (data && data.completed) {
      return (<Alert style={{margin: 20}} message="Survey Completed!" type="info" />)
    }

    return (
        <div style={{justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
            {data ? <SurveyTemplate pressCompleteRef={pressComplete} readOnly={data.completed} retrieveData={retrieveData} completed={!completeSurveyResult.pending && !completeSurveyResult.error} data={data} /> : <Spin size="large" style={{margin: 'auto', marginTop: 100}} />}
        </div>
    )
};


export default withRouter(SurveyForm);

