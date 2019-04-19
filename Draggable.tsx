import React from 'react';

import $ from 'jquery';

export interface IDraggablePos {
  x: number;
  y: number;
}

export interface IDraggableProps {
  initialPos: IDraggablePos;
}

export interface IDraggableState {
  pos: IDraggablePos;
  dragging: boolean;
  rel?: IDraggablePos;
}

//courtesy of https://stackoverflow.com/questions/20926551/recommended-way-of-making-react-component-div-draggable
class Draggable extends React.Component<IDraggableProps, IDraggableState> {
  constructor(props: IDraggableProps) {
    super(props);
    this.state = {
      // allow the initial position to be passed in as a prop
      // initialPos: { x: 0, y: 0 }
      pos: this.props.initialPos,
      dragging: false,
      rel: undefined
    };
  }
  componentDidUpdate() {
    if (this.state.dragging && !this.state.dragging) {
      $(document).on("mousemove", this.onMouseMove);
      $(document).on('mouseup', this.onMouseUp)
    } else if (!this.state.dragging && this.state.dragging) {
      $(document).on('mousemove', this.onMouseMove)
      $(document).on('mouseup', this.onMouseUp)
    }
  }
  onMouseUp = (e: JQueryEventObject) => {
    var pos = $(this.myRef.current!).offset()!;
    console.log("onMouseUp", pos);
    this.setState({ dragging: false });
    e.stopPropagation();
    e.preventDefault();
  }
  onMouseMove = (e: JQueryEventObject) => {
    console.log("onMouseMove");
    if (!this.state.dragging) return
    this.setState({
      pos: {
        x: e.pageX - this.state.rel!.x,
        y: e.pageY - this.state.rel!.y
      }
    })
    e.stopPropagation()
    e.preventDefault()
  }
  onMouseDown = (e: React.MouseEvent) => {
    // only left mouse button
    var pos = $(this.myRef.current!).offset()!;
    console.log("onMouseDown", pos);
    if (e.button !== 0) return
    var pos = $(this.myRef.current!).offset()!;
    this.setState({
      dragging: true,
      rel: {
        x: e.pageX - pos.left,
        y: e.pageY - pos.top
      }
    })
    e.stopPropagation()
    e.preventDefault()
  }
  myRef = React.createRef<HTMLDivElement>();
  render() {
    return <div ref={this.myRef} onMouseDown={this.onMouseDown} style={{
      position: 'absolute',
      left: this.state.pos.x + 'px',
      top: this.state.pos.y + 'px'
    }}>Hello world</div>;
  }
}


// React.renderComponent(Draggable({
//     initialPos: { x: 100, y: 200 },
//     className: 'my-draggable',
//     style: {
//         border: '2px solid #aa5',
//         padding: '10px'
//     }
// }, 'Drag Me! See how children are passed through to the div!'), document.body)

export default Draggable;
