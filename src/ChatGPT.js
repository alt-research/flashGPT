import { Configuration, OpenAIApi } from 'openai';

import AnswerSection from './components/AnswerSection';
import FormSection from './components/FormSection';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import SuspenseLoader from './components/SuspenseLoader';
import { useAuthContext } from './contexts/AuthContext';

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const generateResponse = async ({ newQuestion, setNewQuestion }) => {
  const options = {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: newQuestion }],
  };

  const response = await openai.createChatCompletion(options);

  if (response.data.choices) {
    setNewQuestion('');
  }

  return response;
};

const ChatGPT = () => {
  console.log('rendering openai generator');
  const [storedValues, setStoredValues] = useState([]);
  const { isLoading, mutate } = useMutation(generateResponse, {
    onSuccess: (response, variables) => {
      console.log('variables: ', variables);
      setStoredValues([
        {
          question: variables?.newQuestion,
          answer: response.data.choices[0].message.content,
        },
        ...storedValues,
      ]);
    },
  });

  const { loginWithRedirect } = useAuthContext();
  const handleClickLogin = loginWithRedirect;

  return (
    <div>
      {isLoading && <SuspenseLoader preventUserActions />}
      <div className="header-section">
        <h1>ChatGPT CLONE 🤖</h1>
        {storedValues.length < 1 && (
          <p>
            I am an automated question and answer system, designed to assist you in finding relevant
            information. You are welcome to ask me any queries you may have, and I will do my utmost
            to offer you a reliable response. Kindly keep in mind that I am a machine and operate
            solely based on programmed algorithms.
          </p>
        )}
      </div>

      <FormSection
        generateResponse={(newQuestion, setNewQuestion) => {
          mutate({ newQuestion, setNewQuestion });
        }}
      />

      {storedValues.length > 0 && <AnswerSection storedValues={storedValues} />}

      <button className="btn" onClick={handleClickLogin}>
        Login to deploy this contract
      </button>
    </div>
  );
};

export default ChatGPT;
