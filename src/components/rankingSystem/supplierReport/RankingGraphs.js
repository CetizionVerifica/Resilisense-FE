import React, {Component} from 'react'
import {injectIntl} from 'react-intl'
import ReactEcharts from 'echarts-for-react'
import {getGraphOption} from '../supplierRanking/_helper'

class RankingGraphs extends Component {

  render() {
    const {
      totalSuppliers,
    } = this.props

    return (
      <div>
        {/* <ReactEcharts
          option={getGraphOption(totalSuppliers, 'overallPerformanceValue', 'Average Relevance Performance', 'Overall Performance')}
          style={{height: 250}}
        /> */}

        <ReactEcharts
          option={getGraphOption(totalSuppliers, 'overallRelevanceValue', 'Average Overall Company Performance Score', 'Overall Relevance', 'Selected Supplier Group - Average Overall Company Performance')}
          style={{height: 250}}
        />
      </div>
    )
  }
}

export default (injectIntl(RankingGraphs))
