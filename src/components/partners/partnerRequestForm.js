import React, {Component} from 'react'
import {connect} from 'react-redux'
import clone from 'clone'
import {Modal, Button} from 'antd'
import {injectIntl} from 'react-intl'
import {commonMessages} from '../../messages'
import ModalStyle from '../styles/modal.style'
import WithDirection from '../../common/withDirection'
import Box from '../utility/box'
import TableWrapper from '../styles/table.style'
import {sortColumns} from './partnerRequestFields'
const isoModal = ModalStyle(Modal)
const Modals = WithDirection(isoModal)

class PartnerRequest extends Component {

  constructor(props) {
    super(props)
    this.state = {
      columns: this.createcolumns(clone(sortColumns)),
      visible: false,
    }
  }

  createcolumns(columns) {
    const activeColumn = [
      {
        title: '',
        dataIndex: '',
        render: (text, record, index) => {

          const {id} = record

          return (
            <div>
              <Button
                type="primary"
                className="acceptPartnerButton"
                onClick={() => this.handleAccept(id)}
              >
        Accept
              </Button>
            </div>)
        },
      }]
    columns.push(...activeColumn)
    return columns
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

  handleAccept = projectId => {
    this.setState({visible: false})
    this.props.acceptSupplier(projectId)
  }

  render() {
    const {columns} = this.state
    const {projects, intl: {formatMessage}} = this.props

    return (
      <div style={{marginRight: 30}}>
        <Modals
          visible={this.state.visible}
          title="Accept supplier request"
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              {formatMessage(commonMessages.commonCancel)}
            </Button>,
          ]}
        >
          <Box>
            <TableWrapper
              size="small"
              columns={columns}
              onChange={this.onChange}
              dataSource={projects}
              rowKey="id"
              pagination={false}
            />
          </Box>
        </Modals>
      </div>

    )
  }
}

const mapStateToProps = () => ({})

export default connect(mapStateToProps)(injectIntl(PartnerRequest))
