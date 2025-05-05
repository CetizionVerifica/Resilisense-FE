import React, {useState, useRef, useEffect} from 'react';
import styled from 'styled-components';
import { useRequest } from '../../../hook/useRequest';
import { message } from 'antd';
import { Checkbox } from 'antd';
import { QuestionContainer, QuestionTitle, AnswerText, AnswerContainer } from './Common';
import TranslatedText from '../../../common/components/translated_text';
import TranslationsMap from './translationsMap';

const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
};

const CheckboxQuestion = ({max_selections, translation_id, question, questionID, objectID, answers, index, readOnly = false}) => {
    const [values, setValues] = useState(answers);
    const [{data, pending, error}, execute] = useRequest();
    const currentSelections = useRef(0);

    useEffect(() => {
        // console.log("READ ONLY:::", readOnly);
        if (!readOnly) {
            // update question answers
            const body = {questionID: questionID, objectID: objectID, newAnswers: values};
            execute('/api/surveys/answer', 'PATCH', result => result.data, body);
        }
    }, [values]);

    useEffect(() => {
        if (error && !pending){
        //   console.log("Result:", data);
          message.error("Update error!");
        }
      }, [error, pending]);    
  
    const onPress = index => {

        let reload = false;
        if (values[index].selected) {
            currentSelections.current --;
            values[index].selected = false;
            reload = true;
        } else {
            if (currentSelections.current < max_selections) {
                currentSelections.current ++;
                values[index].selected = true;
                reload = true;
            } else {
                message.info(`Select up to ${max_selections} answers`);
            }

        }
        if (reload) {
            setValues([
                ...values
            ]); 
        }       
    };

    return (
        <QuestionContainer>
        <QuestionTitle translation_id={translation_id} text={question} index={index} />
        <AnswerContainer>
            <CheckboxsContainer>
                {
                    values.map(({_id, id_in_template, translation_id, selected, text, category}, i) => {
                        return (
                            <CheckboxContainer 
                                currentSelections={currentSelections}
                                max_selections={max_selections}
                                index={i}
                                category={category}
                                selected={selected}
                                onPress={onPress}
                                text={text}
                                translation_id={translation_id}
                            />
                        );
                    })
                }
            </CheckboxsContainer>  
        </AnswerContainer>
        </QuestionContainer>
      
    );
}

const CheckboxContainer = ({currentSelections, translation_id, max_selections, text, selected, category, onPress, index}) => {
    const [isSelected, setSelected] = useState(false);

    return (
        <ContainerCheck onMouseEnter={() => setSelected(true)} onMouseLeave={() => setSelected(false)} onClick={() => onPress(index)} style={{cursor: 'pointer', backgroundColor: isSelected ? 'rgba(156, 161, 157, .2)' : 'transparent'}}>
            <Checkbox checked={selected} />
            <div style={{marginLeft: 8}}>                
                <CheckboxTitle>
                    <TranslatedText textArray={TranslationsMap[`${translation_id}_category`]} defaultText={category} />
                </CheckboxTitle>
                <CheckboxText>
                    <TranslatedText textArray={TranslationsMap[`${translation_id}_text`]} defaultText={text} />
                </CheckboxText>
            </div>            
        </ContainerCheck>
    )
};

const CheckboxsContainer = styled.h3`
    padding: 0px 5px 5px 0px;
    align-items: flex-start;
`;

const CheckboxTitle = styled.h5`
    margin-left: 8px;
    text-align: left;
    font-weight: bold;
`;

const CheckboxText = styled.p`
    margin-left: 8px;
    text-align: left;
`;

const ContainerCheck = styled.div`
    display: flex;
    padding: 10px;
    flex-direction: row;
`;

export default CheckboxQuestion;
