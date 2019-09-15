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

class FeedTitle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editable: false,
      newFeedTitle: '',
    }

    this.handleEditButtonClick = this.handleEditButtonClick.bind(this);
    this.handleUpdateButtonClick = this.handleUpdateButtonClick.bind(this);
    this.handleTitleFormChange = this.handleTitleFormChange.bind(this);
  }
  
  handleEditButtonClick(event) {
    console.log("Clicked!");
    this.setState({editable: true});
  }

  handleUpdateButtonClick(event) {
    event.preventDefault();

    var newJSON = JSON.parse(JSON.stringify(this.props.feedJSON));
    newJSON.rss.channel.title._text = this.state.newFeedTitle;
    console.log(newJSON);
    this.props.updateFeedJSON(newJSON);
    this.setState({
      editable: false,
      newFeedTitle: '',
    });
  }

  handleTitleFormChange(event) {
    this.setState({newFeedTitle: event.target.value});
  }

  render() {
    try {
      let feedTitle = this.props.feedJSON.rss.channel.title._text;
      //this.setState({feedTitle: feedTitle});
      return (
        <div>
          <p>Title: </p>
          <p>{feedTitle}</p>
          {this.state.editable ? (
            <form onSubmit={this.handleUpdateButtonClick}>
              <input type="text" onChange={this.handleTitleFormChange}></input>
              <input type="submit" value="Submit" />
            </form>
          ) : (
            <button type="button" onClick={this.handleEditButtonClick}>Edit</button>
          )}
          
          
        </div>
      );

    } catch (error) {
      return (
        <div className="no-show"></div>
      );
    }
  }
}

class FeedBuilder extends React.Component {
  defaultState = {
    feedTitle: '',
    feedUrl: '',
    errorMessage: '',
    isError: false,
    feedJSON: {},
  }
  
  constructor(props) {
    super(props);
    this.state = {
      feedTitle: '',
      feedUrl: '',
      errorMessage: '',
      isError: false,
      feedJSON: {},
    }

    this.handleFeedSubmit = this.handleFeedSubmit.bind(this);
    this.handleFeedFormChange = this.handleFeedFormChange.bind(this);
    this.updateFeedJSON = this.updateFeedJSON.bind(this);
  };

  updateFeedJSON(newFeedJSON) {
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
    return (
      <div>
        <FeedUrlForm handleFeedSubmit={this.handleFeedSubmit} handleFeedFormChange={this.handleFeedFormChange}/>
      
        <FeedError isError={this.state.isError} errorMessage={this.state.errorMessage} />

        <FeedTitle feedJSON={this.state.feedJSON} updateFeedJSON={this.updateFeedJSON} />

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
