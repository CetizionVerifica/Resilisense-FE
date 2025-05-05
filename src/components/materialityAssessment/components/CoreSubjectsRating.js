import React, {Component} from 'react'
import {Row, Col, message, notification} from 'antd'
import {values, isEmpty, sortBy, get} from 'lodash'
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd'
import {graphql} from 'react-apollo'
import {mUpdateCoreSubjectRating} from '../../../graphql/materialityMutation'
import basicStyle from '../../../common/basicStyle'
import {coreSubjectNames} from '../../../common/coreSubjectNames'
import LayoutWrapper from '../../utility/layoutWrapper'


const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

const grid = 8

const getItemStyle = (isDragging, draggableStyle, isUpdate) => ({
  userSelect: 'none',
  padding: '8px 16px',
  margin: `0 0 ${grid}px 0`,
  background: isDragging ? '#e6f7ff' : '#f0f2f5',
  ...draggableStyle,
  color: isUpdate ? '#444' : '#e02a2a',
})


const {rowStyle, colStyle, gutter} = basicStyle
class CoreSubjectRating extends Component {
  constructor(props) {
    super(props)
    this.state = {
      items: values(coreSubjectNames),
      loading: false,
      isUpdate: false,
    }
    this.onDragEnd = this.onDragEnd.bind(this)
  }

  componentWillMount() {
    if (!isEmpty(this.props.coreSubjects)) {
      this.setState({
        items: sortBy(this.props.coreSubjects, ['rating']),
        isUpdate: true,
      })
    }
  }

  componentWillUpdate(nextprops) {
    const coreSubjects = sortBy(nextprops.coreSubjects, ['rating'])
    if (nextprops.coreSubjects !== this.props.coreSubjects && !isEmpty(nextprops.coreSubjects)) {
      this.setState({
        items: coreSubjects,
        isUpdate: true,
      })
    }
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return
    }
    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    )
    this.setState({
      items,
    })
    this.handleFormSubmit(items)
  }
  handleFormSubmit(items) {
    //const {items} = this.state
    const {materialityId, stakeholderId, refetch} = this.props

    this.setState({loading: true})
    this.props.mutate({
      variables: {
        id: materialityId,
        stakeholderId: stakeholderId,
        data: items.map((item, index) => ({coreSubject: item.coreSubject || item.value, rating: index + 1})),
      },
    }).then(({data}) => {
      message.success('Processing complete!')
      refetch()
    }).catch(({message, locations, path}) => {
      this.setState({loading: false})
      return notification.warning({
        message: 'Update Core Subject Rating',
        description: message,
      })
    })
  }
  render() {
    return (
      <LayoutWrapper>
        <Row style={rowStyle} justify="space-between" gutter={gutter}>
          <Col md={24} sm={24} xs={24} style={colStyle}>
            {!this.state.isUpdate && <h3>Ranking Not Done</h3>}
            <DragDropContext onDragEnd={this.onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}

                  >
                    {this.state.items.map((item, index) => (
                      <Draggable key={item.coreSubject || item.key}
                        draggableId={item.coreSubject || item.key} index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style,
                              this.state.isUpdate
                            )}
                          >
                            {get(coreSubjectNames[item.coreSubject], 'label', item.label)}
                            <h3 style={{float: 'right'}}> {index + 1} </h3>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

          </Col>
        </Row>
      </LayoutWrapper>
    )
  }
}


export default graphql(mUpdateCoreSubjectRating)(CoreSubjectRating)

