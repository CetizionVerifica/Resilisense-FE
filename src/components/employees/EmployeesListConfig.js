import React from 'react'
import {DateCell, ImageCell, LinkCell, TextCell} from '../../common/helperCells'
import IntlMessages from '../utility/intlMessages'
import {employeeFields} from './employeeFields'


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
    title: <IntlMessages {...employeeFields.name.localization} />,
    key: 'name',
    width: 200,
    render: object => renderCell(object, 'TextCell', 'name'),
  },
  {
    title: <IntlMessages {...employeeFields.jobPosition.localization} />,
    key: 'jobPosition',
    render: object => renderCell(object, 'TextCell', 'jobPosition'),
  },
  {
    title: <IntlMessages {...employeeFields.email.localization} />,
    key: 'email',
    render: object => renderCell(object, 'TextCell', 'email'),
  },
  {
    title: <IntlMessages {...employeeFields.phone.localization} />,
    key: 'phone',
    render: object => renderCell(object, 'TextCell', 'phone'),
  },
]

const sortColumns = [
  {...columns[0], sorter: true},
  {...columns[1], sorter: true},
  {...columns[2], sorter: true},
  {...columns[3], sorter: true},
]


export {columns, sortColumns}
