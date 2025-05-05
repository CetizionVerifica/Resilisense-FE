import React, {useState, useRef, useEffect} from 'react';
import styled from 'styled-components';
import { useRequest } from '../../../hook/useRequest';
import { message } from 'antd';
import { Radio, Input } from 'antd';
import { QuestionContainer, QuestionTitle, AnswerContainer } from './Common';
import TranslatedText from '../../../common/components/translated_text';
import TranslationsMap from './translationsMap';

const radioStyle = {
    display: 'flex',
    // backgroundColor: 'blue',
    lineHeight: '30px',
    height: '30px',
    alignItems: 'center',
    marginLeft: 5,
    marginRight: 5,
};

const getSelectedItemIndex = (answers) => {
    if (!answers) return -1;
    for (var index in answers) {
        if (answers[index].selected) return index;
    }
    return -1;
}

const RadioGroupQuestion = ({question, translation_id, questionID, objectID, answers, index, readOnly = false}) => {
    const [ansObj, setValue] = useState({
        answers: answers,
        value: getSelectedItemIndex(answers),
    });
    const [{data, pending, error}, execute] = useRequest();

    useEffect(() => {
        if (error && !pending){
        //   console.log("Result:", data);
          message.error("Update error!");
        }
      }, [error, pending]);    

    const onChange = e => {
        // console.log('radio checked', e.target.value);
        if (e.target.value >= 0){
            setValue({
                ...ansObj,
                value: e.target.value,
                answers: ansObj.answers.map((element, index) => index === e.target.value ? {...element, selected: true} : {...element, selected: false}),
            });
        }
    };

    const updateText = (text, position) => {
        setValue({
            ...ansObj,
            answers: ansObj.answers.map((element, index) => index === position ? {...element, input: text} : element),
        });
    }

    const updateData = () => {
        if (!readOnly) {
            const body = {questionID: questionID, objectID: objectID, newAnswers: ansObj.answers};
            execute('/api/surveys/answer', 'PATCH', result => result.data, body);
        }
    }
    
    useEffect(() => {  
        updateData();
    }, [ansObj]);

    return (
        <QuestionContainer>
            <QuestionTitle translation_id={translation_id} index={index} text={question} />
            <AnswerContainer>
                <Radio.Group style={{width: '100%'}} onChange={onChange} value={parseInt(ansObj.value)}>
                    {
                        answers.map(({_id, translation_id, selected, text, category, input}, index) => {
                            return (
                                <MRadio translation_id={translation_id} updateText={updateText} input={input} index={index} text={text} selected={parseInt(ansObj.value) === index} />
                            );
                        })
                    }
                </Radio.Group>   
            </AnswerContainer>

        </QuestionContainer>     
    )
}

const MRadio = ({index, input, translation_id, text, updateText}) => {
    const [isSelected, setSelected] = useState(false);
    return (
        <div>                   
           {typeof input === 'string' ? 
           <div>
                <p style={{margin: 8}}>
                    <TranslatedText defaultText={text} textArray={TranslationsMap[`${translation_id}_text`]} />
                </p>
               <MInput
                placeholder={""}
                defaultValue={input}
                onChange={event => updateText(event.target.value, index)}
               />
            </div>           
           : <Radio onMouseEnter={() => setSelected(true)} onMouseLeave={() => setSelected(false)} style={{...radioStyle, backgroundColor: isSelected ? 'rgba(156, 161, 157, .2)' : 'transparent'}} value={index}>
                {text.length > 0 ? <TranslatedText defaultText={text} textArray={TranslationsMap[`${translation_id}_text`]} /> : <Input style={{ width: '100%', margin: 10, }} />}
            </Radio> }
        </div>

    )
}

const MInput = props => {
    const [data, setData] = useState(props.defaultValue);

    useEffect(() => {
        setData(props.defaultValue);
    }, [props.defaultValue]);

    const onChange = event => {
        props.onChange(event);
        setData(event.target.value);
    }

    return (
        <Input {...props} value={data} onChange={onChange} />        
    )
}

export default RadioGroupQuestion;
