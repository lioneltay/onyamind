import { css } from "styled-components"

export default css`
  .f-wrap {
    display: flex;
    flex-wrap: wrap;
  }

  .flex {
    display: flex;
  }

  .fd-c {
    display: flex;
    flex-direction: column;
  }

  .fj-s {
    display: flex;
    justify-content: flex-start;
  }

  .fj-e {
    display: flex;
    justify-content: flex-end;
  }

  .fj-c {
    display: flex;
    justify-content: center;
  }

  .fj-sb {
    display: flex;
    justify-content: space-between;
  }

  .fj-sa {
    display: flex;
    justify-content: space-around;
  }

  .fa-s {
    display: flex;
    align-items: flex-start;
  }

  .fa-st {
    display: flex;
    align-items: stretch;
  }

  .fa-c {
    display: flex;
    align-items: center;
  }

  .fa-e {
    display: flex;
    align-items: flex-end;
  }

  .fas-s {
    align-self: flex-start;
  }

  .fas-st {
    align-self: stretch;
  }

  .fas-c {
    align-self: center;
  }

  .fas-e {
    align-self: flex-end;
  }

  .fg-1 {
    display: flex;
    flex-grow: 1;
  }
`
