import { css } from "styled-components"

const UNIT = 8
const HALF = UNIT / 2

function spacing() {
  // const sizes = [0, 2, 4, 8, 16, 24, 32, 48, 64]
  const sizes = Array(6)
    .fill(null)
    .map((v, index) => index * UNIT)

  return sizes
    .map((size, index) => {
      const num = index

      return `
        .m-${num} {
          margin: ${size}px;
        }

        .mb-${num} {
          margin-bottom: ${size}px;
        }

        .mt-${num} {
          margin-top: ${size}px;
        }

        .mt-${num} {
          margin-top: ${size}px;
        }

        .ml-${num} {
          margin-left: ${size}px;
        }

        .mr-${num} {
          margin-right: ${size}px;
        }

        .mx-${num} {
          margin-left: ${size}px;
          margin-right: ${size}px;
        }

        .my-${num} {
          margin-top: ${size}px;
          margin-bottom: ${size}px;
        }

        .m-${num}h {
          margin: ${size + HALF}px;
        }

        .mb-${num}h {
          margin-bottom: ${size + HALF}px;
        }

        .mt-${num}h {
          margin-top: ${size + HALF}px;
        }

        .mt-${num}h {
          margin-top: ${size + HALF}px;
        }

        .ml-${num}h {
          margin-left: ${size + HALF}px;
        }

        .mr-${num}h {
          margin-right: ${size + HALF}px;
        }

        .mx-${num}h {
          margin-left: ${size + HALF}px;
          margin-right: ${size + HALF}px;
        }

        .my-${num}h {
          margin-top: ${size + HALF}px;
          margin-bottom: ${size + HALF}px;
        }

        .p-${num} {
          padding: ${size}px;
        }

        .pb-${num} {
          padding-bottom: ${size}px;
        }

        .pt-${num} {
          padding-top: ${size}px;
        }

        .pl-${num} {
          padding-left: ${size}px;
        }

        .pr-${num} {
          padding-right: ${size}px;
        }

        .px-${num} {
          padding-left: ${size}px;
          padding-right: ${size}px;
        }

        .py-${num} {
          padding-top: ${size}px;
          padding-bottom: ${size}px;
        }

        .p-${num}h {
          padding: ${size + HALF}px;
        }

        .pb-${num}h {
          padding-bottom: ${size + HALF}px;
        }

        .pt-${num}h {
          padding-top: ${size + HALF}px;
        }

        .pl-${num}h {
          padding-left: ${size + HALF}px;
        }

        .pr-${num}h {
          padding-right: ${size + HALF}px;
        }

        .px-${num}h {
          padding-left: ${size + HALF}px;
          padding-right: ${size + HALF}px;
        }

        .py-${num}h {
          padding-top: ${size + HALF}px;
          padding-bottom: ${size + HALF}px;
        }
      `
    })
    .join("\n")
}

export default css`
  .m-a {
    margin: auto;
  }

  ${spacing()}
`
