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
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ActivityIndicator,
  PanResponder
} from "react-native"

import { LineChart } from "react-native-chart-kit"

import dayjs from "dayjs"

import utc from "dayjs/plugin/utc"

dayjs.extend(utc)

import LoadWeather from "../../components/LoadWeather/loadWeather"

interface HourlyData {
  temperature: number
  time: number // TODO: unix time
  timeReadable: string
  summary: string
  icon: string
}

interface WeatherData {
  temperature: number
  apparentTemperature: number
  summary: string
  icon: string
  humidity: number
  sunriseTime: number
  sunsetTime: number
  temperatureLow: number // TODO: unix time
  temperatureHigh: number // TODO: unix time
  hourlyForecast: Array<HourlyData>
}

interface Props {
  latitude: number | null
  longitude: number | null
}

interface State {
  currentIndex: number
  latitude: number | null
  longitude: number | null
  error: string | null
  pressed: boolean
}

export default class HourlyWeather extends Component<Props, State> {
  _currentIncrements = 0
  _currentDecrements = 0

  constructor(props: Props) {
    super(props)

    this.state = {
      currentIndex: 0,
      latitude: props.latitude,
      longitude: props.longitude,
      error: null,
      pressed: false
    }
  }

  _handleStartShouldSetPanResponder = () => true

  _handleMoveShouldSetPanResponder = () => true

  _handlePanResponderGrant = () => {
    this.setState({
      pressed: true
    })
  }

  _handlePanResponderMove = (event: Object, gestureState: { dx: number }) => {
    const isNotMaxIndex = this.state.currentIndex < 7
    const isNotMinIndex = this.state.currentIndex > 0
    const { width } = Dimensions.get("screen")
    const dragWidth = width / 10
    const { dx } = gestureState

    if (dx - this._currentIncrements * dragWidth > dragWidth && isNotMaxIndex) {
      this.setState({ currentIndex: this.state.currentIndex + 1 })
      this._currentIncrements++
    } else if (
      dx + this._currentDecrements * dragWidth < -dragWidth &&
      isNotMinIndex
    ) {
      this.setState({ currentIndex: this.state.currentIndex - 1 })
      this._currentDecrements++
    }
  }

  _handlePanResponderEnd = () => {
    this.setState({
      pressed: false
    })
    this._currentIncrements = 0
    this._currentDecrements = 0
  }

  _panResponder = PanResponder.create({
    onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
    onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
    onPanResponderGrant: this._handlePanResponderGrant,
    onPanResponderMove: this._handlePanResponderMove,
    onPanResponderRelease: this._handlePanResponderEnd,
    onPanResponderTerminate: this._handlePanResponderEnd
  })

  render() {
    const { latitude, longitude } = this.state
    return (
      <View style={styles.container} {...this._panResponder.panHandlers}>
        <Text style={styles.welcome}>Dark Sky</Text>
        {latitude && longitude ? (
          <LoadWeather
            url={`http://localhost:3000/api/hourly?coordinates=${latitude},${longitude}`}
          >
            {({
              loading,
              error,
              data
            }: {
              loading: boolean
              error: boolean
              data: WeatherData
            }) => {
              if (loading)
                return (
                  <View>
                    <ActivityIndicator color="#fff" />
                  </View>
                )
              if (error) return <Text style={styles.info}>Error</Text>

              if (data) {
                const { hourlyForecast } = data
                const { currentIndex } = this.state
                const {
                  icon,
                  temperature,
                  timeReadable,
                  summary
                } = hourlyForecast[currentIndex]

                return (
                  <View>
                    <View style={styles.imageContainer}>
                      <Image
                        style={styles.image}
                        source={{
                          uri: `https://darksky.net/images/weather-icons/${icon}.png`
                        }}
                      />
                    </View>
                    <Text style={styles.info}>{temperature}° C</Text>
                    <Text style={styles.info}>{timeReadable}</Text>
                    <Text style={styles.info}>{summary}</Text>
                    <View>
                      <LineChart
                        data={{
                          labels: hourlyForecast.map(h =>
                            dayjs.unix(h.time).format("H")
                          ),
                          datasets: [
                            {
                              data: hourlyForecast.map(h =>
                                Math.round(h.temperature)
                              )
                            }
                          ]
                        }}
                        width={Dimensions.get("window").width}
                        height={200}
                        withDots={false}
                        withShadow={false}
                        withInnerLines={false}
                        withOuterLines={false}
                        // withHorizontalLabels={false}
                        yAxisSuffix={"°"}
                        chartConfig={{
                          backgroundColor: "transparent",
                          decimalPlaces: 0,
                          color: (opacity = 1) =>
                            `rgba(255, 255, 255, ${opacity})`,
                          labelColor: (opacity = 1) =>
                            `rgba(255, 255, 255, ${opacity})`
                        }}
                        bezier
                      />
                    </View>
                  </View>
                )
              }
              return null
            }}
          </LoadWeather>
        ) : null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000"
  },
  welcome: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  info: {
    color: "white",
    fontSize: 18,
    margin: 5,
    textAlign: "center"
  },
  row: {
    flexDirection: "row",
    justifyContent: "center"
  },
  spacedRow: {
    justifyContent: "space-around"
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  image: {
    width: 40,
    height: 40
  },
  icon: {
    paddingRight: 2,
    justifyContent: "center",
    alignItems: "center"
  }
})
