import React, {Component} from 'react'
import {remove, some} from 'lodash'
import {connect} from 'react-redux'
import {Upload, Modal, message, Button, Icon, Checkbox, Tabs} from 'antd'
import {graphql, compose} from 'react-apollo'
import {injectIntl} from 'react-intl'
import {updateGapAnalysisFileMutation} from '../../graphql/gapAnalysisMutation'
import fetchGapFilesQuery from '../../graphql/fetchGapFiles'
import ModalStyle from '../styles/modal.style'
import TableWrapper from '../styles/table.style'
import {DeleteCell, TextCell} from '../../common/helperCells'
import WithDirection from '../../common/withDirection'
import {deleteFileRequest} from '../../actions/GapFileActions'


const isoModal = ModalStyle(Modal)
const Modals = WithDirection(isoModal)
const TabPane = Tabs.TabPane

class RelateWithFile extends Component {

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      fileList: [],
      columns: this.createColumns(),
      selectedFileId: props.selectedFileId,
      noDocument: props.noDocument,
      activeTab: props.noDocument ? 'noDocumentation' : 'existingDocumentation',
    }
  }

  createColumns() {
    return [
      {
        title: 'File',
        key: 'name',
        render: object => TextCell(object.name),
      },
      {
        title: '',
        dataIndex: '',
        render: (text, record, index) =>
          (<DeleteCell
            index={record.id}
            onDeleteCell={() => this.deleteFile(record.id)}
          />),
      },
    ]
  }

  deleteFile = id => {
    deleteFileRequest(id).then(() => {
      this.props.fetchGapFilesQuery.refetch()
      this.props.refetchData()
    })
  }

  handleFormSubmit = () => {

    const {selectedFileId, noDocument} = this.state

    this.formSubmit(selectedFileId, noDocument)
  }

  formSubmit = (fileId, noDocument) => {
    const {keyConsideration, gapAnalysisId, refetchData} = this.props
    this.setState({loading: true})

    this.props.mutate({
      variables: {
        id: gapAnalysisId,
        keyConsideration: keyConsideration.key,
        coreSubject: keyConsideration.coreSubject,
        issueOfInterest: keyConsideration.isuueOfInterest,
        file: fileId,
        noRelatedDocument: noDocument,
      },
    }).then(({data}) => {
      refetchData()
      message.success('Processing complete!')
      this.setState({loading: false, visible: false, selectedFileId: '', noDocument: false})
    })
  }


  componentWillUpdate(nextProps, nextState) {
    if (nextProps.visible && !nextState.visible) {
      this.setState({
        visible: true,
        selectedFileId: nextProps.selectedFileId,
        noDocument: nextProps.noDocument,
        activeTab: nextProps.noDocument ? 'noDocumentation' : 'existingDocumentation',
      })
      this.props.fetchGapFilesQuery.refetch()
    }
    if (!nextState.visible) {
      this.props.hideModal()
    }
  }

  showModal = () => {
    this.setState({
      visible: true,
    })
    this.props.showModal(this.state.visible)
  }

  handleCancel = () => {
    this.setState({visible: false})
  }

  getRowClass = record => {
    if (record.id === this.state.selectedFileId) {
      return 'selected-table-row'
    }

    return ''
  }

  renderFiles = () => {
    const {fetchGapFilesQuery: {gapFiles, loading}} = this.props

    return (
      <TableWrapper
        bodyHeight="500px"
        size="small"
        columns={this.state.columns}
        dataSource={gapFiles}
        rowKey="id"
        loading={loading}
        pagination={false}
        rowClassName={this.getRowClass}
        rowSelection={
          {type: 'radio',
            onSelect: f => {this.setState({selectedFileId: f.id, noDocument: false})},
            selectedRowKeys: [this.state.selectedFileId],
          }}
      />)
  }

  handleUploadChange = ({file, fileList}) => {
    if (file.status === 'done') {
      //message.success('File uploaded successfully')
      this.formSubmit(file.response.fileId, false)
    }

    remove(fileList, (f) => {return f.status === 'done'})

    this.setState({fileList: [...fileList]})
  }

  checkFileList = (file, fileList) => {
    const {fetchGapFilesQuery: {gapFiles}} = this.props

    const fileExists = some(gapFiles, f => f.name === file.name)

    if (fileExists) {
      message.warning('Document already uploaded. You can link with existing documents by selecting them from the documents list')
      remove(fileList, (f) => {return f.name === file.name})

      this.setState({fileList: [...fileList]})
    }

    return !fileExists
  }

  handleNoDocumentChange = () => {
    this.setState({noDocument: !this.state.noDocument, selectedFileId: ''})
  }

  renderUploadFile = () => {
    const {projectId, fetchGapFilesQuery} = this.props

    let uploadedFiles = 0

    if (fetchGapFilesQuery && fetchGapFilesQuery.gapFiles) {
      uploadedFiles = fetchGapFilesQuery.gapFiles.length
    }

    return (
      <div>
        <h4>Maximum limit - 60 documents</h4>
        <div style={{marginTop: '15px', display: 'flex'}}>
          <Upload
            accept=".pdf"
            name="projectFile"
            action={`/api/${projectId}/file`}
            fileList={this.state.fileList}
            headers={{authorization: localStorage.getItem('token'), enctype: 'multipart/form-data'}}
            onChange={this.handleUploadChange}
            disabled={uploadedFiles >= 60}
            beforeUpload={this.checkFileList}
          >
            <Button>
              <Icon type="upload" /> Upload file
            </Button>
          </Upload>
        </div>
      </div>
    )
  }

  handleTabChange = key => {
    this.setState({activeTab: key})
  }

  render() {
    const {fetchGapFilesQuery} = this.props
    const noFiles = !fetchGapFilesQuery || !fetchGapFilesQuery.gapFiles || (fetchGapFilesQuery.gapFiles && fetchGapFilesQuery.gapFiles.length === 0)
    const footer = [
      <Button
        key="back"
        onClick={this.handleCancel}
      >Return</Button>,
    ]

    if (this.state.activeTab !== 'uploadNew') {
      footer.push(<Button
        key="submit"
        type="primary"
        loading={this.state.loading}
        onClick={this.handleFormSubmit}
      >
        OK
      </Button>)
    }

    return (
      <div style={{marginRight: 30}}>
        <Modals
          visible={this.state.visible}
          title="Link to documentation"
          onCancel={this.handleCancel}
          width={700}
          footer={footer}
        >
          <Tabs animated={false} activeKey={this.state.activeTab} onChange={this.handleTabChange}>
            <TabPane tab="Link to existing documentation" key="existingDocumentation">
              <span>You can link the key consideration to existing documentation by selecting one of the documents found in the list below,</span>
              {noFiles && <span style={{display: 'flex', justifyContent: 'center'}}>There are no files uploaded</span> }
              {!noFiles && <div style={{marginTop: '15px'}}>
                {this.renderFiles()}
              </div>}
            </TabPane>
            <TabPane tab="Upload new documentation" key="uploadNew">
              <span>You can upload new documentation to which the key consideration will be
automatically linked to. Once uploaded, the documentation will show in the
existing documentation tab so that other key considerations can be linked to it
if necessary.</span>
              {this.renderUploadFile()}
            </TabPane>
            <TabPane tab="No documentation" key="noDocumentation">
              <span>In the case where there is no documentation that addresses the key
consideration in question, you can choose the ‘No documentation’ option. Be
advised that this will be considered as not providing sufficient evidence to
support the company performance score allocated by the user, and that the
score will consequently be subject to penalisation.</span>
              <div style={{marginTop: '15px'}}>
                <Checkbox
                  checked={this.state.noDocument}
                  onChange={this.handleNoDocumentChange}
                />
                <span>No documentation</span>
              </div>
            </TabPane>
          </Tabs>


        </Modals>
      </div>

    )
  }
}

const RelateWithFileFormQL = compose(
  graphql(fetchGapFilesQuery, {
    name: 'fetchGapFilesQuery',
    skip: ({projectId}) => !projectId,
    options: ({projectId}) => {return {variables: {projectId: projectId}}},
  }),
  graphql(updateGapAnalysisFileMutation)
)


export default connect(
  (state) => ({ })
)(RelateWithFileFormQL(injectIntl(RelateWithFile)))


