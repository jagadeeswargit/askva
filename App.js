import { useState } from "react";
import "./App.css";
import logo from "./iconBot.png";
import iconClose from "./iconClose.png";
import { FixedSizeList as List } from "react-window";
let selectedItem = "";
function App() {
  const [messages, setMessages] = useState([
    {
      fromOrTo: "To",
      message: "Hi! I'm your Virtual Assistant. I can help with questions.",
    },
  ]);
  const data = [
    "View Billing Option",
    "Claim or Roadside Help",
    "Manage My Policy",
    "Start a Quote",
  ];
  const [isBotVisible, setIsBotVisible] = useState(false);
  const [updateView, setUpdateView] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleImageClick = () => {
    callAPI();
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
    setUpdateView(!updateView);
    callAPIWithInput();
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
  };

  const Row = ({ index, style }) => {
    if (messages[index].fromOrTo === "From") {
      return (
        <div key={index} className="left-box">
          {messages[index].message}
        </div>
      );
    } else if (messages[index].fromOrTo === "To") {
      return (
        <div key={index} className="right-box">
          {messages[index].message}
        </div>
      );
    } else if (messages[index].fromOrTo === "Option") {
      return (
        <div className="cell-border">
          {data.map((item, i) => (
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

  const callAPI = async () => {
    try {
      let url = `https://jsonplaceholder.typicode.com/users`;
      const res = await fetch(url);
      const finalRes = await res.text();
      console.log("finalRes 1st time  " + finalRes);

      let newObj = {
        fromOrTo: "Option",
        message: "",
      };
      messages.push(newObj);
      setMessages(messages);
      setUpdateView(!updateView);
    } catch (err) {
      console.error("err", err);
    }
  };

  const callAPIWithInput = async () => {
    try {
      let url = `https://jsonplaceholder.typicode.com/users`;
      const res = await fetch(url);
      // const res = await fetch(url, {
      //   method: "post",
      //   body: selectedItem + inputValue,
      // });
      const finalRes = await res.json();
      let newObj = {
        fromOrTo: "To",
        message: finalRes[0].name,
      };
      messages.push(newObj);
      setMessages(messages);
      setInputValue("");
      setUpdateView(!updateView);
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
              <List
                height={300}
                width={280}
                itemCount={messages.length}
                itemSize={50}
              >
                {Row}
              </List>
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
