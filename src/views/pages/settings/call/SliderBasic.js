import React from "react"
import Tooltip from "rc-tooltip"
import Slider from "rc-slider"

const createSliderWithTooltip = Slider.createSliderWithTooltip
const Range = createSliderWithTooltip(Slider.Range)
const Handle = Slider.Handle

const handle = props => {
  const { value, dragging, index, ...restProps } = props
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={value}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  )
}

class SliderBasic extends React.Component {
  state = {
    value: 20
  }

  onSliderChange = value => {
    this.setState({ value })
  }

  resetSlider = () => {
    this.setState({ value: null })
  }

  render() {
    return (
          <Slider
            min={0}
            max={20}
            defaultValue={3}
            handle={handle}
            reverse={this.props.rtl === "rtl"}
            tipProps={{
              prefixCls: "rc-slider-tooltip"
            }}
          />

    )
  }
}

export default SliderBasic
