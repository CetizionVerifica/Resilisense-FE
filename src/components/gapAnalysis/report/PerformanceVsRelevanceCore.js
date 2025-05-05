import React, {Component} from 'react'
import {Row, Col, Select} from 'antd'
import {filter, orderBy, get} from 'lodash'
import Box from '../../utility/box'
import TableWrapper from '../../styles/table.style'
import basicStyle from '../../../common/basicStyle'
import ExportImage from '../../utility/exportImage'
import {coreSubjectNames} from '../../../common/coreSubjectNames'
import {coreSubjectOptions} from './_helper'
import {columnsRelevenceCoreSubject} from './reportConfig'
const Option = Select.Option

class PerformanceVsRelevanceCore extends Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: null,
      SelectedCoreSubject: null,
    }
  }

  onChange(value, selectedOptions) {
    this.setState({
      SelectedCoreSubject: value})
  }
  renderFields(group) {
    return (
      <Select
        key={1}
        options={coreSubjectOptions}
        onChange={(value, selectedOptions) => this.onChange(value, selectedOptions)}
        style={{width: '100%'}}
      >
        {coreSubjectOptions.map(d => <Option key={d.value}>{d.label}</Option>)}
      </Select>
    )

  }
  render() {
    const {rowStyle, colStyle, gutter} = basicStyle
    const {SelectedCoreSubject} = this.state
    const {gapAnalysis} = this.props
    const coreSubject = filter(gapAnalysis.coreSubjects, {coreSubject: SelectedCoreSubject})[0]
    const keyConsiderations = []
    if (coreSubject) {
      coreSubject.issueOfInterests.map(issueOfInterest => {
        return issueOfInterest.keyConsiderations.map(keyConsideration => {
          return keyConsiderations.push({
            ...keyConsideration,
            issueOfInterest: issueOfInterest.issueOfInterest,
          })
        })
      })
    }

    return (
      <Row style={rowStyle} justify="space-between" gutter={gutter}>
        <Col md={24} sm={24} xs={24} style={colStyle}>
          <Box title="Core Subject" >
            {this.renderFields()}
          </Box>
        </Col>
        <Col md={24} sm={24} xs={24} style={colStyle}>

          {SelectedCoreSubject && <ExportImage id="performanceVsRelevanceCore">
            <TableWrapper
              size="small"
              columns={columnsRelevenceCoreSubject}
              onChange={this.onChange}
              dataSource={orderBy(keyConsiderations, ['issueLevel'], ['desc'])}
              pagination={false}
              rowKey="keyConsideration"
              title={() => (<div >
                <span style={{color: '#888'}}> Major to Minor Issues: </span>
                <span> {get(coreSubjectNames[SelectedCoreSubject], 'label')} </span>
              </div>)}
            />
          </ExportImage>}
          <div style={{marginTop: 20, textAlign: 'right'}} />
        </Col>
      </Row>

    )
  }
}


export default PerformanceVsRelevanceCore

