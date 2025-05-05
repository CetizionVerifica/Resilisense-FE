import React, {Component} from 'react'
import {values, filter, maxBy, minBy, orderBy} from 'lodash'
import {List, Select, Cascader} from 'antd'
import clone from 'clone'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl'
import {graphql} from 'react-apollo'
import {companyTypes, companySectorTypes} from '../../common/enum/companySectors'
import {generateYears} from '../../common/utils'
import {breadcrumbUpdate} from '../../actions'
import {fetchProjects} from '../../graphql/fetchProjects'
import PageHeader from '../utility/pageHeader'
import {sortColumns, columnsPerfornce} from './RankingListConfig'
import Box from '../utility/box'
import LayoutWrapper from '../utility/layoutWrapper'
import {getlevelOfImpact, between} from '../../common/rankingUtils'
import Industry from './Industry'

const Option = Select.Option
const yearsList = generateYears()

class RankingSystem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: clone(sortColumns),
      columnsPerfornce: columnsPerfornce,
      selectYear: '',
      selectIndustry: '',
    }
  }

  componentDidMount() {
    const {breadcrumbUpdate} = this.props

    const breadcrumb = [{name: 'Home', link: '/'},
      {name: 'Ranking'},
    ]
    breadcrumbUpdate(breadcrumb)

  }
  handleChange= (value) => {
    this.setState({selectYear: value})
  }
  handleInstutryChange= (value) => {
    this.setState({selectIndustry: value[1]})
  }
  renderIssueOfInterest(currentIndustry) {
    const {data: {projects}} = this.props
    if (currentIndustry.key !== this.state.selectIndustry) {
      return <div />
    }
    const industryProjects = filter(projects,
      {year: this.state.selectYear, company: {type: currentIndustry.key}})

    if (industryProjects.length === 0) {
      return <div />
    }
    const maxRelevance = maxBy(industryProjects, 'gapAnalysis.relevance') || 0
    const minRelevance = minBy(industryProjects, 'gapAnalysis.relevance') || 0

    const avg = getlevelOfImpact(
      maxRelevance.gapAnalysis.relevance,
      minRelevance.gapAnalysis.relevance)
    const projectsImpact = industryProjects.map(project => {
      const pro = {...project}
      if (between(project.gapAnalysis.relevance, avg[0], avg[1])) {
        pro.impact = 'Low'
      } else if (between(project.gapAnalysis.relevance, avg[1], avg[2])) {
        pro.impact = 'Medium'
      } else {
        pro.impact = 'High'
      }
      return pro
    })
    const nn = orderBy(projectsImpact, ['gapAnalysis.weightedPerformance'], ['desc'])
    return (
      <div style={{margin: 20, marginBottom: 20}} key={currentIndustry.key}>
        <Industry
          industry={currentIndustry}
          projects={nn}
          avg={avg}
        />
      </div>
    )

  }
  render() {
    const {data: {projects}} = this.props
    if (!projects) {
      return <div />
    }
    return (
      <LayoutWrapper>
        <PageHeader>Ranking </PageHeader>
        <Box >
          <List
            header={<div>
              <label>Select Year</label>
              <Select style={{width: '100%'}} onChange={this.handleChange}>
                {yearsList.map(year =>
                  (<Option
                    key={year.value}
                    value={year.value}
                  >
                    {year.value}
                  </Option>))}
              </Select>
              <label>Select Sector and Industry</label>
              <Cascader
                options={companySectorTypes}
                style={{width: '100%'}}
                onChange={this.handleInstutryChange}
                placeholder="Please select"
              />
            </div>}
            dataSource={values(companyTypes)}
            renderItem={item => this.renderIssueOfInterest(item)}
          />

        </Box>
      </LayoutWrapper>
    )
  }
}


function mapStateToProps({company}) {
  const {sort, order, search, query} = company
  return {sortFild: sort, order, search, query}
}

const RankingSystemQL =
    graphql(fetchProjects, {
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
    })(RankingSystem)


export default connect(mapStateToProps, {breadcrumbUpdate})(injectIntl(RankingSystemQL))
