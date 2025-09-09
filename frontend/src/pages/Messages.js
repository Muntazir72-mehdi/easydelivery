import React, { useEffect, useState } from 'react';

const Messages = () => {
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessageThreads();
  }, []);

  const fetchMessageThreads = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5003/api/messages/threads', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch message threads');
      }
      const data = await response.json();
      setThreads(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (otherUserId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5003/api/messages?otherUserId=${otherUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleThreadClick = (thread) => {
    setSelectedThread(thread);
    fetchMessages(thread.otherUser._id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5003/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: selectedThread.otherUser._id,
          content: newMessage,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      const sentMessage = await response.json();
      setMessages([...messages, sentMessage]);
      setNewMessage('');
      fetchMessageThreads(); // Refresh threads to update last message
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <p>Loading messages...</p>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-1/3 bg-white border-r">
        <h2 className="text-xl font-bold p-4 border-b">Messages</h2>
        <div className="overflow-y-auto h-full">
          {threads.length === 0 ? (
            <p className="p-4 text-gray-500">No messages yet.</p>
          ) : (
            threads.map((thread) => (
              <div
                key={thread._id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedThread && selectedThread._id === thread._id ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleThreadClick(thread)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{thread.otherUser.name}</p>
                    <p className="text-sm text-gray-600 truncate">
                      {thread.lastMessage.content}
                    </p>
                  </div>
                  {thread.unreadCount > 0 && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      {thread.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(thread.lastMessage.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedThread ? (
          <>
            <div className="bg-white p-4 border-b">
              <h3 className="font-semibold">{selectedThread.otherUser.name}</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`mb-4 ${
                    message.sender._id === JSON.parse(localStorage.getItem('user')).id
                      ? 'text-right'
                      : 'text-left'
                  }`}
                >
                  <div
                    className={`inline-block p-3 rounded-lg max-w-xs ${
                      message.sender._id === JSON.parse(localStorage.getItem('user')).id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs mt-1 opacity-75">
                      {new Date(message.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
              <div className="flex">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border rounded-l"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
                >
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
