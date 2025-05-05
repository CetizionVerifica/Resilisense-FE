import {get, round} from 'lodash'
import {TextCell} from '../../../common/helperCells'
import {gapAnalysisQuestions} from '../../../common/gapAnalysisQuestions'
import {coreSubjectNames} from '../../../common/coreSubjectNames'
import {issueOfInterest} from '../../../common/issueOfInterest'
import {getIssueLevel,
  getCompanyPerformance,
  getRevisingScorePerformance,
  getRelevanceSignificance} from './_helper'

const renderCell = (object, type, key) => {
  const value = object[key]
  switch (type) {
    case 'ValueCell':
      return TextCell(get(gapAnalysisQuestions[value], 'label'))
    case 'IssueOfInterestCell':
      return TextCell(get(issueOfInterest[value], 'label'))
    case 'CoreSubjectCell':
      return TextCell(get(coreSubjectNames[value], 'label'))
    case 'revisedScoreCell': {
      // CSR-94 change this line (old line -> const score = value ? round(value * 100) : '-')
      const score = typeof(value) === 'number' ? round(value * 100) : '-'
      return getRevisingScorePerformance(score)
    }
    case 'issueLevelCell':
      return getIssueLevel(object)
    case 'companyPerformanceCell':
      // CSR-97 it shows very-poor intead of N/A return getCompanyPerformance(value)
      return object.relevanceValue === 0 ? 'N/A' : getCompanyPerformance(value)
    case 'relevanceSignificanceCell':
      return getRelevanceSignificance(value)
    default:
      return TextCell(value)
  }
}

const columns = [
  {
    title: 'Key Considerations',
    key: 'keyConsiderations',
    render: object => renderCell(object, 'TextCell', 'label'),
  },

]
const columnsStatus = [
  {
    title: 'Key Considerations',
    key: 'keyConsiderations',
    render: object => renderCell(object, 'ValueCell', 'keyConsideration'),
  },

]

const columnsCoreSubject = [
  {
    title: 'Core Subject',
    key: 'coreSubject',
    render: object => renderCell(object, 'CoreSubjectCell', 'coreSubject'),
  },

]

const columnsGapAnalysisTables = [
  {
    title: 'Key Considerations',
    key: 'keyConsiderations',
    render: object => renderCell(object, 'ValueCell', 'keyConsideration'),
  },
  {
    title: 'Initial Company Performance Score',
    key: 'performanceValue',
    render: object =>{console.log("here?"); return renderCell(object, 'companyPerformanceCell', 'performanceValue')},
  },
  {
    title: 'Revised Company Performance Score',
    key: 'revisedScore',
    render: object =>{
      console.log("TEST:", object.revisedScore);
      return renderCell(object, 'revisedScoreCell', 'revisedScore');
    },
  },
  {
    title: 'Relevance & Significance Score',
    key: 'relevanceValue',
    render: object => renderCell(object, 'relevanceSignificanceCell', 'relevanceValue'),
  },


]

const columnsRelevenceCoreSubject = [
  {
    title: 'Key Considerations',
    key: 'keyConsiderations',
    width: 500,
    render: object => renderCell(object, 'ValueCell', 'keyConsideration'),
  },
  {
    title: 'Issue of Interest',
    key: 'issueOfInterests',
    render: object => renderCell(object, 'IssueOfInterestCell', 'issueOfInterest'),
  },
  {
    title: 'Issue Level',
    key: 'issueLevel',
    render: object => renderCell(object, 'issueLevelCell', 'issueLevel'),
  },


]


export {columns,
  columnsStatus,
  columnsCoreSubject,
  columnsGapAnalysisTables,
  columnsRelevenceCoreSubject}


