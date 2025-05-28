/*global document Image */
import React, { Component } from "react";
import html2canvas from "html2canvas";
import domtoimage from "dom-to-image-more";
import { Button, Modal } from "antd";
import { ExportImageWrapper } from "./exportImage.style";
import { message } from "antd";

class ExportImage extends Component {
  state = {
    visible: false,
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = (e) => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };

  // Convert all external images to base64 data URLs to avoid CORS issues
  convertImagesToDataUrls = async (node) => {
    const images = node.querySelectorAll("img");
    const conversions = Array.from(images).map((img) => {
      return new Promise((resolve) => {
        if (
          !img.src ||
          img.src.startsWith("data:") ||
          img.src.startsWith("blob:")
        ) {
          resolve(); // Skip data URLs and blob URLs
          return;
        }

        try {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const tempImg = new Image();

          tempImg.crossOrigin = "anonymous";

          tempImg.onload = () => {
            try {
              canvas.width = tempImg.naturalWidth || tempImg.width;
              canvas.height = tempImg.naturalHeight || tempImg.height;
              ctx.drawImage(tempImg, 0, 0);

              const dataUrl = canvas.toDataURL("image/png");
              img.src = dataUrl;
              resolve();
            } catch (error) {
              console.warn(
                "Failed to convert image to data URL:",
                img.src,
                error
              );
              // Replace with transparent pixel if conversion fails
              img.src =
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
              resolve();
            }
          };

          tempImg.onerror = () => {
            console.warn("Failed to load image:", img.src);
            // Replace with transparent pixel if loading fails
            img.src =
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
            resolve();
          };

          tempImg.src = img.src;
        } catch (error) {
          console.warn("Error setting up image conversion:", error);
          img.src =
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
          resolve();
        }
      });
    });

    await Promise.all(conversions);
  };

  // Remove all external stylesheets and resources that could cause CORS issues
  sanitizeNode = (node) => {
    // Clone the node to avoid modifying the original
    const clonedNode = node.cloneNode(true);

    // Remove all external stylesheets
    const links = clonedNode.querySelectorAll('link[rel="stylesheet"]');
    links.forEach((link) => {
      if (link.href && !link.href.startsWith(window.location.origin)) {
        link.remove();
      }
    });

    // Remove all script tags
    const scripts = clonedNode.querySelectorAll("script");
    scripts.forEach((script) => script.remove());

    // Remove elements with background images that might cause issues
    const elementsWithBg = clonedNode.querySelectorAll("*");
    elementsWithBg.forEach((el) => {
      const style = window.getComputedStyle(el);
      if (
        style.backgroundImage &&
        style.backgroundImage !== "none" &&
        !style.backgroundImage.includes("data:")
      ) {
        el.style.backgroundImage = "none";
      }
    });

    return clonedNode;
  };

  // Download the generated image
  downloadImage = (dataUrl, filename) => {
    try {
      const link = document.createElement("a");
      link.download = `${filename}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      message.error("Failed to download image.");
    }
  };

  // Robust export using html2canvas (more reliable than dom-to-image for CORS issues)
  exportWithHtml2Canvas = async (node, id) => {
    try {
      const canvas = await html2canvas(node, {
        useCORS: true,
        allowTaint: false, // Set to false to avoid tainted canvas issues
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false,
        ignoreElements: (element) => {
          // Ignore problematic elements
          if (element.tagName === "SCRIPT") return true;
          if (element.tagName === "NOSCRIPT") return true;
          if (element.tagName === "IFRAME") return true;
          return false;
        },
        onclone: (clonedDoc) => {
          // Additional cleanup in cloned document
          const scripts = clonedDoc.querySelectorAll("script");
          scripts.forEach((script) => script.remove());

          const iframes = clonedDoc.querySelectorAll("iframe");
          iframes.forEach((iframe) => iframe.remove());
        },
      });

      const dataUrl = canvas.toDataURL("image/png", 1.0);
      return dataUrl;
    } catch (error) {
      throw new Error(`html2canvas failed: ${error.message}`);
    }
  };

  // Main export function - now defaults to html2canvas for better reliability
  exportImage = async () => {
    const { id } = this.props;
    const node = document.querySelector(`#${id}`);

    if (!node) {
      message.error("Element not found for export.");
      return;
    }

    const hideMessage = message.loading("Preparing export...", 0);

    try {
      // Convert external images to data URLs first
      await this.convertImagesToDataUrls(node);

      // Wait a moment for DOM updates
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Try html2canvas first (more reliable for CORS issues)
      try {
        const dataUrl = await this.exportWithHtml2Canvas(node, id);
        this.downloadImage(dataUrl, id);
        message.success("Image exported successfully!");
        return;
      } catch (html2canvasError) {
        console.warn(
          "html2canvas failed, trying dom-to-image:",
          html2canvasError
        );
      }

      // Fallback to dom-to-image with extreme filtering
      try {
        const dataUrl = await domtoimage.toPng(node, {
          useCORS: false, // Disable CORS to avoid external resource issues
          allowTaint: false,
          skipFonts: true,
          cacheBust: true,
          quality: 0.95,
          bgcolor: "#ffffff",
          filter: (domNode) => {
            // Very aggressive filtering
            if (domNode.tagName === "SCRIPT") return false;
            if (domNode.tagName === "NOSCRIPT") return false;
            if (domNode.tagName === "IFRAME") return false;
            if (domNode.tagName === "OBJECT") return false;
            if (domNode.tagName === "EMBED") return false;
            if (domNode.tagName === "LINK" && domNode.rel === "stylesheet") {
              return (
                domNode.href && domNode.href.startsWith(window.location.origin)
              );
            }
            return true;
          },
          onclone: (clonedDoc) => {
            // Remove all potentially problematic elements
            const problematicSelectors = [
              "script",
              "noscript",
              "iframe",
              "object",
              "embed",
              'link[rel="stylesheet"]:not([href^="' +
                window.location.origin +
                '"])',
            ];

            problematicSelectors.forEach((selector) => {
              const elements = clonedDoc.querySelectorAll(selector);
              elements.forEach((el) => el.remove());
            });

            // Ensure all images are data URLs
            const images = clonedDoc.querySelectorAll("img");
            images.forEach((img) => {
              if (
                !img.src ||
                (!img.src.startsWith("data:") && !img.src.startsWith("blob:"))
              ) {
                img.src =
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
              }
            });
          },
        });

        this.downloadImage(dataUrl, id);
        message.success("Image exported successfully!");
      } catch (domToImageError) {
        console.error("Both export methods failed:", domToImageError);
        message.error(
          "Failed to export image. This may be due to CORS restrictions or external resources."
        );
      }
    } catch (error) {
      console.error("Export process failed:", error);
      message.error("Export failed. Please try again.");
    } finally {
      hideMessage();
    }
  };

  downloadCanvas = async (canvasId) => {
    try {
      const canvas = document.querySelector(`#${canvasId}canvas`);
      if (!canvas) {
        message.error("Canvas not found for download.");
        return;
      }

      const nuroImage = new Image();
      nuroImage.src = canvas.src || canvas.toDataURL();

      const canvasContainer = document.querySelector(`#${canvasId}canvas`);
      canvasContainer.innerHTML = "";
      canvasContainer.appendChild(nuroImage);

      const link = document.createElement("a");
      link.download = "my-image-name.jpeg";
      link.href = nuroImage.src;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      this.handleCancel();
    } catch (error) {
      console.error("Canvas download failed:", error);
      message.error("Failed to download canvas image.");
    }
  };

  render() {
    const { children, id } = this.props;
    return (
      <ExportImageWrapper>
        <div className="exportButton">
          <Button type="dashed" className="" onClick={this.exportImage}>
            Export
          </Button>
        </div>
        <div id={id}>{children}</div>
        <Modal
          title="Export"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width="80%"
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Return
            </Button>,
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
    );
  }
}

export default ExportImage;
//somethign
