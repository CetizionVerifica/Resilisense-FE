import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {values, filter, find, get, round, sumBy} from 'lodash'
import {Button, List, Progress} from 'antd'
import {injectIntl} from 'react-intl'
import styled from 'styled-components'
import {commonMessages} from '../../messages'
import {projectStatuses} from '../../common/enum/projectStatuses'
import {coreSubjectNames} from '../../common/coreSubjectNames'
import {uploadedDocuments} from '../../common/uploadedDocuments'
import {gapAnalysisQuestions} from '../../common/gapAnalysisQuestions'
import {progressBar} from '../../common/tooltips'
import {getRelatedFilesPercent} from './_helper'
import InfoTooltip from '../utility/InfoTooltip'

const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

class GapList extends Component {

  renderProgress(item) {
    const {gapAnalysis} = this.props
    const totalQ = filter(values(gapAnalysisQuestions), {coreSubject: item.key}).length
    const totalQAnswer = get(find(gapAnalysis.coreSubjects, {coreSubject: item.key}), 'totalKeyConsiderations', 0)
    let progress = round((totalQAnswer * 100) / totalQ)

    if (item.key === 'uploadedDocuments') {
      const coreSubjects = get(gapAnalysis, 'coreSubjects')
      progress = getRelatedFilesPercent(coreSubjects)
    }

    return <Progress percent={progress} />
  }
  renderTotalProgress() {
    const {gapAnalysis} = this.props
    const totalQ = values(gapAnalysisQuestions).length
    const totalQAnswer = sumBy(gapAnalysis.coreSubjects, 'totalKeyConsiderations')
    const progress = round((totalQAnswer * 100) / totalQ)
    return <Progress percent={progress} />
  }

  render() {
    const {gapAnalysis, project, intl: {formatMessage}} = this.props
    const hasDocumentAssessmentReport = (project.status != projectStatuses.new.value && project.status != projectStatuses.firstAssessmentRequest.value  ) 
    const isProjectCompleted = (project.status != projectStatuses.new.value && project.status != projectStatuses.firstAssessmentRequest.value && project.status != projectStatuses.firstAssessmentCompleted.value && project.status != projectStatuses.secondAssessmentRequest.value ) 

    return (
      <List
        header={
          <ButtonsWrapper>
            <div>
              <Button type="primary"
                className=""
                style={{marginRight: 20}}
                onClick={() => this.props.history.push(`/gap/${gapAnalysis.id}`)}
              >
                {formatMessage(commonMessages.commonEdit)}
              </Button>
              <Button
                type="primary"
                style={{marginRight: 20}}
                disabled={!hasDocumentAssessmentReport}
                onClick={() => this.props.history.push(`/doc-assessment-report/${gapAnalysis.id}`)}
              >
                {formatMessage(commonMessages.documentationAssessment)}
              </Button>
              <Button
                type="dashed"
                disabled={!isProjectCompleted}
                onClick={() => this.props.history.push(`/gapresult/${gapAnalysis.id}`)}
              >
                {formatMessage(commonMessages.commonResults)}
              </Button>
            </div>
            <div>
              <InfoTooltip content={progressBar} />
            </div>
          </ButtonsWrapper>
        }
        footer={<div>Total {this.renderTotalProgress()}</div>}
        size="large"
        bordered
        dataSource={values({...coreSubjectNames, ...uploadedDocuments})}
        renderItem={item => (<List.Item>{formatMessage(item.localization)} {this.renderProgress(item)}</List.Item>)}
      />
    )
  }
}


export default withRouter(injectIntl(GapList))
