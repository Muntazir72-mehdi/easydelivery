import React, { useState, useEffect } from 'react';

const AISmartMatch = ({ userId, token }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userId && token) {
      fetchSmartMatches();
    }
  }, [userId, token]);

  const fetchSmartMatches = async () => {
    setLoadingMatches(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5003/api/ai/smart-match', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch smart matches');
      }
      const data = await response.json();
      setMatches(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMatches(false);
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoadingAnswer(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5003/api/ai/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question }),
      });
      if (!response.ok) {
        throw new Error('Failed to get AI answer');
      }
      const data = await response.json();
      setAnswer(data.answer);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingAnswer(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl shadow-lg mt-6 border border-blue-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
        <span className="mr-2">🤖</span> AI Smart Match & Assistant
      </h2>

      <div className="mb-6">
        <h3 className="font-semibold mb-3 text-gray-700 flex items-center">
          <span className="mr-2">🎯</span> Smart Match Suggestions
        </h3>
        {loadingMatches ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Loading matches...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 font-medium">⚠️ {error}</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-600">No smart matches found at the moment.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-64 overflow-auto">
            {matches.map((match, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{match.deliveryRequest.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      📍 {match.deliveryRequest.from} → {match.deliveryRequest.to}
                    </p>
                    <div className="bg-green-50 border border-green-200 rounded p-2">
                      <p className="text-sm text-green-700 font-medium">
                        🚗 Matched Trip: {match.travelerTrip.from} → {match.travelerTrip.to}
                      </p>
                      <p className="text-xs text-green-600">
                        📅 {new Date(match.travelerTrip.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleAskQuestion} className="mb-6">
        <label htmlFor="question" className="block font-semibold mb-2 text-gray-700 flex items-center">
          <span className="mr-2">💬</span> Ask AI a question about your trip or the app:
        </label>
        <div className="flex space-x-2">
          <input
            id="question"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Type your question here..."
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            disabled={loadingAnswer}
          >
            {loadingAnswer ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <span>🤖</span>
                <span>Ask</span>
              </>
            )}
          </button>
        </div>
      </form>

      {answer && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
          <h4 className="font-semibold mb-2 text-gray-800 flex items-center">
            <span className="mr-2">✨</span> AI Answer:
          </h4>
          <p className="text-gray-700 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default AISmartMatch;
