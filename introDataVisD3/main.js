var NavItem = React.createClass({
  click: function (e){
    this.props.controller.setCurrentIndex(this.props.item.index);
  },
  render: function (){

    var item = this.props.item;
    var type = item.type || "block";
    var navClass = "nav-item" + (this.props.active ? " active" : "");

    if(type === "block"){
      var thumbnailUrl = "http://bl.ocks.org/curran/raw/" + item.id + "/thumbnail.png";

      return (
        <div className={navClass} onClick={this.click} >
          <span className="title">{item.title}</span>
          <img className="thumbnail" src={thumbnailUrl}/>
        </div>
      );
    } else {
      return (
        <div className={navClass} onClick={this.click} >
          {item.title}
        </div>
      );
    }
  }
});

var NavList = React.createClass({
  render: function (){
    return (
      <div className="nav">
        {this.props.items.map((item) => {
          return <NavItem item={item}
                          key={item.index}
                          active={item.index === this.props.currentIndex}
                          controller={this.props.controller}/>
        })} 
      </div>
    );
  }
});

var ContentPane = React.createClass({
  render: function (){
    var blockbuilderUrl = "http://blockbuilder.org/curran/" + this.props.item.id;
    return <iframe className="content" src={blockbuilderUrl} />;
  }
});

var App = React.createClass({
  getInitialState() {
    return {
      items: [],
      item: {},
      currentIndex: 0
    };
  },
  render() {
    return (
      <div className="app">
        <NavList items={this.state.items} 
                 currentIndex={this.state.currentIndex}
                 controller={this.props.controller}/>
        <ContentPane item={this.state.item} />
      </div>
    );
  }
});

var mountNode = document.getElementById("app-container");
var controller = {};
var app = ReactDOM.render(<App controller={controller}/>, mountNode);

controller.setItems = (items) => {
  app.setState(() => {
    return { items: items };
  });
  controller.setCurrentIndex(0);
}

controller.setCurrentIndex = (currentIndex) => {
  app.setState((previousState) => {
    return {
      currentIndex: currentIndex,
      item: previousState.items[currentIndex]
    };
  });
}

// Increment (offset == 1) or decrement (offset == -1) the current index.
controller.incrementCurrentIndex = (offset) => {
  app.setState((previousState) => {
    var currentIndex = previousState.currentIndex + offset;

    // Guard against going out of bounds.
    var n = previousState.items.length;
    currentIndex = (currentIndex < 0) ? 0 : currentIndex;
    currentIndex = (currentIndex >= n) ? (n - 1) : currentIndex;

    return {
      currentIndex: currentIndex,
      item: previousState.items[currentIndex]
    };
  });
}

// Load the file that configures the items and their order.
d3.json("items.json", (err, items) => {

  // Assign an index to each item.
  items.forEach((item, i) => item.index = i);
 
  // Set the state from the loaded data.
  controller.setItems(items);
});

// Set up navigation with arrow keys.
window.addEventListener("keydown", function (e){
  var offsets = {

    // Decrement slide on UP (38) and LEFT (37)
    37: -1,
    38: -1,

    // Increment slide on DOWN (40) and RIGHT (39);
    39: 1,
    40: 1
  };
  controller.incrementCurrentIndex(offsets[e.keyCode]);
});
