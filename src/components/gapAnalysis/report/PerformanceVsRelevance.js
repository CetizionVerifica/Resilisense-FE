import React, {Component} from 'react'
import clone from 'clone'
import {Row, Col, Cascader} from 'antd'
import {values, filter, get, find} from 'lodash'
import {gapAnalysisQuestions} from '../../../common/gapAnalysisQuestions'
import {issueOfInterest} from '../../../common/issueOfInterest'
import Box from '../../utility/box'
import TableWrapper from '../../styles/table.style'
import basicStyle from '../../../common/basicStyle'
import ExportImage from '../../utility/exportImage'
import {coreSubjectOptions, getIssueLevel} from './_helper'
import {columns} from './reportConfig'

class PerformanceVsRelevance extends Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: columns,
      issueOfInterest: null,
    }
  }


  createcolumns(columns, issueOfInterest) {
    const {gapAnalysis} = this.props
    const coreSubject = filter(gapAnalysis.coreSubjects,
      {issueOfInterests: [{issueOfInterest}]})[0]
    const keyConsiderations =
      get(coreSubject ? find(coreSubject.issueOfInterests, {issueOfInterest}) : {}, 'keyConsiderations')
    const gapAnalysisColumn = [{
      title: 'Issue Level',
      dataIndex: '1',
      render: (text, record, index) => {
        const slectedValue = find(keyConsiderations, {keyConsideration: record.key})
        return getIssueLevel(slectedValue)
      },
    }]
    columns.push(...gapAnalysisColumn)
    return columns
  }

  onChange(value, selectedOptions) {
    this.setState({columns: this.createcolumns(clone(columns), value[1]),
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
  render() {
    const {rowStyle, colStyle, gutter} = basicStyle
    const {columns} = this.state
    return (
      <Row style={rowStyle} justify="space-between" gutter={gutter}>
        <Col md={24} sm={24} xs={24} style={colStyle}>
          <Box title="Core Subject / Issue of Interset" >
            {this.renderFields()}
          </Box>
        </Col>
        <Col md={24} sm={24} xs={24} style={colStyle}>

          {this.state.issueOfInterest && <ExportImage id="PerformanceVsRelevance">
            <TableWrapper
              size="small"
              columns={columns}
              onChange={this.onChange}
              dataSource={filter(values(gapAnalysisQuestions),
                {isuueOfInterest: this.state.issueOfInterest})}
              pagination={false}
              title={() => (<div >
                <span style={{color: '#888'}}> Issue of Interest: </span>
                <span> {get(issueOfInterest[this.state.issueOfInterest], 'label')} </span>
              </div>)}
            />
          </ExportImage>}
          <div style={{marginTop: 20, textAlign: 'right'}} />
        </Col>
      </Row>

    )
  }
}


export default PerformanceVsRelevance

