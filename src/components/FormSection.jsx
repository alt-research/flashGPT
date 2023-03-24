import { useState } from 'react';

const defaultInput = [
  'You are Solidity smart contract developer.',
  'Write a `MyToken` contract which is an ERC20 contract.',
  'Name is MyToken and symbol is MTK.',
  'It should only use solidity version 0.8.18.',
  'Provide contract codes with SPDX-License without elaboration.',
].join('\n');

const FormSection = ({ generateResponse }) => {
  const [newQuestion, setNewQuestion] = useState(defaultInput);

  return (
    <div className="form-section">
      <textarea
        rows="5"
        className="form-control"
        placeholder="Ask me anything..."
        value={newQuestion}
        onChange={e => setNewQuestion(e.target.value)}
      ></textarea>
      <button className="btn" onClick={() => generateResponse(newQuestion, setNewQuestion)}>
        Generate Response 🤖
      </button>
    </div>
  );
};

export default FormSection;
