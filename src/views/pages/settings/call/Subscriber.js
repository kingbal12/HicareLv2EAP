// src/components/Subscriber.js
import React from 'react';
import { OTSubscriber } from 'opentok-react';
import { Button } from 'bootstrap';
// import CheckBox from './CheckBox';

class Subscriber extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      audio: true,
      video: true,
      
    };
  }

  setAudio = (audio) => {
    this.setState({ audio });
  }

  setVideo = (video) => {
    this.setState({ video });
  }

  onError = (err) => {
    this.setState({ error: `Failed to subscribe: ${err.message}` });
  }

  
  render() {
    return (
      <div className="subscriber">
        {this.state.error ? <div id="error">{this.state.error}</div> : null}
        
      </div>
    );
  }
}
export default Subscriber;