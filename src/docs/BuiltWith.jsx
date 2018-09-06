import React from 'react';
import { StyleSheet, css } from 'aphrodite-jss';


const styles = StyleSheet.create({
  builtWith: {
    position: 'relative',
    cursor: 'pointer',
    display: 'block',
    transition: 'all 0.3s',
    opacity: 0.5,
    '&:hover': {
      opacity: 1,
    },
  },
  logo: {
    height: 30,
    position: 'absolute',
    top: 0,
    right: 0,
  },
});


const BuiltWith = () => {
  return (
    <a href="https://github.com/react-display-window/react-display-window" target="_blank" className={css(styles.builtWith)}>
      <img
        className={css(styles.logo)}
        src="https://raw.githubusercontent.com/react-display-window/react-display-window/master/assets/logo.png" />
    </a>
  );
};


export default BuiltWith;
