import {get, round} from 'lodash'
import {TextCell} from '../../common/helperCells'
import {coreSubjectNames} from '../../common/coreSubjectNames'
import {issueOfInterest} from '../../common/issueOfInterest'
const renderCell = (object, type, key) => {
  const value = object[key]
  switch (type) {
    case 'CoreSubjectCell':
      return TextCell(get(coreSubjectNames[value], 'label'))
    case 'IssueOfInterestCell':
      return TextCell(get(issueOfInterest[value], 'label'))
    case 'RelevanceCell':
      return TextCell(round(value, 2))
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

const columnsCoreSubject = [
  {
    title: 'Core Subject',
    key: 'coreSubject',
    render: object => renderCell(object, 'CoreSubjectCell', 'coreSubject'),
  },
  {
    title: 'Internal Stakeholder Relevance',
    key: 'company',
    render: object => renderCell(object, 'RelevanceCell', 'relevanceCompanyValue'),
  },
  {
    title: 'External Stakeholder Relevance',
    key: 'stakeholder',
    render: object => renderCell(object, 'RelevanceCell', 'relevanceStakeholdersValue'),
  },
  {
    title: 'Overall Relevance',
    key: 'weightValue',
    render: object => renderCell(object, 'RelevanceCell', 'weightValue'),
  },
]

const columnsIssueOfInterest = [
  {
    title: 'No.',
    key: 'no',
    render: object => renderCell(object, 'TextCell', 'c'),
  },
  {
    title: 'Issue of Interset',
    key: 'issueOfInterest',
    render: object => renderCell(object, 'IssueOfInterestCell', 'issueOfInterest'),
  },
  {
    title: 'Core Subject',
    key: 'coreSubject',
    render: object => renderCell(object, 'CoreSubjectCell', 'coreSubject'),
  },
  {
    title: 'Internal Stakeholders Relevance',
    key: 'company',
    render: object => renderCell(object, 'RelevanceCell', 'relevanceCompanyValue'),
  },
  {
    title: 'External Stakeholder Relevance',
    key: 'stakeholder',
    render: object => renderCell(object, 'RelevanceCell', 'relevanceStakeholdersValue'),
  },
  {
    title: 'Overall Relevance',
    key: 'weightValue',
    render: object => renderCell(object, 'RelevanceCell', 'weightValue'),
  },
]


export {columns, columnsCoreSubject, columnsIssueOfInterest}

