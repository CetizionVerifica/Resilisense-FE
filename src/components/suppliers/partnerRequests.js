import React, {Component} from 'react'
import {Row, Col, Button, message} from 'antd'
import {withRouter} from 'react-router-dom'
import {graphql, compose} from 'react-apollo'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl'
import clone from 'clone'
import {acceptPartnerMutation, rejectPartnerMutation} from '../../graphql/companyMutation'
import fetchPartnersQuery from '../../graphql/fetchPartnersQuery'
import {fetchProjectsByYear} from '../../graphql/fetchProjects'
import fetchPartnerRequestsQuery from '../../graphql/fetchPartnerRequests'
import fetchSuppliersQuery from '../../graphql/fetchSuppliersQuery'
import TableWrapper from '../styles/table.style'
import {DeleteCell} from '../../common/helperCells'
import {openModal} from '../modals/modalActions'
import {sortPartnerColumns} from './suppliersRankingConfig'

class PartnerRequests extends Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: this.createColumns(clone(sortPartnerColumns)),
      visible: false,
    }
  }


  createColumns(columns) {
    const activeColumn = [
      {
        title: '',
        dataIndex: '',
        width: 200,
        render: (text, record, index) => {

          const {id, partnerCompanyId, partnerId, requestedYear, projectId, projectAgency} = record

          return (
            <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
              <Button
                type="primary"
                className="acceptPartnerButton"
                onClick={() => {
                  const acceptDisclaimer = () => this.acceptRequest(id, requestedYear, partnerCompanyId, partnerId, projectId, projectAgency)
                  this.props.openModal('SupplierRequestDisclaimerModal', {acceptDisclaimer})
                }}
              >
        Accept Request
              </Button>
              <div style={{marginTop: 6}}>
                <DeleteCell
                  index={id}
                  onDeleteCell={() => this.rejectPartner(id, projectId, partnerId)}
                />
              </div>
            </div>)
        },
      }]
    columns.push(...activeColumn)
    return columns
  }

  refetchData = () => {
    const {fetchPartnersQuery, fetchPartnerRequestsQuery, fetchSuppliersQuery} = this.props

    fetchPartnersQuery.refetch()
    fetchPartnerRequestsQuery.refetch()
    fetchSuppliersQuery.refetch()
  }

  acceptRequest = (agencyId, year, partnerCompanyId, partnerId, projectId, projectAgency) => {
    const {fetchProjectsByYear} = this.props

    this.setState({loading: true, agencyId, year, companyId: partnerCompanyId, partnerId})

    fetchProjectsByYear.refetch({
      year,
    }).then(({data}) => {

      if (!data.projectsByYear || data.projectsByYear.length === 0) {
        message.warning('No project found for this year. Please add a project to accept the request')
        this.setState({loading: false})
      } else if (data.projectsByYear.length === 1) {
        // accept the request
        const project = data.projectsByYear[0]

        this.acceptPartner(projectId, project.id, project.company.id, projectAgency)

      } else {
        // Show modal to chose project
        this.setState({
          loading: false,
          visible: true,
          requestProjects: data.projectsByYear,
        })
      }

    })
  }

  rejectPartner = (agencyId, projectId, partnerId) => {
    const {rejectPartnerMutation} = this.props

    this.setState({loading: true})

    rejectPartnerMutation({
      variables: {
        id: agencyId,
        partnerId,
        projectId,
      },
    }).then(({data}) => {
      this.refetchData()
      message.success('Processing complete!')
      this.setState({loading: false})
    })
  }

  acceptPartner = (projectId, partnerProjectId, companyId, partnerAgencyId) => {
    const {acceptPartnerMutation} = this.props
    const {agencyId, partnerId} = this.state

    acceptPartnerMutation({
      variables: {
        id: agencyId,
        partnerId,
        projectId,
        partnerProjectId,
        partnerAgencyId,
        companyId,
      },
    }).then(({data}) => {
      this.refetchData()
      message.success('Processing complete!')
      this.setState({loading: false})
    })
  }

  renderSupplierRequestsTable = (supplierRequests) => {
    const {columns} = this.state
    const {fetchPartnersQuery: {loading}} = this.props

    return (
      <Row style={{marginBottom: 20}}>
        <Col>
          <div>Supplier requests</div>
          <TableWrapper
            size="small"
            columns={columns}
            dataSource={supplierRequests}
            rowKey="projectId"
            loading={loading}
            className="sortingTable"
            pagination={false}
          />
        </Col>
      </Row>
    )
  }

  getRequestedSuppliers = (agencyId, partner) => {

    const dataSource = partner.partnerRequestedProjects || []

    return dataSource.map(project => ({
      id: agencyId,
      agencyName: partner.partnerCompany.agency.name,
      partnerId: partner.id,
      partnerCompanyId: partner.partnerCompany.id,
      partnerCompanyName: partner.partnerCompany.name,
      requestedYear: project.year,
      project: project.title,
      projectStatus: '-',
      projectId: project.id,
      projectAgency: project.agency.id,
      showProjectResults: false,
    }))
  }

  renderRequests = agency => {

    if (!agency || !agency.partners || agency.partners.length === 0) {
      return null
    }

    const requestedPartners = []

    agency.partners.forEach(partner => {
      requestedPartners.push(...this.getRequestedSuppliers(agency.id, partner))
    })

    if (requestedPartners.length === 0) {
      return null
    }

    return this.renderSupplierRequestsTable(requestedPartners)
  }

  render() {

    const {fetchPartnersQuery} = this.props

    if (!fetchPartnersQuery || fetchPartnersQuery.loading) {
      return null
    }

    return this.renderRequests(fetchPartnersQuery.partners)
  }
}

function mapStateToProps({company, auth}) {
  const {sort, order, search, query} = company
  const {currentUser} = auth
  const currentAgency = currentUser ? currentUser.currentAgency : ''

  return {sortFild: sort, order, search, query, currentAgency}
}

const PartnerRequestsQL = compose(
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
  graphql(fetchSuppliersQuery, {
    name: 'fetchSuppliersQuery',
    options: ({currentAgency}) => {
      return {
        variables: {
          id: currentAgency,
        },
        fetchPolicy: 'network-only',
      }
    },
  }),
  graphql(fetchPartnerRequestsQuery, {
    name: 'fetchPartnerRequestsQuery',
  }),
  graphql(fetchProjectsByYear, {
    name: 'fetchProjectsByYear', 
  }),
  graphql(acceptPartnerMutation, {
    name: 'acceptPartnerMutation',
  }),
  graphql(rejectPartnerMutation, {
    name: 'rejectPartnerMutation',
  }),
)(withRouter(PartnerRequests))

export default connect(mapStateToProps, {openModal})(injectIntl(PartnerRequestsQL))
