import React, {Component} from 'react'
import {Row, Col, Select, Cascader, Divider, Radio, Slider} from 'antd'
import {values, filter} from 'lodash'
import styled from 'styled-components'
import {injectIntl} from 'react-intl'
import {coreSubjectNames} from '../../../common/coreSubjectNames'
import {coreSubjectIssuesOfInt} from '../../../common/issueOfInterest'
import {generateYears} from '../../../common/utils'
import {countries, impact, regions} from '../../../common/enum'
import {companySectorTypes} from '../../../common/enum/companySectors'

const Option = Select.Option
const yearsList = generateYears()

const PercentageWrapper = styled.div`
  margin-top: 10px;

  .ant-slider-rail{
    background-color: red !important;    
  }

  .ant-slider-track{
    background-color: green !important;
  }
`

class RankingFilters extends Component {
  constructor(props) {
    super(props)
    this.state = {
      minPercent: 0,
      maxPercent: 100,
      radioGroupValue: 1,
      countries: countries,
    }
  }

  changeRange = (value, radioGroupValue) => {
    const {
      handleOverallPercent,
      handleCoreSubjectPercent,
      handleIssueOfInterestPercent,
    } = this.props

    switch (radioGroupValue) {
      case 1:
        handleOverallPercent(value)
        break
      case 2:
        handleCoreSubjectPercent(value)
        break
      case 3:
        handleIssueOfInterestPercent(value)
        break
      default:
        break
    }
  }

  handleRangeChange = value => {
    this.changeRange(value, this.state.radioGroupValue)
    this.setState({minPercent: value[0], maxPercent: value[1]})
  }

  onChange = e => {
    const {minPercent, maxPercent} = this.state
    this.setState({
      radioGroupValue: e.target.value,
    })
    this.changeRange([minPercent, maxPercent], e.target.value)
  }

  onCoreSubjectChange = value => {
    this.props.handleCoreSubject(value)
    const {minPercent, maxPercent} = this.state
    this.setState({radioGroupValue: 2})
    this.changeRange([minPercent, maxPercent], 2)
  }

  onIssueOfInterestChange = value => {
    this.props.handleIssueOfInterest(value)
    const {minPercent, maxPercent} = this.state
    this.setState({radioGroupValue: 3})
    this.changeRange([minPercent, maxPercent], 3)
  }

  onRegionChange = value => {
    this.props.handleRegionChange(value)

    const filteredCountries = value ? filter(countries, c => c.region === value) : countries
    this.setState({countries: filteredCountries})
  }

  renderLimitBar = () => {
    const {minPercent, maxPercent} = this.state

    return (
      <PercentageWrapper>
        <Slider defaultValue={[minPercent, maxPercent]} range onChange={this.handleRangeChange} />
        <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-evenly'}}>
          <span>{minPercent}% (lower limit) - {maxPercent}% (upper limit)</span>
          <div style={{width: 20, height: 10, backgroundColor: 'red'}} />
          <span>Non Conforming</span>
          <div style={{width: 20, height: 10, backgroundColor: 'green'}} />
          <span>Conforming</span>
        </div>
      </PercentageWrapper>
    )
  }

  render() {
    const {
      handleCountryChange,
      handleYearChange,
      handleIndustryChange,
      handleImpact,
    } = this.props

    const {radioGroupValue} = this.state

    const limitBar = this.renderLimitBar()

    return (

      <div>
        <h3>Aggregation criteria</h3>
        <Row gutter={10}>
          <Col lg={8} md={12} sm={24} xs={24}>
            <label style={{marginTop: 10}}>Year</label>
            <Select style={{width: '100%'}} allowClear onChange={handleYearChange}>
              {yearsList.map(year =>
                (<Option
                  key={year.value}
                  value={year.value}
                >
                  {year.value}
                </Option>))}
            </Select>
          </Col>
          <Col lg={8} md={12} sm={24} xs={24}>
            <label style={{marginTop: 10}}>Region</label>
            <Select style={{width: '100%'}} allowClear onChange={this.onRegionChange}>
              {values(regions).map(region =>
                (<Option
                  key={region.value}
                  value={region.value}
                >
                  {region.label}
                </Option>))}
            </Select>
          </Col>
        </Row>
        <Row gutter={10} style={{marginTop: 10}}>
          <Col lg={8} md={12} sm={24} xs={24}>
            <label style={{marginTop: 10}}>Country</label>
            <Select style={{width: '100%'}} allowClear onChange={handleCountryChange}>
              {values(this.state.countries).map(country =>
                (<Option
                  key={country.value}
                  value={country.value}
                >
                  {country.label}
                </Option>))}
            </Select>
          </Col>
          <Col lg={8} md={12} sm={24} xs={24}>
            <label style={{marginTop: 10}}>Sector and Industry</label>
            <Cascader
              options={companySectorTypes}
              style={{width: '100%'}}
              onChange={handleIndustryChange}
              placeholder="Please select"
            />
          </Col>
        </Row>
        <Row gutter={10} style={{marginTop: 10, marginBottom: 20}}>
          <Col lg={8} md={12} sm={24} xs={24}>
            <label style={{marginTop: 10}}>Impact</label>
            <Select style={{width: '100%'}} allowClear onChange={handleImpact}>
              {values(impact).map(criterion =>
                (<Option
                  key={criterion.value}
                  value={criterion.value}
                >
                  {criterion.label}
                </Option>))}
            </Select>
          </Col>
        </Row>
        <h3>Screening criteria</h3>
        <h4>Select the level at which Company Performance should be considered for screening your suppliers</h4>
        <Radio.Group name="radiogroup" style={{width: '100%'}} onChange={this.onChange} value={this.state.radioGroupValue}>
          <Row gutter={10} style={{marginTop: 10}}>
            <Col lg={8} md={12} sm={24} xs={24}>
              <Radio value={1}>Overall level</Radio>
              {radioGroupValue === 1 && limitBar}
            </Col>
            <Col lg={8} md={12} sm={24} xs={24}>
              <Radio value={2}>Core Subject level</Radio>
              <Select style={{width: '100%', marginTop: 10}} allowClear onChange={this.onCoreSubjectChange}>
                {values(coreSubjectNames).map(coreSubject =>
                  (<Option
                    key={coreSubject.value}
                    value={coreSubject.value}
                  >
                    {coreSubject.label}
                  </Option>))}
              </Select>
              {radioGroupValue === 2 && limitBar}
            </Col>
            <Col lg={8} md={12} sm={24} xs={24}>
              <Radio value={3}>Issue of interest level</Radio>
              <Cascader
                options={coreSubjectIssuesOfInt}
                style={{width: '100%', marginTop: 10}}
                onChange={this.onIssueOfInterestChange}
                placeholder="Please select"
              />
              {radioGroupValue === 3 && limitBar}
            </Col>
          </Row>
        </Radio.Group>
        <Divider />
      </div>
    )
  }
}

export default (injectIntl(RankingFilters))
