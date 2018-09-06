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
  editor: {
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
});


class Editor extends React.Component {

  componentDidMount() {
    const { value } = this.props;
    this.editor = CodeMirror.fromTextArea(this.textArea, {
      lineNumbers: true,
      mode: 'javascript',
      theme: 'material',
      readOnly: true,
    });
    this.editor.getDoc().setValue(result);
  }

  componentDidUpdate() {
    const { value} = this.props;
    this.editor.getDoc().setValue(value);
  }

  render() {
    const { graphqlUrl, onChangeUrl } = this.props;
    return (
      <div className={css(styles.editor)}>
        <textarea ref={(ref) => this.textArea = ref} />
      </div>
    );
  }

}


export default Editor;
