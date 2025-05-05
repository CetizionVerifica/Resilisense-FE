import {generateKeys, generateLocalization} from '../utils'
const auditQuestionsTitle = generateLocalization('auditQuestions.title', generateKeys({
  CSRIntroductionAndAwareness: {
    value: 'CSRIntroductionAndAwareness',
    label: 'CSR Introduction and Awareness',
    orderby: 0,
  },
  GapAnalysis: {
    value: 'GapAnalysis',
    label: 'Gap Analysis',
    orderby: 1,
  },
  MaterialityAssessment: {
    value: 'MaterialityAssessment',
    label: 'Materiality Assessment',
    orderby: 2,
  },
  CSRSustainabilityStrategy: {
    value: 'CSRSustainabilityStrategy',
    label: 'CSR/Sustainability Strategy',
    orderby: 3,
  },

}))

const auditQuestions = generateLocalization('auditQuestions.qustions', generateKeys({
  IntroductionAwarenessRaisingAroundCSR: {
    value: 'IntroductionAwarenessRaisingAroundCSR',
    label: 'Introduction and awareness raising around CSR to company’s management',
    title: auditQuestionsTitle.CSRIntroductionAndAwareness.key,
    orderby: 0,
  },
  SocialResponsibility: {
    value: 'SocialResponsibility',
    label: 'Social responsibility/CSR committee/individual in place',
    title: auditQuestionsTitle.CSRIntroductionAndAwareness.key,
    orderby: 1,
  },
  ExecutionGapAnalysis: {
    value: 'ExecutionGapAnalysis',
    label: 'Execution of the gap analysis to identify gaps of the organisation',
    title: auditQuestionsTitle.GapAnalysis.key,
    orderby: 2,
  },
  ProductionReportGapAnalysisFindings: {
    value: 'ProductionReportGapAnalysisFindings',
    label: 'Production of a report on the gap analysis’ findings',
    title: auditQuestionsTitle.GapAnalysis.key,
    orderby: 3,
  },
  IdentificationInternalExternalStakeholders: {
    value: 'IdentificationInternalExternalStakeholders',
    label: 'Identification of internal and external stakeholders',
    title: auditQuestionsTitle.MaterialityAssessment.key,
    orderby: 3,
  },
  InternalStakeholderConsultationUndertaken: {
    value: 'InternalStakeholderConsultationUndertaken',
    label: 'Internal stakeholder consultation undertaken',
    title: auditQuestionsTitle.MaterialityAssessment.key,
    orderby: 3,
  },
  ExternalStakeholderConsultationUndertaken: {
    value: 'ExternalStakeholderConsultationUndertaken',
    label: 'External stakeholder consultation undertaken',
    title: auditQuestionsTitle.MaterialityAssessment.key,
    orderby: 3,
  },
  ExecutionMaterialityAssessmentIdentifyMaterialIssues: {
    value: 'ExecutionMaterialityAssessmentIdentifyMaterialIssues',
    label: 'Execution of a materiality assessment to identify material issues to the organisation',
    title: auditQuestionsTitle.MaterialityAssessment.key,
    orderby: 3,
  },
  ProductionOfReportOnTheMaterialityAssessment: {
    value: 'ProductionOfReportOnTheMaterialityAssessment',
    label: 'Production of a report on the materiality assessment’s findings',
    title: auditQuestionsTitle.MaterialityAssessment.key,
    orderby: 3,
  },
  DevelopmentOfCSRSustainabilityStrategy: {
    value: 'DevelopmentOfCSRSustainabilityStrategy',
    label: 'Development of a CSR/sustainability strategy',
    title: auditQuestionsTitle.CSRSustainabilityStrategy.key,
    orderby: 3,
  },
  DevelopmentOfActionsAndKPIs: {
    value: 'DevelopmentOfActionsAndKPIs',
    label: 'Development of actions and KPIs',
    title: auditQuestionsTitle.CSRSustainabilityStrategy.key,
    orderby: 3,
  },
  DeterminingFurtherTrainingNeeds: {
    value: 'DeterminingFurtherTrainingNeeds',
    label: 'Determining further training needs',
    title: auditQuestionsTitle.CSRSustainabilityStrategy.key,
    orderby: 3,
  },

}))

export {auditQuestionsTitle, auditQuestions}
