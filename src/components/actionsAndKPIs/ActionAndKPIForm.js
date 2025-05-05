import React, { Component } from "react";
import { values, get, filter, find, round, orderBy } from "lodash";
import { Form, Modal, message, Button, Row, Col, notification } from "antd";
import { Scrollbars } from "react-custom-scrollbars";
import { reduxForm, Field } from "redux-form";
import { graphql, compose } from "react-apollo";
import ReactEcharts from "echarts-for-react";
import { injectIntl } from "react-intl";
import styled from "styled-components";
import TableWrapper from "../styles/table.style";
import { coreSubjectNames } from "../../common/coreSubjectNames";
import { issueOfInterest } from "../../common/issueOfInterest";
import { kpiTooltip, kpiMajorIssuesTooltip } from "../../common/tooltips";
import ModalStyle from "../styles/modal.style";
import WithDirection from "../../common/withDirection";
import fetchMateriality from "../../graphql/fetchMateriality";
import { addActionsAndKPIsToCompany } from "../../graphql/actionsAndKPIsMutation";
import { actionAndKPIFields } from "./actionAndKPIFields";
import InfoTooltip from "../utility/InfoTooltip";
import {
  getCompanyPerformance,
  getRevisingScorePerformance,
  getRelevanceSignificance,
} from "../gapAnalysis/report/_helper";
import { columnsStatus } from "../gapAnalysis/report/reportConfig";
import axios from "axios";

const isoModal = ModalStyle(Modal);
const Modals = WithDirection(isoModal);
const color = [
  "#db4040",
  "#2581ce",
  "#9e5fdd",
  "#32aa87",
  "#e77a3c",
  "#abb034",
];

const TooltipWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

const MajorKeyConsiderationTitle = styled.div`
  text-align: right;
  vertical-align: middle;
  line-height: 21px;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 5px;
`;

class ActionsAndKPIs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      columns: this.createcolumns(columnsStatus),
      selectedIssueOfInterest: null,
      selectedCoreSubject: null,
      gapAnalysiskeyConsiderations: [],
    }
  }

  getGapAnalysisIssueOfInterest(projectID, coreSubject, issueOfInterest) {
    axios
      .get(`/api/gapanalysis/${projectID}/${coreSubject}/${issueOfInterest}`, {
        headers: { authorization: localStorage.getItem("token") }, // eslint-disable-line
      })
      .then(({ data }) => {
        // console.log("DATTA:", get(data, 'data.keyConsiderations'));
        this.setState({
          gapAnalysiskeyConsiderations: get(data, "data.keyConsiderations"),
        });
      })
      .catch((error) => {
        message.error("There was an error with your request.?");
      });
  }

  createcolumns(columns) {
    const columns2 = [
      {
        title: "Initial Company Performance Score",
        dataIndex: "1",
        render: (text, record, index) => {
          return getCompanyPerformance(get(record, "actualPerformanceValue"));
        },
      },
      {
        title: "Revised Company Performance Score",
        key: "revisedScore",
        render: (object) => {
          const value = object.revisedScore;
          // CSR-97 change this line (old line -> const score = value ? round(value * 100) : '-')
          const score = typeof value === "number" ? round(value * 100) : "-";
          return getRevisingScorePerformance(score);
        },
      },
      {
        title: "Relevance & Significance Score",
        dataIndex: "3",
        render: (text, record, index) => {
          return getRelevanceSignificance(get(record, "relevanceValue"));
        },
      },
    ];
    columns.push(...columns2);
    return columns;
  }

  handleFormSubmit(fields) {
    const { companyId, refetch, reset, projectId, projectYear } = this.props;
    this.setState({ loading: true });
    this.props
      .mutate({
        variables: {
          ...fields,
          companyId: companyId,
          coreSubject: fields.issueOfInterest[0],
          issueOfInterest: fields.issueOfInterest[1],
          projectId,
          year: projectYear,
          textData: this.state.textData
        },
        //refetchQueries: [{query: fetchCompanyQuery, variables: {id: companyId}}],
      })
      .then(({ data }) => {
        refetch();
        message.success("Processing complete!");
        reset();

        this.setState({
          loading: false,
          visible: false,
        });

      })
      .catch(({ message, locations, path }) => {
        this.setState({ loading: false });
        return notification.warning({
          message: "Add Actions and KPIs ",
          description: message,
        });
      });
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.visible && !nextState.visible) {
      this.setState({ visible: true });
    }
    if (!nextState.visible) {
      this.props.hideModal();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.selectedIssueOfInterest &&
      this.state.selectedCoreSubject &&
      (prevState.selectedIssueOfInterest !==
        this.state.selectedIssueOfInterest ||
        prevState.selectedCoreSubject !== this.state.selectedCoreSubject)
    ) {
      // console.log('pokemons state has changed.', this.state.selectedIssueOfInterest, this.state.selectedIssueOfInterest)
      // get data:
      this.getGapAnalysisIssueOfInterest(
        this.props.projectId,
        this.state.selectedCoreSubject,
        this.state.selectedIssueOfInterest
      );
    }
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
    this.props.showModal(this.state.visible);
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  onChange(value, selectedOptions) {
    this.setState({
      selectedIssueOfInterest: value[1],
      selectedCoreSubject: value[0],
    });
  }

  getOption(issueOfInterests, project) {
    return {
      title: {
        text: "Materiality Matrix - Issues Of Interest",
        subtext: `${get(project, "title")} [${get(project, "year")}]`,
        left: "center",
      },
      grid: {
        top: 120,
      },
      tooltip: {
        formatter: function (obj) {
          const data = obj.data;
          return ` Core Subject: ${get(
            coreSubjectNames[data[3]],
            "label"
          )} <br/>
          Issue of Interest: ${get(issueOfInterest[data[2]], "label")}<br/>
          Relevance to Internal Stakeholders: ${data[0]} <br/>
          Relevance to External Stakeholders: ${data[1]}`;
        },
      },
      xAxis: {
        splitLine: {
          lineStyle: {
            type: "dashed",
          },
        },
        max: 100,
        interval: 34,
        name: "Relevance to Internal Stakeholders",
        nameLocation: "center",
        nameTextStyle: {
          padding: 30,
        },
      },

      yAxis: {
        splitLine: {
          lineStyle: {
            type: "dashed",
          },
        },
        max: 100,
        interval: 34,
        name: "Relevance to External Stakeholders",
        nameLocation: "middle",
        nameTextStyle: {
          padding: 30,
        },
      },
      series: [
        {
          symbolSize: 20,
          data: issueOfInterests.map((issueOfInterest) => [
            issueOfInterest.relevanceCompanyValue,
            issueOfInterest.relevanceStakeholdersValue,
            issueOfInterest.issueOfInterest,
            issueOfInterest.coreSubject,
            issueOfInterest.c,
          ]),
          type: "scatter",
          itemStyle: {
            normal: {
              shadowBlur: 10,
              shadowColor: "rgba(120, 36, 50, 0.5)",
              shadowOffsetY: 5,
              color: color[0],
            },
          },
          label: {
            show: true,
            formatter: function (params) {
              return params.data[4];
            },
            backgroundColor: color[0],
            width: "100px",
          },
        },
      ],
    };
  }

  renderMajorIssues(field) {
    const { columns, selectedIssueOfInterest, selectedCoreSubject } =
      this.state;
    const keyConsiderations = this.state.gapAnalysiskeyConsiderations;

    const keyConsiderationsMajor = filter(
      keyConsiderations,
      (keyConsideration) => keyConsideration.issueLevel > 5
    );
    return (
      <div key="majorIssues" style={{ position: "relative", marginTop: 15 }}>
        <MajorKeyConsiderationTitle>
          {field.label}
          <TooltipWrapper>
            <InfoTooltip content={kpiMajorIssuesTooltip} placement="leftTop" />
          </TooltipWrapper>
        </MajorKeyConsiderationTitle>
        <Scrollbars autoHide autoHeight autoHeightMin={0} autoHeightMax={250}>
          <TableWrapper
            key={field.name}
            size="small"
            columns={columns}
            dataSource={keyConsiderationsMajor}
            pagination={false}
            rowKey="keyConsideration"
            locale={{
              emptyText:
                "No major issues were identified under this specific issue of interest. User to assign an Action & KPI at their own discretion",
            }}
            title={() => (
              <div>
                <span style={{ color: "#888" }}> Major Issues: </span>
                <span>
                  {" "}
                  {get(issueOfInterest[selectedIssueOfInterest], "label")}{" "}
                </span>
              </div>
            )}
          />
        </Scrollbars>
      </div>
    );
  }

  renderFields(group) {
    // Filter fields that belong to the specified group and company
    const filteredFields = filter(values(group), ["group", "company"]);
  
    return filteredFields.map((field) => {
      if (field.name === "majorIssues") {
        // Render specific fields differently
        return this.renderMajorIssues(field);
      }
  
      // Define common props for the Field component
      const fieldProps = {
        key: field.name,
        ...field,
        name: field.name,
        label: field.label,
        component: field.component,
        placeholder: field.label,
        options: field.options,
        isEditable: field.isEditable || "", // Ensure compatibility
      };
  
      // Conditionally handle inputType 'textField'
      if (field.inputType === "textField") {
        return <Field {...fieldProps} />;
      }
  
      // Default rendering for other field types
      return (
        <Field
          {...fieldProps}
          onChange={this.onChange.bind(this)} // Attach onChange handler
        />
      );
    });
  }
  
  render() {
    const {
      handleSubmit,
      data: { materiality },
    } = this.props;
    if (!materiality) {
      return <div />;
    }

    const issueOfInterests = [];
    orderBy(materiality.coreSubjects, ["weightValue"], ["desc"])
      .slice(0, 4)
      .map((coreSubject) => {
        return coreSubject.issueOfInterests.map((issue) => {
          return issueOfInterests.push({
            ...issue,
            coreSubject: coreSubject.coreSubject,
            c: `${get(coreSubjectNames[coreSubject.coreSubject], "orderby")}.${
              get(issueOfInterest[issue.issueOfInterest], "orderby") + 1
            }`,
          });
        });
      });

    return (
      <div style={{ marginRight: 30 }}>
        <Form className="login-form">
          <Modals
            width={"90%"}
            visible={this.state.visible}
            title="Set new Action & KPI"
            onCancel={this.handleCancel}
            footer={[
              <Button key="back" onClick={this.handleCancel}>
                Return
              </Button>,
              <Button
                key="submit"
                type="primary"
                loading={this.state.loading}
                onClick={handleSubmit(this.handleFormSubmit.bind(this))}
              >
                Submit
              </Button>,
            ]}
          >
            <div>
              <Row style={{ marginBottom: 15 }}>
                <Col span={12}>
                  {this.renderFields(actionAndKPIFields)}
                  <TooltipWrapper>
                    <InfoTooltip content={kpiTooltip} placement="leftTop" />
                  </TooltipWrapper>
                </Col>
                <Col span={12}>
                  <ReactEcharts
                    option={this.getOption(
                      issueOfInterests,
                      get(materiality, "project")
                    )}
                    style={{ height: 500 }}
                    onChartReady={this.onChartReady}
                  />
                </Col>
              </Row>
            </div>
          </Modals>
        </Form>
      </div>
    );
  }
}

const ActionsAndKPIsForm = reduxForm({
  form: "actionsAndKPIs",
})(ActionsAndKPIs);

// export default graphql(addActionsAndKPIsToCompany)(graphql(fetchMateriality, {
//   options: (props) => {return {variables: {id: props.materialityId}}},
// })(injectIntl(ActionsAndKPIsForm)))

export default compose(
  graphql(addActionsAndKPIsToCompany),
  graphql(fetchMateriality, {
    options: (props) => {
      return { variables: { id: props.materialityId } };
    },
  })
)(injectIntl(ActionsAndKPIsForm));
