import React from 'react'
import {DateCell, ImageCell, LinkCell, TextCell, ActionCell} from '../../common/helperCells'
import IntlMessages from '../utility/intlMessages'
import {commonMessages} from '../../messages'
import {newProject} from './projectFields'

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
    title: <IntlMessages {...newProject.projectName.localization} />,
    key: 'title',
    width: 200,
    render: object => renderCell(object, 'TextCell', 'title'),
  },
  {
    title: <IntlMessages {...newProject.companyName.localization} />,
    key: 'comapany',
    render: object => object.company ? renderCell(object.company, 'TextCell', 'name') : 'No company',
  },
  {
    title: <IntlMessages {...newProject.projectYear.localization} />,
    key: 'year',
    render: object => renderCell(object, 'TextCell', 'year'),
  },
  {
    title: <IntlMessages {...commonMessages.createdDate} />,
    key: 'date',
    width: 100,
    render: object => renderCell(object, 'DateCell', 'date'),
  },
  {
    title: <IntlMessages {...commonMessages.lastUpdate} />,
    key: 'updatedDate',
    width: 100,
    render: object => renderCell(object, 'DateCell', 'date'),
  },
  {
    title: '',
    key: 'action',
    width: 50,
    render: object => ActionCell([
      {
        key: 'edit1',
        link: `/project/${object.id}`,
        icon: 'edit',
      },
    ]),
  },
]

const sortColumns = [
  {...columns[0], sorter: true},
  {...columns[1], sorter: true},
  {...columns[2], sorter: true},
  {...columns[3], sorter: true},
  {...columns[4], sorter: true},
  {...columns[5], sorter: false},
]


export {columns, sortColumns}
