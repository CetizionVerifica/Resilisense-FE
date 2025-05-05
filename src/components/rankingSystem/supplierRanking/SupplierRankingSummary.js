import React, {Component} from 'react'
import {Row, Col, Select, Cascader} from 'antd'
import {get, find, values, round, filter, uniq} from 'lodash'
import {injectIntl} from 'react-intl'
import ReactEcharts from 'echarts-for-react'
import {countries} from '../../../common/enum'
import {coreSubjectNames} from '../../../common/coreSubjectNames'
import {coreSubjectIssuesOfInt} from '../../../common/issueOfInterest'
import Box from '../../utility/box'

const Option = Select.Option

class SupplierRankingSummary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      coreSubjectPerformance: '-',
      coreSubjectRelevance: '-',
      issueOfInterestPerformance: '-',
      issueOfInterestRelevance: '-',
    }
  }

  onCoreSubjectChange = value => {
    const {record} = this.props
    let coreSubjectPerformance = '-'
    let coreSubjectRelevance = '-'
    const coreSubject = find(record.coreSubjects, {coreSubject: value})

    if (coreSubject) {
      coreSubjectPerformance = `${round(get(coreSubject, 'performanceValue', 0) * 100, 2)} %`
      coreSubjectRelevance = `${round(get(coreSubject, 'relevanceValue', 0) * 100, 2)} %`
    }

    this.setState({coreSubjectPerformance, coreSubjectRelevance})
  }

  onIssueOfInterestChange = value => {
    const {record} = this.props
    let issueOfInterestPerformance = '-'
    let issueOfInterestRelevance = '-'

    const coreSubject = find(record.coreSubjects, {coreSubject: value[0]})

    if (coreSubject) {
      const issueOfInterest = find(coreSubject.issueOfInterests, {issueOfInterest: value[1]})

      if (issueOfInterest) {
        issueOfInterestPerformance = `${round(get(issueOfInterest, 'performanceValue', 0) * 100, 2)} %`
        issueOfInterestRelevance = `${round(get(issueOfInterest, 'relevanceValue', 0) * 100, 2)} %`
      }

    }

    this.setState({issueOfInterestPerformance, issueOfInterestRelevance})
  }

  getOption(totalSuppliers, record) {

    const suppliers = filter(totalSuppliers, {companyId: record.companyId})
    const years = uniq(suppliers.map(s => {return s.requestedYear})).sort()
    const data = suppliers.sort((a, b) => {return a.requestedYear - b.requestedYear}).map(supplier => supplier.overallPerformanceValue)

    return {
      title: {
        subtext: 'Selected Supplier - Overall Company Performance',
        x: 'center',
      },
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        data: years,
        type: 'category',
        boundaryGap: false,
        name: 'Year',
        nameLocation: 'center',
      },
      yAxis: {
        max: 100,
        name: 'Overall Company Performance Score',
        nameLocation: 'middle',
        nameTextStyle: {
          padding: 20,
        },
      },
      series: {
        name: 'Overall Performance',
        type: 'line',
        data,
      },
    }
  }

  render() {
    const {
      coreSubjectPerformance,
      coreSubjectRelevance,
      issueOfInterestPerformance,
      issueOfInterestRelevance,
    } = this.state

    const {record, totalSuppliers} = this.props
    const countryValue = find(countries, {value: record.country})
    const country = countryValue ? countryValue.label : '-'

    return (
      <Box>
        <Row type="flex" justify="space-between" >
          <Col span={4}>
            <div>
              <h3>Basic info</h3>
              <div>Name: {record.agencyName}</div>
              <div>Sector / Industry:</div>
              <div>{record.industry}</div>
              <div>Country: {country}</div>
            </div>
            <div style={{marginTop: 10, width: 230}}>
              <h3>Contact person</h3>
              <div>Contact name: {record.contactName}</div>
              <div>Job position: {record.contactPosition}</div>
              <div>Email: {record.contactEmail}</div>
            </div>
            <div style={{marginTop: 10}}>
              <h3>Supplier analytics</h3>
              <div>Conforms to criteria set: {`${record.conforming ? 'Yes' : 'No'}`}</div>
              <div>Overall company performance score: {record.overallPerformance}</div>
              <div>Overall relevance & significant score: {record.overallRelevance}</div>
            </div>
          </Col>
          <Col span={14}>
            <ReactEcharts
              option={this.getOption(totalSuppliers, record)}
              style={{height: 400}}
            />
          </Col>
          <Col span={6}>
            <h3>Company Performance and Relevance Scores</h3>
            <div>
              <div>Core Subject</div>
              <Select style={{width: '100%', marginTop: 10}} allowClear onChange={this.onCoreSubjectChange}>
                {values(coreSubjectNames).map(coreSubject =>
                  (<Option
                    key={coreSubject.value}
                    value={coreSubject.value}
                  >
                    {coreSubject.label}
                  </Option>))}
              </Select>
              <div>Company Performance Score: {coreSubjectPerformance}</div>
              <div>Relevance & Significance Score: {coreSubjectRelevance}</div>

              <div style={{marginTop: 10}}>Issue of interest</div>
              <Cascader
                options={coreSubjectIssuesOfInt}
                style={{width: '100%', marginTop: 10}}
                onChange={this.onIssueOfInterestChange}
                placeholder="Please select"
              />
              <div>Company Performance Score: {issueOfInterestPerformance}</div>
              <div>Relevance & Significance Score: {issueOfInterestRelevance}</div>
            </div>
          </Col>
        </Row>
      </Box>
    )
  }
}

export default injectIntl(SupplierRankingSummary)
