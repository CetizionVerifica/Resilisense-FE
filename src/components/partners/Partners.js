import React, {Component} from 'react'
import {Row, Col, Button, Switch, message} from 'antd'
import clone from 'clone'
import {some} from 'lodash'
import {withRouter} from 'react-router-dom'
import {graphql, compose} from 'react-apollo'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl'
import styled from 'styled-components'
import PageHeader from '../utility/pageHeader'
import LayoutWrapper from '../utility/layoutWrapper'
import basicStyle from '../../common/basicStyle'
import {companySorting, companySearch, breadcrumbUpdate} from '../../actions'
import fetchPartnersQuery from '../../graphql/fetchPartnersQuery'
import {fetchProjectsByYear} from '../../graphql/fetchProjects'
import fetchSupplierRequestsQuery from '../../graphql/fetchSupplierRequests'
import {
  acceptSupplierMutation,
  rejectSupplierMutation,
  removePartnerMutation,
} from '../../graphql/companyMutation'
import {changeSupplierFullAccess} from '../../graphql/projectMutation'
import {showSupplierResultsMutation} from '../../graphql/agencyMutation'
import {DeleteCell} from '../../common/helperCells'
import Box from '../utility/box'
import TableWrapper from '../styles/table.style'
import {sortColumns} from './partnerConfig'
import PartnerWrapper from './partner.style'
import PartnerRequestForm from './partnerRequestForm'
import PartnerForm from './partnerForm/partnerForm'
import {openModal} from '../modals/modalActions'
import axios from 'axios';

const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  margin: 0px 0 30px;
`

class PartnerList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: this.createColumns(clone(sortColumns)),
      search: '',
      visible: false,
      addPartnerVisible: false,
      current: 0,
      agencyId: '',
      year: 0,
      companyId: '',
      partnerId: '',
    }
  }

  componentDidMount() {
    const {breadcrumbUpdate} = this.props

    const breadcrumb = [{name: 'Home', link: '/'},
      {name: 'Clients management'},
    ]
    breadcrumbUpdate(breadcrumb)
  }

  createColumns(columns) {
    const activeColumn = [
      {
        title: 'Access to results',
        dataIndex: '',
        width: 200,
        render: (text, record, index) => {

          const {id, partnerCompanyId, projectId, partnerId} = record

          if (!record.projectId || record.projectStatus !== 'Completed') {
            return (
              null
            )
          }

          return (
            <Switch
              defaultChecked={record.showProjectResults}
              onChange={(checked) => this.getAccessToResults(id, partnerCompanyId, projectId, partnerId, checked)}
            />
          )
        },
      },
      {
        title: '',
        dataIndex: '',
        width: 200,
        render: (text, record, index) => {

          const {id, partnerCompanyId, partnerCompanyName, partnerId, projectId, requestedYear} = record

          if (record.projectId) {
            return (
              <DeleteCell
                index={record.projectId}
                onDeleteCell={() => this.onDeleteCell(id, partnerCompanyId, partnerId, projectId)}
              />
            )
          }

          return (
            <div>
              <Button
                type="primary"
                className="acceptPartnerButton"
                onClick={() => {
                  const acceptDisclaimer = async () => await this.acceptRequest(id, requestedYear, partnerCompanyId, partnerId)
                  this.props.openModal('PartnerDisclaimerModal', {acceptDisclaimer, companyName: partnerCompanyName})
                }}
              >
        Accept Request
              </Button>
              <DeleteCell
                index={record.projectId}
                onDeleteCell={() => this.rejectRequest(id, requestedYear, partnerId)}
              />
            </div>)
        },
      }]
    columns.push(...activeColumn)
    return columns
  }

  refetchData = () => {
    const {fetchPartnersQuery, fetchSupplierRequestsQuery} = this.props

    fetchPartnersQuery.refetch()
    fetchSupplierRequestsQuery.refetch()
  }

  rejectRequest = (agencyId, year, partnerId) => {
    const {rejectSupplierMutation} = this.props

    this.setState({loading: true})

    rejectSupplierMutation({
      variables: {
        id: agencyId,
        partnerId,
        year,
      },
    }).then(({data}) => {
      this.refetchData()
      message.success('Processing complete!')
      this.setState({loading: false})
    })
  }

  acceptSupplier = projectId => {
    const {acceptSupplierMutation} = this.props
    const {agencyId, year, companyId, partnerId} = this.state

    acceptSupplierMutation({
      variables: {
        id: agencyId,
        partnerId,
        projectId,
        companyId,
        year,
      },
    }).then(({data}) => {
      this.refetchData()
      message.success('Processing complete!')
      this.setState({loading: false})
    })
  }

  getAccessToResults = (agencyId, companyId, projectId, partnerId, show) => {
    const {changeSupplierFullAccess, showSupplierResultsMutation} = this.props

    changeSupplierFullAccess({
      variables: {
        id: projectId,
        company: companyId,
        agency: agencyId,
        fullAccessToResults: show,
      },
    }).then(({data}) => {

      showSupplierResultsMutation({
        variables: {
          id: agencyId,
          partnerId,
          projectId,
          show,
        },
      }).then(() => {
        message.success('Processing complete!')
        this.setState({loading: false})
      })
    })
  }

  acceptRequest = async (agencyId, year, partnerCompanyId, partnerId) => { 
    this.setState({loading: true, agencyId, year, companyId: partnerCompanyId, partnerId})
    try {     
      const {data} = await axios.get(`/api/projects/${year}`, {
        headers: { authorization: localStorage.getItem('token') }, // eslint-disable-line
      });
      
      const projectsByYear = data.data;
      // console.log("DATA:", data.data);
      if (!projectsByYear || projectsByYear.length === 0) {
        message.warning(`No project found for this year. Please add a project to accept the request ${year}`)
        this.setState({loading: false})
      } else if (projectsByYear.length === 1) {
        // accept the request
        const project = projectsByYear[0];
        console.log("ProjectL", project._id);
        this.acceptSupplier(project._id)
      } else {
        // Show modal to chose project
        this.setState({
          loading: false,
          visible: true,
          requestProjects: data.projectsByYear,
        })
      }      
    } catch (error) {
      message.error(`Something goes wrong`);
      console.log("error:", error.message);
    }
  }

  showModal = () => {
    this.setState({
      visible: true,
    })
  }

  hideModal = () => {
    this.setState({
      visible: false,
    })
  }

  showAddPartnerModal = () => {
    this.setState({
      addPartnerVisible: true,
    })
  }

  hideAddPartnerModal = () => {
    this.setState({
      addPartnerVisible: false,
    })
  }

  onChange = (pagination, filters, sorter) => {
    if (sorter && sorter.columnKey && sorter.order) {
      if (sorter.order === 'ascend') {
        this.props.companySorting(sorter.columnKey, 'asc')
      } else {
        this.props.companySorting(sorter.columnKey, 'desc')
      }
    }
  }


  onDeleteCell = (agencyId, partnerCompanyId, partnerId, projectId) => {
    const {fetchPartnersQuery, removePartnerMutation} = this.props

    this.setState({loading: true})

    removePartnerMutation({
      variables: {
        id: agencyId,
        partnerId,
        projectId,
        companyId: partnerCompanyId,
      },
    }).then(({data}) => {
      fetchPartnersQuery.refetch()
      message.success('Partner removed!')
      this.setState({loading: false})
    })
  }

  acceptProjectFromList = projectId => {
    this.acceptSupplier(projectId)
    this.hideModal()
  }

  getRequestedPartners = (agencyId, partner) => {

    const dataSource = partner.requestedYears || []

    return dataSource.map(year => ({
      id: agencyId,
      agencyName: partner.partnerCompany.agency.name,
      partnerId: partner.id,
      partnerCompanyId: partner.partnerCompany.id,
      partnerCompanyName: partner.partnerCompany.name,
      requestedYear: year,
      project: '-',
      projectStatus: '-',
      showProjectResults: false,
    }))
  }

  getPartners = (agencyId, partner) => {

    const dataSource = partner.projects || []

    return dataSource.map(project => ({
      id: agencyId,
      agencyName: partner.partnerCompany.agency.name,
      partnerId: partner.id,
      partnerCompanyId: partner.partnerCompany.id,
      partnerCompanyName: partner.partnerCompany.name,
      requestedYear: project.year,
      project: project.title,
      projectId: project.id,
      projectStatus: project.status,
      showProjectResults: some(partner.showProjectResults, {id: project.id}),
    }))
  }

  renderTablePartners = (partners) => {
    const {columns} = this.state
    const {fetchPartnersQuery: {loading}, intl: {formatMessage}} = this.props

    return (
      <TableWrapper
        size="small"
        columns={columns}
        onChange={this.onChange}
        dataSource={partners}
        rowKey="projectId"
        loading={loading}
        className="sortingTable"
      />
    )
  }

  renderPartners = agency => {
 
    if (!agency || !agency.partners || agency.partners.length === 0) {
      return (
        <div style={{textAlign: 'center'}}>
          <span>There are no clients</span>
        </div>
      )
    }

    const requestedPartners = []
    const acceptedPartners = []

    agency.partners.forEach(partner => {
      requestedPartners.push(...this.getRequestedPartners(agency.id, partner))
      acceptedPartners.push(...this.getPartners(agency.id, partner))
    })

    const partners = requestedPartners.concat(acceptedPartners)
    return this.renderTablePartners(partners)
  }

  render() {
    const {rowStyle, colStyle, gutter} = basicStyle
    const {fetchPartnersQuery} = this.props

    if (!fetchPartnersQuery || fetchPartnersQuery.loading) {
      return null
    }

    return (
      <LayoutWrapper>
        <PageHeader><span>Clients management</span> </PageHeader>
        <Row style={rowStyle} justify="space-between" gutter={gutter}>
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <PartnerWrapper>
              <Box>
              {/*  <ButtonWrapper className="isoButtonWrapper">
                  <Button type="primary" className="" onClick={this.showAddPartnerModal}>
              Add Client
                  </Button>
                </ButtonWrapper>*/}
                {this.renderPartners(fetchPartnersQuery.partners)}
              </Box>
              <PartnerForm
                visible={this.state.addPartnerVisible}
                hideModal={this.hideAddPartnerModal}
              />
              <PartnerRequestForm
                visible={this.state.visible}
                hideModal={this.hideModal}
                acceptSupplier={this.acceptProjectFromList}
                projects={this.state.requestProjects}
              />
            </PartnerWrapper>
          </Col>
        </Row>
      </LayoutWrapper>
    )
  }
}

function mapStateToProps({company, auth}) {
  const {sort, order, search, query} = company
  const {currentUser} = auth
  const currentAgency = currentUser ? currentUser.currentAgency : ''

  return {sortFild: sort, order, search, query, currentAgency}
}

const CompaniesListQL = compose(
  graphql(fetchPartnersQuery, {
    name: 'fetchPartnersQuery',
    skip: ({currentAgency}) => !currentAgency,
    options: (props) => {
      return {
        variables: {
          id: props.currentAgency,
        },
        fetchPolicy: 'network-only',
      }
    },
  }),

  graphql(fetchProjectsByYear, {
    name: 'fetchProjectsByYear',
    // options: (props) => {
    //   console.log("REsult vae:", props)
    //   return {
    //     variables: {
    //       year: props.year,
    //     },
    //     fetchPolicy: 'network-only',
    //   }
    // },    
  }),
  graphql(fetchSupplierRequestsQuery, {
    name: 'fetchSupplierRequestsQuery',
  }),
  graphql(acceptSupplierMutation, {
    name: 'acceptSupplierMutation',
  }),
  graphql(rejectSupplierMutation, {
    name: 'rejectSupplierMutation',
  }),
  graphql(removePartnerMutation, {
    name: 'removePartnerMutation',
  }),
  graphql(changeSupplierFullAccess, {
    name: 'changeSupplierFullAccess',
  }),
  graphql(showSupplierResultsMutation, {
    name: 'showSupplierResultsMutation',
  }),
)(withRouter(PartnerList))


export default connect(mapStateToProps, {
  companySorting, companySearch, breadcrumbUpdate, openModal})(injectIntl(CompaniesListQL))

