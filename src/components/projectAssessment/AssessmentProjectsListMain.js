import React, {Component} from 'react'
import {connect} from 'react-redux'
import {breadcrumbUpdate} from '../../actions'
import {injectIntl} from 'react-intl'
import {projectsMessages} from '../../messages'
import Box from '../utility/box'
import PageHeader from '../utility/pageHeader'
import FirstAssessmentProjectsList from './FirstAssessmentProjectsList'
import FirstAssessmentCompletedProjectsList from './FirstAssessmentCompletedProjectsList'
import SecondAssessmentProjectsList from './SecondAssessmentProjectsList'
import CompletedProjectsList from './CompletedProjectsList'
import LayoutWrapper from '../utility/layoutWrapper'


class AssessmentProjectsListMain extends Component {
  componentDidMount() {
    const {breadcrumbUpdate, intl: {formatMessage}} = this.props
    const breadcrumb = [{name: 'Home', link: '/'},
      {name: formatMessage(projectsMessages.titleProjectAssessmentList)},
    ]
    breadcrumbUpdate(breadcrumb)
  }

  render() {
    const {intl: {formatMessage}} = this.props
    // if (userRole !== 'Admin') {
    //   return null
    // }

    return (
      <LayoutWrapper>
        <PageHeader>{formatMessage(projectsMessages.titleProjectAssessmentList)}</PageHeader>
        <Box >
          <FirstAssessmentProjectsList />
        </Box>
        <Box style={{marginTop: 25}}>
          <SecondAssessmentProjectsList />
        </Box>
        <Box style={{marginTop: 25}}>
          <FirstAssessmentCompletedProjectsList />
        </Box>
        <Box style={{marginTop: 25}}>
          <CompletedProjectsList />
        </Box>
      </LayoutWrapper>
    )
  }
}

function mapStateToProps({auth}) {
  return {
    userRole: auth.currentUser ? auth.currentUser.role.split('|') : [],
  }
}

export default connect(mapStateToProps, {breadcrumbUpdate})(injectIntl(AssessmentProjectsListMain))

