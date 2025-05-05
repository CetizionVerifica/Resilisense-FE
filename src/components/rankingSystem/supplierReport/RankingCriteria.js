import React, {Component} from 'react'
import {injectIntl} from 'react-intl'
import {find, get} from 'lodash'
import basicStyle from '../../../common/basicStyle'
import {suppliersMessages} from '../../../messages'
import {companySectorTypes} from '../../../common/enum/companySectors'
import {regions, countries} from '../../../common/enum'
import {coreSubjectNames} from '../../../common/coreSubjectNames'
import {issueOfInterest} from '../../../common/issueOfInterest'

class RankingCriteria extends Component {

  render() {
    const {intl: {formatMessage}, query} = this.props

    const industry = get(query, 'industry', '')
    const coreSubjectFilter = get(query, 'coreSubject', '')
    const issueOfInterestFilter = get(query, 'issueOfInterest', '')
    const queryRegion = get(query, 'region', '')
    const queryCountry = get(query, 'country', '')
    const sectorIndustry = find(companySectorTypes, {value: industry})
    const coreSubject = find(coreSubjectNames, {value: coreSubjectFilter})
    const selectedIssueOfInterest = find(issueOfInterest, {value: issueOfInterestFilter})

    const region = queryRegion ? regions[queryRegion].label : ''
    const country = queryCountry ? find(countries, {value: queryCountry}) : ''

    const {greyColor} = basicStyle

    return (
      <div style={{width: 400}}>
        <h2>Supplier criteria</h2>
        {query.year && <h4> {formatMessage(suppliersMessages.year)} <span style={greyColor}>{query.year}</span></h4>}
        {region && <h4> {formatMessage(suppliersMessages.region)} <span style={greyColor}>{region}</span></h4>}
        {country && <h4> {formatMessage(suppliersMessages.country)} <span style={greyColor}>{country.label}</span></h4>}
        {sectorIndustry && <h4> {formatMessage(suppliersMessages.sectorIndustry)} <span style={greyColor}>{sectorIndustry.label}</span></h4>}
        {query.impact && <h4> {formatMessage(suppliersMessages.impact)} <span style={greyColor}>{query.impact}</span></h4>}
        {coreSubject && <h4> {formatMessage(suppliersMessages.coreSubjectFilter)} <span style={greyColor}>{coreSubject.label}</span></h4>}
        {selectedIssueOfInterest && <h4> {formatMessage(suppliersMessages.issueOfInterestFilter)} <span style={greyColor}>{selectedIssueOfInterest.label}</span></h4>}
        {query.scorePercentMin && <h4> {formatMessage(suppliersMessages.minLimit)} <span style={greyColor}>{query.scorePercentMin}</span></h4>}
        {query.scorePercentMax && <h4> {formatMessage(suppliersMessages.maxLimit)} <span style={greyColor}>{query.scorePercentMax}</span></h4>}
      </div>
    )
  }
}

export default (injectIntl(RankingCriteria))
