import { P_IVORY, WHITE } from './Color';

export const MODAL_STYLE: React.CSSProperties = {
  top: '15vh',
  left: '25vw',
  width: '50vw',
  height: '70vh',
  backgroundColor: P_IVORY,
  position: 'absolute',
  overflow: 'auto',
  borderRadius: '5px'
}

export const FIELD_STYLE: React.CSSProperties = {
  margin: '5px 5px 15px'
};

export const TASK_CARD: React.CSSProperties = {
  width: '225px',
  minHeight: '65px',
  backgroundColor: WHITE,
  color: 'rgba(0, 0, 0, 0.87)',
  boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 2px 1px -1px',
  padding: '5px',
  borderRadius: '3px',
  margin: '10px 5px',
  opacity: 1,
  overflowWrap: 'break-word',
  position: 'relative'
}