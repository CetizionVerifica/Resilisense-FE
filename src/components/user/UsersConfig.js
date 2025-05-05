import React from 'react'
import {DateCell, ImageCell, LinkCell, TextCell, ActionCell} from '../../common/helperCells'
import IntlMessages from '../utility/intlMessages'
import { userFields } from './userFields'
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

  const isIE = /*@cc_on!@*/false || !!document.documentMode;

  const columns = [
    {
        title: isIE ? 'Email' : <IntlMessages {...userFields.email.localization} />,
        key: 'email',
        width: 300,
        render: object => renderCell(object, 'TextCell', 'email'),
      },
    {
      title: isIE ? 'Name' : <IntlMessages {...userFields.name.localization} />,
      key: 'name',
      width: 200,
      render: object => renderCell(object, 'TextCell', 'name'),
    },
  
    {
      title: 'Active',
      key: 'active',
      width: 200,
      render: object => renderCell(object, 'TextCell', 'active'),
    },
    {
      title: 'Roles',
      key: 'role',
      width: 300,
      render: object => renderCell(object, 'TextCell', 'role'),
    },
    {
      title: 'Number of Agencies',
      key: 'numberOfAgencies',
  
      render: object => renderCell(object, 'TextCell', 'numberOfAgencies'),
    },
    {
      title: '',
      key: 'action',
      width: 100,
      render: object => ActionCell([
        {
          key: 'edit1',
          link: `/user/${object.id}`,
          icon: 'edit',
        },
      ]),
    },
  ]
  
  const sortColumns = [
    {...columns[0], sorter: isIE ? false : true},
    {...columns[1], sorter: isIE ? false : true},
    {...columns[2], sorter: isIE ? false : true},
    {...columns[3], sorter: isIE ? false : false},
    {...columns[4], sorter: isIE ? false : true},
    {...columns[5], sorter: isIE ? false : false},
  ]
  
  
  export {columns, sortColumns}