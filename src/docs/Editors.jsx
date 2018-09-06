import 'codemirror/mode/javascript/javascript';
import 'codemirror-graphql/mode';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/lint/lint';

import React from 'react';
import { StyleSheet, css } from 'aphrodite-jss';
import CodeMirror from 'codemirror';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';


const styles = StyleSheet.create({
  editors: {
    width: '100%',
    border: '1px solid rgba(0, 0, 0, 0.5)',
    overflow: 'hidden',
    borderRadius: 5,
    '& .CodeMirror': {
      fontFamily: '"Fira Code", "monaco", monospaced',
      height: '100%',
      fontSize: '12px !important',
      lineHeight: '1.8',
    },
    '& .CodeMirror-linenumber': {
      paddingLeft: 8,
      paddingRight: 20,
    },
    '& .CodeMirror-gutters': {
      background: 'rgba(0, 0, 0, 0.4) !important',
    },
    '& .CodeMirror-lines': {
      marginLeft: 8,
    },
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    width: '100%',
    padding: '16px',
    background: '#1C262A',
    border: 'none',
    outline: '0 !important',
    color: 'rgba(227, 232, 232, 1)',
    letterSpacing: '0.05em',
  },
  panesContainer: {
    width: '100%',
    height: 500,
    background: '#1C262A',
    borderTop: '1px solid rgba(0, 0, 0, 0.5)',
    display: 'flex',
  },
  pane: {
    height: '100%',
    borderRight: '1px solid rgba(0, 0, 0, 0.5)',
    flex: 1,
    '&:last-of-type': {
      border: 0,
    },
  },
  resultContainer: {
    width: '100%',
    height: 500,
    background: '#1C262A',
    borderTop: '1px solid rgba(0, 0, 0, 0.5)',
  }
});


class Editors extends React.Component {

  componentDidMount() {
    const { resolvers, query, result, onChangeResolvers, onChangeQuery } = this.props;
    this.leftPaneEditor = CodeMirror.fromTextArea(this.leftPane, {
      lineNumbers: true,
      mode: 'javascript',
      theme: 'material',
    });
    this.leftPaneEditor.getDoc().setValue(resolvers);
    this.rightPaneEditor = CodeMirror.fromTextArea(this.rightPane, {
      lineNumbers: true,
      mode: 'graphql',
      theme: 'material',
    });
    this.rightPaneEditor.getDoc().setValue(query);
    this.resultPaneEditor = CodeMirror.fromTextArea(this.resultPane, {
      lineNumbers: true,
      mode: 'javascript',
      theme: 'material',
    });
    this.resultPaneEditor.getDoc().setValue(result);
  }

  componentDidUpdate() {
    const { resolvers, query, result } = this.props;
    this.leftPaneEditor.getDoc().setValue(resolvers);
    this.rightPaneEditor.getDoc().setValue(query);
    this.resultPaneEditor.getDoc().setValue(result);
  }

  render() {
    const { graphqlUrl, onChangeUrl } = this.props;
    return (
      <div className={css(styles.editors)}>
        <div className={css(styles.inputContainer)}>
          <input
            value={graphqlUrl}
            onChange={(e) => onChangeUrl(e.target.value)}
            className={css(styles.input)}
            placeholder="http://localhost/api/graphql"
            type="text" />
        </div>
        <div className={css(styles.panesContainer)}>
          <div className={css(styles.pane)}>
            <textarea ref={(ref) => this.leftPane = ref} />
          </div>
          <div className={css(styles.pane)}>
            <textarea ref={(ref) => this.rightPane = ref} />
          </div>
        </div>
        <div className={(css(styles.resultContainer))}>
          <textarea ref={(ref) => this.resultPane = ref} />
        </div>
      </div>
    );
  }
}


export default Editors;
