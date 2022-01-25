import React, { useState, useEffect } from 'react'

export const ThemeContext = React.createContext({
  dark: false,
  toggle: () => {},
});



const ThemeProvider = (props) => {
  // keeps state of the current theme
  const [dark, setDark] = useState(false);
  
  // paints the app before it renders elements
  useEffect(() => {
    const lastTheme = window.localStorage.getItem('darkTheme');
    
    if (lastTheme === 'true') {
      setDark(true);
      applyTheme(darkTheme);
    } else {
      setDark(false);
      applyTheme(lightTheme);
    } 
  // if state changes, repaints the app
  }, [dark]);

  // rewrites set of css variablels/colors
  const applyTheme = theme => {
    const root = document.getElementsByTagName('html')[0];
    root.style.cssText = theme.join(';');
  }

  const toggle = () => {
    const body = document.getElementsByTagName('body')[0];
    body.style.cssText = 'transition: background .5s ease';

    setDark(!dark);
    window.localStorage.setItem('darkTheme', !dark);
  };

  return (
    <ThemeContext.Provider value={{ dark, toggle,}}>
      {props.children}
    </ThemeContext.Provider>
  )
}
export default ThemeProvider;

// styles
const lightTheme = [
  '--background: #f9fafb',
  '--navbackground: #111111',
  '--text: #000',
  '--textrev: #fff',
  '--headingstroke: #fff',
  '--hoverstroke: #000',
  '--toggle: #eaeaea',
  '--togglehover: #444444',
  '--link:#444444',
  '--card:#dbe1e8',
  '--span:#3f4954',
];

const darkTheme = [
  '--background: #111111',
  '--navbackground: #f9fafb',
  '--text: #fff',
  '--textrev: #000',
  '--headingstroke: #000',
  '--hoverstroke: #fff',
  '--toggle: #444444',
  '--togglehover: #eaeaea',
  '--link:#888888',
  '--card:#3f4954',
  '--span:#f9feff',
];