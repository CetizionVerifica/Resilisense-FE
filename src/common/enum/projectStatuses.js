import {generateKeys, generateLocalization} from '../utils'
const projectStatuses = generateLocalization('projectStatuses', generateKeys({
  new: {
    value: 'New',
    label: 'New',
    group: 'projectStatuses',
    orderby: 0,
  },
  firstAssessmentRequest: {
    value: 'FirstAssessmentRequest',
    label: 'First Assessment Request',
    group: 'projectStatuses',
    orderby: 1,
  },
  firstAssessmentCompleted: {
    value: 'FirstAssessmentCompleted',
    label: 'First Assessment Completed',
    group: 'projectStatuses',
    orderby: 2,
  },
  secondAssessmentRequest: {
    value: 'SecondAssessmentRequest',
    label: 'Second Assessment Request',
    group: 'projectStatuses',
    orderby: 3,
  },
  completed: {
    value: 'Completed',
    label: 'Completed',
    group: 'projectStatuses',
    orderby: 4,
  },
  meterialitysendsurvey: {
    value: 'MaterialitySendSurvey',
    label: 'Materiality Send Survey',
    group: 'projectStatuses',
    orderby: 5,
  },
  materialitycompleted: {
    value: 'MaterialityCompleted',
    label: 'Materiality Completed',
    group: 'projectStatuses',
    orderby: 6,
  },
  finished: {
    value: 'Finished',
    label: 'Finished',
    group: 'projectStatuses',
    orderby: 7,
  },
}))

export {projectStatuses}
