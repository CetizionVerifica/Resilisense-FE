import React, {Component} from 'react'
import {Divider} from 'antd'
import {round, meanBy} from 'lodash'
import {injectIntl} from 'react-intl'
import ReactEcharts from 'echarts-for-react'
import basicStyle from '../../../common/basicStyle'
import {suppliersMessages} from '../../../messages'
import {getGraphOption} from './_helper'

class RankingAnalytics extends Component {

  render() {
    const {intl: {formatMessage},
      totalSuppliers,
      selectedSuppliers,
    } = this.props

    const {greyColor} = basicStyle

    const notMeetCriteriaProjects = totalSuppliers.length - selectedSuppliers.length
    const meetCriteriaPercentage = round(selectedSuppliers.length / totalSuppliers.length * 100, 1) || 0
    const notMeetCriteriaPercentage = round(notMeetCriteriaProjects / totalSuppliers.length * 100, 1) || 0
    const overallPerformanceAvg = round(meanBy(selectedSuppliers, 'overallPerformanceValue') || 0, 1)
    const overallRelevanceAvg = round(meanBy(selectedSuppliers, 'overallRelevanceValue') || 0, 1)

    return (
      <div>
        <div style={{display: 'flex'}}>
          <div style={{width: '25%', marginTop: 40}}>
            <h2>Suppliers analytics</h2>
            <h4> {formatMessage(suppliersMessages.suppliersMeetCriteria)} <span style={greyColor} >
              {selectedSuppliers.length} of {totalSuppliers.length} ({meetCriteriaPercentage}%)</span>
            </h4>
            <h4>{formatMessage(suppliersMessages.suppliersNotMeetCriteria)} <span style={greyColor} >
              {notMeetCriteriaProjects} of {totalSuppliers.length} ({notMeetCriteriaPercentage}%)</span>
            </h4>
            <h4> {formatMessage(suppliersMessages.averageCompanyPerformance)} <span style={greyColor} >
              {overallPerformanceAvg}%
            </span>
            </h4>
            <h4> {formatMessage(suppliersMessages.averageRelevanceScore)} <span style={greyColor} >
              {overallRelevanceAvg}%
            </span>
            </h4>
          </div>
          <div style={{width: '75%'}}>
            {/* <div>
              <ReactEcharts
                option={getGraphOption(totalSuppliers, 'overallPerformanceValue', 'Average Relevance Performance', 'Overall Performance')}
                style={{height: 250}}
              />
            </div> */}
            <ReactEcharts
              option={getGraphOption(totalSuppliers, 'overallRelevanceValue', 'Average Overall Company Performance Score', 'Overall Relevance', 'Selected Supplier Group - Average Overall Company Performance')}
              style={{height: 400}}
            />
            <div />
          </div>
        </div>
        <Divider />
      </div>
    )
  }
}

export default (injectIntl(RankingAnalytics))
