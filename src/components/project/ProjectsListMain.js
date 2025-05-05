import React, {Component} from 'react'
import {connect} from 'react-redux'
import {breadcrumbUpdate} from '../../actions'
import {injectIntl} from 'react-intl'
import {projectsMessages} from '../../messages'
import Box from '../utility/box'
import PageHeader from '../utility/pageHeader'
import ProjectsList from './ProjectsList'
import LayoutWrapper from '../utility/layoutWrapper'


class ProjectsListMain extends Component {
  componentDidMount() {
    const {breadcrumbUpdate, intl: {formatMessage}} = this.props
    const breadcrumb = [{name: 'Home', link: '/'},
      {name: formatMessage(projectsMessages.titleProjectsList)},
    ]
    breadcrumbUpdate(breadcrumb)
  }
  render() {
    const {intl: {formatMessage}} = this.props

    return (
      <LayoutWrapper>
        <PageHeader>{formatMessage(projectsMessages.titleProjectsList)}</PageHeader>
        <Box >
          <ProjectsList />
        </Box>
      </LayoutWrapper>
    )
  }
}

export default connect(null, {breadcrumbUpdate})(injectIntl(ProjectsListMain))

