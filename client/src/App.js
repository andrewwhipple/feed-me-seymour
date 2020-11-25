import React from 'react';
import logo from './logo.svg';
import './App.css';



class FeedUrlForm extends React.Component {
  
  render() {
    return (
      <div>
        <form onSubmit={this.props.handleFeedSubmit}>
        <label>
          Enter feed url:
          <input type="text" value={this.props.feedUrl} onChange={this.props.handleFeedFormChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      </div>
  
    );
  }
}

class FeedError extends React.Component {
  render() {
    if (this.props.isError) {
      return (
        <div>
          <p>{this.props.errorMessage}</p>
        </div>
      );
    } else {
      return(
        <div className="no-show"></div> // use no-error to hide the div
    );
    }
  }
}


class EditableLine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editable: false,
      newEntry: '',
    }

    this.handleUpdateButtonClick = this.handleUpdateButtonClick.bind(this);
    this.handleTextFormChange = this.handleTextFormChange.bind(this);
    this.handleEditButtonClick = this.handleEditButtonClick.bind(this);



  }

  handleEditButtonClick(event) {
    console.log("Clicked!");
    this.setState({editable: true});
  }

  handleUpdateButtonClick(event) {
    event.preventDefault();

    this.props.updateFeedJSON(this.state.newEntry, this.props.fieldKey);
    this.setState({
      editable: false,
      newEntry: '',
    });
  }

  handleTextFormChange(event) {
    this.setState({newEntry: event.target.value});
  }

  render() {
    if (this.props.currentEntry) {
      return (
        <div>
          <p>{this.props.label}</p>
          <p>{this.props.currentEntry}</p>
          {this.state.editable ? (
            <form onSubmit={this.handleUpdateButtonClick}>
              <input type="text" onChange={this.handleTextFormChange}></input>
              <input type="submit" value="Submit" />
            </form>
          ) : (
            <button type="button" onClick={this.handleEditButtonClick}>Edit</button>
          )}
          
          
        </div>
      );
    } else {
      return (
        <div className="no-show"></div>
      );
    }
  }

}


class ChannelAttributes extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      channelJSON: this.props.channelJSON
    }

    this.updateChannelJSON = this.updateChannelJSON.bind(this);
  }

  updateChannelJSON(newEntry, fieldKey) {
    var newChannelJSON = this.state.channelJSON;
    newChannelJSON[fieldKey]._text = newEntry;
    this.setState({channelJSON: newChannelJSON});
    
  }


  render() {
    console.log("CHannel attribute rendered!");

    return (
        <div>
          <p>Meow!</p>

          {this.state.channelJSON.title &&
            <EditableLine label="Title: " currentEntry={this.state.channelJSON.title._text} updateFeedJSON={this.updateChannelJSON} fieldKey='title' />
          }
          {this.state.channelJSON.link &&
            <EditableLine label="Link: " currentEntry={this.state.channelJSON.link._text} updateFeedJSON={this.updateChannelJSON} fieldKey='link' />
          }
        </div>
 
    );
  }
}

class FeedBuilder extends React.Component {
  defaultState = {
    feedUrl: '',
    errorMessage: '',
    isError: false,
    feedJSON: {},
  }
  
  constructor(props) {
    super(props);
    this.state = {
      feedUrl: '',
      errorMessage: '',
      isError: false,
      feedJSON: {},
    }

    this.handleFeedSubmit = this.handleFeedSubmit.bind(this);
    this.handleFeedFormChange = this.handleFeedFormChange.bind(this);
  };

 

  handleFeedSubmit(event) {
    event.preventDefault();
    
    fetch('/fetch_feed/' + encodeURIComponent(this.state.feedUrl), {
      method: 'GET',
    }).then((res) => {
      res.text().then((xmlTxt) => {
        if(res.ok) {
          let feedUrl = this.state.feedUrl;
          this.setState(this.defaultState);
          this.setState({
            errorMessage: '',
            isError: false,
            feedJSON: JSON.parse(xmlTxt),
            feedUrl: feedUrl,
          });

        } else {
          let feedUrl = this.state.feedUrl;
          this.setState(this.defaultState);
          this.setState({
            errorMessage: xmlTxt,
            isError: true,
            feedUrl: feedUrl,
          });
        }
      })
    }).catch(() => console.error('Error in fetching the RSS feed')) 
  } 
  
  handleFeedFormChange(event) {
    this.setState({feedUrl: event.target.value});
  }

  render() {

    return (
      <div>
        <FeedUrlForm handleFeedSubmit={this.handleFeedSubmit} handleFeedFormChange={this.handleFeedFormChange}/>
      
        <FeedError isError={this.state.isError} errorMessage={this.state.errorMessage} />
        
        {this.state.feedJSON.rss && this.state.feedJSON.rss.channel &&
          <ChannelAttributes channelJSON={this.state.feedJSON.rss.channel}/>
        }
        

      </div> 
    );
  }
}


function App() {
  
  
  return (
    <FeedBuilder />
   
  );
}

export default App;
