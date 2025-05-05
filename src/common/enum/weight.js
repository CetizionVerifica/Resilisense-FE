import { generateKeys, generateLocalization } from "../utils";

const weightCompanyPerformanceDocAssessment = generateLocalization(
  "weightCompanyPerformanceDocAssessment",
  generateKeys({
    weightNA: {
      value: 0,
      percentageLimit: 0,
      label: "No",
      group: "companyPerformanceWeight",
      orderby: 0,
      color: "#c10003",
    },
    weight1: {
      value: 1,
      percentageLimit: 25,
      label: 'Poor',
      group: 'companyPerformanceWeight',
      orderby: 1,
      color: '#ee7d39',
    },
    weight2: {
      value: 2,
      percentageLimit: 50,
      label: 'Acceptable',
      group: 'companyPerformanceWeight',
      orderby: 2,
      color: '#ffda70',
    },
    weight3: {
      value: 3,
      percentageLimit: 75,
      label: 'Good',
      group: 'companyPerformanceWeight',
      orderby: 3,
      color: '#a8d192',
    },
    weight4: {
      value: 4,
      percentageLimit: 100,
      label: "Yes",
      group: "companyPerformanceWeight",
      orderby: 4,
      color: "#53833c",
    },
  })
);
const weightCompanyPerformance = generateLocalization(
  "weightCompanyPerformance",
  generateKeys({
    weightNA: {
      value: 0,
      percentageLimit: 0,
      label: "No",
      group: "companyPerformanceWeight",
      orderby: 0,
      color: "#c10003",
    },
    // weight1: {
    //   value: 1,
    //   percentageLimit: 25,
    //   label: '1 - Poor',
    //   group: 'companyPerformanceWeight',
    //   orderby: 1,
    //   color: '#ee7d39',
    // },
    // weight2: {
    //   value: 2,
    //   percentageLimit: 50,
    //   label: '2 - Acceptable',
    //   group: 'companyPerformanceWeight',
    //   orderby: 2,
    //   color: '#ffda70',
    // },
    // weight3: {
    //   value: 3,
    //   percentageLimit: 75,
    //   label: '3 - Good',
    //   group: 'companyPerformanceWeight',
    //   orderby: 3,
    //   color: '#a8d192',
    // },
    weight4: {
      value: 4,
      percentageLimit: 100,
      label: "Yes",
      group: "companyPerformanceWeight",
      orderby: 4,
      color: "#53833c",
    },
  })
);
const customWeightCompanyPerformance_v_1_5_2_4 = generateLocalization(
  "customWeightCompanyPerformance_v_1_5_2_4",
  generateKeys({
    weightNA: {
      value: 0,
      percentageLimit: 0,
      label: "Does not",
      group: "companyPerformanceWeight",
      orderby: 0,
      color: "#c10003",
    },
    weight4: {
      value: 4,
      percentageLimit: 100,
      label: "Does",
      group: "companyPerformanceWeight",
      orderby: 4,
      color: "#53833c",
    },
  })
);
const customWeightCompanyPerformance_v_1_1_2_3 = generateLocalization(
  "customWeightCompanyPerformance_v_1_1_2_3",
  generateKeys({
    weightNA: {
      value: 0,
      percentageLimit: 0,
      label: "No",
      group: "companyPerformanceWeight",
      orderby: 0,
      color: "#c10003",
    },
    weight2: {
      value: 2,
      percentageLimit: 0,
      label: "Yes - what is required by law",
      group: "companyPerformanceWeight",
      orderby: 0,
      color: "#ee7d39",
    },
    weight4: {
      value: 4,
      percentageLimit: 100,
      label: "Yes - over and above what is required by law",
      group: "companyPerformanceWeight",
      orderby: 4,
      color: "#53833c",
    },
  })
);

const revisedScorePerformance = generateLocalization(
  "revisedScorePerformance",
  generateKeys({
    weightNA: {
      value: 0,
      percentageLimit: 19,
      label: "Very poor",
      group: "revisedScorePerformance",
      orderby: 0,
      color: "#c10003",
    },
    weight1: {
      value: 1,
      percentageLimit: 39,
      label: "Poor",
      group: "revisedScorePerformance",
      orderby: 1,
      color: "#ee7d39",
    },
    weight2: {
      value: 2,
      percentageLimit: 59,
      label: "Acceptable",
      group: "revisedScorePerformance",
      orderby: 2,
      color: "#ffda70",
    },
    weight3: {
      value: 3,
      percentageLimit: 79,
      label: "Good",
      group: "revisedScorePerformance",
      orderby: 3,
      color: "#a8d192",
    },
    weight4: {
      value: 4,
      percentageLimit: 100,
      label: "Very good",
      group: "revisedScorePerformance",
      orderby: 4,
      color: "#53833c",
    },
  })
);

const weightRelevanceSignificance = generateLocalization(
  "weightRelevanceSignificance",
  generateKeys({
    weightNA: {
      value: 0,
      label: "0 - N/A",
      group: "companyPerformanceWeight",
      orderby: 0,
    },
    weight1: {
      value: 1,
      label: "1 - Very Low",
      group: "companyRelevanceSignificanceWeight",
      orderby: 1,
    },
    weight2: {
      value: 2,
      label: "2 - Low",
      group: "companyRelevanceSignificanceWeight",
      orderby: 2,
    },
    weight3: {
      value: 3,
      label: "3 - Average",
      group: "companyRelevanceSignificanceWeight",
      orderby: 3,
    },
    weight4: {
      value: 4,
      label: "4 - High",
      group: "companyRelevanceSignificanceWeight",
      orderby: 4,
    },
    weight5: {
      value: 5,
      label: "5 - Very high",
      group: "companyRelevanceSignificanceWeight",
      orderby: 5,
    },
  })
);

const weightStakeholder = generateLocalization(
  "weightStakeholder",
  generateKeys({
    weight0: {
      value: 0,
      label: "0% - N/A",
      group: "companyStakeholderWeight",
      orderby: 0,
    },
    weight10: {
      value: 10,
      label: "10% - ",
      group: "companyStakeholderWeight",
      orderby: 1,
    },
    weight20: {
      value: 20,
      label: "20% - ",
      group: "companyStakeholderWeight",
      orderby: 2,
    },
    weight30: {
      value: 30,
      label: "30% - ",
      group: "companyStakeholderWeight",
      orderby: 3,
    },
    weight40: {
      value: 40,
      label: "40% - ",
      group: "companyStakeholderWeight",
      orderby: 4,
    },
    weight50: {
      value: 50,
      label: "50% - ",
      group: "companyStakeholderWeight",
      orderby: 4,
    },
    weight60: {
      value: 60,
      label: "60% - ",
      group: "companyStakeholderWeight",
      orderby: 5,
    },
    weight70: {
      value: 70,
      label: "70% - ",
      group: "companyStakeholderWeight",
      orderby: 6,
    },
    weight80: {
      value: 80,
      label: "80% - ",
      group: "companyStakeholderWeight",
      orderby: 7,
    },
    weight90: {
      value: 90,
      label: "90% - ",
      group: "companyStakeholderWeight",
      orderby: 8,
    },
    weight100: {
      value: 100,
      label: "100% - ",
      group: "companyStakeholderWeight",
      orderby: 9,
    },
  })
);

export {
  weightCompanyPerformance,
  revisedScorePerformance,
  weightRelevanceSignificance,
  weightStakeholder,
  customWeightCompanyPerformance_v_1_1_2_3,
  customWeightCompanyPerformance_v_1_5_2_4,
  weightCompanyPerformanceDocAssessment
};
