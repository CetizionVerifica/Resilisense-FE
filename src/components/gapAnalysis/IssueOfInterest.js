import React, { Component, useState, useEffect } from "react";
import clone from "clone";
import { Row, Col, Tag, message, Divider, Tooltip, InputNumber } from "antd";
import { values, filter, find, get, round, maxBy, groupBy } from "lodash";
import { graphql } from "react-apollo";
import { injectIntl } from "react-intl";
import styled from "styled-components";
import { performanceView } from "../../common/enum/performance";
import {
  updateGapAnalysisMutation,
  updateGapAnalysisWithExtraMutation,
} from "../../graphql/gapAnalysisMutation";
import { DropdownCell, ActionCell, IconCell } from "../../common/helperCells";
import {
  weightCompanyPerformance,
  customWeightCompanyPerformance_v_1_1_2_3,
  customWeightCompanyPerformance_v_1_5_2_4,
  weightRelevanceSignificance,
} from "../../common/enum/weight";
import { gapAnalysisQuestions } from "../../common/gapAnalysisQuestions";
import {
  issueOfIntPerformance,
  companyPerformanceTooltip,
  companyRelevanceTooltip,
  noteTooltip,
  fileTooltip,
  exportTooltip,
} from "../../common/tooltips";
import basicStyle from "../../common/basicStyle";
import TableWrapper from "../styles/table.style";
import ExportImage from "../utility/exportImage";
import { columns } from "./issueOfIterestsListConfig";
import InfoTooltip from "../utility/InfoTooltip";

const TableTooltipWrapper = styled.div`
  display: flex;
`;

const TooltipWrapper = styled.div`
  margin-left: 10px;
`;

const ExportTooltipWrapper = styled.div`
  position: absolute;
  top: 17px;
  right: 8px;
`;
const CompanyPerformanceCell = styled.div`
  display: flex;
  width: 100%;
  height: 50px;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
`;
const updateKeyConsiderations = [];
const { rowStyle, colStyle, gutter } = basicStyle;

function CompanyPerformance_2_4_3({
  record,
  disabled,
  issueOfInterest,
  companyPerformanceCell,
}) {
  const [grievances, setGrievances] = useState(null);
  const [satisfactory, setSatisfactory] = useState(null);
  const keyConsiderations = get(issueOfInterest, "keyConsiderations");
  const slectedValue = find(keyConsiderations, {
    keyConsideration: record.key,
  });

  useEffect(() => {
    function calculateValue() {
      const percent = (satisfactory / grievances) * 100;
      switch (true) {
        case percent >= 0 && percent < 20:
          return 0;
        case percent >= 20 && percent < 40:
          return 1;
        case percent >= 40 && percent < 60:
          return 2;
        case percent >= 60 && percent < 80:
          return 3;
        case percent >= 80 && percent <= 100:
          return 4;
        default:
          return 0;
      }
    }
    console.log("243", calculateValue());
    const delayDebounceFn = setTimeout(() => {
      if (grievances && satisfactory)
        companyPerformanceCell(record, calculateValue(), slectedValue, true, [
          grievances,
          satisfactory,
        ]);
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [grievances, satisfactory]);

  useEffect(() => {
    if (issueOfInterest && issueOfInterest.length !== 0) {
      grievances !== issueOfInterest.customField[0] &&
        setGrievances(issueOfInterest.customField[0]);
      satisfactory !== issueOfInterest.customField[1] &&
        setSatisfactory(issueOfInterest.customField[1]);
    }
  }, []);

  return (
    <div>
      <CompanyPerformanceCell>
        <div>Number of grievances reported over the last year:</div>
        <InputNumber
          min={0}
          disabled={disabled}
          value={grievances}
          onChange={(e) => {
            if (Number.isInteger(e)) {
              setGrievances(e);
            } else {
              message.error(
                "Error: Invalid input type. Please enter a number!"
              );
            }
          }}
        />
      </CompanyPerformanceCell>
      <CompanyPerformanceCell>
        <div>Number of satisfactory resolutions over the last year:</div>
        <InputNumber
          min={0}
          disabled={disabled}
          value={satisfactory}
          onChange={(e) => {
            if (Number.isInteger(e)) {
              setSatisfactory(e);
            } else {
              message.error(
                "Error: Invalid input type. Please enter a number!"
              );
            }
          }}
        />
      </CompanyPerformanceCell>
    </div>
  );
}
function CompanyPerformance_7_5_1({
  record,
  issueOfInterest,
  companyPerformanceCell,
  disabled,
}) {
  const [localEmployees, setLocalEmployees] = useState(null);
  const [totalEmployees, setTotalEmployees] = useState(null);
  const keyConsiderations = get(issueOfInterest, "keyConsiderations");
  const slectedValue = find(keyConsiderations, {
    keyConsideration: record.key,
  });

  useEffect(() => {
    function calculateValue() {
      const percent = (localEmployees / totalEmployees) * 100;
      switch (true) {
        case percent >= 0 && percent < 20:
          return 0;
        case percent >= 20 && percent < 40:
          return 1;
        case percent >= 40 && percent < 60:
          return 2;
        case percent >= 60 && percent < 80:
          return 3;
        case percent >= 80 && percent <= 100:
          return 4;
        default:
          return 0;
      }
    }
    const delayDebounceFn = setTimeout(() => {
      if (localEmployees && totalEmployees) {
        companyPerformanceCell(record, calculateValue(), slectedValue, true, [
          localEmployees,
          totalEmployees,
        ]);
      }
    }, 2000);

    return () => clearTimeout(delayDebounceFn);
  }, [localEmployees, totalEmployees]);

  useEffect(() => {
    if (issueOfInterest && issueOfInterest.length !== 0) {
      localEmployees !== issueOfInterest.customField[0] &&
        setLocalEmployees(issueOfInterest.customField[0]);
      totalEmployees !== issueOfInterest.customField[1] &&
        setTotalEmployees(issueOfInterest.customField[1]);
    }
  }, []);

  return (
    <div>
      <CompanyPerformanceCell>
        <div>Number of local employees: </div>
        <InputNumber
          min={0}
          disabled={disabled}
          value={localEmployees}
          onChange={(e) => {
            if (Number.isInteger(e)) {
              setLocalEmployees(e);
            } else {
              message.error(
                "Error: Invalid input type. Please enter a number!"
              );
            }
          }}
        />
      </CompanyPerformanceCell>
      <CompanyPerformanceCell>
        <div>Number of total employees: </div>
        <InputNumber
          min={0}
          disabled={disabled}
          value={totalEmployees}
          onChange={(e) => {
            if (Number.isInteger(e)) {
              setTotalEmployees(e);
            } else {
              message.error(
                "Error: Invalid input type. Please enter a number!"
              );
            }
          }}
        />
      </CompanyPerformanceCell>
    </div>
  );
}
function CompanyPerformance_7_5_2({
  record,
  issueOfInterest,
  companyPerformanceCell,
  disabled,
}) {
  const [percentage, setPercentage] = useState(null);
  const keyConsiderations = get(issueOfInterest, "keyConsiderations");
  const slectedValue = find(keyConsiderations, {
    keyConsideration: record.key,
  });

  useEffect(() => {
    function calculateValue() {
      switch (true) {
        case percentage >= 0 && percentage < 20:
          return 0;
        case percentage >= 20 && percentage < 40:
          return 1;
        case percentage >= 40 && percentage < 60:
          return 2;
        case percentage >= 60 && percentage < 80:
          return 3;
        case percentage >= 80 && percentage <= 100:
          return 4;
        default:
          return 0;
      }
    }
    const delayDebounceFn = setTimeout(() => {
      if (percentage) {
        companyPerformanceCell(record, calculateValue(), slectedValue, true, [
          percentage,
        ]);
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [percentage]);

  useEffect(() => {
    if (issueOfInterest && issueOfInterest.length !== 0) {
      percentage !== issueOfInterest.extraCustomField[0] &&
        setPercentage(issueOfInterest.extraCustomField[0]);
    }
  }, []);

  return (
    <div>
      <CompanyPerformanceCell>
        <div>Percentage of locally sourced goods and services: </div>
        <InputNumber
          min={0}
          disabled={disabled}
          value={percentage}
          onChange={(e) => {
            if (Number.isInteger(e) && e <= 100) {
              setPercentage(e);
            } else {
              message.error(
                "Error: Invalid input type. Please enter a number from 0 to 100!"
              );
            }
          }}
        />
      </CompanyPerformanceCell>
    </div>
  );
}
function CompanyPerformance_3_2_19({
  record,
  issueOfInterest,
  companyPerformanceCell,
  disabled,
}) {
  const [topAverageHourlySalaryMale, setTopAverageHourlySalaryMale] = useState(
    null
  );
  const [
    topAverrageHourlySalaryFemale,
    setTopAverageHourlySalaryFemale,
  ] = useState(null);
  const [
    lowerAverageHourlySalaryMale,
    setLowerAverageHourlySalaryMale,
  ] = useState(null);
  const [
    lowerAverageHourlySalaryFemale,
    setLowerAverageHourlySalaryFemale,
  ] = useState(null);
  const [
    remainingAverageHourlySalaryMale,
    setRemainingAverageHourlySalaryMale,
  ] = useState(null);
  const [
    remainingAverageHourlySalaryFemale,
    setRemaingAverageHourlySalaryFemale,
  ] = useState(null);

  const keyConsiderations = get(issueOfInterest, "keyConsiderations");
  const slectedValue = find(keyConsiderations, {
    keyConsideration: record.key,
  });
  useEffect(() => {
    function calculateValue() {
      const percent =
        ((topAverageHourlySalaryMale - topAverrageHourlySalaryFemale) /
          (topAverageHourlySalaryMale * 3) +
          (lowerAverageHourlySalaryMale - lowerAverageHourlySalaryFemale) /
            (lowerAverageHourlySalaryMale * 3) +
          (remainingAverageHourlySalaryMale -
            remainingAverageHourlySalaryFemale) /
            (remainingAverageHourlySalaryMale * 3)) *
        100;
      // console.log(percent)
      switch (true) {
        case percent >= 60:
          return 0;
        case percent >= 41 && percent < 60:
          return 1;
        case percent >= 21 && percent < 41:
          return 2;
        case percent >= 1 && percent < 21:
          return 3;
        case percent >= 0 && percent < 1:
          return 4;
        default:
          return 0;
      }
    }
    const delayDebounceFn = setTimeout(() => {
      if (
        topAverageHourlySalaryMale &&
        topAverrageHourlySalaryFemale &&
        lowerAverageHourlySalaryFemale &&
        lowerAverageHourlySalaryMale &&
        remainingAverageHourlySalaryFemale &&
        remainingAverageHourlySalaryMale
      ) {
        console.log(calculateValue());
        companyPerformanceCell(record, calculateValue(), slectedValue, true, [
          topAverageHourlySalaryMale,
          topAverrageHourlySalaryFemale,
          lowerAverageHourlySalaryMale,
          lowerAverageHourlySalaryFemale,
          remainingAverageHourlySalaryMale,
          remainingAverageHourlySalaryFemale,
        ]);
      }
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [
    topAverageHourlySalaryMale,
    topAverrageHourlySalaryFemale,
    lowerAverageHourlySalaryFemale,
    lowerAverageHourlySalaryMale,
    remainingAverageHourlySalaryFemale,
    remainingAverageHourlySalaryMale,
  ]);
  useEffect(() => {
    if (issueOfInterest && issueOfInterest.customField.length !== 0) {
      setTopAverageHourlySalaryMale(issueOfInterest.customField[0]);
      setTopAverageHourlySalaryFemale(issueOfInterest.customField[1]);
      setLowerAverageHourlySalaryMale(issueOfInterest.customField[2]);
      setLowerAverageHourlySalaryFemale(issueOfInterest.customField[3]);
      setRemainingAverageHourlySalaryMale(issueOfInterest.customField[4]);
      setRemaingAverageHourlySalaryFemale(issueOfInterest.customField[5]);
    }
  }, []);

  return (
    <div>
      <div underline strong>
        Top management
      </div>
      <CompanyPerformanceCell>
        <div>Average hourly salary for male employees: </div>
        <InputNumber
          min={0}
          disabled={disabled}
          value={topAverageHourlySalaryMale}
          onChange={(e) => {
            if (Number.isInteger(e)) {
              setTopAverageHourlySalaryMale(e);
            } else {
              message.error(
                "Error: Invalid input type. Please enter a number!"
              );
            }
          }}
        />
      </CompanyPerformanceCell>
      <CompanyPerformanceCell>
        <div>Average hourly salary for female employees:</div>
        <InputNumber
          min={0}
          disabled={disabled}
          value={topAverrageHourlySalaryFemale}
          onChange={(e) => {
            if (Number.isInteger(e)) {
              setTopAverageHourlySalaryFemale(e);
            } else {
              message.error(
                "Error: Invalid input type. Please enter a number!"
              );
            }
          }}
        />
      </CompanyPerformanceCell>
      <div underline strong>
        Lower management
      </div>
      <CompanyPerformanceCell>
        <div>Average hourly salary for male employees: </div>
        <InputNumber
          min={0}
          disabled={disabled}
          value={lowerAverageHourlySalaryMale}
          onChange={(e) => {
            if (Number.isInteger(e)) {
              setLowerAverageHourlySalaryMale(e);
            } else {
              message.error(
                "Error: Invalid input type. Please enter a number!"
              );
            }
          }}
        />
      </CompanyPerformanceCell>
      <CompanyPerformanceCell>
        <div>Average hourly salary for female employees:</div>
        <InputNumber
          min={0}
          disabled={disabled}
          value={lowerAverageHourlySalaryFemale}
          onChange={(e) => {
            if (Number.isInteger(e)) {
              setLowerAverageHourlySalaryFemale(e);
            } else {
              message.error(
                "Error: Invalid input type. Please enter a number!"
              );
            }
          }}
        />
      </CompanyPerformanceCell>
      <div underline strong>
        Remaining Workforce
      </div>
      <CompanyPerformanceCell>
        <div>Average hourly salary for male employees: </div>
        <InputNumber
          min={0}
          disabled={disabled}
          value={remainingAverageHourlySalaryMale}
          onChange={(e) => {
            if (Number.isInteger(e)) {
              setRemainingAverageHourlySalaryMale(e);
            } else {
              message.error(
                "Error: Invalid input type. Please enter a number!"
              );
            }
          }}
        />
      </CompanyPerformanceCell>
      <CompanyPerformanceCell>
        <div>Average hourly salary for female employees:</div>
        <InputNumber
          min={0}
          disabled={disabled}
          value={remainingAverageHourlySalaryFemale}
          onChange={(e) => {
            if (Number.isInteger(e)) {
              setRemaingAverageHourlySalaryFemale(e);
            } else {
              message.error(
                "Error: Invalid input type. Please enter a number!"
              );
            }
          }}
        />
      </CompanyPerformanceCell>
    </div>
  );
}
function CompanyPerformance_1_5_1({
  record,
  issueOfInterest,
  companyPerformanceCell,
  dropDownValues,
  disabled,
}) {
  const [number, setNumber] = useState(null);
  const keyConsiderations = get(issueOfInterest, "keyConsiderations");
  const maxDropDownValue = maxBy(dropDownValues, "value").value;
  const slectedValue = find(keyConsiderations, {
    keyConsideration: record.key,
  });
  const relevanceValue = get(slectedValue, "relevanceValue");
  const performanceValue = get(slectedValue, "performanceValue");
  const value = get(find(dropDownValues, { value: performanceValue }), "value");
  const dropDownValue =
    !value && performanceValue > maxDropDownValue
      ? maxDropDownValue
      : performanceValue;

  if (!value && performanceValue > maxDropDownValue) {
    this.normalizeCompanyPerformance(record, dropDownValue, slectedValue);
  }
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (number)
        companyPerformanceCell(record, dropDownValue, slectedValue, true, [
          number,
        ]);
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [number, dropDownValue, record, slectedValue]);

  useEffect(() => {
    if (issueOfInterest && issueOfInterest.customField.length !== 0) {
      setNumber(issueOfInterest.customField[0]);
    }
  }, [issueOfInterest]);
  return (
    <React.Fragment>
      <DropdownCell
        // defaultValue={relevanceValue === 0 ? "N/A" : dropDownValue}
        defaultValue={dropDownValue}
        record={record}
        disabled={disabled}
        // disabled={relevanceValue === 0 || !canEdit}
        options={dropDownValues}
        callBack={(value) => {
          // console.log("Performance:->", value);
          return companyPerformanceCell(record, value, slectedValue, true);
        }}
      />
      {dropDownValue === 4 && (
        <CompanyPerformanceCell>
          <div>If yes, how many ?</div>
          <InputNumber
            min={0}
            disabled={disabled}
            value={number}
            onChange={(e) => {
              if (Number.isInteger(e)) {
                setNumber(e);
              } else {
                message.error(
                  "Error: Invalid input type. Please enter a number!"
                );
              }
            }}
          />
        </CompanyPerformanceCell>
      )}
    </React.Fragment>
  );
}
function DropdownCompanyPerformance({
  record,
  issueOfInterest,
  dropDownValues,
  companyPerformanceCell,
  disabled,
}) {
  const keyConsiderations = get(issueOfInterest, "keyConsiderations");
  const maxDropDownValue = maxBy(dropDownValues, "value").value;
  const slectedValue = find(keyConsiderations, {
    keyConsideration: record.key,
  });
  const relevanceValue = get(slectedValue, "relevanceValue");
  const performanceValue = get(slectedValue, "performanceValue");
  const value = get(find(dropDownValues, { value: performanceValue }), "value");
  const dropDownValue =
    !value && performanceValue > maxDropDownValue
      ? maxDropDownValue
      : performanceValue;

  if (!value && performanceValue > maxDropDownValue) {
    this.normalizeCompanyPerformance(record, dropDownValue, slectedValue);
  }
  return (
    <DropdownCell
      // defaultValue={relevanceValue === 0 ? "N/A" : dropDownValue}
      defaultValue={dropDownValue}
      record={record}
      disabled={disabled}
      // disabled={relevanceValue === 0 || !canEdit}
      options={dropDownValues}
      callBack={(value) => {
        // console.log("Performance:->", value);
        return companyPerformanceCell(record, value, slectedValue, true);
      }}
    />
  );
}

class IssueOfInterestList extends Component {
  constructor(props) {
    super(props);
    this.companyPerformanceCell = this.companyPerformanceCell.bind(this);
    this.companyPerformanceCellExtra = this.companyPerformanceCellExtra.bind(
      this
    );

    this.state = {
      gapColumns: this.createcolumns(clone(columns), props, false),
      search: "",
      visible: false,
      current: 0,
      gapAnalys: [],
      groupedByQuestion: groupBy(
        filter(values(gapAnalysisQuestions), {
          isuueOfInterest: this.props.issue.key,
        }),
        "groupby"
      ),
      questions: [],
    };
  }
  componentDidMount() {
    const keys = Object.keys(this.state.groupedByQuestion);
    const newQuestions = [];
    for (let index = 0; index < keys.length; index++) {
      if (keys[index] === "0") {
        newQuestions.push(...this.state.groupedByQuestion["0"]);
      } else {
        newQuestions.push(this.state.groupedByQuestion[keys[index]][0]);
      }
    }
    this.setState({ questions: newQuestions });
  }

  componentWillReceiveProps(nextProp) {
    const { issueOfInterest, showMissingOptions } = nextProp;
    if (issueOfInterest || showMissingOptions) {
      this.setState({
        gapColumns: this.createcolumns(clone(columns), nextProp, true),
      });
    }
  }
  renderCoreSubjectResult(issueOfInterest) {
    return (
      <div style={{ divAlign: "center" }}>
        <Divider orientation="left">Overview</Divider>
        <Row style={rowStyle} justify="space-between" gutter={gutter}>
          {values(performanceView).map((item) => {
            return (
              <Col md={11} sm={11} xs={24} style={colStyle} key={item.key}>
                <span style={{ marginBottom: 10, display: "block" }}>
                  {item.label}{" "}
                </span>
                <Tag color={item.color}>
                  {round(get(issueOfInterest, item.value, 0) * 100, 2)}%
                </Tag>
              </Col>
            );
          })}
          <Col md={2} sm={2} xs={24} style={{ marginTop: 25 }}>
            <InfoTooltip content={issueOfIntPerformance} />
          </Col>
        </Row>
      </div>
    );
  }

  renderColumnTitle(div, tooltipContent) {
    return (
      <TableTooltipWrapper>
        <span>{div}</span>
        <TooltipWrapper>
          <InfoTooltip content={tooltipContent} />
        </TooltipWrapper>
      </TableTooltipWrapper>
    );
  }

  createcolumns(
    columns,
    { issueOfInterest, showMissingOptions, canEdit, canUploadFile },
    isParent
  ) {
    const {
      intl: { formatMessage },
      showNote,
      showRelateWithFile,
      showViewPDF,
      issue,
    } = this.props;
    const keyConsiderations = get(issueOfInterest, "keyConsiderations");
    const gapAnalysisColumn = [
      {
        title: "Key Considerations",
        key: "keyConsiderations",
        width: 500,
        render: (object) => {
          const slectedValue = find(keyConsiderations, {
            keyConsideration: object.key,
          });
          const note = get(slectedValue, "note");
          return (
            <div>
              <div>
                <div>{formatMessage(object.localization)}</div>
              </div>
              {note && object.groupby !== 0 && (
                <div>
                  <div strong>{`Note: ${note}`}</div>
                </div>
              )}
            </div>
          );
        },
      },
      {
        title: this.renderColumnTitle(
          "Company Performance",
          companyPerformanceTooltip
        ),
        dataIndex: "1",
        render: (div, record, index) => {
          const slectedValue = find(keyConsiderations, {
            keyConsideration: record.key,
          });
          const relevanceValue = get(slectedValue, "relevanceValue");
          const performanceValue = get(slectedValue, "performanceValue");

          if (record.dropdown !== 0) {
            if (record.value === "v_1_1_2_3") {
              return (
                <DropdownCompanyPerformance
                  record={record}
                  issueOfInterest={issueOfInterest}
                  dropDownValues={values(
                    customWeightCompanyPerformance_v_1_1_2_3
                  )}
                  disabled={!canEdit}
                  companyPerformanceCell={this.companyPerformanceCell}
                />
              );
            } else if (record.value === "v_1_1_5_1") {
              return (
                <CompanyPerformance_1_5_1
                  record={record}
                  disabled={!canEdit}
                  issueOfInterest={issueOfInterest}
                  companyPerformanceCell={this.companyPerformanceCell}
                  dropDownValues={values(weightCompanyPerformance)}
                />
              );
            } else if (record.value === "v_1_2_4_3") {
              return (
                <CompanyPerformance_2_4_3
                  record={record}
                  disabled={!canEdit}
                  issueOfInterest={issueOfInterest}
                  companyPerformanceCell={this.companyPerformanceCell}
                />
              );
            } else if (record.value === "v_1_7_5_1") {
              return (
                <CompanyPerformance_7_5_1
                  record={record}
                  disabled={!canEdit}
                  issueOfInterest={issueOfInterest}
                  companyPerformanceCell={this.companyPerformanceCell}
                />
              );
            } else if (record.value === "v_1_7_5_2") {
              return (
                <CompanyPerformance_7_5_2
                  record={record}
                  disabled={!canEdit}
                  issueOfInterest={issueOfInterest}
                  companyPerformanceCell={this.companyPerformanceCellExtra}
                />
              );
            } else if (record.value === "v_1_3_2_19") {
              return (
                <CompanyPerformance_3_2_19
                  record={record}
                  disabled={!canEdit}
                  issueOfInterest={issueOfInterest}
                  companyPerformanceCell={this.companyPerformanceCell}
                />
              );
            } else if (record.value === "v_1_3_2_14") {
              return (
                <DropdownCompanyPerformance
                  record={record}
                  disabled={!canEdit}
                  issueOfInterest={issueOfInterest}
                  dropDownValues={values(
                    customWeightCompanyPerformance_v_1_1_2_3
                  )}
                  companyPerformanceCell={this.companyPerformanceCell}
                />
              );
            } else if (record.value === "v_1_5_2_4") {
              return (
                <DropdownCompanyPerformance
                  record={record}
                  disabled={!canEdit}
                  issueOfInterest={issueOfInterest}
                  dropDownValues={values(
                    customWeightCompanyPerformance_v_1_5_2_4
                  )}
                  companyPerformanceCell={this.companyPerformanceCell}
                />
              );
            } else {
              return (
                <DropdownCompanyPerformance
                  record={record}
                  disabled={!canEdit}
                  issueOfInterest={issueOfInterest}
                  dropDownValues={values(weightCompanyPerformance)}
                  companyPerformanceCell={this.companyPerformanceCell}
                />
              );
            }
          }
        },
      },
      {
        title: this.renderColumnTitle(
          "Relevance & Significance",
          companyRelevanceTooltip
        ),
        dataIndex: "3",
        render: (div, record, index) => {
          const slectedValue = find(keyConsiderations, {
            keyConsideration: record.key,
          });
          return (
            <React.Fragment>
              {record.dropdown !== 0 ? (
                <DropdownCell
                  defaultValue={get(slectedValue, "relevanceValue")}
                  record={record}
                  disabled={!canEdit}
                  options={values(weightRelevanceSignificance)}
                  callBack={(value) => {
                    // console.log("Value:", value);
                    return this.relevanceSignificanceCell(
                      record,
                      value,
                      slectedValue
                    );
                  }}
                />
              ) : null}
            </React.Fragment>
          );
        },
      },
      {
        title: this.renderColumnTitle("Note", noteTooltip),
        key: "action",
        width: 50,
        render: (record) => {
          const slectedValue = find(keyConsiderations, {
            keyConsideration: record.key,
          });
            return ActionCell([
              {
                key: "note",
                onClick: () => {
                  if (!canUploadFile) {
                    return;
                  } else {
                    showNote(record, get(slectedValue, "note", ""));
                  }
                },
                link: "#",
                icon: "solution",
                iconColor: get(slectedValue, "note") ? "#52c41a" : "#08c",
              },
            ]);
        },
      },
      {
        title: this.renderColumnTitle("Documentation", fileTooltip),
        key: "relateFile",
        width: 50,
        render: (div, record, index) => {
          if (record.noDocument) {
            return null;
          }

          const slectedValue = find(keyConsiderations, {
            keyConsideration: record.key,
          });
          const relevanceValue = get(slectedValue, "relevanceValue");

          if (relevanceValue === 0) {
            return IconCell([
              {
                key: "file",
                icon: "file",
                iconColor: "#d3d3d3",
              },
            ]);
          }
            return (
              <Tooltip title={record.doclabel}>
                {ActionCell([
                  {
                    key: "file",
                    onClick: () => {
                      if (!canUploadFile) {
                        return;
                      }
                      showRelateWithFile(
                        record,
                        get(slectedValue, "file.id", ""),
                        get(slectedValue, "noRelatedDocument", false)
                      );
                    },
                    link: "#",
                    icon: "file",
                    iconColor:
                      get(slectedValue, "file") ||
                      get(slectedValue, "noRelatedDocument")
                        ? "#52c41a"
                        : "#08c",
                  },
                ])}{" "}
              </Tooltip>
            );
        },
      },
      {
        title: this.renderColumnTitle("Preview Docs", fileTooltip),
        key: "viewPDF",
        width: 50,
        render: (div, record, index) => {
          if (record.noDocument) {
            return null;
          }

          const slectedValue = find(keyConsiderations, {
            keyConsideration: record.key,
          });
          const relevanceValue = get(slectedValue, "relevanceValue");

          if (relevanceValue === 0) {
            return IconCell([
              {
                key: "action",
                icon: "file",
                iconColor: "#d3d3d3",
              },
            ]);
          }

          return (
            <Tooltip title={record.doclabel}>
              {ActionCell([
                {
                  key: "file",
                  onClick: () => {
                    if (!canUploadFile) {
                      return;
                    }
                    showViewPDF(
                      record,
                      get(slectedValue, "file.id", ""),
                      get(slectedValue, "noRelatedDocument", false)
                    );
                  },
                  link: "#",
                  icon: "file",
                  iconColor:
                    get(slectedValue, "file") ||
                    get(slectedValue, "noRelatedDocument")
                      ? "#52c41a"
                      : "#08c",
                },
              ])}
            </Tooltip>
          );
        },
      },
    ];
    columns.push(...gapAnalysisColumn);

    if (showMissingOptions) {
      columns.push({
        title: "",
        key: "error",
        width: 15,
        render: (record) => {
          const selectedValue = find(keyConsiderations, {
            keyConsideration: record.key,
          });
          const relevance = get(selectedValue, "relevanceValue", null);

          const hasFile =
            relevance === 0 ||
            get(selectedValue, "file") !== null ||
            get(selectedValue, "noRelatedDocument") ||
            get(selectedValue, "noDocument");
          const hasRelevance = relevance !== null;
          const hasPerformance =
            relevance === 0 ||
            (relevance !== 0 &&
              get(selectedValue, "performanceValue", null) !== null);
          const icon =
            !hasFile || !hasRelevance || !hasPerformance
              ? "exclamation-circle"
              : "";

          return ActionCell([
            {
              key: "file",
              onClick: () => false,
              link: "#",
              icon,
              iconColor: "#AF0606",
            },
          ]);
        },
      });
    }

    return columns;
  }

  normalizeCompanyPerformance(record, value, currentValue) {
    if (updateKeyConsiderations.indexOf(record.key) > -1) {
      return;
    }

    updateKeyConsiderations.push(record.key);

    this.companyPerformanceCell(record, value, currentValue, false);
  }

  companyPerformanceCellExtra(
    record,
    value,
    currentValue,
    showMessage,
    extraCustomField
  ) {
    const { refetch } = this.props;
    const keyConsideration = {
      id: this.props.gapAnalysisId,
      keyConsideration: record.key,
      performanceValue: value,
      extraCustomField,
      coreSubject: record.coreSubject,
      issueOfInterest: record.isuueOfInterest,
      noDocument: record.noDocument,
      noRelatedDocument: record.noRelatedDocument,
    };

    this.props
      .updateGapAnalysisWithExtraMutation({
        variables: {
          ...keyConsideration,
        },
      })
      .then(() => {
        if (!currentValue) {
          // refetch();
        }

        if (showMessage) {
          message.success("Processing complete!");
        }
      })
      .catch((error) => message.error(error.message));
  }

  companyPerformanceCell(
    record,
    value,
    currentValue,
    showMessage,
    customField
  ) {
    const { refetch } = this.props;
    const keyConsideration = {
      id: this.props.gapAnalysisId,
      keyConsideration: record.key,
      performanceValue: value,
      customField,
      coreSubject: record.coreSubject,
      issueOfInterest: record.isuueOfInterest,
      noDocument: record.noDocument,
      noRelatedDocument: record.noRelatedDocument,
    };

    this.props
      .updateGapAnalysisMutation({
        variables: {
          ...keyConsideration,
        },
      })
      .then(() => {
        if (!currentValue) {
          // refetch();
        }

        if (showMessage) {
          message.success("Processing complete!");
        }
      })
      .catch((error) => message.error(error.message));
  }

  relevanceSignificanceCell(record, value, currentValue) {
    const { refetch } = this.props;
    const keyConsideration = {
      id: this.props.gapAnalysisId,
      keyConsideration: record.key,
      relevanceValue: value,
      coreSubject: record.coreSubject,
      issueOfInterest: record.isuueOfInterest,
      noDocument: record.noDocument,
      noRelatedDocument: record.noRelatedDocument,
    };
    message.success("Processing complete!");
    this.props
      .updateGapAnalysisMutation({
        variables: {
          ...keyConsideration,
        },
      })
      .then(() => {
        if (!currentValue) {
          refetch();
        }
      })
      .catch((error) => message.error(error.message));
  }

  render() {
    const { gapColumns } = this.state;
    const {
      issue,
      issueOfInterest,
      intl: { formatMessage },
    } = this.props;
    const keyConsiderations = get(issueOfInterest, "keyConsiderations");

    return (
      <Row type="flex" justify="space-between">
        <Col span={24}>
          <ExportImage id={issue.key}>
            {this.state.questions.length && (
              <TableWrapper
                size="small"
                columns={gapColumns}
                onChange={this.onChange}
                defaultExpandAllRows={true}
                expandedRowRender={(record, index) => {
                  const slectedValue = find(keyConsiderations, {
                    keyConsideration: record.key,
                  });
                  const note = get(slectedValue, "note");
                  const group = [
                    ...this.state.groupedByQuestion[record.groupby],
                  ].filter((item) => item !== record);
                  return (
                    <React.Fragment>
                      {note && <div>{`Note: ${note}`}</div>}
                      {record.groupby !== 0 && (
                        <TableWrapper
                          size="small"
                          columns={this.createcolumns(
                            clone(columns),
                            this.props,
                            false
                          )}
                          onChange={this.onChange}
                          dataSource={group}
                          pagination={false}
                        />
                      )}
                    </React.Fragment>
                  );
                }}
                dataSource={this.state.questions}
                pagination={false}
                title={() => (
                  <div>
                    <span style={{ color: "#888" }}> Issue of Interest: </span>
                    <span> {formatMessage(issue.localization)} </span>
                    {this.renderCoreSubjectResult(issueOfInterest)}
                  </div>
                )}
              />
            )}
          </ExportImage>
          <ExportTooltipWrapper>
            <InfoTooltip content={exportTooltip} />
          </ExportTooltipWrapper>
        </Col>
      </Row>
    );
  }
}

export default graphql(updateGapAnalysisWithExtraMutation, {
  name: "updateGapAnalysisWithExtraMutation",
})(
  graphql(updateGapAnalysisMutation, { name: "updateGapAnalysisMutation" })(
    injectIntl(IssueOfInterestList)
  )
);
