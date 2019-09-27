import React from 'react';
// import './App.css';
import { Amendment } from './Amendment';
import { Box, Grommet } from 'grommet';

const theme = {
  global: {
    colors: {
      brand: '#228BE6',
    },
    font: {
      family: 'Roboto',
      size: '18px',
      height: '30px',
    },
    textarea: {
      width: 635,
      height: 125
    }
  },
};

const AppBar = (props) => (
  <Box
    tag='header'
    direction='row'
    align='center'
    justify='between'
    background='brand'
    pad={{ left: 'medium', right: 'small', vertical: 'small' }}
    elevation='medium'
    style={{ zIndex: '1' }}
    {...props}
  />
);

function App() {
  return (
    <Grommet theme={theme}>
      <AppBar>
        Amendment Demo
      </AppBar>

      
        
        <Amendment></Amendment>
     
  


    </Grommet>
  );
}

export default App;
