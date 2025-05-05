import React, { Component } from "react";
import { Button, Row, Col, message, Icon } from "antd";
import { find, get } from "lodash";
import clone from "clone";
import { connect } from "react-redux";
import { graphql, compose } from "react-apollo";
import styled from "styled-components";
import fetchActionsAndKPI from "../../graphql/fetchActionsAndKPI";
import {
  removeActionAndKPI,
  updateActionAndKPI,
} from "../../graphql/actionsAndKPIsMutation";
import { actionAndKPISorting, actionAndKPISearch } from "../../actions";
import TableWrapper from "../styles/table.style";
import Box from "../utility/box";
import { sortColumns } from "./ActionAndKPIListConfig";
import { InputSearch } from "../utility/inputSearch";
import { DeleteCell, ActionCell } from "../../common/helperCells";
import { newKpi } from "../../common/tooltips";
import InfoTooltip from "../utility/InfoTooltip";
import ActionAndKPIForm from "./ActionAndKPIForm";
import ActionAndKPIEdit from "./ActionAndKPIEdit";
import FinishedActionAndKpiModal from "../modals/finishedActionAndKpi";
const TooltipWrapper = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`;

class ActionsAndKPIsList extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.state = {
      columns: this.createcolumns(clone(sortColumns)),
      search: "",
      addVisible: false,
      editVisible: false,
      finishedVisible: false,
      current: 0,
      selectedActionAndKPI: "",
      setNewActionEnable: props.setNewActionEnable,
    };
  }
  showAddModal = () => this.setState({ addVisible: true });

  hideAddModal = () => this.setState({ addVisible: false });

  showFinishedModal = () => this.setState({ finishedVisible: true });
  hideFinishedModal = () => this.setState({ finishedVisible: false });
  showEditModal = (actionAndKPI) =>
    this.setState({ editVisible: true, selectedActionAndKPI: actionAndKPI });

  hideEditModal = () => this.setState({ editVisible: false });

  handleCancel = () => {
    this.setState({ visible: false });
  };
  createcolumns(columns) {
    const { projectId } = this.props;

    const activeColumn = [
      {
        title: "Baseline Performance",
        width: 50,
        key: "baseLineperformance",
        render: (text, record, index) => {
          const projectSelected = find(record.projectPerformance, {
            isBaseline: true,
          });
          return `${get(projectSelected, "performance", "-")} [${get(
            projectSelected,
            "year",
            "-"
          )}]`;
        },
      },
      {
        title: "Current Performance",
        width: 50,
        key: "performance",
        render: (text, record, index) => {
          const projectSelected = find(record.projectPerformance, {
            project: projectId,
          });
          return `${get(projectSelected, "performance", "-")} [${get(
            projectSelected,
            "year",
            "-"
          )}]`;
        },
      },
      {
        title: "Target Performance",
        width: 50,
        key: "targetPerformance",
        render: (text, record, index) => {
          // console.log("This is:", record);
          const projectSelected = find(record.projectPerformance, {
            project: projectId,
          });
          const currentYear = get(projectSelected, "year", "-");
          const nextYear = currentYear === "-" ? "-" : currentYear + 1;
          return `${get(
            projectSelected,
            "targetPerformance",
            "-"
          )} [${nextYear}]`;
        },
      },
      {
        title: "",
        key: "edit",
        width: 50,
        render: (text, record, index) =>
          ActionCell([
            {
              key: "edit",
              link: "#",
              onClick: () => this.showEditModal(record),
              icon: "edit",
            },
          ]),
      },
      {
        title: "",
        dataIndex: "",
        render: (text, record, index) => (
          <DeleteCell index={record.id} onDeleteCell={this.onDeleteCell} />
        ),
      },
    ];
    columns.push(...activeColumn);
    return columns;
  }

  onDeleteCell = (id) => {
    this.setState({ loading: true });
    this.props
      .removeActionAndKPI({
        variables: {
          id,
        },
        //refetchQueries: [{query: this.props.fetchEmployees, variables: {companyId}}],
      })
      .then(() => {
        message.success("Processing complete!");
        this.props.fetchActionsAndKPI.refetch();
        this.setState({ loading: false, visible: false });
      });
  };

  onChange(pagination, filters, sorter) {
    if (sorter && sorter.columnKey && sorter.order) {
      if (sorter.order === "ascend") {
        this.props.actionAndKPISorting(sorter.columnKey, "asc");
      } else {
        this.props.actionAndKPISorting(sorter.columnKey, "desc");
      }
      //this.setState({dataList: dataList.getAll()})
    }
  }

  onSearch() {
    this.props.actionAndKPISearch("name", this.state.search);
  }
  emitEmpty = () => {
    //this.userNameInput.focus()
    this.setState({ search: "" });
    this.props.actionAndKPISearch("name", "");
  };
  render() {
    const { search, columns, selectedActionAndKPI } = this.state;
    const {
      companyId,
      projectId,
      projectYear,
      materialityId,
      fetchActionsAndKPI: { actionsAndKPIs, loading },
    } = this.props;
    if (!actionsAndKPIs) {
      return <div />;
    }
    // console.log('height', this.props.height)
    const suffix = search ? (
      <Icon type="close-circle" onClick={this.emitEmpty} />
    ) : null;
    return (
      <div style={{ marginRight: 30 }}>
        <Box style={{ margin: 0 }}>
          <Row style={{ marginBottom: 15 }}>
            <Col span={3}>
              <Button
                disabled={!this.state.setNewActionEnable}
                type="primary"
                className=""
                style={{ marginRight: 15 }}
                onClick={this.showAddModal}
              >
                Set new Action and KPI
              </Button>
            </Col>
            <Col span={4}>
              <Button
                type="primary"
                className=""
                disabled={!this.state.setNewActionEnable}
                style={{ marginRight: 15 }}
                onClick={this.showFinishedModal}
              >
                Completed Actions & KPI
              </Button>
            </Col>
            <Col span={12}>
              <InputSearch
                placeholder="Search Issue of Interest"
                className="isoSearchNotes"
                value={search}
                prefix={
                  <Icon type="search" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                onSearch={() => this.onSearch()}
                enterButton
                suffix={suffix}
                onChange={(e) => this.setState({ search: e.target.value })}
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <TableWrapper
                bodyHeight={this.props.height ? `${this.props.height}px` : null}
                size="small"
                columns={columns}
                rowKey="id"
                loading={loading}
                onChange={this.onChange}
                dataSource={actionsAndKPIs}
                className="sortingTable"
                pagination={actionsAndKPIs.length > 10}
              />
              <TooltipWrapper>
                <InfoTooltip content={newKpi} />
              </TooltipWrapper>
            </Col>
          </Row>
          <ActionAndKPIForm
            visible={this.state.addVisible}
            handleOk={this.handleOk}
            refetch={this.props.fetchActionsAndKPI.refetch}
            hideModal={this.hideAddModal}
            companyId={companyId}
            materialityId={materialityId}
            projectId={projectId}
            projectYear={projectYear}
            // gap={this.props.match.params.id}
          />
          <ActionAndKPIEdit
            visible={this.state.editVisible}
            handleOk={this.handleOk}
            hideModal={this.hideEditModal}
            companyId={companyId}
            projectId={projectId}
            projectYear={projectYear}
            actionAndKPI={selectedActionAndKPI}
          />
          <FinishedActionAndKpiModal
            visible={this.state.finishedVisible}
            handleOk={this.handleOk}
            hideModal={this.hideFinishedModal}
            companyId={companyId}
            projectId={projectId}
            projectYear={projectYear}
          />
        </Box>
      </div>
    );
  }
}

function mapStateToProps({ actionsAndKPIs }) {
  const { sort, order, search, query } = actionsAndKPIs;
  return { sortFild: sort, order, search, query };
}
const ActionsAndKPIsListQL = compose(
  graphql(removeActionAndKPI, {
    name: "removeActionAndKPI",
  }),
  graphql(updateActionAndKPI, {
    name: "updateActionAndKPI",
  }),
  graphql(fetchActionsAndKPI, {
    name: "fetchActionsAndKPI",
    options: (props) => {
      return {
        variables: {
          companyId: props.companyId,
          sort: props.sortFild,
          order: props.order,
          search: props.search,
          s: props.query,
        },
      };
    },
  })
)(ActionsAndKPIsList);

export default connect(mapStateToProps, {
  actionAndKPISorting,
  actionAndKPISearch,
})(ActionsAndKPIsListQL);
