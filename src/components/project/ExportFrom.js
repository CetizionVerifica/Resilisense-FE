import React, {Component} from 'react'
import {Table, Card, Row, Col} from 'antd'
const dataSource = [{
  key: '1',
  name: 'Mike',
  age: 32,
  address: '10 Downing Street',
}, {
  key: '2',
  name: 'John',
  age: 42,
  address: '10 Downing Street',
}]

const columns = [{
  title: 'Name',
  dataIndex: 'name',
  key: 'name',
}, {
  title: 'Age',
  dataIndex: 'age',
  key: 'age',
}, {
  title: 'Address',
  dataIndex: 'address',
  key: 'address',
}]

class ExportFrom extends Component {

  render() {
    return (
      <div className="scroll-full">
        
      </div>
    )
  }
}


export default ExportFrom
