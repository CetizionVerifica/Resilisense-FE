import React from 'react'
import moment from 'moment'
import {values, find} from 'lodash'
import {
  TextCell,
  ActionCell,
  DropdownCell,
  NewTabCell} from '../../common/helperCells'
import {surveyFlags} from '../../common/enum/surveyFlags'
import {surveyStatuses} from '../../common/enum/surveyStatuses'
import {responseStatuses} from '../../common/enum/responseStatuses'
import {materialityGroup} from '../../common/enum/materialityGroup'
import IntlMessages from '../utility/intlMessages'
import {surveyFields} from './surveyFields'

const dateFormat = 'DD/MM/YYYY'

const renderCell = (object, type, key) => {
  const value = object[key]
  switch (type) {
    default:
      return TextCell(value)
  }
}

const createSurveyManagementColumns = (showSurveyPreview, flagSurvey) => {
  const columns = [
    {
      title: <IntlMessages {...surveyFields.title.localization} />,
      key: 'title',
      render: object => renderCell(object, 'TextCell', 'title'),
    },
    {
      title: <IntlMessages {...surveyFields.createdDate.localization} />,
      key: 'createDate',
      width: 250,
      render: object => renderCell(object, 'TextCell', 'createdDate'),
    },
    {
      title: <IntlMessages {...surveyFields.modifiedDate.localization} />,
      key: 'modifiedDate',
      width: 250,
      render: object => renderCell(object, 'TextCell', 'modifiedDate'),
    },
    {
      title: '',
      key: 'flag',
      width: 250,
      render: (text, record, index) => {
        return (<DropdownCell
          defaultValue={record.flag}
          record={record}
          options={values(surveyFlags)}
          callBack={(value) => flagSurvey(record.id, value)}
        />)
      },
    },
    {
      title: '',
      key: 'preview',
      width: 50,
      render: record => {
        return ActionCell([
          {
            key: 'preview',
            onClick: () => showSurveyPreview(record.previewLink),
            link: '#',
            icon: 'search',
            iconColor: '#08c',
          },
        ])
      },
    },
    {
      title: '',
      key: 'edit',
      width: 50,
      render: record => {
        return NewTabCell([
          {
            key: 'edit',
            link: record.editUrl,
            icon: 'edit',
            iconColor: '#08c',
          },
        ])
      },
    },
  ]

  return [
    {...columns[0], sorter: false},
    {...columns[1], sorter: false},
    {...columns[2], sorter: false},
    {...columns[3], sorter: false},
    {...columns[4], sorter: false},
    {...columns[5], sorter: false},
  ]
}

const createSurveysColumns = () => {
  const columns = [
    {
      title: <IntlMessages {...surveyFields.project.localization} />,
      key: 'project',
      render: object => renderCell(object.project, 'TextCell', 'title'),
    },
    {
      title: <IntlMessages {...surveyFields.year.localization} />,
      key: 'year',
      width: 150,
      render: object => renderCell(object.project, 'TextCell', 'year'),
    },
    {
      title: <IntlMessages {...surveyFields.company.localization} />,
      key: 'company',
      width: 150,
      render: object => renderCell(object.project.company, 'TextCell', 'name'),
    },
    {
      title: <IntlMessages {...surveyFields.sendDate.localization} />,
      key: 'sendDate',
      width: 150,
      render: object => TextCell(moment(object.sendDate).format(dateFormat)),
    },
    {
      title: <IntlMessages {...surveyFields.reminderSendDate.localization} />,
      key: 'reminderSendDate',
      width: 150,
      render: object => {
        const date = object.reminderSendDate ? moment(object.reminderSendDate).format(dateFormat) : '-'
        return TextCell(date)
      },
    },
    {
      title: <IntlMessages {...surveyFields.status.localization} />,
      key: 'status',
      width: 150,
      render: object => {
        const status = find(surveyStatuses, {value: object.status})
        return TextCell(status.label)
      },
    },
    {
      title: '',
      key: 'view',
      width: 50,
      render: record => {
        return ActionCell([
          {
            key: 'preview',
            link: `/surveys/${record.id}`,
            icon: 'search',
            iconColor: '#08c',
          },
        ])
      },
    },
  ]

  return [
    {...columns[0], sorter: false},
    {...columns[1], sorter: false},
    {...columns[2], sorter: false},
    {...columns[3], sorter: false},
    {...columns[4], sorter: false},
    {...columns[5], sorter: false},
    {...columns[6], sorter: false},
  ]
}

const createRecipientColumns = (isExternal, handleStakeholderGroup) => {
  const columns = [
    {
      title: <IntlMessages {...surveyFields.name.localization} />,
      key: 'name',
      render: object => renderCell(object, 'TextCell', 'name'),
    },
    {
      title: <IntlMessages {...surveyFields.email.localization} />,
      key: 'email',
      render: object => renderCell(object, 'TextCell', 'email'),
    },
    {
      title: <IntlMessages {...surveyFields.jobPosition.localization} />,
      key: 'jobPosition',
      render: object => renderCell(object, 'TextCell', 'jobPosition'),
    },
    {
      title: <IntlMessages {...surveyFields.phone.localization} />,
      key: 'phone',
      render: object => renderCell(object, 'TextCell', 'phone'),
    },
    {
      title: <IntlMessages {...surveyFields.responseDate.localization} />,
      key: 'responseDate',
      render: object => {
        const date = object.responseDate ? moment(object.responseDate).format(dateFormat) : '-'
        return TextCell(date)
      },
    },
    {
      title: <IntlMessages {...surveyFields.class.localization} />,
      key: 'class',
      width: 200,
      render: (text, record, index) => {
        return (<DropdownCell
          defaultValue={record.groupXFactor}
          options={values(materialityGroup)}
          callBack={(value) => {
            // console.log("Class::;", record.stakeholder, record.groupXFactor);
            return handleStakeholderGroup(value, record.stakeholder)}}
        />)
      },
    },
    {
      title: <IntlMessages {...surveyFields.status.localization} />,
      key: 'status',
      render: object => {
        const status = find(responseStatuses, {value: object.status})
        return TextCell(status.label)
      },
    },
  ]

  const resultColumns = [
    {...columns[0], sorter: false},
    {...columns[1], sorter: false},
    {...columns[2], sorter: false},
    {...columns[3], sorter: false},
    {...columns[4], sorter: false},
  ]

  if (isExternal) {
    resultColumns.push({...columns[5], sorter: false})
  }

  resultColumns.push({...columns[6], sorter: false})

  return resultColumns
}

const createSurveyRecipientColumns = () => {
  const columns = [
    {
      title: <IntlMessages {...surveyFields.name.localization} />,
      key: 'name',
      render: object => renderCell(object, 'TextCell', 'name'),
    },
    {
      title: <IntlMessages {...surveyFields.email.localization} />,
      key: 'email',
      render: object => renderCell(object, 'TextCell', 'email'),
    },
    {
      title: <IntlMessages {...surveyFields.jobPosition.localization} />,
      key: 'jobPosition',
      render: object => renderCell(object, 'TextCell', 'jobPosition'),
    },
    {
      title: <IntlMessages {...surveyFields.phone.localization} />,
      key: 'phone',
      render: object => renderCell(object, 'TextCell', 'phone'),
    },
  ]

  return [
    {...columns[0], sorter: false},
    {...columns[1], sorter: false},
    {...columns[2], sorter: false},
    {...columns[3], sorter: false},
  ]
}

export {createSurveyManagementColumns, createSurveysColumns, createRecipientColumns, createSurveyRecipientColumns}
