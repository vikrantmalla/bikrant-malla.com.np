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
  '--navBackground: #111111',
  '--navBackgroundShadow: 0 1px 30px 0 rgb(145 145 145 / 20%)',
  '--text: #000',
  '--textRev: #fff',
  '--headingStroke: #fff',
  '--hoverStroke: #000',
  '--toggle: #eaeaea',
  '--toggleHover: #444444',
  '--link:#444444',
  '--card:#dbe1e8',
  '--cardBackgroundShadow: 0 3px 8px rgb(0 0 0 / 24%)',
  '--span:#3f4954',
];

const darkTheme = [
  '--background: #13141c',
  '--navBackground: #f9fafb',
  '--navBackgroundShadow: 0 1px 30px 0 rgb(2 2 3 / 70%)',
  '--text: #fff',
  '--textRev: #000',
  '--headingStroke: #000',
  '--hoverStroke: #fff',
  '--toggle: #202230',
  '--toggleHover: #eaeaea',
  '--link:#888888',
  '--card:#212330',
  '--cardBackgroundShadow: 0 2px 20px 0 rgb(0 0 0 / 5%)',
  '--span:#f9feff',
];