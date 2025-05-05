import styled from 'styled-components'

const LayoutContentWrapper = styled.div`
  padding: 20px 20px;
  display: flex;
  flex-flow: row wrap;
  overflow: hidden;


  .ant-form-item{
    margin-bottom: 5px;
    .ant-form-item-label{
        line-height: 21px;
    }
  }

  @media only screen and (max-width: 767px) {
    padding: 50px 20px;
  }

  @media (max-width: 580px) {
    padding: 15px;
  }
`

export {LayoutContentWrapper}
