import React from 'react';
import { OTPublisher } from 'opentok-react';

// import CheckBox from './CheckBox';


class Publisher extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        error: null,
        connection: "Connecting",
        publishVideo: true,
        publishScreen: false,
        publishingScreen: false,
      }
      this.sessionEventHandlers = {
        sessionConnected: () => {
          this.setState({ connection: "Connected" });
        },
        sessionDisconnected: () => {
          this.setState({ connection: "Disconnected" });
        },
        sessionReconnected: () => {
          this.setState({ connection: "Reconnected" });
        },
        sessionReconnecting: () => {
          this.setState({ connection: "Reconnecting" });
        },
      };
  
      this.publisherEventHandlers = {
        accessDenied: () => {
          console.log("User denied access to media source");
        },
        streamCreated: () => {
          console.log("Publisher stream created");
        },
        streamDestroyed: ({ reason }) => {
          console.log(`Publisher stream destroyed because: ${reason}`);
        },
      };
  
      this.subscriberEventHandlers = {
        videoEnabled: () => {
          console.log("Subscriber video enabled");
        },
        videoDisabled: () => {
          console.log("Subscriber video disabled");
        },
      };
  
      this.publisherScreenEventHandlers = {
        accessDenied: () => {
          console.log("User denied access to media Screen source");
        },
        streamCreated: () => {
          console.log("Publisher SCreen created");
        },
        mediaStopped: () => {
          this.setState({ publishScreen: false });
        },
        streamDestroyed: ({ reason }) => {
          console.log(`Publisher Screen destroyed because: ${reason}`);
        },
      };
    }




    onSessionError = (error) => {
      this.setState({ error });
    };
  
    onPublish = () => {
      console.log("Publish Success");
      this.setState({ error: null });
    };
  
    onPublishError = (error) => {
      this.setState({ error });
    };
  
    onPublishScreen = () => {
      console.log("Publish Screen Success");
      this.setState({ error: null });
    };
  
    onPublishScreenError = (error) => {
      console.log("Publish Screen Error", error);
      this.setState({ error, publishScreen: false });
    };
  
    onSubscribe = () => {
      console.log("Subscribe Success");
    };
  
    onSubscribeError = (error) => {
      this.setState({ error });
    };
  
    toggleVideo = () => {
      this.setState((state) => ({
        publishVideo: !state.publishVideo,
      }));
    };
  
    toggleScreenshare = () => {
      this.setState((state) => ({
        publishScreen: !state.publishScreen,
      }));
    };

    render() {
      const { error, publishVideo, publishScreen } = this.state;
      
      return (
        <div className="publisher">
        <button id="videoButton" onClick={this.toggleVideo}>
          {publishVideo ? "Disable" : "Enable"} Video
        </button>
        <button id="screenButton" onClick={this.toggleScreenshare}>
          {publishScreen ? "Unpublish" : "Publish"} Screen
        </button>
            {error ? (
          <div className="error">
            <strong>Error:</strong> {JSON.stringify(error.message)}
          </div>
        ) : null}
          <OTPublisher
            properties={{videoSource: "1de715565c9317a8505cd4ef34943cd87f98165c164b3968f738e0740caf5ea3", width: 200, height: 200 }}
            onPublish={this.onPublish}
            onError={this.onPublishError}
            eventHandlers={this.publisherEventHandlers}
          />
          {publishScreen && (
            <OTPublisher
              properties={{ videoSource: "screen", width: 200, height: 200 }}
              onPublish={this.onPublishScreen}
              onError={this.onPublishScreenError}
              eventHandlers={this.publisherScreenEventHandlers}
            />
          )}
            
      </div>
      );
    }
  }
  export default Publisher;