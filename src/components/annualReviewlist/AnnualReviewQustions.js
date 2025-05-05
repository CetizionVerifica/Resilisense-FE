import React, {Component} from 'react'
import clone from 'clone'
import {Row, Col, Tag, Switch, message} from 'antd'
import {values, filter, get, round} from 'lodash'
import {graphql} from 'react-apollo'
import {performanceView} from '../../common/enum/performance'
import {updateGapAnalysisMutation} from '../../graphql/gapAnalysisMutation'

import {annualReviewQuestions} from '../../common/enum/annualReviewQuestions'
import basicStyle from '../../common/basicStyle'
import TableWrapper from '../styles/table.style'
import ExportImage from '../utility/exportImage'
import {columns} from './AnnualReviewlistConfig'
const {rowStyle, colStyle, gutter} = basicStyle
class IssueOfInterestList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      gapColumns: this.createcolumns(clone(columns), props.issueOfInterest),
      search: '',
      visible: false,
      current: 0,
      gapAnalys: [],
    }
  }

  componentWillReceiveProps(nextProp) {
    const {issueOfInterest} = nextProp
    if (issueOfInterest) {
      this.setState({gapColumns: this.createcolumns(clone(columns), issueOfInterest)})
    }
  }
  renderCoreSubjectResult(issueOfInterest) {
    return (<div style={{textAlign: 'center'}}>
      <Row style={rowStyle} justify="space-between" gutter={gutter}>
        {values(performanceView).map(item => {
          return (<Col md={12} sm={12} xs={24} style={colStyle} key={item.key}>
            <span style={{marginBottom: 10, display: 'block'}}>{item.label} </span>
            <Tag color={item.color}>
              {round(get(issueOfInterest, item.value, 0) * 100, 2) }%
            </Tag>
          </Col>)
        })}
      </Row>
    </div>)
  }

  createcolumns(columns) {
    const activeColumn = [{
      title: 'Active',
      key: 'active',
      width: 100,
      render: (text, record, index) =>
        (<Switch
          defaultChecked={record.active}
          key={record.id}
          onChange={() => {}}
        />),
    }]
    columns.push(...activeColumn)
    return columns
  }

  companyPerformanceCell(record, value, currentValue) {
    const {refetch} = this.props
    const keyConsideration = {
      id: this.props.gapAnalysisId,
      keyConsideration: record.key,
      performanceValue: value,
      coreSubject: record.coreSubject,
      issueOfInterest: record.isuueOfInterest,
    }

    this.props.mutate({
      variables: {
        ...keyConsideration,
      },
    }).then(() => {
      if (!currentValue) {
        refetch()
      }

      message.success('Processing complete!')
    })
  }

  relevanceSignificanceCell(record, value, currentValue) {
    const {refetch} = this.props
    const keyConsideration = {
      id: this.props.gapAnalysisId,
      keyConsideration: record.key,
      relevanceValue: value,
      coreSubject: record.coreSubject,
      issueOfInterest: record.isuueOfInterest,
    }
    this.props.mutate({
      variables: {
        ...keyConsideration,
      },
    }).then(() => {
      if (!currentValue) {
        refetch()
      }
      message.success('Processing complete!')
    })
  }
  render() {
    const {gapColumns} = this.state
    const {subTitle} = this.props
    return (

      <Row type="flex" justify="space-between" >
        <Col span={24}>
          <ExportImage id={subTitle.key}>
            <TableWrapper
              size="small"
              columns={gapColumns}
              onChange={this.onChange}
              dataSource={filter(values(annualReviewQuestions), {subtitle: subTitle.key})}
              pagination={false}
              showHeader={false}
              title={() => (<div >
                <span> {subTitle.label} </span>
              </div>)}
            />
          </ExportImage>
        </Col>
      </Row>
    )
  }
}


export default graphql(updateGapAnalysisMutation)(IssueOfInterestList)
