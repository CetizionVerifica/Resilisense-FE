import React, {Component} from 'react'
import clone from 'clone'
import {Row, Col, Tag, Divider} from 'antd'
import {values, filter, find, get, round} from 'lodash'
import {injectIntl} from 'react-intl'
import {performanceView} from '../../common/enum/performance'
import {DropdownCell} from '../../common/helperCells'
import {
  weightCompanyPerformance,
  weightRelevanceSignificance} from '../../common/enum/weight'
import {gapAnalysisQuestions} from '../../common/gapAnalysisQuestions'
import basicStyle from '../../common/basicStyle'
import TableWrapper from '../styles/table.style'
import {columns} from './issueOfIterestsListConfig'

const {rowStyle, colStyle, gutter} = basicStyle
class SupplierIssueOfInterestList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      gapColumns: this.createcolumns(clone(columns), props),
      gapAnalys: [],
    }
  }

  componentWillReceiveProps(nextProp) {
    const {issueOfInterest} = nextProp
    if (issueOfInterest) {
      this.setState({gapColumns: this.createcolumns(clone(columns), nextProp)})
    }
  }
  renderCoreSubjectResult(issueOfInterest) {
    return (<div style={{textAlign: 'center'}}>
      <Divider orientation="left">Overview</Divider>
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

  createcolumns(columns, {issueOfInterest}) {
    const {intl: {formatMessage}} = this.props
    const keyConsiderations = get(issueOfInterest, 'keyConsiderations')
    const gapAnalysisColumn = [{
      title: 'Key Considerations',
      key: 'keyConsiderations',
      width: 500,
      render: object => formatMessage(object.localization),
    }, {
      title: 'Initial Company Performance Score',
      dataIndex: '1',
      render: (text, record, index) => {
        const slectedValue = find(keyConsiderations, {keyConsideration: record.key})
        const relevanceValue = get(slectedValue, 'relevanceValue')
        return (<DropdownCell
          defaultValue={relevanceValue === 0 ? 'N/A' : get(slectedValue, 'performanceValue')}
          record={record}
          disabled
          options={values(weightCompanyPerformance)}
          callBack={(value) => {}}
        />)
      },
    },
    {
      title: 'Relevance & Significance Score',
      dataIndex: '3',
      render: (text, record, index) => {
        const slectedValue = find(keyConsiderations, {keyConsideration: record.key})
        return (<DropdownCell
          defaultValue={get(slectedValue, 'relevanceValue')}
          record={record}
          disabled
          options={values(weightRelevanceSignificance)}
          callBack={(value) => {}}
        />)
      },
    },
    ]
    columns.push(...gapAnalysisColumn)

    return columns
  }

  render() {
    const {gapColumns} = this.state
    const {issue, issueOfInterest, intl: {formatMessage}} = this.props
    return (

      <Row type="flex" justify="space-between" >
        <Col span={24}>
          <TableWrapper
            size="small"
            columns={gapColumns}
            onChange={this.onChange}
            dataSource={filter(values(gapAnalysisQuestions), {isuueOfInterest: issue.key})}
            pagination={false}
            title={() => (<div >
              <span style={{color: '#888'}}> Issue of Interest: </span>
              <span> {formatMessage(issue.localization)} </span>
              {this.renderCoreSubjectResult(issueOfInterest)}
            </div>)}
          />
        </Col>
      </Row>
    )
  }
}


export default (injectIntl(SupplierIssueOfInterestList))
