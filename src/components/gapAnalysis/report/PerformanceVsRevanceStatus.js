import React, {Component} from 'react'
import clone from 'clone'
import {Row, Col, Cascader} from 'antd'
import {filter, get, find, round} from 'lodash'
import TableWrapper from '../../styles/table.style'
import basicStyle from '../../../common/basicStyle'
import {issueOfInterest} from '../../../common/issueOfInterest'
import ExportImage from '../../utility/exportImage'
import {
  coreSubjectOptions,
  getCompanyPerformanceStatusReport,
  getRevisingScorePerformance,
  getRelevanceSignificance,
} from './_helper'
import {columnsStatus} from './reportConfig'

class PerformanceVsRevanceStatus extends Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: columnsStatus,
      issueOfInterest: null,
    }
  }


  createcolumns(columns) {
    const gapAnalysisColumn = [{
      title: 'Initial Company Performance Score',
      dataIndex: '1',
      render: (text, record, index) => {
        return getCompanyPerformanceStatusReport(get(record, 'actualPerformanceValue'), get(record, 'relevanceValue'))
      },
    },
    {
      title: 'Revised Company Performance Score',
      key: 'revisedScore',
      render: object => {
        const value = object.revisedScore
        // CSR-97 change this line (old line -> const score = value ? round(value * 100) : '-')
        const score = typeof(value) === 'number' ? round(value * 100) : '-'        

        return getRevisingScorePerformance(score)
      },
    },
    {
      title: 'Relevance & Significance Score',
      dataIndex: '3',
      render: (text, record, index) => {
        return getRelevanceSignificance(get(record, 'relevanceValue'))
      },
    }]
    columns.push(...gapAnalysisColumn)
    return columns
  }

  onChange(value, selectedOptions) {
    this.setState({columns: this.createcolumns(clone(columnsStatus)),
      issueOfInterest: value[1]})
  }
  renderFields(group) {
    return (
      <Cascader
        key={1}
        options={coreSubjectOptions}
        onChange={(value, selectedOptions) => this.onChange(value, selectedOptions)}
        style={{width: '100%'}}
      />
    )
  }
  renderTabel(data, type, index) {
    const {columns} = this.state
    return (
      <TableWrapper
        size="small"
        key={index}
        columns={columns}
        onChange={this.onChange}
        dataSource={data}
        pagination={false}
        rowKey="keyConsideration"
        title={() => (<div >
          <span style={{color: '#888'}}> {type} Issues: </span>
          <span> {get(issueOfInterest[this.state.issueOfInterest], 'label')} </span>
        </div>)}
      />
    )
  }
  render() {
    const {rowStyle, colStyle, gutter} = basicStyle
    const {issueOfInterest} = this.state
    const {gapAnalysis} = this.props
    const coreSubject = filter(gapAnalysis.coreSubjects,
      {issueOfInterests: [{issueOfInterest}]})[0]
    const keyConsiderations =
      get(coreSubject ? find(coreSubject.issueOfInterests, {issueOfInterest}) : {},
        'keyConsiderations')
    const keyConsiderationsMajor =
      filter(keyConsiderations, keyConsideration => keyConsideration.issueLevel > 5)
    const keyConsiderationsMinor =
      filter(keyConsiderations, keyConsideration => keyConsideration.issueLevel <= 5)
    return (
      <Row style={rowStyle} justify="space-between" gutter={gutter}>
        <Col md={24} sm={24} xs={24} style={colStyle}>

          <p> Core Subject / Issue of Interset </p>
          {this.renderFields()}
        </Col>
        {issueOfInterest && <div>
          <Col md={24} sm={24} xs={24} style={colStyle} key={2}>
            <ExportImage id="PerformanceVsRevanceStatusMajor">
              {this.renderTabel(keyConsiderationsMajor, 'Major', 1)}
            </ExportImage>
          </Col>
          <Col md={24} sm={24} xs={24} style={colStyle} key={3}>
            <ExportImage id="PerformanceVsRevanceStatusMinor">
              {this.renderTabel(keyConsiderationsMinor, 'Minor', 2)}
            </ExportImage>
          </Col>
        </div>
        }
      </Row>

    )
  }
}


export default PerformanceVsRevanceStatus

