/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/emin93/react-native-template-typescript
 *
 * @format
 */

import React, { Component } from "react"

import { ActivityIndicator } from "react-native"

import Geolocation from "@react-native-community/geolocation"

import HourlyWeather from "./containers/HourlyWeather/hourlyWeather"

interface Props {}

interface State {
  latitude: number | null
  longitude: number | null
  error: string | null
}

export default class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      latitude: null,
      longitude: null,
      error: null
    }
  }

  componentDidMount() {
    Geolocation.getCurrentPosition(
      position => {
        console.log({ position })
        this.setState({
          latitude: -29.8243, // position.coords.latitude,
          longitude: 30.9049, // position.coords.longitude,
          error: null
        })
      },
      error => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    )
  }

  render() {
    const { latitude, longitude } = this.state
    if (latitude && longitude) {
      return (
        <HourlyWeather
          latitude={this.state.latitude}
          longitude={this.state.longitude}
        />
      )
    } else {
      return <ActivityIndicator color="#fff" />
    }
  }
}
