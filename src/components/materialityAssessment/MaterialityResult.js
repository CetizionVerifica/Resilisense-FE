import React, {Component} from 'react'
import {graphql} from 'react-apollo'
import {get} from 'lodash'
import {connect} from 'react-redux'
import {Row, Col, Tabs} from 'antd'
import {breadcrumbUpdate} from '../../actions'
import fetchMateriality from '../../graphql/fetchMateriality'
import basicStyle from '../../common/basicStyle'
import PageHeader from '../utility/pageHeader'
import LayoutWrapper from '../utility/layoutWrapper'
import Box from '../utility/box'

import MatrixCoreSubjects from './report/MatrixCoreSubjects'
import MatrixIssueOfInterest from './report/MatrixIssueOfInterest'

const TabPane = Tabs.TabPane
class MaterialityResult extends Component {
  componentWillUpdate(nextprops) {
    const {data: {materiality}, breadcrumbUpdate} = nextprops
    if (materiality) {
      const breadcrumb = [{name: 'Home', link: '/'},
        {
          name: get(materiality.project, 'company.name'),
          link: `/company/${get(materiality.project, 'company.id')}`,
        },
        {
          name: get(materiality.project, 'title'),
          link: `/project/${get(materiality.project, 'id')}`,
        },
        {name: 'Materiality Results'},
      ]
      breadcrumbUpdate(breadcrumb)
    }
  }
  shouldComponentUpdate(nextProps) {
    return !(nextProps.data.materiality === this.props.data.materiality)
  }

  render() {

    const {rowStyle, colStyle, gutter} = basicStyle
    const {data: {materiality}} = this.props
    if (!materiality) {
      return <div />
    }
    return (
      <LayoutWrapper>
        <PageHeader><span>Materiality Assessment Results</span> </PageHeader>
        <Row style={rowStyle} justify="space-between" gutter={gutter}>
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <Box>
              <Tabs animated={false} defaultActiveKey="1" >
                <TabPane tab="Materiality Matrix - Core Subjects" key="1">
                  <MatrixCoreSubjects materiality={materiality} />
                </TabPane>
                <TabPane tab="Materiality Matrix - Issues of Interest" key="2">
                  <MatrixIssueOfInterest materiality={materiality} />
                </TabPane>
              </Tabs>
            </Box>
          </Col>
        </Row>
      </LayoutWrapper>
    )
  }
}

const MaterialityResultQL = graphql(fetchMateriality, {
  options: (props) => {
    return {
      variables: {id: props.match.params.id},
      fetchPolicy: 'network-only',
    }
  },
})(MaterialityResult)

export default connect(null, {breadcrumbUpdate})(MaterialityResultQL)
