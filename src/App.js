import { Configuration, OpenAIApi } from 'openai';

import FormSection from './components/FormSection';
import AnswerSection from './components/AnswerSection';

import { useState } from 'react';

const App = () => {
	const configuration = new Configuration({
		apiKey: process.env.REACT_APP_OPENAI_API_KEY,
	});

	const openai = new OpenAIApi(configuration);

	const [storedValues, setStoredValues] = useState([]);

	const generateResponse = async (newQuestion, setNewQuestion) => {
		const options = {
		  model: "gpt-3.5-turbo",
		  messages: [{ role: "user", content: newQuestion }],
		};
	
		const response = await openai.createChatCompletion(options);
	
		if (response.data.choices) {
		  setStoredValues([
			{
			  question: newQuestion,
			  answer: response.data.choices[0].message.content,
			},
			...storedValues,
		  ]);
		  setNewQuestion("");
		}
	  };

	return (
		<div>
			<div className="header-section">
				<h1>ChatGPT CLONE 🤖</h1>
				{storedValues.length < 1 && (
					<p>
						I am an automated question and answer system, designed to assist you
						in finding relevant information. You are welcome to ask me any
						queries you may have, and I will do my utmost to offer you a
						reliable response. Kindly keep in mind that I am a machine and
						operate solely based on programmed algorithms.
					</p>
				)}
			</div>

			<FormSection generateResponse={generateResponse} />

			{storedValues.length > 0 && <AnswerSection storedValues={storedValues} />}
		</div>
	);
};

export default App;
