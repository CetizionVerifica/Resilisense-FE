import React, {Component, useEffect} from 'react'
import {Modal, Button} from 'antd'
import {connect} from 'react-redux'
import {closeModal} from './modalActions'
import { useRequest } from '../../hook/useRequest'
import SurveyTemplate from '../surveys/template/SurveyTemplate'

const actions = {closeModal}

// class SurveyPreviewModal extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       // visible: false,
//     }
//   }
  
//   // get template
//   render() {
//     return (
//       <Modal
//         size="medium"
//         visible
//         title="Survey Preview"
//         width={1000}
//         // bodyStyle={{padding: 0, height: 600}}
//         bodyStyle={{padding: 0, height: 600}}
//         onCancel={this.props.closeModal}
//         footer={[
//           <Button key="back" onClick={this.props.closeModal}>Return</Button>,
//         ]}
//         closable={false}
//         maskClosable={false}
//       >
//         {/* <iframe style={{width: '100%', height: '100%'}} src={this.props.previewLink} /> */}
//       </Modal>
//     )
//   }
// }

// export default connect(null, actions)(SurveyPreviewModal)

const SurveyPreviewModal = props => {
  const [{data, pending, error}, execute] = useRequest();

  useEffect(() => {
    execute(`/api/surveys/${props.type}`, 'GET', result => result.data);
  }, [execute]);

  return (
    <Modal
      size="medium"
      visible
      title="Survey Preview"
      width={1000}
      // bodyStyle={{padding: 0, height: 600}}
      bodyStyle={{padding: 0}}
      onCancel={props.closeModal}
      footer={[
        <Button key="back" onClick={props.closeModal}>Return</Button>,
      ]}
      closable={false}
      maskClosable={false}
    >
      {!pending && !error ? <SurveyTemplate readOnly={true} completed={false} data={data} /> : null}
    </Modal>
  )
};

export default connect(null, actions)(SurveyPreviewModal)
