import React, { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import styled from 'styled-components';
import { InputNumber } from 'antd';
import { Select } from 'antd';
import { indexOf } from 'lodash';
import TranslatedText from '../../../common/components/translated_text';
import TranslationsMap from './translationsMap';
const { Option } = Select;

const ItemTypes = {
    CARD: 'card',
}

const style = {
  border: '1px solid gray',
  padding: '0.5rem 1rem',
  flexDirection: 'row',
  display: 'flex',
  marginBottom: '0.6rem',
  cursor: 'move',
}

export const Card = ({ translation_id, id, isAnswred, text, index, moveCard, title, anwersNumber, dropDownHandleChange }) => {
  const ref = useRef(null);
  const [isSelected, setSelected] = useState(false);
  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    hover(item, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect()
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      // Determine mouse position
      const clientOffset = monitor.getClientOffset()
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }
      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex)
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  });

  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.CARD, id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })
  const opacity = isDragging ? 0 : 1
  drag(drop(ref));

  const hover = isHovered => {
    setSelected(isHovered);
  }
  
  return (
    <div onMouseEnter={() => hover(true)} onMouseLeave={() => hover(false)} ref={ref} style={{
       ...style,
       opacity,
       alignItems: 'center',
       justifyContent: 'center',
       borderRadius: 3,
       backgroundColor: isSelected ? 'rgba(156, 161, 157, .2)' : 'transparent'
       }}>
      <Dropdown isAnswred={isAnswred} index={index} defaultVal={index} anwersNumber={anwersNumber} dropDownHandleChange={dropDownHandleChange} />     
      <div style={{width: 5}} />
      <div style={{flex: 1}}>
        <Title>
          <TranslatedText defaultText={title} textArray={TranslationsMap[`${translation_id}_category`]} />
        </Title>
        <Description>
          <TranslatedText defaultText={text} textArray={TranslationsMap[`${translation_id}_text`]} />
        </Description>
      </div>
    </div>
  )
}

const Dropdown = ({index, anwersNumber, defaultVal, dropDownHandleChange }) => {
  const options = [];
  for (var i=0; i<anwersNumber; i++) {
    options.push({});
  }

  function handelChange(value) {
    const newPosition = value.key;
    const oldPosition = index;
    dropDownHandleChange(oldPosition, newPosition);
  }

  return (
    <Select
    labelInValue
    key={defaultVal} // nescesary to render the default value
    defaultValue={{ key: defaultVal }}
    style={{ width: 55 }}
    onChange={handelChange}
    >
    {
      options.map((_, index) => <Option key={index} value={index}>{index+1}</Option>)
    }
    </Select>
  )
}

const NumberPosition = styled.p`
  margin: 0px 30px 0px 30px; 
  padding: 5px;
  border-radius: 20%;
  border-width: thin;
  border-style: solid;  
`;

const Title = styled.h3`
  text-align: left;
  font-weight: bold;
;`;

const Description = styled.h5`
  text-align: left;
;`;