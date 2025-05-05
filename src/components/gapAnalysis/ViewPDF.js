import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Modal, Row, Col, Button, Tabs } from 'antd'
import { graphql, compose } from 'react-apollo'
import { injectIntl } from 'react-intl'
import fetchGapFilesQuery from '../../graphql/fetchGapFile'
import ModalStyle from '../styles/modal.style'
import WithDirection from '../../common/withDirection'
import { Document, Page } from 'react-pdf'

const isoModal = ModalStyle(Modal)
const Modals = WithDirection(isoModal)
const TabPane = Tabs.TabPane

class ViewPDF extends Component {

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      selectedFileId: props.selectedFileId,
      numPages: null,
      pageNumber: 1,
      pageScale: 1,
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.visible && !nextState.visible) {
      this.setState({
        visible: true,
        selectedFileId: nextProps.selectedFileId,
        noDocument: nextProps.noDocument,
        activeTab: nextProps.noDocument ? 'noDocumentation' : 'existingDocumentation',
      })

    }
    if (!nextState.viewPDF) {
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
    this.setState({ visible: false })
  }
  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages })
  }


  render() {
    const { fetchGapFilesQuery } = this.props
    const { pageNumber, numPages, pageScale } = this.state

    const noFiles = !fetchGapFilesQuery || !fetchGapFilesQuery.gapFile
    const footer = [
      <Button
        key="back"
        onClick={this.handleCancel}
      >Return</Button>,
    ]

    return (
      <div style={{ marginRight: 30 }}>
        <Modals
          visible={this.state.visible}
          title="Uploaded document"
          onCancel={this.handleCancel}
          width={700}
          footer={footer}
        >
          <Row>
            {!noFiles && <div style={{ justifyContent: 'center', display: 'flex' }}>
              <Document
                file={`/${fetchGapFilesQuery.gapFile.path}`}
                onLoadSuccess={this.onDocumentLoadSuccess}
              >
                <Page pageNumber={pageNumber} scale={pageScale} />
              </Document>
            </div>}
          </Row>

        </Modals>
      </div>

    )
  }
}


const ViewPDFFileFormQL = compose(
  graphql(fetchGapFilesQuery, {
    name: 'fetchGapFilesQuery',
    skip: ({ selectedFileId }) => !selectedFileId,
    options: ({ selectedFileId }) => { return { variables: { id: selectedFileId } } },
  })
)

export default connect((props) => ({ data: props.data })
)(ViewPDFFileFormQL(injectIntl(ViewPDF)))
