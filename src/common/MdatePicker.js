import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment'

const MDatePicker = props => {
    return (
        <div>
            <div style={{position: 'relative', bottom:0}}>
                <div>
                    <p>{props.label}</p>
                </div>
                <div>
                    <DatePicker
                        value={props.input.value ? moment(props.input.value) : null}
                        onChange={props.input.onChange}
                    />
                </div>
            </div>
        </div>
    )
};

export default MDatePicker;
