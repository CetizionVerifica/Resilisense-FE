import {generateKeys, generateLocalization} from '../utils'
const annualReviewQuestionsTitle = generateLocalization('annualReviewQuestions.title', generateKeys({
  management: {
    value: 'management',
    label: 'Management',
  },
  humanRights: {
    value: 'humanRights',
    label: 'Human Rights',
  },
  labour: {
    value: 'labour',
    label: 'Labour',
  },
  environment: {
    value: 'environment',
    label: 'Environment',
  },
  antiCorruption: {
    value: 'antiCorruption',
    label: 'Anti-Corruption',
  },

}))

const annualReviewQuestionsSubTitle = generateLocalization('annualReviewQuestions.subTitle', generateKeys({
  assess: {
    value: 'assess',
    label: 'Assess',
    title: annualReviewQuestionsTitle.management.key,
  },
  define: {
    value: 'define',
    label: 'Define',
    title: annualReviewQuestionsTitle.management.key,
  },
  implement: {
    value: 'implement',
    label: 'Implement',
    title: annualReviewQuestionsTitle.management.key,
  },
  communicate: {
    value: 'communicate',
    label: 'Communicate',
    title: annualReviewQuestionsTitle.management.key,
  },
  // Human rights
  healthAndSafety: {
    value: 'healthAndSafety',
    label: 'Health And Safety',
    title: annualReviewQuestionsTitle.humanRights.key,
  },
  hoursWagesAndLeave: {
    value: 'hoursWagesAndLeave',
    label: 'Hours Wages And Leave',
    title: annualReviewQuestionsTitle.humanRights.key,
  },
  fairTreatment: {
    value: 'fairTreatment',
    label: 'Fair Treatment',
    title: annualReviewQuestionsTitle.humanRights.key,
  },
  communityImpacts: {
    value: 'communityImpacts',
    label: 'Community Impacts',
    title: annualReviewQuestionsTitle.humanRights.key,
  },
  productStewardship: {
    value: 'productStewardship',
    label: 'Product Stewardship',
    title: annualReviewQuestionsTitle.humanRights.key,
  },
  countryRisk: {
    value: 'countryRisk',
    label: 'Country Risk',
    title: annualReviewQuestionsTitle.humanRights.key,
  },
  // Labour
  freedomOfAssociation: {
    value: 'freedomOfAssociation',
    label: 'Freedom Of Association',
    title: annualReviewQuestionsTitle.labour.key,
  },
  forcedLabour: {
    value: 'forcedLabour',
    label: 'Forced Labour',
    title: annualReviewQuestionsTitle.labour.key,
  },
  childLabour: {
    value: 'childLabour',
    label: 'Child Labour',
    title: annualReviewQuestionsTitle.labour.key,
  },
  discrimination: {
    value: 'discrimination',
    label: 'Discrimination',
    title: annualReviewQuestionsTitle.labour.key,
  },
  // Environment
  precaution: {
    value: 'precaution',
    label: 'Precaution',
    title: annualReviewQuestionsTitle.environment.key,
  },
  responsibilityAndPerformance: {
    value: 'responsibilityAndPerformance',
    label: 'Responsibility And Performance',
    title: annualReviewQuestionsTitle.environment.key,
  },
  technology: {
    value: 'technology',
    label: 'Technology',
    title: annualReviewQuestionsTitle.environment.key,
  },
  // Anti corruption
  companyCultureAndProcedures: {
    value: 'companyCultureAndProcedures',
    label: 'Company Culture And Procedures',
    title: annualReviewQuestionsTitle.antiCorruption.key,
  },
  jointActions: {
    value: 'jointActions',
    label: 'JointActions',
    title: annualReviewQuestionsTitle.antiCorruption.key,
  },

}))

const annualReviewQuestions = generateLocalization('annualReviewQuestions.qustions', generateKeys({
  // UNGC Self Assessment tool
  // Management
  doesTheCompanyComplyWithAllRelevantRegulation: {
    value: 'doesTheCompanyComplyWithAllRelevantRegulation',
    label: 'Does the company comply with all relevant regulation on issues covered by the Global Compact principles?',
    title: annualReviewQuestionsTitle.management.key,
    subtitle: annualReviewQuestionsSubTitle.assess.key,
    orderby: 1,
  },
  doesTheCompanyIdentifyAndAssessTheImpactsOfItsOperations: {
    value: 'doesTheCompanyIdentifyAndAssessTheImpactsOfItsOperations',
    label: 'Does the company identify and assess the impacts of its operations on issues covered by the Global Compact principles?',
    title: annualReviewQuestionsTitle.management.key,
    subtitle: annualReviewQuestionsSubTitle.assess.key,
    orderby: 2,
  },
  doesTheCompanyHaveAPolicyStatementInLineWithTheGlobalCompactPrinciples: {
    value: 'doesTheCompanyHaveAPolicyStatementInLineWithTheGlobalCompactPrinciples? ',
    label: 'Does the company have a policy statement in line with the Global Compact principles? ',
    title: annualReviewQuestionsTitle.management.key,
    subtitle: annualReviewQuestionsSubTitle.define.key,
    orderby: 3,
  },
  doTheCompanyDecisionMakingProcessesIncludeIssuesCovered: {
    value: 'doTheCompanyDecisionMakingProcessesIncludeIssuesCovered',
    label: 'Do the company\'s decision-making processes include issues covered by the Global Compact principles?',
    title: annualReviewQuestionsTitle.management.key,
    subtitle: annualReviewQuestionsSubTitle.implement.key,
    orderby: 4,
  },
  DoesTheCompanyInvolveWorkersWhenAddressingIssuesCover: {
    value: 'DoesTheCompanyInvolveWorkersWhenAddressingIssuesCover',
    label: 'Does the company involve workers when addressing issues covered by the global compact principles?',
    title: annualReviewQuestionsTitle.management.key,
    subtitle: annualReviewQuestionsSubTitle.implement.key,
    orderby: 5,
  },
  doesTheCompanyPromoteIssuesCoveredByTheGlobalCompactPrincip: {
    value: 'doesTheCompanyPromoteIssuesCoveredByTheGlobalCompactPrincip',
    label: 'Does the company promote issues covered by the Global Compact principles in its interactions with suppliers and business partners?',
    title: annualReviewQuestionsTitle.management.key,
    subtitle: annualReviewQuestionsSubTitle.implement.key,
    orderby: 6,
  },
  doesTheCompanyPositivelyContributeToCommunityDevelopment: {
    value: 'doesTheCompanyPositivelyContributeToCommunityDevelopment',
    label: 'Does the company positively contribute to community development?',
    title: annualReviewQuestionsTitle.management.key,
    subtitle: annualReviewQuestionsSubTitle.implement.key,
    orderby: 7,
  },
  doesTheCompanyHaveATrustedProcedureForHearingProcessingAnd: {
    value: 'doesTheCompanyHaveATrustedProcedureForHearingProcessingAnd',
    label: 'Does the company have a trusted procedure for hearing, processing and settling internal and external concerns/complaints?',
    title: annualReviewQuestionsTitle.management.key,
    subtitle: annualReviewQuestionsSubTitle.implement.key,
    orderby: 8,
  },
  doesTheCompanyCommunicateWithStakeholdersAboutCompanySpecificIssuesCoveredBy: {
    value: 'doesTheCompanyCommunicateWithStakeholdersAboutCompanySpecificIssuesCoveredBy',
    label: 'Does the company communicate with stakeholders about company-specific issues covered by the Global Compact principles?',
    title: annualReviewQuestionsTitle.management.key,
    subtitle: annualReviewQuestionsSubTitle.communicate.key,
    orderby: 9,
  },
  // Human Rights
  doesTheCompanyEnsureThatItsWorkersAreProvidedSafeSuitab: {
    value: 'doesTheCompanyEnsureThatItsWorkersAreProvidedSafeSuitab',
    label: 'Does the company ensure that its workers are provided safe, suitable and sanitary work facilities?',
    title: annualReviewQuestionsTitle.humanRights.key,
    subtitle: annualReviewQuestionsSubTitle.healthAndSafety.key,
    orderby: 10,
  },
  doesTheCompanyEnsureThatWorkersAreProvidedWithThePro: {
    value: 'doesTheCompanyEnsureThatWorkersAreProvidedWithThePro',
    label: 'Does the company ensure that workers are provided with the protective equipment and training necessary to perform their tasks safely?',
    title: annualReviewQuestionsTitle.humanRights.key,
    subtitle: annualReviewQuestionsSubTitle.healthAndSafety.key,
    orderby: 11,
  },
  doesTheCompanyActivelyInvolveWorkersInHea: {
    value: 'doesTheCompanyActivelyInvolveWorkersInHea',
    label: 'Does the company actively involve workers in health and safety work?',
    title: annualReviewQuestionsTitle.humanRights.key,
    subtitle: annualReviewQuestionsSubTitle.healthAndSafety.key,
    orderby: 12,
  },
  doesTheCompanyEnsureThatTheWorkweekIsLimitedTo48HoursThatOverti: {
    value: 'doesTheCompanyEnsureThatTheWorkweekIsLimitedTo48HoursThatOverti',
    label: 'Does the company ensure that the workweek is limited to 48 hours; that overtime is infrequent and limited; and that workers are given reasonable breaks and rest periods?',
    title: annualReviewQuestionsTitle.humanRights.key,
    subtitle: annualReviewQuestionsSubTitle.hoursWagesAndLeave.key,
    orderby: 13,
  },
  doesTheCompanyProvideALivingWa: {
    value: 'doesTheCompanyProvideALivingWa',
    label: 'Does the company provide a living wage that enables workers to meet the basic needs of themselves and their dependents?',
    title: annualReviewQuestionsTitle.humanRights.key,
    subtitle: annualReviewQuestionsSubTitle.hoursWagesAndLeave.key,
    orderby: 14,
  },
  doesTheCompanyEnsureThatWorkersArePaidHolidayLeaveSickLeavAndPare: {
    value: 'doesTheCompanyEnsureThatWorkersArePaidHolidayLeaveSickLeavAndPare',
    label: 'Does the company ensure that workers are paid holiday leave, sick leave, and parental leave in accordance with international minimum standards?',
    title: annualReviewQuestionsTitle.humanRights.key,
    subtitle: annualReviewQuestionsSubTitle.hoursWagesAndLeave.key,
    orderby: 15,
  },
  doesTheCompanyEnsureThatAllWorkersHaveAnOfficialEmploymentStatus: {
    value: 'doesTheCompanyEnsureThatAllWorkersHaveAnOfficialEmploymentStatus?',
    label: 'Does the company ensure that all workers have an official employment status?',
    title: annualReviewQuestionsTitle.humanRights.key,
    subtitle: annualReviewQuestionsSubTitle.hoursWagesAndLeave.key,
    orderby: 16,
  },
  doesTheCompanyProtectWorkersFromWorkplaceHarassmentIncludingPhysica: {
    value: 'doesTheCompanyProtectWorkersFromWorkplaceHarassmentIncludingPhysica',
    label: 'Does the company protect workers from workplace harassment including physical, verbal, sexual or psychological harassment, abuse, or threats?',
    title: annualReviewQuestionsTitle.humanRights.key,
    subtitle: annualReviewQuestionsSubTitle.fairTreatment.key,
    orderby: 17,
  },
  DoesTheCompanyRespectThePrivacyOfItsWorkersWheneverItGathersPri: {
    value: 'DoesTheCompanyRespectThePrivacyOfItsWorkersWheneverItGathersPri',
    label: 'Does the company respect the privacy of its workers whenever it gathers private information or monitors the workplace?',
    title: annualReviewQuestionsTitle.humanRights.key,
    subtitle: annualReviewQuestionsSubTitle.fairTreatment.key,
    orderby: 18,
  },
  beforeBuyingRentingAcquiringOrOtherwiseAccessingLandOrPropertyDo: {
    value: 'beforeBuyingRentingAcquiringOrOtherwiseAccessingLandOrPropertyDo',
    label: 'Before buying, renting, acquiring or otherwise accessing land or property, does the company ensure that all affected owners and users of the land or property, have been adequately consulted and compensated?',
    title: annualReviewQuestionsTitle.humanRights.key,
    subtitle: annualReviewQuestionsSubTitle.communityImpacts.key,
    orderby: 19,
  },
  doesTheCompanyTakeStepsToEnsureThatCompanySecurityArrangemen: {
    value: 'doesTheCompanyTakeStepsToEnsureThatCompanySecurityArrangemen',
    label: 'Does the company take steps to ensure that company security arrangements are in accordance with international principles for law enforcement and the use of force?',
    title: annualReviewQuestionsTitle.humanRights.key,
    subtitle: annualReviewQuestionsSubTitle.communityImpacts.key,
    orderby: 20,
  },
  doesTheCompanyEngageWithLocalCommunitiesOnTheActualOrPotent: {
    value: 'doesTheCompanyEngageWithLocalCommunitiesOnTheActualOrPotent',
    label: 'Does the company engage with local communities on the actual or potential human rights impacts of its operations?',
    title: annualReviewQuestionsTitle.humanRights.key,
    subtitle: annualReviewQuestionsSubTitle.communityImpacts.key,
    orderby: 21,
  },
  doesTheCompanyTakeStepsToPreventRisksToHumanRightsArisingFromProd: {
    value: 'doesTheCompanyTakeStepsToPreventRisksToHumanRightsArisingFromProd',
    label: 'Does the company take steps to prevent risks to human rights arising from product defects or improper use or misuse of company products?',
    title: annualReviewQuestionsTitle.humanRights.key,
    subtitle: annualReviewQuestionsSubTitle.productStewardship.key,
    orderby: 22,
  },
  doesTheCompanySeekToAvoidInvolveme: {
    value: 'adoesTheCompanySeekToAvoidInvolvemesasd',
    label: 'Does the company seek to avoid involvement in human rights abuses owing to government or societal practices?',
    title: annualReviewQuestionsTitle.humanRights.key,
    subtitle: annualReviewQuestionsSubTitle.countryRisk.key,
    orderby: 23,
  },
  // Labour
  doesTheCompanyRecogniseTheRightsOfItsWor: {
    value: 'doesTheCompanyRecogniseTheRightsOfItsWor',
    label: 'Does the company recognise the rights of its workers to freedom of association and to bargain collectively?',
    title: annualReviewQuestionsTitle.labour.key,
    subtitle: annualReviewQuestionsSubTitle.freedomOfAssociation.key,
    orderby: 24,
  },
  ifIndependentTradeUnionsAreEitherDiscour: {
    value: 'ifIndependentTradeUnionsAreEitherDiscour',
    label: 'If independent trade unions are either discouraged or restricted, does the company enable workers to gather independently to discuss work-related problems?',
    title: annualReviewQuestionsTitle.labour.key,
    subtitle: annualReviewQuestionsSubTitle.freedomOfAssociation.key,
    orderby: 25,
  },
  doesTheCompanyTakeAllNecess: {
    value: 'doesTheCompanyTakeAllNecess',
    label: 'Does the company take all necessary measures to ensure that it does not participate in any form of forced or bonded labour?',
    title: annualReviewQuestionsTitle.labour.key,
    subtitle: annualReviewQuestionsSubTitle.forcedLabour.key,
    orderby: 26,
  },
  doesTheCompanyComplyWithMinim: {
    value: 'doesTheCompanyComplyWithMinim',
    label: 'Does the company comply with minimum age standards?',
    title: annualReviewQuestionsTitle.labour.key,
    subtitle: annualReviewQuestionsSubTitle.childLabour.key,
    orderby: 27,
  },
  doesTheCompanyEnsureThatEmploym: {
    value: 'doesTheCompanyEnsureThatEmploym',
    label: 'Does the company ensure that employment-related decisions are based on relevant and objective criteria?',
    title: annualReviewQuestionsTitle.labour.key,
    subtitle: annualReviewQuestionsSubTitle.discrimination.key,
    orderby: 28,
  },
  // Environment
  doesTheCompanySupportAPrecautio: {
    value: 'doesTheCompanySupportAPrecautio',
    label: 'Does the company support a precautionary approach to environmental issues?',
    title: annualReviewQuestionsTitle.environment.key,
    subtitle: annualReviewQuestionsSubTitle.precaution.key,
    orderby: 29,
  },
  doesTheCompanyHaveEmerge: {
    value: 'doesTheCompanyHaveEmerge',
    label: 'Does the company have emergency procedures in place to prevent and address accidents affecting the environment and human health?',
    title: annualReviewQuestionsTitle.environment.key,
    subtitle: annualReviewQuestionsSubTitle.precaution.key,
    orderby: 30,
  },
  doesTheCompanyTakeMeasuresToPreven: {
    value: 'doesTheCompanyTakeMeasuresToPreven',
    label: 'Does the company take measures to prevent and reduce energy consumption and emissions of greenhouse gases?',
    title: annualReviewQuestionsTitle.environment.key,
    subtitle: annualReviewQuestionsSubTitle.responsibilityAndPerformance.key,
    orderby: 31,
  },
  doesTheCompanyTakeMeasur: {
    value: 'doesTheCompanyTakeMeasur',
    label: 'Does the company take measures to reduce water consumption and treat waste water?',
    title: annualReviewQuestionsTitle.environment.key,
    subtitle: annualReviewQuestionsSubTitle.responsibilityAndPerformance.key,
    orderby: 32,
  },
  doesTheCompanyTakeMeasuresToPreve: {
    value: 'doesTheCompanyTakeMeasuresToPreve',
    label: 'Does the company take measures to prevent and reduce the production of waste and ensure responsible waste management?',
    title: annualReviewQuestionsTitle.environment.key,
    subtitle: annualReviewQuestionsSubTitle.responsibilityAndPerformance.key,
    orderby: 33,
  },
  doesTheCompanyPreventReduceAndTreatAir: {
    value: 'doesTheCompanyPreventReduceAndTreatAir',
    label: 'Does the company prevent, reduce and treat air emissions?',
    title: annualReviewQuestionsTitle.environment.key,
    subtitle: annualReviewQuestionsSubTitle.responsibilityAndPerformance.key,
    orderby: 34,
  },
  doesTheCompanyPreventAndReduceImpactsO: {
    value: 'doesTheCompanyPreventAndReduceImpactsO',
    label: 'Does the company prevent and reduce impacts on the surrounding environment from noise, odour, light and vibrations?',
    title: annualReviewQuestionsTitle.environment.key,
    subtitle: annualReviewQuestionsSubTitle.responsibilityAndPerformance.key,
    orderby: 35,
  },
  doesTheCompanyMinimiseTheUs: {
    value: 'doesTheCompanyMinimiseTheUs',
    label: 'Does the company minimise the use and ensure safe handling and storage of chemicals and other dangerous substances?',
    title: annualReviewQuestionsTitle.environment.key,
    subtitle: annualReviewQuestionsSubTitle.responsibilityAndPerformance.key,
    orderby: 36,
  },
  doesTheCompanyPreventMinimiseAndRemedyNegativeImpactsOnBiodi: {
    value: 'doesTheCompanyPreventMinimiseAndRemedyNegativeImpactsOnBiodi',
    label: 'Does the company prevent, minimise and remedy negative impacts on biodiversity?',
    title: annualReviewQuestionsTitle.environment.key,
    subtitle: annualReviewQuestionsSubTitle.responsibilityAndPerformance.key,
    orderby: 37,
  },
  doesTheCompanyEnsureThatNaturalResou: {
    value: 'doesTheCompanyEnsureThatNaturalResou',
    label: 'Does the company ensure that natural resources are used in a sustainable manner?',
    title: annualReviewQuestionsTitle.environment.key,
    subtitle: annualReviewQuestionsSubTitle.responsibilityAndPerformance.key,
    orderby: 38,
  },
  desTheCompanyEncourageTheDevelopm: {
    value: 'desTheCompanyEncourageTheDevelopm',
    label: 'Does the company encourage the development and use of environmentally friendly technologies?',
    title: annualReviewQuestionsTitle.environment.key,
    subtitle: annualReviewQuestionsSubTitle.technology.key,
    orderby: 39,
  },
  // Anti Corruption
  doesTheCompanyTakeAClearStandAg: {
    value: 'doesTheCompanyTakeAClearStandAg',
    label: 'Does the company take a clear stand against corruption?',
    title: annualReviewQuestionsTitle.antiCorruption.key,
    subtitle: annualReviewQuestionsSubTitle.companyCultureAndProcedures.key,
    orderby: 40,
  },
  doesTheCompanyAssessTheRis: {
    value: 'doesTheCompanyAssessTheRis',
    label: 'Does the company assess the risk of corruption when doing business?',
    title: annualReviewQuestionsTitle.antiCorruption.key,
    subtitle: annualReviewQuestionsSubTitle.companyCultureAndProcedures.key,
    orderby: 41,
  },
  doesTheCompanyEnsureThatRelev: {
    value: 'doesTheCompanyEnsureThatRelev',
    label: 'Does the company ensure that relevant workers are properly trained?',
    title: annualReviewQuestionsTitle.antiCorruption.key,
    subtitle: annualReviewQuestionsSubTitle.companyCultureAndProcedures.key,
    orderby: 42,
  },
  doTheCompanysInternalProceduresSu: {
    value: 'doTheCompanysInternalProceduresSu',
    label: 'Do the company\'s internal procedures support its anti-corruption commitment?',
    title: annualReviewQuestionsTitle.antiCorruption.key,
    subtitle: annualReviewQuestionsSubTitle.companyCultureAndProcedures.key,
    orderby: 43,
  },
  doesTheCompanysAntiCorruptionInitiativeCo: {
    value: 'doesTheCompanysAntiCorruptionInitiativeCo',
    label: 'Does the company\'s anti-corruption initiative cover agents, intermediaries and consultants?',
    title: annualReviewQuestionsTitle.antiCorruption.key,
    subtitle: annualReviewQuestionsSubTitle.companyCultureAndProcedures.key,
    orderby: 44,
  },
  doesTheCompanyTakeJointActio: {
    value: 'doesTheCompanyTakeJointActio',
    label: 'Does the company take joint actions with others to engage in and promote anti-corruption initiatives?',
    title: annualReviewQuestionsTitle.antiCorruption.key,
    subtitle: annualReviewQuestionsSubTitle.jointActions.key,
    orderby: 45,
  },

}))

export {annualReviewQuestionsTitle, annualReviewQuestionsSubTitle, annualReviewQuestions}


