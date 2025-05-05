import React from 'react'
import {DateCell, ImageCell, LinkCell, TextCell} from '../../common/helperCells'
import IntlMessages from '../utility/intlMessages'
import {companyInformation} from '../company/companyFields'

const renderCell = (object, type, key) => {
  const value = object[key]
  switch (type) {
    case 'ImageCell':
      return ImageCell(value)
    case 'DateCell':
      return DateCell(value)
    case 'LinkCell':
      return LinkCell(value)
    default:
      return TextCell(value)
  }
}

const columns = [

  {
    title: <IntlMessages {...companyInformation.name.localization} />,
    key: 'name',
    render: object =>
      object.company ? renderCell(object.company, 'TextCell', 'name') : 'No company',
  },
  {
    title: 'Project',
    key: 'project',

    render: object => renderCell(object, 'TextCell', 'title'),
  },
  {
    title: 'Impact',
    wdith: 200,
    key: 'Impact',
    render: object => renderCell(object, 'TextCell', 'impact'),
  },

]

const columnsPerfornce = [
  {
    title: 'Rank',
    key: 'rank',
    render: (text, record, index) => index + 1,
  },

  {
    title: <IntlMessages {...companyInformation.name.localization} />,
    key: 'name',
    render: object =>
      object.company ? renderCell(object.company, 'TextCell', 'name') : 'No company',
  },
  {
    title: 'Project',
    key: 'personName',
    render: object => renderCell(object, 'TextCell', 'title'),
  },
  {
    title: 'Relevance & Significance Overall Score',
    key: 'relevanceScore',
    render: object =>
      object.gapAnalysis ? renderCell(object.gapAnalysis, 'TextCell', 'relevance') : 0,
  },
  {
    title: 'Company Performance Overall Score',
    key: 'performanceScore',

    render: object =>
      object.gapAnalysis ? renderCell(object.gapAnalysis, 'TextCell', 'weightedPerformance') : 0,
  },
]

const sortColumns = [
  {...columns[0], sorter: false},
  {...columns[1], sorter: false},
  {...columns[2], sorter: false},
]


export {columns, sortColumns, columnsPerfornce}
