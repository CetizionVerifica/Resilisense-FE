import React, { useEffect } from 'react';
import { useRequest } from '../../../hook/useRequest';
import { Input } from 'antd';
import { QuestionContainer, QuestionTitle, AnswerContainer } from './Common';

export default function FreeText({question, translation_id, questionID, objectID, answers, index, readOnly = false}) {
    const [{data, pending, error}, execute] = useRequest();
    function update(event) {
      if (!readOnly) {
        execute('/api/surveys/answer', 'PATCH', result => result.data, {
            questionID: questionID,
            objectID: objectID,
            newAnswers: [
                {
                    ...answers[0],
                    selected: true,
                    text: event.target.value,
                }
            ]
        });
      }
    }

    return (
        <QuestionContainer>
            <QuestionTitle translation_id={translation_id} index={index} text={question} />
            <AnswerContainer>
            <Input placeholder="" defaultValue={answers[0].text} onChange={update} />
            </AnswerContainer>
        </QuestionContainer>
    )
}