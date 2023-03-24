import React, { useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { useAuthContext } from '../contexts/AuthContext';

const AnswerSection = ({ storedValues }) => {
  const { loginWithRedirect } = useAuthContext();
  const copyText = text => {
    navigator.clipboard.writeText(text);
  };
  const [code, setCode] = useState('');
  const options = {
    selectOnLineNumbers: true,
  };
  const onChange = newVal => {
    setCode(newVal)
  };
  const editorDidMount = answer => (editor, monaco) => {
    console.log('editorDidMount', editor);
    const answerArr = answer.split('```');
    if (answerArr?.length === 3) {
      console.log('answerArr: ', answerArr);
      setCode(answerArr[1]);
    } else {
      setCode(answer);
    }
    editor.focus();
  };
  const handleClickLogin = () => {
    localStorage.setItem("contract_code", code)
    loginWithRedirect()
  };

  return (
    <>
      <hr className="hr-line" />
      <div className="answer-container">
        {storedValues.map((value, index) => {
          return (
            <>
              <div className="answer-section" key={index}>
                <p className="question">{value.question}</p>
                <p className="answer">{value.answer}</p>
                <div className="copy-icon" onClick={() => copyText(value.answer)}>
                  <i className="fa-solid fa-copy"></i>
                </div>
              </div>
              {value.answer?.includes('pragma solidity') && (
                <div style={{ padding: '2rem 0' }}>
                  <MonacoEditor
                    width="800"
                    height="300"
                    language="javascript"
                    theme="vs-dark"
                    value={code}
                    options={options}
                    onChange={onChange}
                    editorDidMount={editorDidMount(value.answer)}
                  />
                </div>
              )}
            </>
          );
        })}
      </div>
      <button className="btn" onClick={handleClickLogin}>
        Login to deploy this contract
      </button>
    </>
  );
};

export default AnswerSection;
