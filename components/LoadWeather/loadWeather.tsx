import React, { Component, ReactNode } from "react"
import { View } from "react-native"

interface State {
  loading: boolean
  error: boolean
  data: Object
}
interface Props {
  url: string
  children: ReactNode
}
class LoadWeather extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      loading: true,
      error: false,
      data: {},
    }
  }
  componentDidMount() {
    fetch(this.props.url)
      .then(res => res.json())
      .then(data => {
        this.setState({
          data,
          loading: false,
        })
      })
      .catch(err => this.setState({ loading: false, error: true }))
  }
  render() {
    return (
      <View>
        {this.props.children({
          ...this.props,
          ...this.state,
        })}
      </View>
    )
  }
}

export default LoadWeather
