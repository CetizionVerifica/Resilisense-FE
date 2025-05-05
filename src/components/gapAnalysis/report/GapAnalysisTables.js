import React, {Component} from 'react'
import {Row, Col, Radio, Cascader} from 'antd'
import {filter, get, find} from 'lodash'
import {issueOfInterest} from '../../../common/issueOfInterest'
import Box from '../../utility/box'
import TableWrapper from '../../styles/table.style'
import basicStyle from '../../../common/basicStyle'
import ExportImage from '../../utility/exportImage'
import {coreSubjectOptions} from './_helper'
import {columnsGapAnalysisTables} from './reportConfig'

const RadioButton = Radio.Button
const RadioGroup = Radio.Group

class GapAnalysisTables extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedIssueOfInterest: null,
      tabelFilter: 'all',
    }
  }
  onChange(value, selectedOptions) {
    this.setState({selectedIssueOfInterest: value[1]})
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
  onChangeFilter(e) {
    this.setState({tabelFilter: e.target.value})
  }
  render() {
    const {rowStyle, colStyle, gutter} = basicStyle
    const {gapAnalysis} = this.props
    const {selectedIssueOfInterest, tabelFilter} = this.state

    const coreSubject = filter(gapAnalysis.coreSubjects,
      {issueOfInterests: [{issueOfInterest: selectedIssueOfInterest}]})[0]
    const keyConsiderations =
      get(coreSubject ? find(coreSubject.issueOfInterests,
        {issueOfInterest: selectedIssueOfInterest}) : {}, 'keyConsiderations')
    
    return (
      <Row style={rowStyle} justify="space-between" gutter={gutter}>
        <Col md={24} sm={24} xs={24} style={colStyle}>

          <Box title="Core Subject / Issue of Interset" >
            {this.renderFields()}
          </Box>
        </Col>
        <Col md={24} sm={24} xs={24} style={colStyle}>

          {selectedIssueOfInterest && <ExportImage id="GapAnalysisTables">
            <TableWrapper
              size="small"
              columns={columnsGapAnalysisTables}
              onChange={this.onChange}
              rowKey="keyConsideration"
              dataSource={filter(keyConsiderations, (o) => {
                if (tabelFilter === '0-2') {
                  return o.performanceValue < 3
                } else if (tabelFilter === '3') {
                  return o.performanceValue === 3
                } else if (tabelFilter === '4') {
                  return o.performanceValue >= 4
                } else {
                  return true
                }

              })}
              pagination={false}
              title={() => (<div >
                <span style={{color: '#888'}}> Issue of Interest: </span>
                <span> {get(issueOfInterest[selectedIssueOfInterest], 'label')} </span>
                <RadioGroup onChange={(v) => this.onChangeFilter(v)} defaultValue="all">
                  <RadioButton value="all">All</RadioButton>
                  <RadioButton value="0-2">0 - 2</RadioButton>
                  <RadioButton value="3">3</RadioButton>
                  <RadioButton value="4">4</RadioButton>
                </RadioGroup>
              </div>)}
            />
          </ExportImage>}
          <div style={{marginTop: 20, textAlign: 'right'}} />
        </Col>
      </Row>

    )
  }
}


export default GapAnalysisTables
