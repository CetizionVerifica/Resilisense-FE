import React from 'react'
import {Row, Col, Popover, Tag} from 'antd'
import {values, filter, get, find} from 'lodash'
import classnames from 'classnames'
import {issueLevel} from '../../../common/enum/issueLevel'
import {
  weightCompanyPerformance,
  revisedScorePerformance,
  weightCompanyPerformanceDocAssessment,
  weightRelevanceSignificance} from '../../../common/enum/weight'
import {coreSubjectNames} from '../../../common/coreSubjectNames'
import {issueOfInterest} from '../../../common/issueOfInterest'
import IssueLevelTable from '../../styles/issueLevelTable.style'


const coreSubjectOptions = values(coreSubjectNames).map(coreSubject => {
  return {
    value: coreSubject.value,
    label: coreSubject.label,
    children: values(filter(issueOfInterest, {coreSubject: coreSubject.key})).map(issue => {
      return {
        value: issue.value,
        label: issue.label,
      }
    }),
  }
})

const issueLevelTableInfo = (relevance, performace) => {
  return (<IssueLevelTable>
    <div className="performanceLabel"> Company   <br />   Performance </div>
    <Row justify="space-between">
      <Col md={4} sm={4} xs={4} className="labelCol">0</Col>
      <Col md={4} sm={4} xs={4}
        className={classnames({slectedBox: performace === 0 && relevance === 1})}
        style={{background: get(issueLevel.level5, 'color')}}
      >
        {get(issueLevel.level5, 'label')}
      </Col>
      <Col md={4} sm={4} xs={4}
        className={classnames({slectedBox: performace === 0 && relevance === 2})}
        style={{background: get(issueLevel.level6, 'color')}}
      >
        {get(issueLevel.level6, 'label')}
      </Col>
      <Col md={4} sm={4} xs={4}
        className={classnames({slectedBox: performace === 0 && relevance === 3})}
        style={{background: get(issueLevel.level7, 'color')}}
      >
        {get(issueLevel.level7, 'label')}
      </Col>
      <Col md={4} sm={4} xs={4}
        className={classnames({slectedBox: performace === 0 && relevance === 4})}
        style={{background: get(issueLevel.level8, 'color')}}
      >
        {get(issueLevel.level8, 'label')}
      </Col>
      <Col md={4} sm={4} xs={4}
        className={classnames({slectedBox: performace === 0 && relevance === 5})}
        style={{background: get(issueLevel.level9, 'color')}}
      >
        {get(issueLevel.level9, 'label')}
      </Col>
    </Row>
    <Row justify="space-between">
      <Col md={4} sm={4} xs={4} className="labelCol">1</Col>
      <Col md={4} sm={4} xs={4}
        className={classnames({slectedBox: performace === 1 && relevance === 1})}
        style={{background: get(issueLevel.level4, 'color')}}
      >
        {get(issueLevel.level4, 'label')}
      </Col>
      <Col md={4} sm={4} xs={4}
        className={classnames({slectedBox: performace === 1 && relevance === 2})}
        style={{background: get(issueLevel.level5, 'color')}}
      >
        {get(issueLevel.level5, 'label')}
      </Col>
      <Col md={4} sm={4} xs={4}
        className={classnames({slectedBox: performace === 1 && relevance === 3})}
        style={{background: get(issueLevel.level6, 'color')}}
      >
        {get(issueLevel.level6, 'label')}
      </Col>
      <Col md={4} sm={4} xs={4}
        className={classnames({slectedBox: performace === 1 && relevance === 4})}
        style={{background: get(issueLevel.level7, 'color')}}
      >
        {get(issueLevel.level7, 'label')}
      </Col>
      <Col md={4} sm={4} xs={4}
        className={classnames({slectedBox: performace === 1 && relevance === 5})}
        style={{background: get(issueLevel.level8, 'color')}}
      >
        {get(issueLevel.level8, 'label')}
      </Col>
    </Row>
    <Row justify="space-between">
      <Col md={4} sm={4} xs={4} className="labelCol">2</Col>
      <Col md={4} sm={4} xs={4}
        className={classnames({slectedBox: performace === 2 && relevance === 1})}
        style={{background: get(issueLevel.level3, 'color')}}
      >
        {get(issueLevel.level3, 'label')}
      </Col>
      <Col md={4} sm={4} xs={4}
        className={classnames({slectedBox: performace === 2 && relevance === 2})}
        style={{background: get(issueLevel.level4, 'color')}}
      >
        {get(issueLevel.level4, 'label')}
      </Col>
      <Col md={4} sm={4} xs={4}
        className={classnames({slectedBox: performace === 2 && relevance === 3})}
        style={{background: get(issueLevel.level5, 'color')}}
      >
        {get(issueLevel.level5, 'label')}
      </Col>
      <Col md={4} sm={4} xs={4}
        className={classnames({slectedBox: performace === 2 && relevance === 4})}
        style={{background: get(issueLevel.level6, 'color')}}
      >
        {get(issueLevel.level6, 'label')}
      </Col>
      <Col md={4} sm={4} xs={4}
        className={classnames({slectedBox: performace === 2 && relevance === 5})}
        style={{background: get(issueLevel.level7, 'color')}}
      >
        {get(issueLevel.level7, 'label')}
      </Col>
    </Row>
    <Row justify="space-between">
      <Col md={4} sm={4} xs={4} className="labelCol">3</Col>
      <Col md={4} sm={4} xs={4}
        className={classnames({slectedBox: performace === 3 && relevance === 1})}
        style={{background: get(issueLevel.level2, 'color')}}
      >
        {get(issueLevel.level2, 'label')}
      </Col>
      <Col md={4} sm={4} xs={4}
        className={classnames({slectedBox: performace === 3 && relevance === 2})}
        style={{background: get(issueLevel.level3, 'color')}}
      >
        {get(issueLevel.level3, 'label')}
      </Col>
      <Col md={4} sm={4} xs={4}
        className={classnames({slectedBox: performace === 3 && relevance === 3})}
        style={{background: get(issueLevel.level4, 'color')}}
      >
        {get(issueLevel.level4, 'label')}
      </Col>
      <Col md={4} sm={4} xs={4}
        className={classnames({slectedBox: performace === 3 && relevance === 4})}
        style={{background: get(issueLevel.level5, 'color')}}
      >
        {get(issueLevel.level5, 'label')}
      </Col>
      <Col md={4} sm={4} xs={4}
        className={classnames({slectedBox: performace === 3 && relevance === 5})}
        style={{background: get(issueLevel.level6, 'color')}}
      >
        {get(issueLevel.level6, 'label')}
      </Col>
    </Row>
    <Row justify="space-between">
      <Col md={4} sm={4} xs={4} className="labelCol">4</Col>
      <Col md={4} sm={4} xs={4}
        className={classnames({slectedBox: performace === 4 && relevance === 1})}
        style={{background: get(issueLevel.level1, 'color')}}
      >
        {get(issueLevel.level1, 'label')}
      </Col>
      <Col md={4} sm={4} xs={4}
        className={classnames({slectedBox: performace === 4 && relevance === 2})}
        style={{background: get(issueLevel.level2, 'color')}}
      >
        {get(issueLevel.level2, 'label')}
      </Col>
      <Col md={4} sm={4} xs={4}

        className={classnames({slectedBox: performace === 4 && relevance === 3})}
        style={{background: get(issueLevel.level3, 'color')}}
      >
        {get(issueLevel.level3, 'label')}
      </Col>
      <Col md={4} sm={4} xs={4}
        className={classnames({slectedBox: performace === 4 && relevance === 4})}
        style={{background: get(issueLevel.level4, 'color')}}
      >
        {get(issueLevel.level4, 'label')}
      </Col>
      <Col md={4} sm={4} xs={4}
        className={classnames({slectedBox: performace === 4 && relevance === 5})}
        style={{background: get(issueLevel.level5, 'color')}}
      >
        {get(issueLevel.level5, 'label')}
      </Col>
    </Row>
    <Row justify="space-between">
      <Col md={4} sm={4} xs={4} />
      <Col md={4} sm={4} xs={4} className="labelCol">1</Col>
      <Col md={4} sm={4} xs={4} className="labelCol">2</Col>
      <Col md={4} sm={4} xs={4} className="labelCol">3</Col>
      <Col md={4} sm={4} xs={4} className="labelCol">4</Col>
      <Col md={4} sm={4} xs={4} className="labelCol">5</Col>
    </Row>
    <div className="relevanceLabel"> Relevance & Significance </div>
  </IssueLevelTable>
  )
}

const getIssueLevel = (keyConsideration) => {
  const issue = get(keyConsideration, 'issueLevel')
  const level = find(issueLevel, {level: issue})
  if (level && keyConsideration.relevanceValue !== 0) {
    return (
      <Popover
        content={issueLevelTableInfo(
          keyConsideration.relevanceValue,
          keyConsideration.actualPerformanceValue)}
        title="Performance score vs. relevance score - Key consideration"
      >
        <Tag color={get(level, 'color')}>{get(level, 'label')}</Tag>
      </Popover>)
  } else {
    return <span>N/A</span>
  }
}

const getCompanyPerformance = (performanceValue, value) => {
  // console.log("Performance: 1", performanceValue, value);
  
  const companyPerformance = find(weightCompanyPerformanceDocAssessment, {value: performanceValue})
  if (value === 'v_1_2_4_3')
  console.log('per', performanceValue, companyPerformance)
  if (companyPerformance) {
    return (<Tag
      color={get(companyPerformance, 'color')}
      style={{width: '100%', textAlign: 'center'}}
    >
      {get(companyPerformance, 'label')}
    </Tag>)
  } else {
    return <span>N/A</span>
  }
}

const getCompanyPerformanceStatusReport = (performanceValue, relevanceValue) => {
  const relevanceSignificance = find(weightRelevanceSignificance, {value: relevanceValue})
  if (!relevanceSignificance || relevanceSignificance.value === 0) {
    return <span>N/A</span>
  }

  return getCompanyPerformance(performanceValue)
}

const getRevisingScorePerformance = (score) => {
  // console.log("Performance: :", score);
  const companyPerformance = find(revisedScorePerformance, item => item.percentageLimit >= score)
  if (companyPerformance) {
    return (<Tag
      color={get(companyPerformance, 'color')}
      style={{width: '100%', textAlign: 'center'}}
    >
      {`${get(companyPerformance, 'label')} (${score}%)`}
    </Tag>)
  } else {
    return <span>N/A</span>
  }
}

const getRelevanceSignificance = (relevanceValue) => {
  const relevanceSignificance = find(weightRelevanceSignificance, {value: relevanceValue})
  if (relevanceSignificance) {
    return <span>{get(relevanceSignificance, 'label')}</span>
  } else {
    return <span>N/A</span>
  }
}

export {
  coreSubjectOptions,
  getIssueLevel,
  getCompanyPerformanceStatusReport,
  getCompanyPerformance,
  getRevisingScorePerformance,
  getRelevanceSignificance,
}
