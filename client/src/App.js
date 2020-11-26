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

    var attributeLines = []

    for (var attrKey in this.state.channelJSON) {
      console.log(attrKey);

      if (attrKey !== "item") {
        var label = attrKey + ": ";

        attributeLines.push(<EditableLine key={attrKey + "_component_key"} label={label} currentEntry={this.state.channelJSON[attrKey]._text} updateFeedJSON={this.updateChannelJSON} fieldKey={attrKey} />)
      }
    }


    return (
        <div>
          {attributeLines}
          <hr/>
          <ItemList itemArray={this.state.channelJSON.item}/>
        </div>
    );
  }
}

class ItemList extends React.Component {
  // Given rss.channel.item array, renders a list of ItemAttributes
  // This is also where the capability to add a new item should live

  constructor(props) {
    super(props);

    this.state = {
      itemArray: this.props.itemArray
    }

    this.updateItemArray = this.updateItemArray.bind(this);

  }

  updateItemArray() {
    console.log('updateItemArray() not written yet!');
  }

  render() {
    var itemAttributesArray = [];
    for (var item in this.state.itemArray) {
      console.log(this.state.itemArray[item]);
      itemAttributesArray.push(<ItemAttributes itemJSON={this.state.itemArray[item]}/>);
    }


    return(
      <div>
        {itemAttributesArray}
      </div>
    )
  }

}

class ItemAttributes extends React.Component {
  // Given an Item JSON from the rss.channel.item array, renders a list of EditableLines for each attribute in the item

  constructor(props) {
    super(props);

    this.state = {
      itemJSON: this.props.itemJSON
    }

    this.updateItemJSON = this.updateItemJSON.bind(this);
  }

  updateItemJSON(newEntry, fieldKey) {
    var newItemJSON = this.state.itemJSON;

    if (fieldKey === 'enclosure.url') {
      newItemJSON.enclosure._attributes.url = newEntry;
    } else if (fieldKey === 'enclosure.length') {
      newItemJSON.enclosure._attributes.length = newEntry;
    } else if (fieldKey === 'enclosure.type') {
      newItemJSON.enclosure._attributes.type = newEntry;
    } else if (fieldKey === 'guid.isPermalink') {
      newItemJSON.guid._attributes.isPermalink = newEntry;
    } else {
      newItemJSON[fieldKey]._text = newEntry;
    }


    
    this.setState({itemJSON: newItemJSON});
  }

  render() {
    var attributeLines = [];

    for (var attrKey in this.state.itemJSON) {
      console.log(attrKey);

      if (attrKey === 'enclosure') {
        var label = attrKey + " - ";

        attributeLines.push(<EditableLine key={attrKey + "url_item_key_" + this.state.itemJSON.guid._text} label={label + 'url: '} currentEntry={this.state.itemJSON[attrKey]._attributes.url} updateFeedJSON={this.updateItemJSON} fieldKey={attrKey + '.url'} />)
        attributeLines.push(<EditableLine key={attrKey + "length_item_key_" + this.state.itemJSON.guid._text} label={label + 'length: '} currentEntry={this.state.itemJSON[attrKey]._attributes.length} updateFeedJSON={this.updateItemJSON} fieldKey={attrKey + '.length'} />)
        attributeLines.push(<EditableLine key={attrKey + "type_item_key_" + this.state.itemJSON.guid._text} label={label + 'type: '} currentEntry={this.state.itemJSON[attrKey]._attributes.type} updateFeedJSON={this.updateItemJSON} fieldKey={attrKey + '.type'} />)

      } else if (attrKey === 'guid') {

        var label = attrKey + " - ";

        attributeLines.push(<EditableLine key={attrKey + "isPermalink_item_key_" + this.state.itemJSON.guid._text} label={label + 'isPermalink: '} currentEntry={this.state.itemJSON[attrKey]._attributes.isPermalink} updateFeedJSON={this.updateItemJSON} fieldKey={attrKey + '.isPermalink'} />)
        attributeLines.push(<EditableLine key={attrKey + "text_item_key_" + this.state.itemJSON.guid._text} label={attrKey + ': '} currentEntry={this.state.itemJSON[attrKey]._text} updateFeedJSON={this.updateItemJSON} fieldKey={attrKey} />)

      } else {
        var label = attrKey + ": ";
        attributeLines.push(<EditableLine key={attrKey + "_item_key_" + this.state.itemJSON.guid._text} label={label} currentEntry={this.state.itemJSON[attrKey]._text || this.state.itemJSON[attrKey]._cdata} updateFeedJSON={this.updateItemJSON} fieldKey={attrKey} />)
      }
      
    }

    return (
      <div>
        <hr/>
        {attributeLines}
      </div>

    )


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
