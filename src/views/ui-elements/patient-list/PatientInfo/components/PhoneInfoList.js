import React, { Component } from "react";
import PhoneInfo from "./PhoneInfo";

class PhoneInfoList extends Component {
  static defaultProps = {
    data: [],
    onRemove: () => console.warn("onRemove not defined"),
    onUpdate: () => console.warn("onUpdate not defined"),
  };

  render() {
    const { data, onRemove, onUpdate, puteostate } = this.props;
    const list = data.map((info) => (
      <PhoneInfo
        key={info.id}
        info={info}
        onRemove={onRemove}
        onUpdate={onUpdate}
        puteostate={puteostate}
      />
    ));

    return <div>{list}</div>;
  }
}

export default PhoneInfoList;
