import React from 'react'
import {DateCell, ImageCell, LinkCell, TextCell, ActionCell, ProgressCell} from '../../common/helperCells'
import IntlMessages from '../utility/intlMessages'
import {commonMessages} from '../../messages'
import {newProject, projectAssessmentFiles} from './projectFields'
import {getFileProgress, getAssessmentProgress} from './utility'

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
    title: <IntlMessages {...commonMessages.lastUpdate} />,
    key: 'updatedDate',
    width: 100,
    render: object => renderCell(object, 'DateCell', 'updatedDate'),
  },
  {
    title: <IntlMessages {...projectAssessmentFiles.projectProgress.localization} />,
    key: 'date',
    width: 300,
    render: object => {
      const progress = getAssessmentProgress(object.gapFiles)

      return ProgressCell(progress)
    },
  },
  {
    title: 'Report',
    key: 'report',
    width: 30,
    render: object => ActionCell([
      {
        key: 'report',
        link: `/doc-assessment-report/${object.gapAnalysis ?object.gapAnalysis.id : 0  }`,
        icon: 'file',
      },
    ]),
  },
  {
    title: '',
    key: 'action',
    width: 30,
    render: object => ActionCell([
      {
        key: 'edit1',
        link: `/project-assessment/${object.id}`,
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
  {...columns[6], sorter: false},
]

const sortColumnsWithoutReport = [
  {...columns[0], sorter: true},
  {...columns[1], sorter: true},
  {...columns[2], sorter: true},
  {...columns[3], sorter: true},
  {...columns[4], sorter: true},
  {...columns[6], sorter: false},
]

const createFileColumns = (showAssessment, showFileOverallScore) => {
  const columns = [
    {
      title: <IntlMessages {...projectAssessmentFiles.projectName.localization} />,
      key: 'name',
      render: object => renderCell(object, 'TextCell', 'name'),
    },
    {
      title: <IntlMessages {...projectAssessmentFiles.projectProgress.localization} />,
      key: 'progress',
      width: 300,
      render: object => {
        const progress = getFileProgress(object)

        return ProgressCell(progress)
      },
    },
    {
      title: 'View score',
      key: 'overallScore',
      width: 150,
      render: record => ActionCell([
        {
          key: 'edit1',
          onClick: () => {
            showFileOverallScore(record)
          },
          link: '#',
          icon: 'file',
        },
      ]),
    },
    {
      title: '',
      key: 'action',
      width: 50,
      render: record => ActionCell([
        {
          key: 'edit1',
          onClick: () => {
            // console.log("show assestment console", record, showAssessment)
            showAssessment(record)
          },
          link: '#',
          icon: 'edit',
        },
      ]),
    },
  ]

  return [
    {...columns[0], sorter: true},
    {...columns[1], sorter: false},
    {...columns[2], sorter: false},
    {...columns[3], sorter: false},
  ]
}


export {columns, sortColumns, sortColumnsWithoutReport, createFileColumns}
