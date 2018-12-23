import React from "react"

import { fetch, Result } from "lib/data-fetcher"
import { withContext } from "lib/react-context-hoc"

import { Button } from "components"
import { TextInput } from "components/forms"

import { createStateContainer, ExtractContextType } from "lib/state-container"

// Mock API Calls
async function getProducts(): Promise<Product[]> {
  return [{ id: 1, name: "PC" }]
}

let id = 10
async function createProduct(data: Omit<Product, "id">): Promise<Product> {
  return new Promise(res => setTimeout(res, 1000)).then(() => {
    id += 1
    return {
      id,
      ...data,
    }
  })
}

// State Container Definition
interface Product {
  id: number
  name: string
}

type StateType = {
  products: Product[]
  allow_editing: boolean
}

const StateContainer = createStateContainer({
  initial_state: {} as StateType,

  actions: updateState => ({
    toggleEditing: () =>
      updateState(state => ({ allow_editing: !state.allow_editing })),

    removeProduct: (product_id: number) =>
      updateState(state => ({
        products: state.products.filter(product => product.id !== product_id),
      })),

    addProduct: ({ name }: Omit<Product, "id">) => {
      updateState({ allow_editing: false })

      return createProduct({ name }).then(product => {
        updateState(state => ({
          allow_editing: true,
          products: [...state.products, product],
        }))
        return product
      })
    },
  }),
})

type Props = {
  context: ExtractContextType<typeof StateContainer.Context>
}

// Usage a component of the 'subapp'
type State = {
  name_text: string
}

class StateContainerDemo extends React.Component<Props, State> {
  state: State = {
    name_text: "",
  }

  render() {
    return (
      <div>
        <div>State Container Demo</div>

        <TextInput
          value={this.state.name_text}
          onChange={(e, name_text) => this.setState({ name_text })}
        />

        <Button
          className="mt-2"
          disabled={
            !this.props.context.state.allow_editing ||
            this.state.name_text === ""
          }
          onClick={() =>
            this.props.context.actions
              .addProduct({ name: this.state.name_text })
              .then(() => this.setState({ name_text: "" }))
          }
        >
          Add Item
        </Button>

        <Button
          className="mt-2"
          onClick={() => this.props.context.actions.toggleEditing()}
        >
          Toggle
        </Button>

        <Button
          className="mt-2"
          onClick={() =>
            this.props.context.actions.updateState(() => ({ products: [] }))
          }
        >
          Clear All
        </Button>

        {this.props.context.state.products.map(product => (
          <div key={product.id}>
            <div>{product.name}</div>
            <Button
              onClick={() =>
                this.props.context.actions.removeProduct(product.id)
              }
            >
              <i className="fas fa-times" />
            </Button>
          </div>
        ))}

        <pre>{JSON.stringify(this.props.context, null, 2)}</pre>
      </div>
    )
  }
}

const StateContainerDemoWithContext = withContext(
  StateContainer.Context,
  "context"
)(StateContainerDemo)

interface TopLevelProps {
  product_data: Result<Product[]>
}

// Top level component of 'subapp'
class TopLevel extends React.Component<TopLevelProps> {
  render() {
    if (!this.props.product_data.data) {
      return <div>Loading...</div>
    }

    return (
      <StateContainer.Provider
        initial_state={{
          products: this.props.product_data.data,
          allow_editing: false,
        }}
      >
        <StateContainerDemoWithContext />
      </StateContainer.Provider>
    )
  }
}

export default fetch({ fetcher: getProducts, params: {}, key: "product_data" })(
  TopLevel
)
