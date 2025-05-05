import React, {Component} from 'react'
import {Row, Col, Button, Icon, message} from 'antd'
import {orderBy} from 'lodash'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl'
import {graphql, compose} from 'react-apollo'
import {withRouter} from 'react-router-dom'
import styled from 'styled-components'
import {fetchSurveys} from '../../graphql/fetchSurveysQuery'
import {flagSurvey} from '../../graphql/surveyMutation'
import {refreshSurveys} from '../../actions/SurveyActions'
import basicStyle from '../../common/basicStyle'
import PageHeader from '../utility/pageHeader'
import Box from '../utility/box'
import {openModal} from '../modals/modalActions'
import {breadcrumbUpdate} from '../../actions'
import LayoutWrapper from '../utility/layoutWrapper'
import TableWrapper from '../styles/table.style'
import {createSurveyManagementColumns} from './SurveysListConfig'

const ActionsWrapper = styled.div`
  width: 170px;
  display: flex;
  justify-content: space-between;
  margin-left: auto;
  margin-bottom: 15px;
`

class SurveysList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: createSurveyManagementColumns(this.showSurveyPreview, this.onFlagSurvey),
      refreshSurveys: false,
    }
  }

  componentDidMount() {
    const {breadcrumbUpdate} = this.props
    const breadcrumb = [{name: 'Home', link: '/'},
      {name: 'Surveys', link: '/surveys-management'},
    ]
    breadcrumbUpdate(breadcrumb)
  }

  onFlagSurvey = (id, flag) => {
    this.props.mutate({
      variables: {
        id,
        flag,
      },
    }).then(() => {
      message.success('Survey change completed!')
      this.props.data.refetch()
    })
  }

  refreshSurveys = () => {
    this.setState({refreshSurveys: true})
    refreshSurveys().then(() => {
      this.props.data.refetch()
    }, () => {
      message.error('There was an error on refreshing the surveys')
    }).finally(() => {
      this.setState({refreshSurveys: false})
    })
  }

  showSurveyPreview = (previewLink) => {
    this.props.openModal('SurveyPreviewModal', {previewLink})
  }

  render() {
    const {rowStyle} = basicStyle
    const {data: {loading, surveys}} = this.props

    return (
      <LayoutWrapper>
        <PageHeader>Surveys</PageHeader>
        <Box >
          <Row style={rowStyle}>
            <Col md={24} sm={24} xs={24}>
              <ActionsWrapper>
                <Button
                  type="primary"
                  style={{width: 50, height: 30}}
                  title="Refresh surveys"
                  onClick={this.refreshSurveys}
                  disabled={this.state.refreshSurveys}
                >
                  <Icon type="reload" spin={this.state.refreshSurveys} />
                </Button>
                <Button
                  type="primary"
                  style={{width: 110, height: 30}}
                  href="https://www.surveymonkey.com/create"
                  title="Create a new survey"
                >
            Create
                </Button>
              </ActionsWrapper>
              <TableWrapper
                size="small"
                columns={this.state.columns}
                dataSource={orderBy(surveys, 'title')}
                rowKey="id"
                className="sortingTable"
                loading={loading}
                pagination={surveys && surveys.length > 10}
              />
            </Col>
          </Row>
        </Box>
      </LayoutWrapper>
    )
  }
}

const SurveysListQL = compose(
  graphql(flagSurvey),
  graphql(fetchSurveys, {
    options: (props) => {
      return {
        variables: {
          sort: props.sortFild,
          order: props.order,
          search: props.search,
          s: props.query,
        },
        fetchPolicy: 'network-only',
      }
    },
  }))(withRouter(SurveysList))

export default connect(null, {breadcrumbUpdate, openModal})(injectIntl(SurveysListQL))


