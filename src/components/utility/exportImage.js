/*global document Image */
import React, {Component} from 'react'
import html2canvas from 'html2canvas'
import domtoimage from 'dom-to-image'
import {Button, Modal} from 'antd'
import {ExportImageWrapper} from './exportImage.style'
import { message } from 'antd';

class ExportImage extends Component {
  state = {
    visible: false,
  }

  showModal = () => {
    this.setState({
      visible: true,
    })
  }
  handleOk = (e) => {
    // console.log(e)
    this.setState({
      visible: false,
    })
  }
  handleCancel = (e) => {
    // console.log(e)
    this.setState({
      visible: false,
    })
  }
  downloadCanvas = async(canvasId) => {
    // console.log(canvasId)
    //const link = document.createElement('a')
    const canvas = document.querySelector(`#${canvasId}canvas`)
    const nuroImage = new Image()
    nuroImage.src = canvas
    document.querySelector(`#${canvasId}canvas`).innerHTML = ''
    document.querySelector(`#${canvasId}canvas`).appendChild(nuroImage)
    const link = document.createElement('a')
    link.download = 'my-image-name.jpeg'
    link.href = canvas
    link.click()
    // domtoimage.toJpeg(canvas, {quality: 0.95})
    //   .then((dataUrl) => {

    //   })

    // canvas.toBlob((blob) => {
    //   link.href = URL.createObjectURL(blob)
    //   link.download = `${canvasId}.png`

    //   console.log(link)
    //   link.click()
    // }, 'image/png', 1.0)
    // //nuroImage.src = ImgConv

  }

  exportImage = async() => {
    const {id} = this.props
    //const canvas = await html2canvas(document.querySelector(`#${id}`))
    const node = document.querySelector(`#${id}`)
    message.loading('Please wait...');
    domtoimage.toPng(node)
      .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = `${id}.png`
        link.href = dataUrl
        link.click()
        setTimeout(() => {
          message.destroy();
        }, 1500);
      })
      .catch((error) => {
        console.error('oops, something went wrong!', error)
        message.destroy();
      })
    // const img = new Image()
    //     img.src = canvas
    // this.showModal()
    // canvas.setAttribute('style', 'width: 100%; hight: auto')
    // document.querySelector(`#${id}canvas`).innerHTML = ''
    // document.querySelector(`#${id}canvas`).appendChild(canvas)

  }
  render() {
    const {children, id} = this.props
    return (
      <ExportImageWrapper>
        <div className="exportButton">
          <Button type="dashed" className="" onClick={this.exportImage}>
                Export
          </Button>
        </div>
        <div id={id} >
          {children}
        </div>
        <Modal
          title="Export"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width="80%"
          footer={[
            <Button key="back" onClick={this.handleCancel}>Return</Button>,
            <Button
              key="submit"
              type="primary"
              onClick={() => this.downloadCanvas(id)}
            >
            Download
            </Button>,
          ]}
        >
          <div id={`${id}canvas`} className="canvasExport" />
        </Modal>
      </ExportImageWrapper>
    )
  }
}

export default ExportImage
