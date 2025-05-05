import {values, filter} from 'lodash'
import {generateKeys, generateLocalization} from './utils'
import {coreSubjectNames} from './coreSubjectNames'
const issueOfInterest = generateLocalization('issueOfInterest', generateKeys({
  /* Organizational Governance */
  ethicalConduct: {
    value: 'ethicalConduct',
    label: 'Ethical Conduct',
    coreSubject: coreSubjectNames.organizationalGovernance.key,
    orderby: 0,
  },
  transparency: {
    value: 'transparency',
    label: 'Transparency',
    coreSubject: coreSubjectNames.organizationalGovernance.key,
    orderby: 1,
  },
  respectOfRuleOfLaw: {
    value: 'respectOfRuleOfLaw',
    label: 'Respect Of Rule Of Law',
    coreSubject: coreSubjectNames.organizationalGovernance.key,
    orderby: 2,
  },
  accountability: {
    value: 'accountability',
    label: 'Accountability',
    coreSubject: coreSubjectNames.organizationalGovernance.key,
    orderby: 3,
  },
  corporateGovernance: {
    value: 'corporateGovernance',
    label: 'Corporate Governance',
    coreSubject: coreSubjectNames.organizationalGovernance.key,
    orderby: 4,
  },
  /* Human Rights */
  dueDiligence: {
    value: 'dueDiligence',
    label: 'Due Diligence',
    coreSubject: coreSubjectNames.humanRights.key,
    orderby: 0,
  },
  humanRightsRisksSituations: {
    value: 'humanRightsRisksSituations',
    label: 'Human Rights Risks Situations',
    coreSubject: coreSubjectNames.humanRights.key,
    orderby: 1,
  },
  avoindanceOfComplicity: {
    value: 'avoindanceOfComplicity',
    label: 'Avoidance Of Complicity',
    coreSubject: coreSubjectNames.humanRights.key,
    orderby: 2,
  },
  resolvingGievances: {
    value: 'resolvingGievances',
    label: 'Resolving Grievances',
    coreSubject: coreSubjectNames.humanRights.key,
    orderby: 3,
  },
  discriminationAndVulnerableGroups: {
    value: 'discriminationAndVulnerableGroups',
    label: 'Discrimination And Vulnerable Groups',
    coreSubject: coreSubjectNames.humanRights.key,
    orderby: 4,
  },
  civilAndPoliticalRights: {
    value: 'civilAndPoliticalRights',
    label: 'Civil And Political Rights',
    coreSubject: coreSubjectNames.humanRights.key,
    orderby: 5,
  },
  economicSocialAndCulturalRights: {
    value: 'economicSocialAndCulturalRights',
    label: 'Economic Social And Cultural Rights',
    coreSubject: coreSubjectNames.humanRights.key,
    orderby: 6,
  },
  fundamentalPrinciplesAndRightsAtWork: {
    value: 'fundamentalPrinciplesAndRightsAtWork',
    label: 'Fundamental Principles And Rights At Work',
    coreSubject: coreSubjectNames.humanRights.key,
    orderby: 7,
  },
  /* Labour Practices */
  employmentAndEmploymentRelationships: {
    value: 'employmentAndEmploymentRelationships',
    label: 'Employment And Employment Relationships',
    coreSubject: coreSubjectNames.laborPractices.key,
    orderby: 0,
  },
  conditionsOfWorkAndSocialProtection: {
    value: 'conditionsOfWorkAndSocialProtection',
    label: 'Conditions Of Work And Social Protection',
    coreSubject: coreSubjectNames.laborPractices.key,
    orderby: 1,
  },
  socialDialogue: {
    value: 'socialDialogue',
    label: 'Social Dialogue',
    coreSubject: coreSubjectNames.laborPractices.key,
    orderby: 2,
  },
  healthAndSafetyAtWork: {
    value: 'healthAndSafetyAtWork',
    label: 'Health And Safety At Work',
    coreSubject: coreSubjectNames.laborPractices.key,
    orderby: 3,
  },
  humanDevelopmentAndTrainingInTheWorkplace: {
    value: 'humanDevelopmentAndTrainingInTheWorkplace',
    label: 'Human Development And Training In The Workplace',
    coreSubject: coreSubjectNames.laborPractices.key,
    orderby: 4,
  },
  /* The Environment */
  preventionOfPollution: {
    value: 'preventionOfPollution',
    label: 'Prevention Of Pollution',
    coreSubject: coreSubjectNames.theEnvironment.key,
    orderby: 0,
  },
  sustainableResourceUse: {
    value: 'sustainableResourceUse',
    label: 'Sustainable Resource Use',
    coreSubject: coreSubjectNames.theEnvironment.key,
    orderby: 1,
  },
  climateChangeMitigationAndAdaptation: {
    value: 'climateChangeMitigationAndAdaptation',
    label: 'Climate Change Mitigation And Adaptation',
    coreSubject: coreSubjectNames.theEnvironment.key,
    orderby: 2,
  },
  ProtectionOfTheEnvironmentBiodiversityAndRestorationOfNaturalHabitats: {
    value: 'ProtectionOfTheEnvironmentBiodiversityAndRestorationOfNaturalHabitats',
    label: 'Protection Of The Environment, Biodiversity And Restoration Of Natural Habitats',
    coreSubject: coreSubjectNames.theEnvironment.key,
    orderby: 3,
  },
  /* Fair Operating Practices */
  antiCorruption: {
    value: 'antiCorruption',
    label: 'Anti-corruption',
    coreSubject: coreSubjectNames.fairOperatingPractices.key,
    orderby: 0,
  },
  responsiblePoliticalInvolvement: {
    value: 'responsiblePoliticalInvolvement',
    label: 'Responsible Political Involvement',
    coreSubject: coreSubjectNames.fairOperatingPractices.key,
    orderby: 1,
  },
  fairCompetition: {
    value: 'fairCompetition',
    label: 'Fair Competition',
    coreSubject: coreSubjectNames.fairOperatingPractices.key,
    orderby: 2,
  },
  promotingSocialResponsibilityInTheValueChain: {
    value: 'promotingSocialResponsibilityInTheValueChain',
    label: 'Promoting Social Responsibility In The Value Chain',
    coreSubject: coreSubjectNames.fairOperatingPractices.key,
    orderby: 3,
  },
  respectForPropertyRights: {
    value: 'respectForPropertyRights',
    label: 'Respect For Property Rights',
    coreSubject: coreSubjectNames.fairOperatingPractices.key,
    orderby: 4,
  },
  /* Consumer Issues */
  fairMarketingFactualAndUnbiasedInformati: {
    value: 'fairMarketingFactualAndUnbiasedInformati',
    label: 'Fair Marketing, Factual And Unbiased Information And Fair Contractual Practices',
    coreSubject: coreSubjectNames.consumerIssues.key,
    orderby: 0,
  },
  protectingConsumersHealthAndSafety: {
    value: 'protectingConsumersHealthAndSafety',
    label: 'Protecting Consumers Health And Safety',
    coreSubject: coreSubjectNames.consumerIssues.key,
    orderby: 1,
  },
  sustainableConsumption: {
    value: 'sustainableConsumption',
    label: 'Sustainable Consumption',
    coreSubject: coreSubjectNames.consumerIssues.key,
    orderby: 2,
  },
  consumerServiceSupportAndComplai: {
    value: 'consumerServiceSupportAndComplai',
    label: 'Consumer Service, Support, And Complaint And Dispute Resolution',
    coreSubject: coreSubjectNames.consumerIssues.key,
    orderby: 3,
  },
  consumerDataProtectionAndPrivacy: {
    value: 'consumerDataProtectionAndPrivacy',
    label: 'Consumer Data Protection And Privacy',
    coreSubject: coreSubjectNames.consumerIssues.key,
    orderby: 4,
  },
  accessToEssentialServices: {
    value: 'accessToEssentialServices',
    label: 'Access To Essential Services',
    coreSubject: coreSubjectNames.consumerIssues.key,
    orderby: 5,
  },
  educationAndAwareness: {
    value: 'educationAndAwareness',
    label: 'Education And Awareness',
    coreSubject: coreSubjectNames.consumerIssues.key,
    orderby: 6,
  },
  /* Community Involvement and Development */
  communityInvolvement: {
    value: 'communityInvolvement',
    label: 'Community Involvement',
    coreSubject: coreSubjectNames.communityInvolvementAndDevelopment.key,
    orderby: 0,
  },
  educationAndCulture: {
    value: 'educationAndCulture',
    label: 'Education And Culture',
    coreSubject: coreSubjectNames.communityInvolvementAndDevelopment.key,
    orderby: 1,
  },
  employmentCreationAndSkillsDevelopment: {
    value: 'employmentCreationAndSkillsDevelopment',
    label: 'Employment Creation And Skills Development',
    coreSubject: coreSubjectNames.communityInvolvementAndDevelopment.key,
    orderby: 2,
  },
  technologyDevelopmentAndAccess: {
    value: 'technologyDevelopmentAndAccess',
    label: 'Technology Development And Access',
    coreSubject: coreSubjectNames.communityInvolvementAndDevelopment.key,
    orderby: 3,
  },
  wealthAndIncomeCreation: {
    value: 'wealthAndIncomeCreation',
    label: 'Wealth And Income Creation',
    coreSubject: coreSubjectNames.communityInvolvementAndDevelopment.key,
    orderby: 4,
  },
  health: {
    value: 'health',
    label: 'Health',
    coreSubject: coreSubjectNames.communityInvolvementAndDevelopment.key,
    orderby: 5,
  },
  socialInvestment: {
    value: 'socialInvestment',
    label: 'Social Investment',
    coreSubject: coreSubjectNames.communityInvolvementAndDevelopment.key,
    orderby: 6,
  },
}))

const coreSubjectIssuesOfInt = values(coreSubjectNames).map(coreSubjectName => {
  return {
    value: coreSubjectName.value,
    label: coreSubjectName.label,
    children: values(filter(issueOfInterest, {coreSubject: coreSubjectName.value})).map(type => {
      return {
        value: type.value,
        label: type.label,
      }
    }),
  }
})

export {issueOfInterest, coreSubjectIssuesOfInt}
