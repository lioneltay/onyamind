import React from "react"
import styled from "styled-components"

export const Input = styled.input`
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
  padding: 10px 18px;
`

export const Button = styled.button.attrs({})<{ color?: string }>`
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

export const IconButton = styled.button`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
  width: 48px;
  font-size: 24px;
  color: #757575;

  &:focus {
    outline: none;
  }
`
