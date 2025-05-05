import React from 'react'
import {generateKeys, generateLocalization} from './utils'
const coreSubjectNames = generateLocalization('gapAnalysisQuestions', generateKeys({
  organizationalGovernance: {
    value: 'organizationalGovernance',
    label: 'Organisational Governance',
    labelTab: <span>Organisational <br />Governance</span>,
    labela: `Organisational
    Governance`,
    orderby: 1,
  },
  humanRights: {
    value: 'humanRights',
    label: 'Human Rights',
    labelTab: <span>Human <br />Rights</span>,
    labela: 'Human Rights',
    orderby: 2,
  },
  laborPractices: {
    value: 'laborPractices',
    label: 'Labour Practices',
    labelTab: <span>Labour <br />Practices</span>,
    labela: 'Labour Practices',
    orderby: 3,
  },
  theEnvironment: {
    value: 'theEnvironment',
    label: 'The Environment',
    labelTab: <span>The <br />Environment</span>,
    labela: 'The Environment',
    orderby: 4,
  },
  fairOperatingPractices: {
    value: 'fairOperatingPractices',
    label: 'Fair Operating Practices',
    labelTab: <span>Fair Operating<br />Practices</span>,
    labela: `Fair Operating
    Practices`,
    orderby: 5,
  },
  consumerIssues: {
    value: 'consumerIssues',
    label: 'Consumer Issues',
    labelTab: <span>Consumer<br />Issues</span>,
    labela: 'Consumer Issues',
    orderby: 6,
  },
  communityInvolvementAndDevelopment: {
    value: 'communityInvolvementAndDevelopment',
    label: 'Community Involvement And Development',
    labelTab: <span>Community<br />Involvement & Development</span>,
    labela: `Community
    Involvement &
    Development`,
    orderby: 7,
  },

}))

export {coreSubjectNames}
