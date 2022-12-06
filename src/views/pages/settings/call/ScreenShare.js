import React from 'react';
import { OTPublisher } from 'opentok-react';
// import CheckBox from './CheckBox';

class Publisher extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        error: null,
        audio: true,
        video: true,
        videoSource: 'screen'
      };
    }

    setAudio = (audio) => {
        this.setState({ audio });
    }

    setVideo = (video) => {
        this.setState({ video });
    }

    onError = (err) => {
        this.setState({ error: `Failed to publish: ${err.message}` });
    }
  
    render() {
      return (
        <div className="publisher">
            {/* {this.state.error ? <div id="error">{this.state.error}</div> : null} */}
            <OTPublisher
            properties={{
                showControls: false,
                publishAudio: this.props.micstate,
                publishVideo: this.props.camerastate,
                videoSource: this.state.videoSource
            }}
            onError={this.onError}
            />
            
      </div>
      );
    }
  }
  export default Publisher;