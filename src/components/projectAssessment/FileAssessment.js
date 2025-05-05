import React, {Component} from 'react'
import {Document, Page} from 'react-pdf'
import {Scrollbars} from 'react-custom-scrollbars'
import {Modal, Button, Row, Col, Select, message} from 'antd'
import {graphql, compose} from 'react-apollo'
import {injectIntl} from 'react-intl'
import {values, find, get, filter} from 'lodash'
import {assessmentCriteria} from '../../common/assessmentCriteria'
import {gapAnalysisQuestions} from '../../common/gapAnalysisQuestions'
import {updateFileMutation} from '../../graphql/gapFileMutation'
import fetchGapFileQuery from '../../graphql/fetchGapFile'
import ModalStyle from '../styles/modal.style'
import WithDirection from '../../common/withDirection'
import {DropdownCell} from '../../common/helperCells'
import {criteriaValues} from '../../common/enum/criteria'

const isoModal = ModalStyle(Modal)
const Modals = WithDirection(isoModal)
const Option = Select.Option

class FileAssessment extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      numPages: null,
      pageNumber: 1,
      pageScale: 1,
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.visible && !nextState.visible) {
      this.setState({visible: true})
    }
    if (!nextState.visible) {
      this.props.hideModal()
    }
    if (this.props.fileId !== nextProps.fileId) {
      nextProps.data.refetch()
    }
  }

  handleCancel = () => {
    this.setState({visible: false})
  }

  documentAssessment(name, value, currentValue) {
    const {data: {refetch}, fileId} = this.props
    const criterion = {
      id: fileId,
      name: name,
      value: value,
    }

    this.props.mutate({
      variables: {
        ...criterion,
      },
    }).then(() => {
      if (!currentValue) {
        refetch()
      }

      message.success('Processing complete!')
    })
  }

  renderStandardCriteria(file) {
    return filter(assessmentCriteria).map(criterion => {
      const fileCriterion = find(file.criteria, {name: criterion.value})
      const defaultValue = get(fileCriterion, 'value')

      return (
        <div
          key={criterion.value}
          style={{marginBottom: 10}}
        >
          <h4 style={{marginRight: 10}}>{criterion.label}</h4>
          <DropdownCell
            defaultValue={defaultValue}
            // disabled={this.props.assessmentComplete}
            record={file}
            options={values(criteriaValues)}
            callBack={(value) => this.documentAssessment(criterion.value, value, defaultValue)}
          />
        </div>
      )
    })
  }

  renderCriteria(file) {
    return (
      <div style={{display: 'flex', flexDirection: 'column', marginLeft: 10}}>
        {this.renderStandardCriteria(file)}
        <div>
          <h4 style={{marginRight: 10}}>Appropriate</h4>
          <Scrollbars style={{height: 450}}>
            <div>
              <ul style={{paddingLeft: 0}}>
                {file.keyConsiderations.map(keyConsideration => {
                  const kcCriterion = find(file.criteria, {name: keyConsideration})
                  const defaultValue = get(kcCriterion, 'value')
                  const gapAnalysisQuest = find(gapAnalysisQuestions, {key: keyConsideration})
                  return (
                    <li
                      style={{marginBottom: 10}}
                      key={keyConsideration}
                    >
                      <span>{gapAnalysisQuest.label}</span>
                      <DropdownCell
                        defaultValue={defaultValue}
                        // disabled={this.props.assessmentComplete}
                        record={file}
                        options={values(criteriaValues)}
                        callBack={(value) => this.documentAssessment(keyConsideration, value, defaultValue)}
                      />
                    </li>
                  )
                })}
              </ul>
            </div>
          </Scrollbars>
        </div>
      </div>)
  }

  onDocumentLoadSuccess = ({numPages}) => {
    this.setState({numPages})
  }

  changePage = offset => this.setState(prevState => ({
    pageNumber: prevState.pageNumber + offset,
  }));

  previousPage = () => this.changePage(-1);

  nextPage = () => this.changePage(1);

  renderPageOptions(numPages, pageNumber) {

    if (!numPages) {
      return null
    }

    return (
      <div style={{display: 'flex', marginTop: 10, justifyContent: 'center'}}>
        <div style={{display: 'flex', width: 300, justifyContent: 'space-between', alignItems: 'baseline'}}>
          <Button
            disabled={pageNumber <= 1}
            onClick={this.previousPage}
          >
            Previous
          </Button>
          <p>
            Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
          </p>
          <Button
            disabled={pageNumber >= numPages}
            onClick={this.nextPage}
          >
            Next
          </Button>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'baseline', marginLeft: 30}}>
          <p style={{marginRight: 10}}>Zoom </p>
          <Select
            defaultValue={1}
            value={this.state.pageScale}
            style={{width: 100}}
            onChange={(value) => this.setState({pageScale: value})}
          >
            <Option value={0.5}>50%</Option>
            <Option value={1}>100%</Option>
            <Option value={1.5}>150%</Option>
            <Option value={2}>200%</Option>
          </Select>
        </div>
      </div>
    )
  }

  render() {
    // console.log("RENDER FILE?")
    const {data} = this.props
    const {pageNumber, numPages, pageScale} = this.state

    if (!data || !data.gapFile) {
      return null
    }

    return (
      <div style={{marginRight: 30}}>
        <Modals
          visible={this.state.visible}
          title="File Assessment"
          width={1200}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>Return</Button>,
          ]}
        >
          <Row>
            <Col md={17}>
              <Scrollbars style={{height: 600}}>
                <div style={{justifyContent: 'center', display: 'flex'}}>
                  <Document
                    file={`/${data.gapFile.path}`}
                    onLoadSuccess={this.onDocumentLoadSuccess}
                  >
                    <Page pageNumber={pageNumber} scale={pageScale} />
                  </Document>
                </div>
              </Scrollbars>
              {this.renderPageOptions(numPages, pageNumber)}
            </Col>
            <Col md={7}>{this.renderCriteria(data.gapFile)}</Col>
          </Row>
        </Modals>
      </div>
    )
  }
}

const FileAssessmentQL = compose(
  graphql(fetchGapFileQuery, {
    skip: ({fileId}) => !fileId,
    options: ({fileId}) => {return {variables: {id: fileId}}},
  }),
  graphql(updateFileMutation)
)


export default FileAssessmentQL(injectIntl(FileAssessment))


