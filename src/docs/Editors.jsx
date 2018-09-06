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
    position: 'relative',
    '& .CodeMirror': {
      fontFamily: '"Fira Code", "monaco", monospaced',
      height: '100%',
      fontSize: '12px !important',
      lineHeight: '1.8',
    },
    '& .CodeMirror-linenumber': {
      paddingLeft: 16,
      paddingRight: 12,
    },
    '& .CodeMirror-gutters': {
      background: '#101518 !important',
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
  pane: {
    width: '100%',
    height: 500,
    background: '#1C262A',
    borderTop: '1px solid rgba(0, 0, 0, 0.5)',
    display: 'none',
  },
  visiblePane: {
    display: 'block',
  },
  editorSelector: {
    position: 'absolute',
    display: 'flex',
    right: 8,
    top: 60,
    zIndex: 999,
    borderRadius: '1px solid rgba(0, 0, 0, 0.5)',
    boxShadow: '0 2px 3px rgba(0, 0, 0, 0.3)',
    borderRadius: 5,
    fontSize: '0.8em',
    overflow: 'hidden',
  },
  editorOption: {
    padding: 8,
    textTransform: 'uppercase',
    background: 'rgba(255, 255, 255, 0.4)',
    color: 'rgba(0, 0, 0, 0.7)',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.6)',
    }
  },
  activeOption: {
    background: 'rgba(255, 255, 255, 0.6)',
  },
});


class Editors extends React.Component {

  state = {
    activeEditor: 'query',
  };

  componentDidMount() {
    const { resolvers, query, result, onChangeResolvers, onChangeQuery } = this.props;
    this.resolversPaneEditor = CodeMirror.fromTextArea(this.resolversPane, {
      lineNumbers: true,
      mode: 'javascript',
      theme: 'material',
    });
    this.resolversPaneEditor.getDoc().setValue(resolvers);
    this.queryPaneEditor = CodeMirror.fromTextArea(this.queryPane, {
      lineNumbers: true,
      mode: 'graphql',
      theme: 'material',
    });
    this.queryPaneEditor.getDoc().setValue(query);
    this.resultPaneEditor = CodeMirror.fromTextArea(this.resultPane, {
      lineNumbers: true,
      mode: 'javascript',
      theme: 'material',
    });
    this.resultPaneEditor.getDoc().setValue(result);
  }

  componentDidUpdate() {
    const { resolvers, query, result } = this.props;
    this.resolversPaneEditor.getDoc().setValue(resolvers);
    this.queryPaneEditor.getDoc().setValue(query);
    this.resultPaneEditor.getDoc().setValue(result);
  }

  render() {
    const { graphqlUrl, onChangeUrl } = this.props;
    const { activeEditor } = this.state;
    return (
      <div className={css(styles.editors)}>
        <div className={css(styles.editorSelector)}>
          <div
            onClick={() => this.setState({ activeEditor: 'query' })}
            className={css(styles.editorOption, activeEditor === 'query' && styles.activeOption)}>
            Query
          </div>
          <div
            onClick={() => this.setState({ activeEditor: 'resolvers' })}
            className={css(styles.editorOption, activeEditor === 'resolvers' && styles.activeOption)}>
            Resolvers
          </div>
          <div
            onClick={() => this.setState({ activeEditor: 'result' })}
            className={css(styles.editorOption, activeEditor === 'result' && styles.activeOption)}>
            Result
          </div>
        </div>
        <div className={css(styles.inputContainer)}>
          <input
            value={graphqlUrl}
            onChange={(e) => onChangeUrl(e.target.value)}
            className={css(styles.input)}
            placeholder="http://localhost/api/graphql"
            type="text" />
        </div>
        <div className={css(styles.pane, activeEditor === 'query' && styles.visiblePane)}>
          <textarea ref={(ref) => this.queryPane = ref} />
        </div>
        <div className={css(styles.pane, activeEditor === 'resolvers' && styles.visiblePane)}>
          <textarea ref={(ref) => this.resolversPane = ref} />
        </div>
        <div className={(css(styles.pane, activeEditor === 'result' && styles.visiblePane))}>
          <textarea ref={(ref) => this.resultPane = ref} />
        </div>
      </div>
    );
  }
}


export default Editors;
