import React, { useRef, useReducer } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components'

const ButtonBase = styled.button`
  cursor: pointer;

  width: 250px;
  height: 6vh;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  outline: none;
  position: relative;
  overflow: hidden;
  border-width: 0;

  background-color: cyan;
  transform: translate3d(0,0,0);

  :hover {
    filter: brightness(1.06);
  }

  ::after {
    content: '';
    pointer-events: none;
    
    width: ${({ ripple }) => ripple.size}px;
    height: ${({ ripple }) => ripple.size}px;

    display: none;
    position: absolute;
    left: ${({ ripple }) => ripple.x}px;
    top: ${({ ripple }) => ripple.y}px;

    border-radius: 50%;
    background-color: ${({ ripple }) => ripple.color};

    opacity: 0;
    animation: ripple ${({ ripple }) => ripple.duration}ms;
  }

  :focus:not(:active)::after {
    display: block;
  }
  
  @keyframes ripple {
    from {
      opacity: 0.75;
      transform: scale(0);
    }
    to {
      opacity: 0;
      transform: scale(2);
    }
  }
`

const rippleReducer = ref => (ripple, event) => {
  const { x, y, width, height } = ref.current.getBoundingClientRect()
  const size = Math.max(width, height) 
  
  return {
    ...ripple,
    size, 
    x: event.pageX - x - size / 2,
    y: event.pageY - y - size / 2
  }
}

const DEFAULT_RIPPLE = {
  size: 0,
  x: 0,
  y: 0,
  color: 'white',
  duration: 850
}

const Button = props => {
  const ref = useRef(null)

  const [ripple, dispatch] = useReducer(
    rippleReducer(ref),
    { ...DEFAULT_RIPPLE, ...props.ripple }
  )

  return (
    <ButtonBase
      ref={ref}
      className={props.className}
      ripple={ripple}
      onClick={event => {
        event.persist()
        dispatch(event)
      }}
    >
      {props.children}
    </ButtonBase>
  )
}

ReactDOM.render(
  <div style={{
    backgroundColor: 'red',
    width: '500px', height: '500px',
    display: 'grid',
    placeItems: 'center'
  }}>
    <Button>
      <span style={{ fontSize: '30px' }}>
        abacabadabaca
      </span>
    </Button>
  </div>,
  document.getElementById('root')
);
