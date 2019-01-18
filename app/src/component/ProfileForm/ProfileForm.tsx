import * as React from 'react';
import { connect } from 'react-redux';
import {  reduxForm, InjectedFormProps, Field } from 'redux-form';
import { AppState } from 'src/redux/index';
import { FormName } from '../../config/FormName';
import { User } from '../../model/user';
import { ProfileState } from 'src/redux/Profile/ProfileReducer';
import Text from '../Fields/Text';
import { Button } from '@material-ui/core';
import { withNamespaces, TransProps } from 'react-i18next';

export interface OwnProps extends React.Props<InjectedFormProps> {
  style?: React.CSSProperties;
  onClose?: () => void;
  onSubmit?: any;
}
export interface ProfileFormState {
}

type ProfileFormProps = OwnProps & InjectedFormProps<User, OwnProps, ProfileFormState>
  & DispatchProps & StateProps & TransProps;

class ProfileForm extends React.Component<ProfileFormProps, ProfileFormState> {
  render(): JSX.Element { 
    const { t } = this.props;
    const style = Object.assign({}, this.props.style, { padding: '10px' })
    return (
      <form className='project' style={style} onSubmit={this.props.handleSubmit}>
        <Field component={Text} name='name' label={t('username')} autoFocus={true} fullWidth={true}></Field>
        <Field component={Text} name='password' label={t('password')} fullWidth={true} type="password"></Field>
        <Field component={Text} name='passwordc' label={t('passwordc')} fullWidth={true} type="password"></Field>
        <footer style={{ marginTop: '10px', textAlign: 'center' }}>
          <Button type='submit' variant='contained' color='primary' style={{ width: '100px', textAlign: 'center' }}>SAVE</Button>
        </footer>
      </form>
    );
  } 
}

interface StateProps {
  profile: ProfileState
}

interface DispatchProps {
}

function mapStateToProps(state: AppState) {
  return {
    profile: state.profile,
    initialValues: state.profile.getUser().toJS()
  };
}
function mapDispatchToProps(dispatch: any) {
  return {
  };
}
function mergeProps(stateProps: StateProps, dispatchProps: DispatchProps, ownProps: ProfileFormProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps);
}

const reduxFormObject: any = reduxForm<User, OwnProps, ProfileFormState>({ form: FormName.ProfileForm, enableReinitialize: true})(ProfileForm);
const i18n = withNamespaces()(reduxFormObject)
const connected: React.ComponentClass<OwnProps> = connect(mapStateToProps, mapDispatchToProps, mergeProps)(i18n);

export default connected;

