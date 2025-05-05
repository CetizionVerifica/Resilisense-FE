import React, {Component} from 'react'
import {message, Button} from 'antd'
import {withRouter} from 'react-router-dom'
import {graphql, compose} from 'react-apollo'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl'
import {companySorting, companySearch, breadcrumbUpdate} from '../../../actions'
import Box from '../../utility/box'
import fetchSuppliersQuery from '../../../graphql/fetchSuppliersQuery'
import {removeSupplierMutation} from '../../../graphql/companyMutation'
import {changeSupplierPhysicalAudit} from '../../../graphql/projectMutation'
import {rankSupplier, filterSuppliers, getSuppliers, filterConformingProjects} from './_helper'
import PageHeader from '../../utility/pageHeader'
import LayoutWrapper from '../../utility/layoutWrapper'
import RankingFilters from './RankingFilters'
import Ranking from './Ranking'
import RankingAnalytics from './RankingAnalytics'
import PartnerRequests from './partnerRequests'

class SuppliersRanking extends Component {
  constructor(props) {
    super(props)
    this.state = {
      search: '',
      current: 0,
      selectCountry: '',
      selectedRegion: '',
      selectYear: '',
      selectIndustry: '',
      selectCoreSubject: '',
      selectIssueOfInterest: [],
      scoreFilter: 'overall',
      scorePercentMax: 100,
      scorePercentMin: 0,
      impact: '',
    }
  }

  componentDidMount() {
    const {breadcrumbUpdate} = this.props

    const breadcrumb = [{name: 'Home', link: '/'},
      {name: 'Ranking'},
    ]
    breadcrumbUpdate(breadcrumb)
  }

  onSupplierPhysicalAudit = (projectId, supplierId, physicalAudit) => {
    const {changeSupplierPhysicalAudit} = this.props

    this.setState({loading: true})

    changeSupplierPhysicalAudit({
      variables: {
        id: projectId,
        supplier: supplierId,
        physicalAudit,
      },
    }).then(({data}) => {
      message.success('Supplier marked!')
      this.setState({loading: false})
    })
  }

  handleYearChange= (value) => {
    this.setState({selectYear: value})
  }

  handleIndustryChange= (value) => {
    this.setState({selectIndustry: value[1]})
  }

  handleCountryChange= (value) => {
    this.setState({selectCountry: value})
  }

  handleRegionChange= (value) => {
    this.setState({selectedRegion: value, selectCountry: ''})
  }

  handleCoreSubject= (value) => {
    this.setState({selectCoreSubject: value})
  }

  handleIssueOfInterest= (value) => {
    this.setState({selectIssueOfInterest: value})
  }

  handleImpact= (value) => {
    this.setState({impact: value})
  }

  handleOverallPercent= (value) => {
    this.setState({
      scoreFilter: 'overall',
      scorePercentMin: value[0],
      scorePercentMax: value[1],
    })
  }

  handleIssueOfInterestPercent= (value) => {
    this.setState({
      scoreFilter: 'issueOfInterest',
      scorePercentMin: value[0],
      scorePercentMax: value[1],
    })
  }

  handleCoreSubjectPercent= (value) => {
    this.setState({
      scoreFilter: 'coreSubject',
      scorePercentMin: value[0],
      scorePercentMax: value[1],
    })
  }

  onGetSuppliersReport = () => {
    const coreSubject = this.state.scoreFilter === 'coreSubject' && this.state.selectCoreSubject ? this.state.selectCoreSubject : ''
    const issueOfInterest = this.state.scoreFilter === 'issueOfInterest' && this.state.selectIssueOfInterest ? this.state.selectIssueOfInterest[1] : ''
    const scorePercentMin = `${this.state.scorePercentMin}`

    const params = []

    if (this.state.selectCountry) {
      params.push(`country=${this.state.selectCountry}`)
    }

    if (this.state.selectedRegion) {
      params.push(`region=${this.state.selectedRegion}`)
    }

    if (this.state.selectYear) {
      params.push(`year=${this.state.selectYear}`)
    }

    if (this.state.selectIndustry) {
      params.push(`industry=${this.state.selectIndustry}`)
    }

    if (this.state.impact) {
      params.push(`impact=${this.state.impact}`)
    }

    if (coreSubject) {
      params.push(`coreSubject=${coreSubject}`)
    }

    if (issueOfInterest) {
      params.push(`issueOfInterest=${issueOfInterest}`)
    }

    if (this.state.scoreFilter) {
      params.push(`scoreFilter=${this.state.scoreFilter}`)
    }

    if (scorePercentMin) {
      params.push(`scorePercentMin=${scorePercentMin}`)
    }

    if (this.state.scorePercentMax) {
      params.push(`scorePercentMax=${this.state.scorePercentMax}`)
    }

    this.props.history.push(`/suppliers-report?${params.join('&')}`)
  }

  renderRanking = supplierCompanies => {

    if (!supplierCompanies) {
      return null
    }

    const {intl: {formatMessage}} = this.props
    const {selectCountry, selectYear, selectIndustry, impact, selectedRegion} = this.state
    const totalSuppliers = []
    let suppliers = []

    supplierCompanies.forEach(company => {
      const companySuppliers = getSuppliers(company.id, company.suppliers, formatMessage, true)
      suppliers.push(...companySuppliers)
      totalSuppliers.push(...companySuppliers)
    })

    suppliers = rankSupplier(suppliers)
    suppliers = filterSuppliers(suppliers, selectCountry, selectYear, selectIndustry, impact, selectedRegion)
    
    const conformingSuppliers = filterConformingProjects({
      suppliers: [...suppliers],
      coreSubject: this.state.selectCoreSubject,
      issueOfInterest: this.state.selectIssueOfInterest,
      scoreFilter: this.state.scoreFilter,
      scorePercentMin: this.state.scorePercentMin,
      scorePercentMax: this.state.scorePercentMax})

    const hasCoreSubject = !!this.state.selectCoreSubject
    const hasIssueOfInterest = this.state.selectIssueOfInterest.length > 0

    const hasFilters = selectCountry ||
                      selectedRegion ||
                      selectYear ||
                      selectIndustry ||
                      impact ||
                      hasCoreSubject ||
                      hasIssueOfInterest

    return (
      <div style={{position: 'relative'}}>
        <Button onClick={this.onGetSuppliersReport} style={{position: 'absolute', top: 5, right: 5}} >Report</Button>
        <RankingFilters
          handleCountryChange={this.handleCountryChange}
          handleRegionChange={this.handleRegionChange}
          handleYearChange={this.handleYearChange}
          handleIndustryChange={this.handleIndustryChange}
          handleImpact={this.handleImpact}
          handleCoreSubject={this.handleCoreSubject}
          handleIssueOfInterest={this.handleIssueOfInterest}
          handleCoreSubjectPercent={this.handleCoreSubjectPercent}
          handleIssueOfInterestPercent={this.handleIssueOfInterestPercent}
          handleOverallPercent={this.handleOverallPercent}
        />
        <Ranking
          suppliers={suppliers}
          coreSubject={this.state.selectCoreSubject}
          issueOfInterest={this.state.selectIssueOfInterest}
          onSupplierPhysicalAudit={this.onSupplierPhysicalAudit}
          scoreFilter={this.state.scoreFilter}
          scorePercentMin={this.state.scorePercentMin}
          scorePercentMax={this.state.scorePercentMax}
        />
        {hasFilters &&
          <RankingAnalytics
            totalSuppliers={totalSuppliers}
            selectedSuppliers={conformingSuppliers}
          />}
      </div>
    )
  }

  render() {
    const {fetchSuppliersQuery: {loading, suppliers}} = this.props

    if (loading) {
      return null
    }

    return (
      <LayoutWrapper>
        <PageHeader>Ranking </PageHeader>
        <Box >
          <PartnerRequests />
          {this.renderRanking(suppliers)}
        </Box>
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
)(withRouter(SuppliersRanking))

export default connect(mapStateToProps, {
  companySorting, companySearch, breadcrumbUpdate})(injectIntl(CompaniesListQL))
