import React, {Component} from 'react'
import {Row, Col, Tabs} from 'antd'
import {values, filter, find, get} from 'lodash'
import {graphql} from 'react-apollo'
import {connect} from 'react-redux'
import {breadcrumbUpdate} from '../../actions'
import fetchGapAnalysisQuery from '../../graphql/fetchGapAnalysis'
import {
  annualReviewQuestionsTitle,
  annualReviewQuestionsSubTitle,
} from '../../common/enum/annualReviewQuestions'
import basicStyle from '../../common/basicStyle'
import PageHeader from '../utility/pageHeader'
import LayoutWrapper from '../utility/layoutWrapper'
import Box from '../utility/box'
import AnnualReviewQustions from './AnnualReviewQustions'

const TabPane = Tabs.TabPane
const {rowStyle, colStyle, gutter} = basicStyle
class GapEdit extends Component {

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
        {name: 'Gap Analysis'},
      ]
      breadcrumbUpdate(breadcrumb)
    }
  }
  shouldComponentUpdate(nextProps) {
    return !(nextProps.data.gapAnalysis === this.props.data.gapAnalysis)
  }

  renderSubtitle(coreSubjectKey, coreSubject) {
    const {data} = this.props
    const issueOfInterests = get(coreSubject, 'issueOfInterests')
    return filter(annualReviewQuestionsSubTitle, {title: coreSubjectKey}).map(subTitle => {
      const issueOfI = find(issueOfInterests, {issueOfInterest: subTitle.key})
      return (
        <div style={{margin: 20, marginBottom: 20}} key={subTitle.key}>

          <AnnualReviewQustions
            subTitle={subTitle}
            issueOfInterest={issueOfI}
            gapAnalysisId={this.props.match.params.id}
            refetch={() => data.refetch()}
          />
        </div>
      )
    })
  }

  render() {
    const {data: {gapAnalysis}} = this.props
    //const coreSubjects = get(gapAnalysis, 'coreSubjects')

    // if (!gapAnalysis) {
    //   return <div>ff</div>
    // }
    return (
      <LayoutWrapper>
        <PageHeader><span>{get(gapAnalysis, 'project.title')}
        UN Global Compact Annual Review</span> </PageHeader>
        <Row style={rowStyle} justify="space-between" gutter={gutter}>
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <Box>
              <Tabs defaultActiveKey="organizationalGovernance" >
                {values(annualReviewQuestionsTitle).map(item => {
                  return (<TabPane tab={item.label} key={item.key}>
                    {this.renderSubtitle(item.key, item)}
                  </TabPane>)
                })}

              </Tabs>
            </Box>
          </Col>
        </Row>
      </LayoutWrapper>
    )
  }
}

const GapEditQL = graphql(fetchGapAnalysisQuery, {
  options: (props) => {return {variables: {id: props.match.params.id}}},
})(GapEdit)
export default connect(null, {breadcrumbUpdate})(GapEditQL)
