import React, {Component} from 'react'
import {Modal, Button, Row, Col} from 'antd'
import {Scrollbars} from 'react-custom-scrollbars'
import {injectIntl} from 'react-intl'
import {connect} from 'react-redux'
import {find} from 'lodash'
import {gapAnalysisQuestions} from '../../common/gapAnalysisQuestions'
import {getFileScore} from './utility'
import ModalStyle from '../styles/modal.style'
import TableWrapper from '../styles/table.style'
import WithDirection from '../../common/withDirection'
import {TextCell} from '../../common/helperCells'

const isoModal = ModalStyle(Modal)
const Modals = WithDirection(isoModal)

class FileOverallScore extends Component {

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      columns: [
        {
          title: 'Key Considerations',
          key: 'name',
          render: object => TextCell(object.keyConsideration),
        },
        {
          title: 'Overall Score',
          key: 'score',
          width: 150,
          render: object => TextCell(`${object.score}%`),
        },
      ],
    }
  }

  componentWillUpdate(nextProps, nextState) {

    if (nextProps.visible && !nextState.visible) {
      this.setState({visible: true})
    }
    if (!nextState.visible) {
      this.props.hideModal()
    }
  }

  handleCancel = () => {
    this.setState({visible: false})
  }

  render() {
    const {file} = this.props

    if (!file || !file.keyConsiderations) {
      return null
    }

    const files = file.keyConsiderations.map(kc => {
      const gapAnalysisQuest = find(gapAnalysisQuestions, {key: kc})
      const fileScore = getFileScore(file, kc)
      return {
        id: gapAnalysisQuest.label,
        keyConsideration: gapAnalysisQuest.label,
        score: fileScore,
      }
    })

    return (
      <div style={{marginRight: 30}}>
        <Modals
          visible={this.state.visible}
          title="File Overall Score"
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>Return</Button>,
          ]}
        >
          <Row>
            <Col md={24} sm={24} xs={24}>
              <Scrollbars
                autoHide
                autoHeight
                autoHeightMin={0}
                autoHeightMax={450}
              >
                <TableWrapper
                  size="small"
                  columns={this.state.columns}
                  dataSource={files}
                  rowKey="id"
                  pagination={false}
                />
              </Scrollbars>
            </Col>
          </Row>
        </Modals>
      </div>
    )
  }
}

export default connect(null, null)(injectIntl(FileOverallScore))
