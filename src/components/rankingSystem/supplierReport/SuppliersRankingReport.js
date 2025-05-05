import React, {Component} from 'react'
import {Button} from 'antd'
import {filter} from 'lodash'
import {withRouter} from 'react-router-dom'
import {graphql, compose} from 'react-apollo'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl'
import queryString from 'query-string'
import clone from 'clone'
import styled from 'styled-components'
import * as jsPDF from 'jspdf'
import 'jspdf-autotable'
import html2canvas from 'html2canvas'
import {breadcrumbUpdate} from '../../../actions'
import Box from '../../utility/box'
import fetchSuppliersQuery from '../../../graphql/fetchSuppliersQuery'
import {rankSupplier, filterSuppliers, getSuppliers, getConformingProjects} from '../supplierRanking/_helper'
import {sortColumns} from '../supplierRanking/suppliersRankingConfig'
import LayoutWrapper from '../../utility/layoutWrapper'
import TableWrapper from '../../styles/table.style'
import RankingCriteria from './RankingCriteria'
import RankingAnalytics from './RankingAnalytics'
import RankingGraphs from './RankingGraphs'
import { message } from 'antd';

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const ExportWrapper = styled.div`
  text-align: right;
`

class SuppliersRankingReport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: clone(sortColumns),
      margins: {
        top: 70,
        bottom: 40,
        left: 30,
        width: 550,
      },
    }
  }

  componentDidMount() {
    const {breadcrumbUpdate} = this.props

    const breadcrumb = [{name: 'Home', link: '/'},
      {name: 'Ranking', link: '/rankingsystem'},
      {name: 'Ranking Report'},
    ]
    breadcrumbUpdate(breadcrumb)
  }

  export = async() => {
    // message.loading('testtttt', 1000)
    message.loading('Please wait...');
    const pdf = new jsPDF('p', 'pt', 'a4')
    pdf.setFontSize(18)
    pdf.fromHTML(document.getElementById('report'), this.state.margins.left, this.state.margins.top, {width: this.state.margins.width}, this.state.margins)

    pdf.setFontSize(18)
    pdf.setTextColor(40)
    pdf.setFontStyle('normal')
    pdf.addPage('a4', 'p')
    pdf.text('Conforming suppliers', this.state.margins.left + 10, this.state.margins.top)
    pdf.autoTable({html: '#conforming-table > div > div > div > div > div.ant-table-content > div > table', startY: this.state.margins.top + 15})

    pdf.addPage('a4', 'p')
    pdf.text('Non Conforming suppliers', this.state.margins.left + 10, this.state.margins.top)
    pdf.autoTable({html: '#non-conforming-table > div > div > div > div > div.ant-table-content > div > table', startY: this.state.margins.top + 15})

    pdf.addPage('a4', 'l')

    html2canvas(document.getElementById('ranking-graphs')).then((canvas) => {
      let imgData = canvas.toDataURL('image/png', 1.0)
      pdf.addImage(imgData, 'PNG', 30, 15, 780, 420)
      this.footerFormatting(pdf, pdf.internal.getNumberOfPages())
      pdf.save('report.pdf')
      message.destroy('Please wait...');
    })
  }

  footerFormatting = (doc, totalPages) => {
    for (let i = totalPages; i >= 1; i--) {
      doc.setPage(i)

      this.footer(doc, i, totalPages)
      doc.page++
    }
  }

  footer = (doc, pageNumber, totalPages) => {

    let str = 'Page ' + pageNumber + ' of ' + totalPages

    doc.setFontSize(10)
    doc.text(str, this.state.margins.left, doc.internal.pageSize.height - 20)
  }

  render() {
    const {fetchSuppliersQuery: {loading, suppliers}} = this.props

    if (!suppliers || loading) {
      return null
    }

    const {
      intl: {formatMessage},
      location: {search},
    } = this.props

    const query = queryString.parse(search)
    const {
      country,
      year,
      industry,
      impact,
      coreSubject,
      issueOfInterest,
      scoreFilter,
      scorePercentMin,
      scorePercentMax,
    } = query
    const totalSuppliers = []
    let selectedSuppliers = []

    suppliers.forEach(company => {
      const companySuppliers = getSuppliers(company.id, company.suppliers, formatMessage)
      selectedSuppliers.push(...companySuppliers)
      totalSuppliers.push(...companySuppliers)
    })

    selectedSuppliers = rankSupplier(selectedSuppliers)
    selectedSuppliers = filterSuppliers(selectedSuppliers, country, year, industry, impact)

    const options = {
      suppliers: selectedSuppliers,
      coreSubject,
      issueOfInterest,
      scoreFilter,
      scorePercentMin,
      scorePercentMax,
    }

    const projects = getConformingProjects(options)

    return (
      <LayoutWrapper>
        <Box>
          <ExportWrapper>
            <Button type="primary" onClick={() => this.export()}>Export</Button>
          </ExportWrapper>
          <HeaderWrapper id="report">
            <RankingAnalytics
              totalSuppliers={totalSuppliers}
              selectedSuppliers={filter(projects, {conforming: true})}
            />
            <RankingCriteria query={query} />
          </HeaderWrapper>
          <div style={{marginTop: 30}} id="conforming-table">
            <TableWrapper
              size="small"
              columns={this.state.columns}
              dataSource={filter(projects, {conforming: true})}
              rowKey="projectId"
              pagination={false}
              className="sortingTable"
              title={() => (<div >
                <span style={{color: '#888'}}>Conforming</span>
              </div>)}
            />
          </div>
          <div style={{marginTop: 30}} id="non-conforming-table">
            <TableWrapper
              size="small"
              columns={this.state.columns}
              dataSource={filter(projects, {conforming: false})}
              rowKey="projectId"
              pagination={false}
              className="sortingTable"
              title={() => (<div >
                <span style={{color: '#888'}}>Non Conforming</span>
              </div>)}
            />
          </div>
          <div id="ranking-graphs">
            <RankingGraphs totalSuppliers={totalSuppliers} />
          </div>
        </Box>
      </LayoutWrapper>
    )
  }
}

function mapStateToProps({auth}) {
  const {currentUser} = auth
  const currentAgency = currentUser ? currentUser.currentAgency : ''

  return {currentAgency}
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
)(withRouter(SuppliersRankingReport))

export default connect(mapStateToProps, {breadcrumbUpdate})(injectIntl(CompaniesListQL))
