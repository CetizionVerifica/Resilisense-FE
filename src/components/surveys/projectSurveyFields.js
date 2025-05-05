import {generateKeys, generateLocalization} from '../../common/utils'
import {SelectField} from 'redux-form-antd'
const projectSurveyFields = generateLocalization('projectSurveyFields', generateKeys({
  companyName: {
    value: 'companyId',
    label: 'Company',
    component: SelectField,
    showSearch: true,
    notFoundContent: 'Not Found',
    enterButton: 'Search',
    options: [],
    warn: v => (v && v.length > 2 ? '' : 'too short'),
    validate: v => (v ? '' : 'Required'),
  },
  projectName: {
    value: 'projectId',
    label: 'Project',
    component: SelectField,
    showSearch: true,
    notFoundContent: 'Not Found',
    enterButton: 'Search',
    options: [],
    warn: v => (v && v.length > 2 ? '' : 'too short'),
    validate: v => (v ? '' : 'Required'),
  },
}))

export {projectSurveyFields}
