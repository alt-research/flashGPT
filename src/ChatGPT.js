import { Configuration, OpenAIApi } from 'openai';

import AnswerSection from './components/AnswerSection';
import FormSection from './components/FormSection';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import SuspenseLoader from './components/SuspenseLoader';

const generateResponse = async ({ newQuestion, setNewQuestion, apiKey }) => {
  const configuration = new Configuration({
    apiKey,
  });
  const openai = new OpenAIApi(configuration);
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

  return (
    <div>
      {isLoading && <SuspenseLoader preventUserActions />}
      <div className="header-section">
        <h1>FlashGPT</h1>
        {storedValues.length < 1 && (
          <p>
            FlashGPT utilizes the power of OpenAI's GPT language model to{' '}
            <b>generate Solidity smart contracts</b> and{' '}
            <b>deploy them to Layer 1 and 2 solutions</b> such as AltLayer flashlayer,Arbitrum,
            Ethereum, Gnosis, Polygon, Polygon zkEVM testnet, Optimism and Scroll alpha testnet.
            This is be a game-changer in the world of blockchain development. With this dApp,
            developers could leverage the natural language processing capabilities of GPT to create
            efficient, secure, and reliable smart contracts that can be easily deployed to L1/L2
            solutions, making the <b>entire process seamless and straightforward</b>.<br></br>
            <br></br>
            <br></br>
          </p>
        )}
        <p>
          <h2>Getting started</h2>
          <br></br>
          1. Sign up for an account at <a href="https://platform.openai.com/">OpenAI</a> and
          following the sign-up process
          <br></br>
          2. Generate an OpenAI API keynavigating to your profile and selecting the "View API keys"
          option. <br></br>
          3. Key it into the designated field on this page. (we do not store your API keys remotely
          for security purposes)
        </p>
      </div>

      <FormSection
        generateResponse={(newQuestion, setNewQuestion, apiKey) => {
          mutate({ newQuestion, setNewQuestion, apiKey });
        }}
      />

      {storedValues.length > 0 && <AnswerSection storedValues={storedValues} />}
    </div>
  );
};

export default ChatGPT;
