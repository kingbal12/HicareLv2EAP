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
        videoSource: undefined
      }
      this.publishEvents = {
        publishConnected: () => {
          this.setState({ connected: true });
        },
        publishDisconnected: () => {
          this.setState({ connected: false });
        }
      };
    }




 


    setAudio = (audio) => {
        this.setState({ audio });
    }

    setVideo = (video) => {
        this.setState({ video });
    }

  
    // changeVideoSource = (videoSource) => {
    //     (this.state.videoSource !== 'camera') ? this.setState({videoSource: 'camera'}) : this.setState({ videoSource: 'screen' })
    // }

    // changeVideoSource = (videoSource) => {
    //   (videoSource !== true) ? this.setState({videoSource: undefined}) : this.setState({ videoSource: 'screen' })
    // }

    onError = (err) => {
        this.setState({ error: `Failed to publish: ${err.message}` });
        alert("인터넷 상태로 인해 화면공유에 오류가 발생하였습니다\n화면공유를 다시 시도해 주십시오")
        window.location.reload()
    }

  

    render() {
      return (
        <div className="publisher">
            {this.state.error ? <div id="error">{this.state.error}</div> : null}
            {/* {this.props.togglescreenshare === false ? */}
              <OTPublisher
                properties={{
                    showControls: false,
                    publishAudio: this.props.micstate,
                    publishVideo: this.props.camerastate,
                    // videoSource: this.props.togglescreenshare === true ? 'screen' : '1de715565c9317a8505cd4ef34943cd87f98165c164b3968f738e0740caf5ea3'

                    // deviceid로 작동
                    // videoSource: this.props.togglescreenshare === true ? 'screen' : undefined
                    videoSource: undefined
                }}
                eventHandlers={this.publishEvents}
                onError={this.onError}
              />
              {/* : null
            } */}
            
            {this.props.togglescreenshare !== false ?
              <OTPublisher
                properties={{
                    showControls: false,
                    publishAudio: this.props.micstate,
                    publishVideo: this.props.camerastate,
                    // videoSource: this.props.togglescreenshare === true ? 'screen' : '1de715565c9317a8505cd4ef34943cd87f98165c164b3968f738e0740caf5ea3'

                    // deviceid로 작동
                    // videoSource: this.props.togglescreenshare === true ? 'screen' : undefined
                    videoSource: 'screen'
                }}
                eventHandlers={this.publishEvents}
                onError={this.onError}
              />
               : null
            } 
            
      </div>
      );
    }
  }
  export default Publisher;