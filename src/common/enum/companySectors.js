import {values, filter} from 'lodash'
import {generateKeys, generateLocalization} from '../utils'
const companySectors = generateLocalization('companySectors', generateKeys({
  primarySectorExtractionOfRawMaterials: {
    value: 'primarySectorExtractionOfRawMaterials',
    label: 'Primary sector - Extraction of raw materials',
    orderby: 0,
  },
  secondarySectorManufacturing: {
    value: 'secondarySectorManufacturing',
    label: 'Secondary sector - Manufacturing',
    orderby: 1,
  },
  tertiarySectorServices: {
    value: 'tertiarySectorServices',
    label: 'Tertiary sector - Services',
    orderby: 2,
  },
  quaternarySectorSpecialisedKnowledgeSkills: {
    value: 'quaternarySectorSpecialisedKnowledgeSkills',
    label: 'Quaternary sector - Specialised knowledge and skills',
    orderby: 3,
  },

}))

const companyTypes = generateLocalization('companyTypes', generateKeys({
  fishing: {
    value: 'fishing',
    label: 'Fishing',
    sector: companySectors.primarySectorExtractionOfRawMaterials.key,
    orderby: 0,
  },
  farming: {
    value: 'farming',
    label: 'Farming',
    sector: companySectors.primarySectorExtractionOfRawMaterials.key,
    orderby: 1,
  },
  landMining: {
    value: 'landMining',
    label: 'Land mining',
    sector: companySectors.primarySectorExtractionOfRawMaterials.key,
    orderby: 2,
  },
  seaMining: {
    value: 'seaMining',
    label: 'Sea mining',
    sector: companySectors.primarySectorExtractionOfRawMaterials.key,
    orderby: 3,
  },
  quarrying: {
    value: 'quarrying',
    label: 'Quarrying',
    sector: companySectors.primarySectorExtractionOfRawMaterials.key,
    orderby: 3,
  },
  forestry: {
    value: 'forestry',
    label: 'Forestry',
    sector: companySectors.primarySectorExtractionOfRawMaterials.key,
    orderby: 3,
  },
  agriculture: {
    value: 'agriculture',
    label: 'Agriculture',
    sector: companySectors.primarySectorExtractionOfRawMaterials.key,
    orderby: 3,
  },
  oilgas: {
    value: 'oilgas',
    label: 'Oil and Gas',
    sector: companySectors.primarySectorExtractionOfRawMaterials.key,
    orderby: 0,
  },
  automotiveIndustry: {
    value: 'automotiveIndustry',
    label: 'Automotive industry',
    sector: companySectors.secondarySectorManufacturing.key,
    orderby: 3,
  },
  electricalIndustry: {
    value: 'electricalIndustry',
    label: 'Electrical industry',
    sector: companySectors.secondarySectorManufacturing.key,
    orderby: 3,
  },
  chemicalIndustry: {
    value: 'chemicalIndustry',
    label: 'Chemical industry',
    sector: companySectors.secondarySectorManufacturing.key,
    orderby: 3,
  },
  metallurgicalIndustry: {
    value: 'metallurgicalIndustry',
    label: 'Metallurgical industry',
    sector: companySectors.secondarySectorManufacturing.key,
    orderby: 3,
  },
  constructionIndustry: {
    value: 'constructionIndustry',
    label: 'Construction industry',
    sector: companySectors.secondarySectorManufacturing.key,
    orderby: 3,
  },
  foodBeverageIndustry: {
    value: 'foodBeverageIndustry',
    label: 'Food & Beverage industry',
    sector: companySectors.secondarySectorManufacturing.key,
    orderby: 3,
  },

  glassIndustry: {
    value: 'glassIndustry',
    label: 'Glass industry',
    sector: companySectors.secondarySectorManufacturing.key,
    orderby: 3,
  },
  textileClothingIndustry: {
    value: 'textileClothingIndustry',
    label: 'Textile & Clothing industry',
    sector: companySectors.secondarySectorManufacturing.key,
    orderby: 3,
  },
  consumerGoodsIndustry: {
    value: 'consumerGoodsIndustry',
    label: 'Consumer Goods industry',
    sector: companySectors.secondarySectorManufacturing.key,
    orderby: 3,
  },
  hardware: {
    value: 'hardware',
    label: 'Hardware',
    sector: companySectors.secondarySectorManufacturing.key,
    orderby: 3,
  },
  aeronauticalIndustry: {
    value: 'aeronauticalIndustry',
    label: 'Aeronautical industry',
    sector: companySectors.secondarySectorManufacturing.key,
    orderby: 3,
  },
  shippingIndustry: {
    value: 'shippingIndustry',
    label: 'Shipping industry',
    sector: companySectors.secondarySectorManufacturing.key,
    orderby: 3,
  },
  spaceIndustry: {
    value: 'spaceIndustry',
    label: 'Space industry',
    sector: companySectors.secondarySectorManufacturing.key,
    orderby: 3,
  },
  retail: {
    value: 'retail',
    label: 'Retail',
    sector: companySectors.tertiarySectorServices.key,
    orderby: 3,
  },
  shipping: {
    value: 'shipping',
    label: 'Shipping',
    sector: companySectors.tertiarySectorServices.key,
    orderby: 3,
  },
  hotelAccommodation: {
    value: 'hotelAccommodation',
    label: 'Hotel & Accommodation',
    sector: companySectors.tertiarySectorServices.key,
    orderby: 3,
  },
  storage: {
    value: 'storage',
    label: 'Storage',
    sector: companySectors.tertiarySectorServices.key,
    orderby: 3,
  },
  craftsRepairs: {
    value: 'craftsRepairs',
    label: 'Crafts & Repairs',
    sector: companySectors.tertiarySectorServices.key,
    orderby: 3,
  },
  governmentPublicAdministration: {
    value: 'governmentPublicAdministration',
    label: 'Government & Public Administration',
    sector: companySectors.tertiarySectorServices.key,
    orderby: 3,
  },
  tourism: {
    value: 'tourism',
    label: 'Tourism',
    sector: companySectors.tertiarySectorServices.key,
    orderby: 3,
  },
  tradeProcurement: {
    value: 'tradeProcurement',
    label: 'Trade and Procurement',
    sector: companySectors.tertiarySectorServices.key,
    orderby: 3,
  },
  entertainmentCultureSport: {
    value: 'entertainmentCultureSport',
    label: 'Entertainment, Culture and Sport',
    sector: companySectors.tertiarySectorServices.key,
    orderby: 3,
  },
  distributionLogistics: {
    value: 'distributionLogistics',
    label: 'Distribution & Logistics',
    sector: companySectors.tertiarySectorServices.key,
    orderby: 3,
  },
  aeronautical: {
    value: 'aeronautical',
    label: 'Aeronautical',
    sector: companySectors.tertiarySectorServices.key,
    orderby: 3,
  },
  militaryServices: {
    value: 'militaryServices',
    label: 'Military services',
    sector: companySectors.tertiarySectorServices.key,
    orderby: 3,
  },
  cleaning: {
    value: 'cleaning',
    label: 'Cleaning',
    sector: companySectors.tertiarySectorServices.key,
    orderby: 3,
  },
  computingSoftwareDevelopment: {
    value: 'computingSoftwareDevelopment',
    label: 'Computing & Software Development',
    sector: companySectors.quaternarySectorSpecialisedKnowledgeSkills.key,
    orderby: 3,
  },
  informationCommunicationsTechnology: {
    value: 'informationCommunicationsTechnology',
    label: 'Information and Communications Technology (ICT)',
    sector: companySectors.quaternarySectorSpecialisedKnowledgeSkills.key,
    orderby: 3,
  },
  consultancyAdviceLegalExpertServices: {
    value: 'consultancyAdviceLegalExpertServices',
    label: 'Consultancy, Advice, Legal and Expert services',
    sector: companySectors.quaternarySectorSpecialisedKnowledgeSkills.key,
    orderby: 3,
  },
  researchDevelopment: {
    value: 'researchDevelopment',
    label: 'Research & Development (R&D)',
    sector: companySectors.quaternarySectorSpecialisedKnowledgeSkills.key,
    orderby: 3,
  },
  researchInnovation: {
    value: 'researchInnovation',
    label: 'Research & Innovation (R&I)',
    sector: companySectors.quaternarySectorSpecialisedKnowledgeSkills.key,
    orderby: 3,
  },
  mediaInformationPromotion: {
    value: 'mediaInformationPromotion',
    label: 'Media, Information and Promotion (incl. Marketing)',
    sector: companySectors.quaternarySectorSpecialisedKnowledgeSkills.key,
    orderby: 3,
  },
  heatlhSocialCare: {
    value: 'heatlhSocialCare',
    label: 'Heatlh and Social Care',
    sector: companySectors.quaternarySectorSpecialisedKnowledgeSkills.key,
    orderby: 3,
  },
  financialServices: {
    value: 'financialServices',
    label: 'Financial Services',
    sector: companySectors.quaternarySectorSpecialisedKnowledgeSkills.key,
    orderby: 3,
  },
  education: {
    value: 'education',
    label: 'Education',
    sector: companySectors.quaternarySectorSpecialisedKnowledgeSkills.key,
    orderby: 3,
  },

}))

const companySectorTypes = values(companySectors).map(sector => {
  return {
    value: sector.value,
    label: sector.label,
    children: values(filter(companyTypes, {sector: sector.value})).map(type => {
      return {
        value: type.value,
        label: type.label,
      }
    }),
  }
})

export {companySectors, companyTypes, companySectorTypes}
