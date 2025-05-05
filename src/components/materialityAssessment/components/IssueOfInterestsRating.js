import React, {Component} from 'react'
import {Row, Col, message} from 'antd'
import {values, filter, isEmpty, sortBy, get} from 'lodash'
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd'
import {graphql} from 'react-apollo'
import {mUpdateIssueOfInterestRating} from '../../../graphql/materialityMutation'
import basicStyle from '../../../common/basicStyle'
import {issueOfInterest} from '../../../common/issueOfInterest'
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
class IssueOfInterstsRating extends Component {
  constructor(props) {
    super(props)
    this.state = {
      items: filter(values(issueOfInterest), {coreSubject: props.coreSubject}),
      loading: false,
      isUpdate: false,
    }
    this.onDragEnd = this.onDragEnd.bind(this)
  }

  componentWillMount() {
    if (!isEmpty(this.props.issueOfInterests)) {
      this.setState({
        items: sortBy(this.props.issueOfInterests, ['rating']),
        isUpdate: true,
      })
    }
  }

  componentWillUpdate(nextprops) {
    const issueOfInterests = sortBy(nextprops.issueOfInterests, ['rating'])
    if (nextprops.issueOfInterests !== this.props.issueOfInterests
      && !isEmpty(nextprops.issueOfInterests)) {
      this.setState({
        items: issueOfInterests,
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
    const {materialityId, stakeholderId, coreSubject} = this.props
    this.setState({loading: true})
    this.props.mutate({
      variables: {
        id: materialityId,
        coreSubject,
        stakeholderId: stakeholderId,
        data: items.map((item, index) =>
          ({issueOfInterest: item.issueOfInterest || item.value, rating: index + 1})),
      },
    }).then(({data}) => {
      message.success('Processing complete!')
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
                      <Draggable key={item.issueOfInterest || item.key}
                        draggableId={item.issueOfInterest || item.key} index={index}
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
                            {get(issueOfInterest[item.issueOfInterest], 'label', item.label)}
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


export default graphql(mUpdateIssueOfInterestRating)(IssueOfInterstsRating)
