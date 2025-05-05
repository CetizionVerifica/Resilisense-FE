import {get, find, sumBy, round, filter} from 'lodash'
import {assessmentCriteria} from '../../common/assessmentCriteria'

export const getFileScore = (file, kc) => {
  let score = 0

  Object.keys(assessmentCriteria).forEach(criterion => {
    const fileCriterion = find(file.criteria, {name: criterion})
    const crValue = get(fileCriterion, 'value')

    if (crValue) {
      score += 20
    }
  })

  const fileCriterion = find(file.criteria, {name: kc})
  const crValue = get(fileCriterion, 'value')

  if (crValue) {
    score += 40
  } else {
    score = 25
  }

  return score
}

export const getCriteriaValues = (file, kc) => {
  const result = {}

  Object.keys(assessmentCriteria).forEach(criterion => {
    const fileCriterion = find(file.criteria, {name: criterion})
    const crValue = get(fileCriterion, 'value', null)
    let displayValue = 'N'

    if (crValue === null) {
      displayValue = '-'
    } else if (crValue) {
      displayValue = 'Y'
    }

    result[criterion] = displayValue
  })

  const fileCriterion = find(file.criteria, {name: kc})
  const crValue = get(fileCriterion, 'value', null)
  let displayValue = 'N'

  if (crValue === null) {
    displayValue = '-'
  } else if (crValue) {
    displayValue = 'Y'
  }

  result.kcCriterion = displayValue

  return result
}

export const getFileProgress = (file) => {
  const totalCriteria = file.keyConsiderations.length + Object.keys(assessmentCriteria).length
  return round((file.criteria.length / totalCriteria) * 100, 1)
}

export const getAssessmentProgress = (gapFiles) => {
  const files = filter(gapFiles, f => f.keyConsiderations.length > 0)
  const totalKC = sumBy(files, 'keyConsiderations.length') + (Object.keys(assessmentCriteria).length * files.length)
  const filledCriteria = sumBy(files, 'criteria.length')

  return round((filledCriteria / totalKC) * 100, 1)
}

