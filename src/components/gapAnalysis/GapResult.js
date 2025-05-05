import React, {Component} from 'react'
import {graphql} from 'react-apollo'
import {get} from 'lodash'
import {Row, Col, Tabs} from 'antd'
import {connect} from 'react-redux'
import styled from 'styled-components'
import {breadcrumbUpdate} from '../../actions'
import fetchGapAnalysisQuery from '../../graphql/fetchGapAnalysis'
import basicStyle from '../../common/basicStyle'
import {gapAnalysisTooltip,
  performanceTooltip,
  performanceByCoreSubjectTooltip,
  performanceStatusTooltip,
  overallPerformanceTooltip,
} from '../../common/tooltips'
import PageHeader from '../utility/pageHeader'
import LayoutWrapper from '../utility/layoutWrapper'
import Box from '../utility/box'
import CoreSubjectOverall from './report/CoreSubjectOverall'
import GapAnalysisTables from './report/GapAnalysisTables'
import PerformanceVsRelevance from './report/PerformanceVsRelevance'
import PerformanceVsRelevanceCore from './report/PerformanceVsRelevanceCore'
import PerformanceVsRevanceStatus from './report/PerformanceVsRevanceStatus'
import InfoTooltip from '../utility/InfoTooltip'

const TabPane = Tabs.TabPane

const TooltipWrapper = styled.div`
  margin-left: 10px;  
`

class GapResult extends Component {
  componentWillUpdate(nextprops) {
    const {data: {gapAnalysis}, breadcrumbUpdate} = nextprops
    if (gapAnalysis) {
      const breadcrumb = [{name: 'Home', link: '/'},
        {
          name: get(gapAnalysis.project, 'company.name'),
          link: `/company/${get(gapAnalysis.project, 'company.id')}`,
        },
        {
          name: get(gapAnalysis.project, 'title'),
          link: `/project/${get(gapAnalysis.project, 'id')}`,
        },
        {name: 'Gap Analysis Results'},
      ]
      breadcrumbUpdate(breadcrumb)
    }
  }
  shouldComponentUpdate(nextProps) {
    return !(nextProps.data.gapAnalysis === this.props.data.gapAnalysis)
  }

  renderTab(text, tooltipContent) {
    return (
      <div style={{display: 'flex'}}>
        <span>{text}</span>
        <TooltipWrapper><InfoTooltip content={tooltipContent} /></TooltipWrapper>
      </div>
    )
  }

  render() {

    const {rowStyle, colStyle, gutter} = basicStyle
    const {data: {gapAnalysis}} = this.props
    if (!gapAnalysis) {
      return <div />
    }

    return (
      <LayoutWrapper>
        <PageHeader><span>Gap Analysis Results</span> </PageHeader>
        <Row style={rowStyle} justify="space-between" gutter={gutter}>
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <Box>
              <Tabs animated={false} defaultActiveKey="1" >
                <TabPane tab={this.renderTab('Gap Analysis Tables', gapAnalysisTooltip)} key="1">
                  <GapAnalysisTables gapAnalysis={gapAnalysis} />
                </TabPane>
                <TabPane tab={this.renderTab('Performance vs. Relevance', performanceTooltip)} key="2">
                  <PerformanceVsRelevance gapAnalysis={gapAnalysis} />
                </TabPane>
                <TabPane tab={this.renderTab('Performance vs. Relevance by Core Subject', performanceByCoreSubjectTooltip)} key="3">
                  <PerformanceVsRelevanceCore gapAnalysis={gapAnalysis} />
                </TabPane>
                <TabPane tab={this.renderTab('Performance vs. Relevance Status Report', performanceStatusTooltip)} key="4">
                  <PerformanceVsRevanceStatus gapAnalysis={gapAnalysis} />
                </TabPane>
                <TabPane tab={this.renderTab('Overall Company Performance by Core Subject', overallPerformanceTooltip)} key="5">
                  <CoreSubjectOverall gapAnalysis={gapAnalysis} />
                </TabPane>
              </Tabs>
            </Box>
          </Col>
        </Row>
      </LayoutWrapper>
    )
  }
}


const GapResultQL = graphql(fetchGapAnalysisQuery, {
  options: (props) => {return {variables: {id: props.match.params.id}}},
})(GapResult)
export default connect(null, {breadcrumbUpdate})(GapResultQL)
