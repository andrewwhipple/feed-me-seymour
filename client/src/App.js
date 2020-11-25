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

  updateEntry(newEntry) {
    
  }  

  render() {

    return (
        <EditableLine label="Title: " currentEntry={this.props.feedJSON.rss.channel.title._text} updateEntry={this.updateEntry}/>
    );
  }
}

class FeedBuilder extends React.Component {
  defaultState = {
    feedTitle: '',
    feedLink: '',
    feedUrl: '',
    errorMessage: '',
    isError: false,
    feedJSON: {},
  }
  
  constructor(props) {
    super(props);
    this.state = {
      feedTitle: '',
      feedLink: '',
      feedUrl: '',
      errorMessage: '',
      isError: false,
      feedJSON: {},
    }

    this.handleFeedSubmit = this.handleFeedSubmit.bind(this);
    this.handleFeedFormChange = this.handleFeedFormChange.bind(this);
    this.updateFeedJSON = this.updateFeedJSON.bind(this);
  };

  updateFeedJSON(newEntry, fieldKey) {
    var newFeedJSON = JSON.parse(JSON.stringify(this.state.feedJSON));
    newFeedJSON.rss.channel[fieldKey]._text = newEntry;
    this.setState({feedJSON: newFeedJSON});
  }

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
    var title;
    var link;
    if (this.state.feedJSON && this.state.feedJSON.rss && this.state.feedJSON.rss.channel && this.state.feedJSON.rss.channel.title) {
      title = <EditableLine label="Title: " currentEntry={this.state.feedJSON.rss.channel.title._text} updateFeedJSON={this.updateFeedJSON} fieldKey='title' />
    } 

    if (this.state.feedJSON && this.state.feedJSON.rss && this.state.feedJSON.rss.channel && this.state.feedJSON.rss.channel.link) {
      link = <EditableLine label="Link: " currentEntry={this.state.feedJSON.rss.channel.link._text} updateFeedJSON={this.updateFeedJSON} fieldKey='link' />
    } 

    return (
      <div>
        <FeedUrlForm handleFeedSubmit={this.handleFeedSubmit} handleFeedFormChange={this.handleFeedFormChange}/>
      
        <FeedError isError={this.state.isError} errorMessage={this.state.errorMessage} />
        
        {title}
        {link}

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
