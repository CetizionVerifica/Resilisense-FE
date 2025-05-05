import React from 'react';
import { DatePicker, InputNumber } from 'antd';

const FormInputNumber = props => (
    <div style={{ marginTop: 6}}>
        <div>
            <p>{props.label}</p>
        </div>
        <div>
            <InputNumber {...props} />
        </div>
    </div>
);

export default FormInputNumber;
