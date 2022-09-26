import Editor from "@monaco-editor/react";
import {useCallback, useEffect, useRef,useState} from 'react';
import firebase from "firebase";
import firebaseConfig from './fireabaseConfig'
import {fromMonaco} from '@hackerrank/firepad';

function App() {

  const editorRef = useRef(null);
  const [editorLoaded,setEditorLoaded] = useState(false);
  const [, setValue] = useState('')

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    setEditorLoaded(true);
  }

  const onChange = useCallback((value) => {
    setValue(value)
  }, []);

  const InitFireBase = () => {
    // Get Firebase Database reference.
    let firepadRef = firebase.database().ref();

    const urlparams = new URLSearchParams(window.location.search);
    const roomId = urlparams.get("id");

    if (roomId) {
      firepadRef = firepadRef.child(roomId);
    } else {
      firepadRef = firepadRef.push();
      window.history.replaceState(null, "Share Code", "?id=" + firepadRef.key);
    }

    return firepadRef;
  };

  useEffect(() => {
    if(!firebase.apps.length){
      // Make sure initialization happens only once
      firebase.initializeApp(firebaseConfig); 
    } 
    else{
      firebase.app();
    }
  }, []);

  useEffect(() => {
    if(!editorLoaded){
      // If editor is not loaded return
      return;
    }

    let dbRef = InitFireBase();
    const editor = editorRef.current;
    console.log(editor)
     editor.onDidAttemptReadOnlyEdit(() => {
    });


    // const dbRef = firebase.database().ref().child(`${rooms[0]}`); // Can be anything in param, use unique string for unique code session

    fromMonaco(dbRef,editorRef.current);

    // const name = prompt("Enter your Name :"); // Name to highlight who is editing where in the code
    // if(name){
    //     firepad.setUserName(name);
    // }

  },[editorLoaded]);

  return (
    <div>
      <Editor
       height="90vh"
       defaultLanguage="javascript"
       theme="vs-dark"
       defaultValue= "// Welcome to My Editor"
       onMount={handleEditorDidMount}
       onChange={onChange}
       options={{
         readOnly: false,
         accessibilitySupport: 'on'
       }}
     />
    </div>
  );
}

export default App;