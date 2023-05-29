import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { AiFillDelete } from 'react-icons/ai';
import './chat.css';

import {
  getRoom,
  addUserToRoom,
  sendMessage,
  getAllMessages,
  deleteMessage,
} from '../../store';

import { useRef } from 'react';

const AdminChatPage = () => {
  const [message, setMessage] = useState('');
  const { roomId, messages } = useSelector((state) => state.chat);
  const { id } = useSelector((state) => state.auth);
  const divRef = useRef(null);

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(sendMessage({ roomId, message }))
      .unwrap()
      .then(() => {
        dispatch(getAllMessages({ roomId }));
        setMessage('');
      })
      .catch((err) => console.log(err.message));
  };

  useEffect(() => {
    dispatch(getRoom())
      .unwrap()
      .then(() => dispatch(addUserToRoom({ roomId })))
      .catch((err) => console.log(err.message));
  }, [dispatch, roomId]);

  useEffect(() => {
    if (roomId) {
      dispatch(getAllMessages({ roomId }));
    }
  }, [dispatch, roomId]);

  useEffect(() => {
    divRef.current.scrollIntoView({ behavior: 'smooth' });
  });

  const handleRemove = (id) => {
    dispatch(deleteMessage({ messageId: id }))
      .unwrap()
      .then(() => {
        dispatch(getAllMessages({ roomId }));
      })
      .catch((err) => console.log(err.message));
  };

  return (
    <div className="msger-container">
      <section class="msger">
        <header class="msger-header">
          <div class="msger-header-title">
            <i class="fas fa-comment-alt"></i> PublicChat
          </div>
          <div class="msger-header-options">
            <span>{/* <i class="fas fa-cog"></i> */}</span>
          </div>
        </header>

        <main class="msger-chat">
          {messages.map((item) => (
            <div
              class={
                item.senderId._id === id ? 'msg right-msg' : 'msg left-msg'
              }
              key={item._id}
            >
              <div
                class="msg-img"
                style={{
                  backgroundImage:
                    "url('https://image.flaticon.com/icons/svg/145/145867.svg')",
                }}
              ></div>

              <div class="msg-bubble">
                <div class="msg-info">
                  <div class="msg-info-name">{item.senderId?.name}</div>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {item.createdAt && (
                      <div class="msg-info-time">
                        {formatDistanceToNow(new Date(item.createdAt), {
                          addSuffix: true,
                        })}
                      </div>
                    )}

                    {item.senderId._id === id && (
                      <AiFillDelete
                        onClick={() => handleRemove(item._id)}
                        style={{
                          marginLeft: '10px',
                          color: 'red',
                          cursor: 'pointer',
                        }}
                      />
                    )}
                  </div>
                </div>

                <div class="msg-text">{item.message}</div>
              </div>
            </div>
          ))}

          <div ref={divRef} />
        </main>

        <form class="msger-inputarea" onSubmit={handleSubmit}>
          <input
            type="text"
            class="msger-input"
            placeholder="Enter your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" class="msger-send-btn">
            Send
          </button>
        </form>
      </section>
    </div>
  );
};

export default AdminChatPage;
