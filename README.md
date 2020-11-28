# feed-me-seymour

At the point where it has:
- A field for submitting a URL with a submit button
- The server can fetch the XML file and return it (or an error) to the client as JSON
- The client can display errors it gets from the server
- The client can support creating a new blank feed form to fill out
- Given a feed json from the server, the client can parse the JSON and display:
- - All the top-level category attributes (channelAttributes component), each as an editableLine
- - All the items in the feed, each with its own list of editableLines for its attributes
- the form is composed of editableLine components that allow:
- - displaying the current value of the line
- - toggling into an edit mode with a free-text field for arbitrary text entry
- - saving that text entry to the global state for that line
- Ability to add a new item to an existing feed
- Ability to send JSON-encoded feed data to the server and have the server return an encoded xml file
- Ability to download the returned XML as a file



