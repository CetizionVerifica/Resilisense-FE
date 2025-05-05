import React, {Component} from 'react'
import {orderBy} from 'lodash'
import {withRouter} from 'react-router-dom'
import {Button} from 'antd'
import {injectIntl} from 'react-intl'
import {commonMessages} from '../../messages'
import TableWrapper from '../styles/table.style'
import {columnsCoreSubject} from './issueOfIterestsListConfig'
import { projectStatuses } from '../../common/enum/projectStatuses'
class MaterialityList extends Component {

  render() {
    const {materiality, projectId, projectStatus, intl: {formatMessage}} = this.props;
    console.log("PRject status materiliaty:", projectStatus);
    return (
      <TableWrapper
        title={() => (<div>
          <Button
            type="primary"
            disabled={projectStatus !== projectStatuses.materialitycompleted.value && projectStatus !== projectStatuses.completed.value && projectStatus !== projectStatuses.meterialitysendsurvey.value}
            onClick={() => this.props.history.push(`/send-survey/${projectId}`)}
            title="Send survey"
          >
            Send survey
          </Button>
          <Button type="dashed" className=""
            style={{marginLeft: 20}}
            onClick={() => this.props.history.push(`/materialityresult/${materiality.id}`)}
          >
            {formatMessage(commonMessages.commonResults)}
          </Button></div>)}
        size="small"
        columns={columnsCoreSubject}
        onChange={this.onChange}
        dataSource={orderBy(materiality.coreSubjects, ['weightValue'], ['desc'])}
        className="sortingTable"
        rowKey="coreSubject"
        pagination={false}
      />

    )
  }
}


export default withRouter(injectIntl(MaterialityList))


