import { useState } from 'react';

const defaultInput = [
  'You are Solidity smart contract developer.',
  'Write a `MyToken` contract which is an ERC20 contract.',
  'Do not accept any arguments in the constructor.',
  'It should only use solidity version 0.8.18.',
  'Provide contract codes with SPDX-License without elaboration.',
].join('\n');

const FormSection = ({ generateResponse }) => {
  const [newQuestion, setNewQuestion] = useState(defaultInput);
  const [apiKey, setApiKey] = useState("")

  return (
    <div className="form-section">
      <div><span>Api Key: </span><input className='apiKey' placeholder="Your OpenAI API Key" value={apiKey} onChange={(e)=>{setApiKey(e?.target?.value)}}/></div>
      <textarea
        rows="5"
        className="form-control"
        placeholder="Ask me anything..."
        value={newQuestion}
        onChange={e => setNewQuestion(e.target.value)}
      ></textarea>
      
      <button className="btn" onClick={() => generateResponse(newQuestion, setNewQuestion, apiKey)}>
        Generate Response 🤖
      </button>
    </div>
  );
};

export default FormSection;
