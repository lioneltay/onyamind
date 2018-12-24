import React from "react"
import styled from "styled-components"

export const Input = styled.input`
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
  padding: 10px 18px;
`

export const Button = styled.button<{ color?: string }>`
  border-radius: 5px;
  color: ${({ color }) => color || "#35aac2"};
  border: 1px solid ${({ color }) => color || "#35aac2"};
  padding: 10px 18px;

  cursor: pointer;
  transition: background 200ms;

  &:focus {
    outline: none;
  }

  &:hover {
    background: #f8f8f8;
  }
`

const Label = styled.label`
  cursor: pointer;
  padding: 10px;
  display: block;
`

type CheckboxProps = Stylable & {
  checked: boolean
  onChange: (checked: boolean) => void
}

type CheckboxState = {}

export class Checkbox extends React.Component<CheckboxProps, CheckboxState> {
  render() {
    return (
      <Label style={this.props.style} className={this.props.className}>
        <input
          style={{ display: "none" }}
          type="radio"
          checked={this.props.checked}
          onClick={() => this.props.onChange(!this.props.checked)}
        />

        <i
          className="far fa-check-circle"
          style={{
            fontSize: this.props.checked ? 20 : 0,
            color: "lightgreen",
            opacity: this.props.checked ? 1 : 0,
            transition: "opacity 500ms",
          }}
        />

        <i
          className="far fa-circle"
          style={{
            fontSize: this.props.checked ? 0 : 20,
            color: "black",
            opacity: this.props.checked ? 0 : 1,
            transition: "opacity 500ms",
          }}
        />
      </Label>
    )
  }
}
