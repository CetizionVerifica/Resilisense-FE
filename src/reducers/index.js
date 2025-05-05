import {combineReducers} from 'redux'
import {intlReducer} from 'react-intl-redux'
import {reducer as form} from 'redux-form'
import authReducer from './authReducer'
import AppReducer from './AppReducer'
import MaterialityReducer from './MaterialityReducer'
import CompanyReducer from './CompanyReducer'
import ProjectReducer from './ProjectReducer'
import FirstAssessmentReducer from './FirstAssessmentReducer'
import FirstAssessmentCompletedReducer from './FirstAssessmentCompletedReducer'
import SecondAssessmentReducer from './SecondAssessmentReducer'
import CompletedProjectReducer from './CompletedProjectReducer'
import EmployeeReducer from './EmployeeReducer'
import StakeholderReducer from './StakeholderReducer'
import ActionsAndKPIsReducer from './ActionsAndKPIsReducer'
import modalReducer from '../components/modals/modalReducer'
const rootReducer = combineReducers({
  intl: intlReducer,
  auth: authReducer,
  app: AppReducer,
  materiality: MaterialityReducer,
  company: CompanyReducer,
  project: ProjectReducer,
  firstAssessment: FirstAssessmentReducer,
  firstAssessmentCompleted: FirstAssessmentCompletedReducer,
  secondAssessment: SecondAssessmentReducer,
  completedProject: CompletedProjectReducer,
  employee: EmployeeReducer,
  stakeholder: StakeholderReducer,
  actionsAndKPIs: ActionsAndKPIsReducer,
  modals: modalReducer,
  form,
})

export default rootReducer

