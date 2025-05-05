import styled from 'styled-components'


const IssueLevelTable = styled.div`
position: relative;
  .ant-row{
    color: #fff;
    .ant-col-xs-4, .ant-col-sm-4, .ant-col-md-4{
      text-align: center;
      font-size: 12px;
      border: 2px solid #fff;
    }

  }
  .labelCol{
    color: #888;
  }
  .performanceLabel{
    position: absolute;
    transform: rotate(270deg);
    left: -30px;
    top: 50px;
    font-size: 12px;
    background: #fff;
    z-index: 5;
    text-align: center;
  }
  .relevanceLabel{
    text-align: center;
    font-size: 12px;
    margin-left: 50px;
  }
  .slectedBox{
    border: 2px solid #222222 !important;
  }

`

export default IssueLevelTable

