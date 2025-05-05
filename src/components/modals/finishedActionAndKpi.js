import React, { Component } from "react";
import { Modal, message, Button } from "antd";
import { graphql } from "react-apollo";
import { injectIntl } from "react-intl";
import { changeProjectStatus } from "../../graphql/projectMutation";
import { projectStatuses } from "../../common/enum/projectStatuses";

class FinishedActionAndKpiModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false, // Initialize loading state
    };
  }

  // Handle the Submit action
  handleProjectSubmit = () => {
    const { projectId, hideModal } = this.props;

    this.setState({ loading: true });
    let status = projectStatuses.materialitycompleted.value;

    // Change status to 'finished' if it matches 'materialitycompleted'
    if (status === projectStatuses.materialitycompleted.value) {
      status = projectStatuses.finished.value;
    }

    this.props
      .mutate({
        variables: {
          id: projectId,
          status: status,
        },
      })
      .then(({ data }) => {
        this.setState({ loading: false });
        message.success("Action & KPI marked as completed!");
        hideModal();
      })
      .catch((error) => {
        console.error("Error:", error);
        this.setState({ loading: false });
        message.error("Something went wrong, please try again.");
      });
  };

  render() {
    const { visible, hideModal } = this.props;

    return (
      <Modal
        visible={visible} // Controlled visibility
        title="Action & KPI"
        onCancel={hideModal} // Close modal when canceled
        footer={[
          <Button key="back" onClick={hideModal}>
            Return
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={this.state.loading}
            onClick={this.handleProjectSubmit}
          >
            Submit
          </Button>,
        ]}
        closable={false}
        maskClosable={false}
      >
        <div>
          <span>
            By clicking on Submit, all the issues of your interest can be marked
            as completed.
          </span>
        </div>
      </Modal>
    );
  }
}

export default graphql(changeProjectStatus)(
  injectIntl(FinishedActionAndKpiModal)
);
