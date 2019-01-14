import React, { Component } from 'react'

export interface LabelProps {
  caption: string;
}
class Label extends Component<LabelProps, any> {
  render() {
    if (!this.props.caption) return null;
    return <p style={{color: 'rgba(0, 0, 0, 0.65)'}}>{this.props.caption}</p>
  }
}
export default Label as React.ComponentClass<LabelProps>;