import React, {useState, useCallback, useEffect} from 'react';
import { Card } from './Card';
import update from 'immutability-helper';
import styled from 'styled-components';
import { useRequest } from '../../../hook/useRequest';
import { message } from 'antd';
import { QuestionContainer, QuestionTitle, AnswerContainer } from './Common';

const OrderQuestion = ({question, translation_id, questionID, objectID, answers, index, readOnly = false}) => {
    const [cards, setCards] = useState(answers);
    const [{data, pending, error}, execute] = useRequest();
    var body;

    useEffect(() => {
      if (!readOnly) {
        body = {questionID: questionID, objectID: objectID, newAnswers: cards};
        console.log("Change", body);
        execute('/api/surveys/answer', 'PATCH', result => result.data, {questionID: questionID, objectID: objectID, newAnswers: cards});
      }
    }, [cards, readOnly]);

    useEffect(() => {
      if (error && !pending){
        console.log("Result:", data);
        message.error("Update error!");
      }
    }, [error, pending]);

    const moveCard = useCallback(
        (dragIndex, hoverIndex) => {
          const dragCard = cards[dragIndex];
          var temp = cards.map(card => ({...card, selected: true}));
          setCards(
            update(temp, {
              $splice: [
                [dragIndex, 1],
                [hoverIndex, 0, dragCard],
              ],
            }),
          )
        },
        [cards],
    );  
    
    const handleDropdownChange = (old_index, new_index) => {
      function arraymove(arr, fromIndex, toIndex) {
        var element = arr[fromIndex];
        arr.splice(fromIndex, 1);
        arr.splice(toIndex, 0, element);
        return arr;
      }      
      var temp = cards.map(card => ({...card, selected: true}));
      setCards(arraymove(temp, old_index, new_index));
    }

    const renderCard = (card, index, anwersNumber) => {
        return (
          <Card
            dropDownHandleChange={handleDropdownChange}
            key={card._id}
            anwersNumber={anwersNumber}
            index={index}
            id={card.id_in_template}
            text={card.text}
            title={card.category}
            translation_id={card.translation_id}
            moveCard={moveCard}
          />
        );
    };
    
    return (
        <QuestionContainer>
            <QuestionTitle translation_id={translation_id} index={index} text={question} />
            <AnswerContainer style={StyleSheet.order_question}>{cards.map((card, i) => renderCard(card, i, cards.length))}</AnswerContainer>
        </QuestionContainer>
    );
};

const StyleSheet = {
    order_question: {
        justifyContent: 'center',
        alignItems: 'center',
    }
};

export default OrderQuestion;
