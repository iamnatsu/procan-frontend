import React, { Component } from 'react'
import { WrappedFieldProps } from 'redux-form';
import { TextField } from '@material-ui/core';

export interface TextProps {
  label: string;
}
type MergedProps = TextProps & WrappedFieldProps;
class Text extends Component<MergedProps, any> {
  render() {
    return (
      <div style={{ marginTop: '5px' }}>
        {this.props.label && <p style={{color: 'rgba(0, 0, 0, 0.54)'}}>{this.props.label}</p> }
        <TextField {...this.props.input}></TextField>
      </div>
    )
  }
}

export default Text as React.ComponentClass<MergedProps>;