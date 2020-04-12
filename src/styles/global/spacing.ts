import { css } from "styled-components"

function spacing() {
  const sizes = [0, 2, 4, 8, 16, 24, 32, 48, 64]

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
