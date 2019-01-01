import React from "react"
import styled from "styled-components"

const OuterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-auto-rows: 100px;

  border: 1px solid green;
`

const Number = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 30px;
  font-weight: 500;
  border: 1px solid red;
`

const Display = styled.div`
  grid-column: span 2;

  display: flex;
  justify-content: start;
  align-items: center;

  font-size: 30px;
  font-weight: 500;
  border: 1px solid red;
`

type State = {
  display: string
  negative: boolean
  question: Question
}

export default class ArithmeticApp extends React.Component<{}, State> {
  state: State = {
    display: "",
    negative: false,
    question: generateRandomQuestion(),
  }

  handleInput = (value: string) => () =>
    this.setState(state => {
      const new_display = state.display.concat(value)
      return new_display.length <= 6 ? { display: new_display } : null
    })

  checkAnswer = () => {
    console.log(this.state.display)
    const answer = getQuestionAnswer(this.state.question)

    if (parseInt(this.state.display) === answer) {
      this.setState({
        display: "",
        negative: false,
        question: generateRandomQuestion(),
      })
    }
  }

  render() {
    return (
      <div>
        <OuterContainer>
          <Question question={this.state.question}>54 x 23</Question>

          <Container>
            <Display>
              {this.state.negative && "-"}
              {this.state.display}
            </Display>
            <Number
              onClick={() => {
                this.setState(state => ({
                  display: state.display.slice(0, state.display.length - 1),
                }))
              }}
            >
              <i className="fas fa-backspace" />
            </Number>

            <Number onClick={this.handleInput("7")}>7</Number>
            <Number onClick={this.handleInput("8")}>8</Number>
            <Number onClick={this.handleInput("9")}>9</Number>

            <Number onClick={this.handleInput("4")}>4</Number>
            <Number onClick={this.handleInput("5")}>5</Number>
            <Number onClick={this.handleInput("6")}>6</Number>

            <Number onClick={this.handleInput("1")}>1</Number>
            <Number onClick={this.handleInput("2")}>2</Number>
            <Number onClick={this.handleInput("3")}>3</Number>

            <Number
              onClick={() =>
                this.setState(state => ({ negative: !state.negative }))
              }
            >
              {this.state.negative ? "+" : "-"}
            </Number>
            <Number onClick={this.handleInput("0")}>0</Number>
            <Number onClick={this.checkAnswer}>=</Number>
          </Container>
        </OuterContainer>
      </div>
    )
  }
}

type Question = {
  values: number[]
  operators: string[]
}

function randomInt(lower: number, upper: number) {
  return Math.floor(Math.random() * (upper - lower) + lower)
}

function generateRandomQuestion(): Question {
  return {
    values: [randomInt(10, 100), randomInt(10, 100)],
    operators: ["*"],
  }
}

function getQuestionAnswer(question: Question): number {
  return question.values[0] * question.values[1]
}

const QuestionContainer = styled.div`
  font-size: 30px;
  font-weight: 500;
  border: 1px solid red;
`

type QuestionProps = {
  question: Question
}

const Question: React.SFC<QuestionProps> = ({ question }) => (
  <QuestionContainer>
    {question.values[0]} x {question.values[1]}
  </QuestionContainer>
)
