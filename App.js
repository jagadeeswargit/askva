import { useEffect, useRef, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { CiCirclePlus, CiEdit } from "react-icons/ci";

import "./App.css";
import logo from "./iconBot.png";
import iconClose from "./iconClose.png";

let context = "";
let selectedItem = "";
let selectedQuestionDrug = "";
let isEditable = false;
let isEditableIndex = -1;
const dummyQuestion = [
  "Which of the following reservoir systems requires humidification of the delivered oxygen?",
  "True or false: the urethra is normally sterile?",
  "Which of the following is a potential cause of secondary aortic regurgitation?",
  "Which of the following is NOT a common cause of hand and wrist joint swelling?",
  "During the Femoral Nerve Stretch Test, what symptom should the patient experience if the test is positive?",
];
const data = ["PARACETAMOL", "HYDROXYCHLOROQUINE", "ACETAMINPPHEN", "TYLENOL"];

function App() {
  const listRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      fromOrTo: "To",
      message: "Hi! I'm your Virtual Assistant. I can help with questions.",
    },
  ]);

  const [isBotVisible, setIsBotVisible] = useState(false);
  const [updateView, setUpdateView] = useState(false);
  const [updateView2, setUpdateView2] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answer, setAnswer] = useState("");
  const [questionsAndAns, setQuestionsAndAns] = useState([]);

  const [questionValue, setQuestionValue] = useState("");
  const [ansValue, setAnsValue] = useState("");

  const handleImageClick = () => {
    let newObj = {
      fromOrTo: "Option",
      message: data,
    };
    setMessages((items) => [...items, newObj]);
    setIsBotVisible(true);
  };

  const handleCloseClick = () => {
    setIsBotVisible(false);
    setMessages([
      {
        fromOrTo: "To",
        message: "Hi! I'm your Virtual Assistant. I can help with questions.",
      },
    ]);
    setInputValue("");
  };

  const clickSendButton = () => {
    let newObj = {
      fromOrTo: "From",
      message: inputValue,
    };
    setMessages((items) => [...items, newObj]);
    setInputValue("");
    setUpdateView(!updateView);
    callAPIWithInputWithSendClick(inputValue);
  };

  const handlePressCell = (item) => {
    selectedItem = item;
    let newObj = {
      fromOrTo: "From",
      message: item,
    };
    setMessages((items) => [...items, newObj]);
    setInputValue("");
    setUpdateView(!updateView);
    callAPIWithInput(item);
  };

  const Row = ({ message, index }) => {
    if (message.fromOrTo === "From") {
      return (
        <div key={index} className="left-box">
          {message.message}
        </div>
      );
    } else if (message.fromOrTo === "To") {
      return (
        <div key={index} className="right-box">
          {message.message}
        </div>
      );
    } else if (message.fromOrTo === "Option") {
      return (
        <div className="cell-border">
          {message.message.map((item, i) => (
            <div onClick={() => handlePressCell(item)} className="cell" key={i}>
              {item}
            </div>
          ))}
        </div>
      );
    }
  };

  const QuestionRow = ({ question, index }) => {
    return (
      <div className="question-cell-border">
        <div
          onClick={() => handlePressQuestionCell(question)}
          className="questioncell"
          key={index}
        >
          {question}
        </div>
      </div>
    );
  };
  const handleTextareaQChange = (event) => {
    setQuestionValue(event.target.value);
  };
  const handleTextareaAChange = (event) => {
    setAnsValue(event.target.value);
  };

  const QuestionAndAnsRowHeader = ({ obj, index }) => {
    return (
      <div className="question-ans-cell-border-2">
        <div className="question-ans-cell-2">
          <h2 className="textarea-question-2">{obj.question}</h2>
          <label className="textarea-ans-2">{obj.answer}</label>
          <CiEdit
            size={30}
            className="icon-add"
            onClick={() => handlePressEdit(obj, index)}
          />
          <AiOutlineDelete
            size={30}
            className="icon-add"
            onClick={() => handlePressDelete(index)}
          />
        </div>
      </div>
    );
  };
  useEffect(() => {
    listRef.current?.lastElementChild?.scrollIntoView();
  }, [messages]);

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      clickSendButton();
    }
  };

  const callAPI = async (context) => {
    try {
      let url = `https://jsonplaceholder.typicode.com/users`;
      const res = await fetch(url);
      // const res = await fetch(url, {
      //   body: JSON.stringify(context),
      // });
      const finalRes = await res.json();
      console.log("finalRes 1st time  " + finalRes);
      let optionArr = [];
      for (let index = 0; index < 2; index++) {
        const element = finalRes[index];
        optionArr.push(element.name);
      }
      let newObj = {
        fromOrTo: "Option",
        message: optionArr,
      };
      setMessages((items) => [...items, newObj]);
      setUpdateView2(!updateView2);
    } catch (err) {
      console.error("err", err);
    }
  };

  const callUsersAPI = async (context) => {
    try {
      let url = `https://jsonplaceholder.typicode.com/users`;
      const res = await fetch(url);

      const finalRes = await res.json();
      let optionArr = [];
      for (let index = 0; index < 5; index++) {
        const element = finalRes[index];
        optionArr.push(element.company.catchPhrase);
        optionArr.push(dummyQuestion[index]);
      }
      setQuestions(optionArr);
    } catch (err) {
      console.error("err", err);
    }
  };

  const callAPIWithInput = async (item) => {
    try {
      let url =
        `https://tltitnfue2.execute-api.us-east-1.amazonaws.com/IT/` + item;
      const res = await fetch(url);
      context = await res.text();
      console.log("context    " + context);
      callAPI(context);
    } catch (err) {
      console.error("err", err);
    }
  };

  const callAPIWithInputWithSendClick = async (item) => {
    try {
      let url =
        `https://tltitnfue2.execute-api.us-east-1.amazonaws.com/IT/` + item;
      const res = await fetch(url);
      context = await res.text();
    } catch (err) {
      console.error("err", err);
    }
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    let question = e.target.value;
    if (question === "Paracetamol") {
      selectedQuestionDrug =
        "Paracetamol (Panadol, Calpol, Alvedon) is an analgesic and antipyretic drug that is used to temporarily relieve mild-to-moderate pain and fever. It is commonly included as an ingredient in cold and flu medications and is also used on its own. Paracetamol is exactly the same drug as acetaminophen (Tylenol)";
    } else if (question === "Acetaminophen") {
      selectedQuestionDrug =
        "Acetaminophen (APAP - also known as paracetamol in many countries) is a non-opioid analgesic and antipyretic agent used to treat pain and fever. It is used as a single agent for mild to moderate pain and combined with an opioid analgesic for severe pain";
    } else if (question === "Azithromycin") {
      selectedQuestionDrug =
        "Azithromycin is most commonly used to treat minor aches and pains, including headache, backache, minor pain of arthritis, toothache, muscular aches, premenstrual and menstrual cramps. It is also commonly used to temporarily reduce fever.";
    } else if (question === "Hydrochloride") {
      selectedQuestionDrug =
        "Hydrochloride is the most commonly used salt, and 15.5% of all drugs contain it. All types of oxycodone are the hydrochloride salt, but sometimes drug data information will just shorten the name to oxycodone. But oxycodone hydrochloride and oxycodone are the same medicine.";
    } else {
      selectedQuestionDrug = "";
    }
    callUsersAPI(e.target.value);
  };

  const handlePressQuestionCell = async (question) => {
    let url = `https://jsonplaceholder.typicode.com/users`;
    const res = await fetch(url);
    const finalRes = await res.json();
    setAnswer(finalRes[0].name);
    setAnsValue(finalRes[0].name);
    setQuestionValue(question);
  };

  const updateItem = (updatedData) => {
    const updatedItems = [...questionsAndAns]; // Create a shallow copy of the original array
    updatedItems[isEditableIndex] = { ...updatedData }; // Update the object at the specified index
    setQuestionsAndAns(updatedItems); // Update the state with the new array
    setQuestionValue("");
    setAnsValue("");
    isEditable = false;
  };

  const handlePressAdd = () => {
    if (questionValue.length === 0 || ansValue.length === 0) {
      return;
    }
    if (isEditable) {
      const obaaj = { question: questionValue, answer: ansValue };
      updateItem(obaaj);
    } else {
      const obaaj = { question: questionValue, answer: ansValue };
      setQuestionsAndAns([...questionsAndAns, obaaj]);
      setQuestionValue("");
      setAnsValue("");
    }
  };
  const handlePressEdit = (obj, index) => {
    isEditable = true;
    isEditableIndex = index;
    setQuestionValue(obj.question);
    setAnsValue(obj.answer);
  };
  const handlePressDelete = (index) => {
    isEditable = false;
    const updatedItems = [...questionsAndAns];
    updatedItems.splice(index, 1);
    setQuestionsAndAns(updatedItems);
  };

  // Function to trigger the CSV download
  const downloadCSV = () => {
    let csvMessage = "Question, Answer \n";
    questionsAndAns.forEach((v) => {
      csvMessage += v.question + "," + v.answer + "\n";
    });
    const blob = new Blob([csvMessage], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };
  return (
    <div className="page">
      <div className="left-column">
        <div className="vertical-view">
          <div>
            <h3>Select an option:</h3>
            <select
              className="drop-down"
              value={selectedOption}
              onChange={handleOptionChange}
            >
              <option value="Option 1">Select Medicines list</option>
              <option value="Option 2">Paracetamol</option>
              <option value="Option 3">Acetaminophen</option>
              <option value="Option 4">Azithromycin</option>
              <option value="Option ">Hydrochloride</option>
            </select>
          </div>
          {questions.length !== 0 ? (
            <div className="chat-container">
              {questions.map((question, index) => (
                <QuestionRow key={index} question={question} />
              ))}
            </div>
          ) : null}
          {answer ? (
            <h3 className="answer-cell-border">Answer is : {answer}</h3>
          ) : null}
          {questions.length !== 0 ? (
            <div
              style={{ position: "absolute", bottom: 70 }}
              className="chat-input-container"
            >
              <input
                type="text"
                className="chat-input-text"
                placeholder="Type your question..."
                onChange={handleTextareaQChange}
                value={questionValue}
              />
              <button
                className="chat-send-button"
                onClick={() => handlePressQuestionCell(questionValue)}
              >
                Send
              </button>
            </div>
          ) : null}
        </div>
      </div>
      <div className="right-column">
        <div className="vertical-view">
          {questions.length > 0 ? (
            <div className="question-ans-cell-border">
              <div className="question-ans-cell">
                <textarea
                  className="textarea-question"
                  placeholder="Enter Question..."
                  onChange={handleTextareaQChange}
                  value={questionValue}
                />

                <textarea
                  className="textarea-ans"
                  placeholder="Enter Answer..."
                  onChange={handleTextareaAChange}
                  value={ansValue}
                />
                <CiCirclePlus
                  size={30}
                  className="icon-add"
                  onClick={handlePressAdd}
                />
              </div>
            </div>
          ) : null}

          {questionsAndAns.length !== 0 ? (
            <div className="chat-container">
              {questionsAndAns.map((obj, index) => (
                <QuestionAndAnsRowHeader key={index} index={index} obj={obj} />
              ))}
            </div>
          ) : null}
          {questionsAndAns.length !== 0 ? (
            <button className="download-button" onClick={downloadCSV}>
              Download CSV
            </button>
          ) : null}
        </div>
      </div>
      {/* Bot functionality */}
      <body>
        {isBotVisible ? (
          <div className="chatbot-box">
            {/* Chatbot content goes here */}
            <div className="chatbot-header">
              <h3>Virtual Assistant</h3>
              <img
                onClick={handleCloseClick}
                src={iconClose}
                className="close"
                alt="iconClose"
              />
            </div>

            <div className="chatbot-input">
              <div>
                <div className="chat-container" ref={listRef}>
                  {messages.map((message, index) => (
                    <Row key={index} message={message} />
                  ))}
                </div>
                <div className="chatbot-input">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                  />
                  <button onClick={clickSendButton}>Send</button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="App">
            <img
              onClick={handleImageClick}
              src={logo}
              className="App-logo"
              alt="logo"
            />
          </div>
        )}
      </body>
    </div>
  );
}

export default App;
