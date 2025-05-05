import React, {Component} from 'react'
import {Button} from 'antd'
import {find, get} from 'lodash'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl'
import {graphql, compose} from 'react-apollo'
import {withRouter} from 'react-router-dom'
import styled from 'styled-components'
import {selectedSurveys} from '../../graphql/fetchSurveysQuery'
import {fetchProjectSurveys} from '../../graphql/fetchProjectSurveys'
import {openModal} from '../modals/modalActions'
import {breadcrumbUpdate} from '../../actions'
import Box from '../utility/box'
import TableWrapper from '../styles/table.style'
import LayoutWrapper from '../utility/layoutWrapper'
import PageHeader from '../utility/pageHeader'
import {createSurveysColumns} from './SurveysListConfig'

const ActionsWrapper = styled.div`
  display: flex;
  margin-bottom: 25px;
`

class Surveys extends Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: createSurveysColumns(),
    }
  }

  componentDidMount() {
    const {breadcrumbUpdate} = this.props
    const breadcrumb = [{name: 'Home', link: '/'},
      {name: 'Surveys', link: '/surveys'},
    ]
    breadcrumbUpdate(breadcrumb)
  }

  showSurveyPreview = (type) => {
    this.props.openModal('SurveyPreviewModal', {type: type})
  }

  render() {
    const {data: {selectedSurveys}, fetchProjectSurveys} = this.props
    const projectSurveys = get(fetchProjectSurveys, 'projectSurveys', [])
    const loading = get(fetchProjectSurveys, 'loading', false)
    const internalSurvey = find(selectedSurveys, {flag: 'internal'})
    const externalSurvey = find(selectedSurveys, {flag: 'external'})

    return (
      <LayoutWrapper>
        <PageHeader>Surveys</PageHeader>
        <Box >
          <div>
            <ActionsWrapper>
              <Button
                type="primary"
                style={{width: 120, height: 30}}
                onClick={() => this.showSurveyPreview('internal')}
                title="Preview internal survey"
              >
            Internal survey
              </Button>
              <Button
                type="primary"
                style={{width: 120, height: 30, marginLeft: 10}}
                onClick={() => this.showSurveyPreview('external')}
                title="Preview external survey"
              >
            External survey
              </Button>
            </ActionsWrapper>
            <TableWrapper
              size="small"
              columns={this.state.columns}
              dataSource={projectSurveys}
              rowKey="id"
              className="sortingTable"
              loading={loading}
              pagination={projectSurveys && projectSurveys.length > 10}
            />
          </div>
        </Box>
      </LayoutWrapper>
    )
  }
}

const SurveysQL = compose(
  graphql(selectedSurveys),
  graphql(fetchProjectSurveys, {
    name: 'fetchProjectSurveys',
    options: () => {return {variables: {}}},
  })
)(withRouter(Surveys))

export default connect(null, {breadcrumbUpdate, openModal})(injectIntl(SurveysQL))
