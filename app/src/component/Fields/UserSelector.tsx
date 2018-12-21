import React, { Component } from 'react'
import { WrappedFieldProps } from 'redux-form';
import { Button, Popover, Typography, TextField, withStyles, StyledComponentProps } from '@material-ui/core';
import { CSSProperties } from '@material-ui/core/styles/withStyles';

export interface UserSelectorProps {
  label: string;
}
export interface UserSelectorState {
  open: boolean;
  anchorEl: HTMLElement |  null;
}
type MergedProps = UserSelectorProps & WrappedFieldProps & StyledComponentProps;

class UserSelector extends Component<MergedProps, UserSelectorState> {
  constructor(props: MergedProps) {
    super(props);

    this.state = {
      open: false,
      anchorEl: null
    }
  }
  
  render() {
    if (!this.state) return null;
    const { classes } = this.props;
    const { open, anchorEl } = this.state;

    if (!classes) return null;
    return (
      <div style={{ marginTop: '5px' }}>
        {this.props.label && <p style={{color: 'rgba(0, 0, 0, 0.54)'}}>{this.props.label}</p> }
        <Button onClick={this.handleOpen.bind(this)}>+</Button>
        <Popover
          //className={this.props.classes ? this.props.classes.popover : ''}
          classes={{
            paper: classes.paper
          }}
          id="simple-popper"
          open={open}
          anchorEl={anchorEl}
          onClose={this.handleClose.bind(this)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Typography>The content of the Popover.</Typography>
          <TextField fullWidth={true} />
          <Button color='primary'>Test</Button>
        </Popover>
      </div>
    )
  }

  handleOpen = (event: any) => {
    this.setState(Object.assign({}, this.state, { open: true, anchorEl: event.currentTarget }));
  };

  handleClose() {
    this.setState(Object.assign({}, this.state, { open: false, anchorEl:null }));
  }

}

const styles: Record<string, CSSProperties> = {
  paper: {
    minWidth: 300,
    maxWidth: 300,
    maxHeight: 200,
    minHeight: 200,
  }
};

const connected = withStyles(styles)(UserSelector)
export default connected as React.ComponentClass<MergedProps>;