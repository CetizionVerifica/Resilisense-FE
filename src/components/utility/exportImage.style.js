import styled from 'styled-components'


const ExportImageWrapper = styled.div`
  position: relative;
  .exportButton {
    top: 10px;
    position: absolute;
    right: 33px;
    z-index: 1;
  }
  .canvasExport{
    canvas{
      width:300px !important;
      hight: auto;
    }
  }

`

export {ExportImageWrapper}
