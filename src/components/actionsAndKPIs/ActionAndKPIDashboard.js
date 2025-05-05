import React, { Component } from "react";
import { Button, Row, Col, message, Icon } from "antd";
import clone from "clone";
import { connect } from "react-redux";
import ReactEcharts from "echarts-for-react";
import { graphql, compose } from "react-apollo";
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
import { issueOfInterests } from "../../constant/constant";
class ActionAndKPIDashboard extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.state = {
      columns: this.createcolumns(clone(sortColumns)),
      search: "",
      current: 0,
      selectedActionAndKPI: "",
    };
  }

  createcolumns(columns) {
    //  columns.push(...activeColumn)
    return columns;
  }

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
    if(this.state.search){

      const searchDataMap  = issueOfInterests.find(issueOfInterest => issueOfInterest.text == this.state.search);
      // this.setState({ search: searchDataMap.value });
      this.props.actionAndKPISearch("issueOfInterest", searchDataMap.value || 'humanRightsRisksSituations');
    }else{
      this.setState({ search: "" });
    this.props.actionAndKPISearch("issueOfInterest", "");
    }
  }
  emitEmpty = () => {
    //this.userNameInput.focus()
    this.setState({ search: "" });
    this.props.actionAndKPISearch("issueOfInterest", "");
  };
  getOption(projectPerformance) {
    const rowLen = projectPerformance.length;
    const xAxisData = [];
    const serieData = [];
    const tragetPerformace = [];
    projectPerformance.map((project, index) => {
      xAxisData.push(String(project.year));
      if (rowLen === index + 1) {
        xAxisData.push(String(project.year + 1));
      }
      serieData.push(project.performance);
      tragetPerformace.push([
        { coord: [index, project.performance] },
        { coord: [index + 1, project.targetPerformance] },
      ]);
    });

    return {
      title: {
        text: "Yearly Project Perfomance",
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["year", "year"],
      },
      // toolbox: {
      //   show: true,
      //   feature: {
      //     dataZoom: {
      //       yAxisIndex: 'none',
      //     },
      //     dataView: {readOnly: false},
      //     magicType: {type: ['line', 'bar']},
      //     restore: {},
      //     saveAsImage: {},
      //   },
      // },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: xAxisData,
      },
      yAxis: {
        type: "value",
        axisLabel: {
          formatter: "{value} ",
        },
      },
      series: {
        type: "line",
        data: serieData,
        markLine: {
          symbol: "circle",
          data: tragetPerformace,
        },
      },
    };
  }
  render() {
    const onEvents = {
      click: this.onChartClick,
      legendselectchanged: this.onChartLegendselectchanged,
    };
    const { search, columns, selectedActionAndKPI } = this.state;
    const {
      companyId,
      fetchActionsAndKPI: { actionsAndKPIs, loading },
    } = this.props;
    if (!actionsAndKPIs) {
      return <div />;
    }
    const suffix = search ? (
      <Icon type="close-circle" onClick={this.emitEmpty} />
    ) : null;
    return (
      <div style={{ marginRight: 30 }}>
        <Box style={{ margin: 0 }}>
          <Row style={{ marginBottom: 15 }}>
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
                size="small"
                columns={columns}
                rowKey="id"
                loading={loading}
                onChange={this.onChange}
                dataSource={actionsAndKPIs}
                className="sortingTable"
                defaultExpandedRowKeys={[actionsAndKPIs[0].id]}
                expandedRowRender={({ projectPerformance }) => (
                  <React.Fragment style={{ height: 300 }}>
                    <ReactEcharts
                      option={this.getOption(projectPerformance)}
                      onChartReady={this.onChartReady}
                      onEvents={onEvents}
                    />
                  </React.Fragment>
                )}
                pagination={actionsAndKPIs.length > 10}
              />
            </Col>
          </Row>
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
      const variables = {
        companyId: props.companyId,
        sort: props.sortFild,
        order: props.order,
        search: props.search, // Ensure search is passed
        s: props.query,
      };
      return { variables };
    },
  })
)(ActionAndKPIDashboard);

export default connect(mapStateToProps, {
  actionAndKPISorting,
  actionAndKPISearch,
})(ActionsAndKPIsListQL);
