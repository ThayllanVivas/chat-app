import React, { useState } from 'react';

const ChatFooter = ({socket}) => {
  const [message, setMessage] = useState('');

  const handleTyping = () => {
    socket.emit('typing', `${localStorage.getItem('userName')} está escrevendo`)
  }
  const handleNotTyping = () => {
    socket.emit('notTyping', '')
  }

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && localStorage.getItem('userName')) {
      socket.emit('message', {
        text: message,
        name: localStorage.getItem('userName'),
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id,
      });
    }
    setMessage('');
  };
  return (
    <div className="chat__footer">
      <form className="form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Escreva algo"
          className="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleTyping}
          onBlur={handleNotTyping}
        />
        <button className="sendBtn">ENVIAR</button>
      </form>
    </div>
  );
};

export default ChatFooter;