import { useState, useRef, useEffect } from "react";
import "./App.css";
import logo from "./iconBot.png";
import iconClose from "./iconClose.png";
let context = "";
let selectedItem = "";
function App() {
  const [messages, setMessages] = useState([
    {
      fromOrTo: "To",
      message: "Hi! I'm your Virtual Assistant. I can help with questions.",
    },
  ]);
  const data = [
    "PARACETAMOL",
    "HYDROXYCHLOROQUINE",
    "ACETAMINPPHEN",
    "TYLENOL",
  ];
  const [isBotVisible, setIsBotVisible] = useState(false);
  const [updateView, setUpdateView] = useState(false);
  const [updateView2, setUpdateView2] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleImageClick = () => {
    let newObj = {
      fromOrTo: "Option",
      message: data,
    };
    messages.push(newObj);
    setMessages(messages);
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
    messages.push(newObj);
    setMessages(messages);
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
    messages.push(newObj);
    setMessages(messages);
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
      messages.push(newObj);
      setMessages(messages);
      setUpdateView2(!updateView2);
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

  return (
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
              <div className="chat-container">
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
  );
}

export default App;
