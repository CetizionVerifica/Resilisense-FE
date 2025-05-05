import React, { useState, useEffect } from "react";
import { Select } from "antd";

const { Option } = Select;
export default function MultipleSelect(props) {
  const [options, setOptions] = useState([]);
  useEffect(() => {
    setOptions(props.options)

  }, [props.options])

  const {
    input: { onChange, value },
  } = props;
  function handleChange(value) {
    onChange(value);
    setOptions(props.options)
  }
  function handleSearch(value) {
    if (value !== "") {
      const result = props.options.filter((item) => item.label.toLowerCase().includes(value.toLowerCase()));
      setOptions(result);
    } else {
      setOptions(props.options);
    }
  }
  return (
    <React.Fragment>
      <div style={{ fontWeight: 700 }}>{props.label}</div>
      <Select
        {...props}
        mode="multiple"
        style={{ width: "100%" }}
        placeholder="Please select lisence"
        onChange={handleChange}
        onSearch={handleSearch}
        value={value || []}
        filterOption={false}
      >
        {options.map((item) => (
          <Option key={item.value}>{item.label}</Option>
        ))}
      </Select>
    </React.Fragment>
  );
}
