import React, { useState, useRef, useEffect } from 'react';
import './App.css';

import gptLogo from './assets/chatgpt.svg';
import addBtn from './assets/add-30.png';
import msgIcon from './assets/message.svg';
import home from './assets/home.svg';
import saved from './assets/bookmark.svg';
import rocket from './assets/rocket.svg';
import sendBtn from './assets/send.svg';
import userIcon from './assets/user-icon.png';
import gptImgLogo from './assets/chatgptLogo.svg';

import { sendMsgToOpenAI } from './openai';

function App() {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false); //Typing showing while fetching from api
  const chatEndRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    setChat((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true); //start typing ayega

    try {
      const reply = await sendMsgToOpenAI(input);
      const botMsg = { sender: 'bot', text: reply };
      setChat((prev) => [...prev, botMsg]);
    } catch (error) {
      const errorMsg = { sender: 'bot', text: '❌ Error getting reply.' };
      setChat((prev) => [...prev, errorMsg]);
      console.error('API error:', error);
    }

    setLoading(false); // Stop typing...
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat, loading]); //apne app scroll hojyega load hoke

  return (
    <div className="App">
      <div className="sideBar">
        <div className="upperSide">
          <div className="upperSideTop">
            <img src={gptLogo} alt="Logo" className="logo" />
            <span className="brand">ChatGPT</span>
          </div>
          <button className="midBtn" onClick={() => window.location.reload()}>
            <img src={addBtn} alt="new chat" className="addBtn" />
            New Chat
          </button>
          <div className="upperSideBottom">
            <button className="query">
              <img src={msgIcon} alt="Query" />
              What is Programming?
            </button>
            <button className="query">
              <img src={msgIcon} alt="Query" />
              How to use an API?
            </button>
          </div>
        </div>
        <div className="lowerSide">
          <div className="listItem">
            <img src={home} alt="Home" className="listItemImg" />
            Home
          </div>
          <div className="listItem">
            <img src={saved} alt="Saved" className="listItemImg" />
            Saved
          </div>
          <div className="listItem">
            <img src={rocket} alt="Upgrade" className="listItemImg" />
            Upgrade to Pro
          </div>
        </div>
      </div>

      <div className="main">
        <div className="chats">
          {chat.map((msg, index) => (
            <div key={index} className={`chat ${msg.sender === 'bot' ? 'bot' : ''}`}>
              <img
                className="chatImg"
                src={msg.sender === 'bot' ? gptImgLogo : userIcon}
                alt=""
              />
              <p className="txt">{msg.text}</p>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="chat bot">
              <img className="chatImg" src={gptImgLogo} alt="GPT Typing" />
              <p className="txt">Typing...</p>
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        <div className="chatFooter">
          <div className="inp">
            <input
              type="text"
              placeholder="Send a message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="send" onClick={handleSend}>
              <img src={sendBtn} alt="Send" />
            </button>
          </div>
          <p>
            ChatGPT may produce inaccurate information about people, places, or facts.
            ChatGPT August 20 Version
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;


