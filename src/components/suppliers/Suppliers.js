import React, {Component} from 'react'
import {Row, Col, Button, Tabs, message} from 'antd'
import {get, find, filter} from 'lodash'
import {withRouter} from 'react-router-dom'
import {graphql, compose} from 'react-apollo'
import clone from 'clone'
import styled from 'styled-components'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl'
import {companySorting, companySearch, breadcrumbUpdate} from '../../actions'
import fetchSuppliersQuery from '../../graphql/fetchSuppliersQuery'
import {removeSupplierMutation} from '../../graphql/companyMutation'
import {changeSupplierPhysicalAudit} from '../../graphql/projectMutation'
import Box from '../utility/box'
import TableWrapper from '../styles/table.style'
import {projectStatuses} from '../../common/enum/projectStatuses'
import SupplierForm from './supplierForm/supplierForm'
import PartnerRequests from './partnerRequests'
import basicStyle from '../../common/basicStyle'
import PageHeader from '../utility/pageHeader'
import LayoutWrapper from '../utility/layoutWrapper'
import SupplierSummary from './SupplierSummary'
import {sortSupplierColumns, physicalOtherAuditColumns, physicalAuditColumns, externalSupplierColumns} from './suppliersRankingConfig'
import ExternalSupplierForm from './supplierForm/ExternalSupplierForm';
import axios from 'axios';
import ExternalSupplierSummary from './ExternalSupplierSummary'

const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  margin: 0px 0 30px;
`
const TabPane = Tabs.TabPane

class Suppliers extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      externalModalSuppVisible: false,
      externalModalSuppInitialData: null,
      externalSupplierColumns: clone(externalSupplierColumns(
        this.showModal)
      ),
      columns: clone(sortSupplierColumns),
      physicalOtherAuditColumns: clone(physicalOtherAuditColumns),
      physicalAuditColumns: clone(physicalAuditColumns),
      externalSuppliersData: [],
    }
  }

  componentDidMount() {
    if (this.props.currentAgency) {
      this.getExternalSuppliers(this.props.currentAgency);  
    }
    const {breadcrumbUpdate} = this.props

    const breadcrumb = [{name: 'Home', link: '/'},
      {name: 'Suppliers management'},
    ]
    breadcrumbUpdate(breadcrumb)
  }

  showModal = (external, data = null) => {
    if (external) {
      // console.log("????????????/", data);
      this.setState({
        externalModalSuppVisible: true,
        externalModalSuppInitialData: data
      })
    } else {
      this.setState({
        visible: true,
      });
    }
  }

  hideExternalModal = () => {
    this.setState({
      externalModalSuppVisible: false,
      externalModalSuppInitialData: null,
    })
  }

  hideModal = () => {
    this.setState({
      visible: false,
    });
  }

  handleOk = (id) => {
    this.setState({loading: true})
    message.success('Processing complete!')
    this.props.history.push(`/company/${id}`)
  };

  
  getExternalSuppliers = (agencyID) => {
    axios.get(`/api/supplier/external/${agencyID}`, {
      headers: {authorization: localStorage.getItem('token')},
    }).then(result => {
      this.setState({externalSuppliersData: get(result, 'data.data')})  
    }).catch(error => {
      message.error('Error! ......');
    });
  }


  onDeleteCell = (agencyId, supplierId, projectId, id) => {
    const {fetchSuppliersQuery, removeSupplierMutation} = this.props

    this.setState({loading: true})

    removeSupplierMutation({
      variables: {
        id,
        supplierId,
        projectId,
        agencyId,
      },
    }).then(({data}) => {
      fetchSuppliersQuery.refetch()
      message.success('Supplier removed!')
      this.setState({loading: false})
    })
  }

  getSuppliers = (companyId, suppliers) => {
    const dataSource = suppliers || []
    const resultSuppliers = []

    dataSource.forEach(supplier => {
      const partnerRequestedProjects = supplier.projects.map(project => {
        const supplierProperties = find(project.supplierProperties, {supplier: supplier.id})

        let overallPerformance = 0

        if (project.status === projectStatuses.firstAssessmentCompleted.value || project.status === projectStatuses.completed.value) {
          overallPerformance = get(project.gapAnalysis, 'weightedPerformance')
        }

        return {
          id: companyId,
          companyId: project.company.id,
          companyEmail: project.company.email,
          contactName: project.company.personName,
          contactPosition: project.company.jobPosition,
          contactEmail: project.company.personEmail,
          gapAnalysis: project.gapAnalysis,
          agencyName: supplier.agency.name,
          agencyId: supplier.agency.id,
          partnerCompanyName: project.company.name,
          requestedYear: project.year,
          project: project.title,
          country: project.company.country || '-',
          projectId: project.id,
          fullAccessToResults: get(supplierProperties, 'fullAccessToResults'),
          physicalAudit: get(supplierProperties, 'physicalAudit', false),
          supplierId: supplier.id,
          overallPerformanceValue: overallPerformance,
          industry: project.company.sector,
        }
      })

      resultSuppliers.push(...partnerRequestedProjects)
    })

    return resultSuppliers
  }

  renderExternalSupplierSummary = (data) => {
    return <ExternalSupplierSummary {
      ...{
        ...data,
        refetch: () => this.getExternalSuppliers(this.props.currentAgency)
      }
    } />
  }

  renderSupplierSummary = (record, totalSuppliers) => {

    const suppliers = filter(totalSuppliers, {companyId: record.companyId})

    return <SupplierSummary record={record} totalSuppliers={suppliers} />
  }

  render() {
    const {rowStyle, colStyle, gutter} = basicStyle
    const {fetchSuppliersQuery: {suppliers}} = this.props

    if (!suppliers) {
      return null
    }

    const totalSuppliers = []

    suppliers.forEach(company => {
      const companySuppliers = this.getSuppliers(company.id, company.suppliers)
      totalSuppliers.push(...companySuppliers)
    })

    const physicalAuditSuppliers = filter(totalSuppliers, supplier => supplier.physicalAudit)

    return (
      <LayoutWrapper>
        <PageHeader><span>Suppliers management</span> </PageHeader>
        <Row style={rowStyle} justify="space-between" gutter={gutter}>
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <Box >
              <PartnerRequests />

              <Row>
                <Col span={12}><ButtonWrapper className="isoButtonWrapper">
                  <Button type="primary" className="" onClick={() => this.showModal(false)}>
                  Add Linked Supplier
                  </Button>
                  <span style={{width: 10}} />
                  <Button type="primary" className="" onClick={() => this.showModal(true)}>
                  Add Other Supplier
                  </Button>                  
                </ButtonWrapper>
                </Col> 
              </Row>
              <Row>
                <Col>

                  <Tabs animated={false} defaultActiveKey="organizationalGovernance" >
                    <TabPane tab="Linked Suppliers" key="linkedSuppliers">
                      <TableWrapper
                        size="small"
                        columns={this.state.columns}
                        onChange={this.onChange}
                        dataSource={totalSuppliers}
                        expandedRowRender={record => this.renderSupplierSummary(record, totalSuppliers)}
                        rowKey="projectId"
                        pagination={false}
                        className="sortingTable"
                        title={() => (<div >
                          <span style={{color: '#888'}}>Linked Suppliers</span>
                        </div>)}
                      />
                    </TabPane>
                    {/* CSR-114 */}
                  <TabPane tab="Other Suppliers" key="otherSuppliers">
                      <TableWrapper
                        size="small"
                        columns={this.state.externalSupplierColumns}
                        onChange={this.onChange}
                        dataSource={this.state.externalSuppliersData}
                        expandedRowRender={record => this.renderExternalSupplierSummary(record)}
                        rowKey="projectId"
                        pagination={false}
                        className="sortingTable"
                        title={() => (<div >
                          <span style={{color: '#888'}}>Other Suppliers</span>
                        </div>)}
                      />
                    </TabPane>                                        
                    <TabPane tab="High Concern List" key="physicalAudit">
                      <TableWrapper
                        size="small"
                        columns={this.state.physicalAuditColumns}
                        onChange={this.onChange}
                        dataSource={physicalAuditSuppliers}
                        rowKey="projectId"
                        pagination={false}
                        className="sortingTable"
                        title={() => (<div >
                          <span style={{color: '#888'}}>High Concern Suppliers</span>
                        </div>)}
                      />
                      <div style={{height: 15}} />
                    <TableWrapper
                        size="small"
                        columns={this.state.physicalOtherAuditColumns}
                        onChange={this.onChange}
                        dataSource={this.state.externalSuppliersData.filter(data => data.isHighConcern)}
                        rowKey="projectId"
                        pagination={false}
                        className="sortingTable"
                        title={() => (<div >
                          <span style={{color: '#888'}}>High Concern - Other Suppliers</span>
                        </div>)}
                      />                      
                    </TabPane>
                  </Tabs>
                </Col>
              </Row>
              <SupplierForm
                visible={this.state.visible}
                handleOk={this.handleOk}
                hideModal={this.hideModal}
                refetch={this.props.fetchSuppliersQuery.refetch}
              />
              <ExternalSupplierForm 
                visible={this.state.externalModalSuppVisible}
                refetch={this.getExternalSuppliers}
                handleOk={this.handleOk}
                hideModal={this.hideExternalModal}
                currentAgency={this.props.currentAgency}
                initialValues={this.state.externalModalSuppInitialData}
                // refetch={this.props.fetchSuppliersQuery.refetch}
              />
            </Box>
          </Col>
        </Row>
      </LayoutWrapper>
    )
  }
}

function mapStateToProps({company, auth, app: {pendingSupplierRequests, pendingPartnerRequests}}) {
  const {sort, order, search, query} = company
  const {currentUser} = auth
  const currentAgency = currentUser ? currentUser.currentAgency : ''

  return {
    sortFild: sort,
    order,
    search,
    query,
    currentAgency,
    requests: pendingSupplierRequests,
    partnerRequests: pendingPartnerRequests,
  }
}

const SuppliersQL = compose(
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
  graphql(removeSupplierMutation, {
    name: 'removeSupplierMutation',
  }),
  graphql(changeSupplierPhysicalAudit, {
    name: 'changeSupplierPhysicalAudit',
  })
)(withRouter(Suppliers))

export default connect(mapStateToProps, {
  companySorting, companySearch, breadcrumbUpdate})(injectIntl(SuppliersQL))

