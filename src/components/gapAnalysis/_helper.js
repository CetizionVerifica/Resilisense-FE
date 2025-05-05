import { values, filter, find, get, round } from "lodash";
import { coreSubjectNames } from "../../common/coreSubjectNames";
import { issueOfInterest } from "../../common/issueOfInterest";
import { gapAnalysisQuestions } from "../../common/gapAnalysisQuestions";

const getTotalSettings = (key) => {
  let files = 0;
  let scores = 0;
  const existingKeyConsiderations = [];

  filter(issueOfInterest, { coreSubject: key }).map((issue) => {
    const issueOfI = filter(values(gapAnalysisQuestions), {
      isuueOfInterest: issue.key,
    });

    files += filter(issueOfI, { noDocument: false }).length;
    scores += issueOfI.length;
    existingKeyConsiderations.push(...issueOfI);
  });

  return { files, scores, key: existingKeyConsiderations };
};

const getCompletedSettings = (coreSubject) => {
  if (!coreSubject) {
    return { uploadedFiles: 0, withScore: 0 };
  }

  const existingKeyConsiderations = [];
  coreSubject.issueOfInterests.forEach((issueOfInterest) => {
    existingKeyConsiderations.push(...issueOfInterest.keyConsiderations);
  });

  const uploadedFiles = existingKeyConsiderations.filter((kConsideration) => {
    const relevance = get(kConsideration, "relevanceValue", null);

    if (!kConsideration.noDocument && relevance === 0) {
      return true;
    }

    return kConsideration.file !== null || kConsideration.noRelatedDocument;
  });
  const withScore = existingKeyConsiderations.filter((kConsideration) => {
    const relevance = get(kConsideration, "relevanceValue", null);
    const performance = get(kConsideration, "performanceValue", null);

    if (
      relevance === null &&
      gapAnalysisQuestions[kConsideration.keyConsideration] &&
      gapAnalysisQuestions[kConsideration.keyConsideration].dropdown !== 0
    ) {
      return false;
    }

    if (
      relevance !== 0 &&
      performance === null &&
      gapAnalysisQuestions[kConsideration.keyConsideration] &&
      gapAnalysisQuestions[kConsideration.keyConsideration].dropdown !== 0
    ) {
      return false;
    }

    return true;
  });

  return {
    uploadedFiles: uploadedFiles.length,
    withScore: withScore.length,
    key: existingKeyConsiderations,
  };
};

const getRelatedFilesPercent = (coreSubjects) => {
  let totalFiles = 0;
  let relatedFiles = 0;

  values(coreSubjectNames).forEach((item) => {
    const coreSubject = find(coreSubjects, { coreSubject: item.key });
    const { files } = getTotalSettings(item.key);
    const { uploadedFiles } = getCompletedSettings(coreSubject);

    totalFiles += files;
    relatedFiles += uploadedFiles;
  });

  return round((relatedFiles / totalFiles) * 100, 1);
};

export { getTotalSettings, getCompletedSettings, getRelatedFilesPercent };
