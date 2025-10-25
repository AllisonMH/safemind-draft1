'use client';

import { useState } from 'react';
import { analyzeMessage, analyzeConversation, type AnalysisResult, type ConversationAnalysis } from '@/lib/api-client';
import RiskLevelBadge from '@/components/RiskLevelBadge';
import AlertCard from '@/components/AlertCard';

export default function Dashboard() {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<string[]>(['']);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [conversationAnalysis, setConversationAnalysis] = useState<ConversationAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'single' | 'conversation'>('single');

  const handleAnalyzeSingle = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzeMessage(text);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeConversation = async () => {
    const validMessages = messages.filter(m => m.trim());
    if (validMessages.length === 0) return;

    setLoading(true);
    setError(null);
    setConversationAnalysis(null);

    try {
      const result = await analyzeConversation(validMessages);
      setConversationAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const addMessage = () => {
    setMessages([...messages, '']);
  };

  const updateMessage = (index: number, value: string) => {
    const newMessages = [...messages];
    newMessages[index] = value;
    setMessages(newMessages);
  };

  const removeMessage = (index: number) => {
    setMessages(messages.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">SafeMind Dashboard</h1>
              <p className="text-gray-600 mt-1">AI Safety Monitoring & Analysis</p>
            </div>
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  mode === 'single'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setMode('single')}
              >
                Single Message
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  mode === 'conversation'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setMode('conversation')}
              >
                Conversation
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6">
            <AlertCard
              type="error"
              title="Error"
              message={error}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">
                {mode === 'single' ? 'Analyze Message' : 'Analyze Conversation'}
              </h2>

              {mode === 'single' ? (
                <div>
                  <textarea
                    className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={8}
                    placeholder="Enter text to analyze for safety concerns..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <button
                    className="mt-4 w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    onClick={handleAnalyzeSingle}
                    disabled={loading || !text.trim()}
                  >
                    {loading ? 'Analyzing...' : 'Analyze Message'}
                  </button>
                </div>
              ) : (
                <div>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {messages.map((msg, index) => (
                      <div key={index} className="flex gap-2">
                        <textarea
                          className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                          placeholder={`Message ${index + 1}...`}
                          value={msg}
                          onChange={(e) => updateMessage(index, e.target.value)}
                        />
                        {messages.length > 1 && (
                          <button
                            className="px-3 py-1 text-red-600 hover:bg-red-50 rounded"
                            onClick={() => removeMessage(index)}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300"
                      onClick={addMessage}
                    >
                      + Add Message
                    </button>
                    <button
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      onClick={handleAnalyzeConversation}
                      disabled={loading || messages.filter(m => m.trim()).length === 0}
                    >
                      {loading ? 'Analyzing...' : 'Analyze Conversation'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Examples */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">💡 Quick Test Examples</h3>
              <div className="space-y-2 text-sm">
                <button
                  className="block w-full text-left p-2 hover:bg-blue-100 rounded"
                  onClick={() => setText("I'm feeling really depressed and hopeless")}
                >
                  Mental health concern
                </button>
                <button
                  className="block w-full text-left p-2 hover:bg-blue-100 rounded"
                  onClick={() => setText("You're such an idiot, I hate you")}
                >
                  Toxic language
                </button>
                <button
                  className="block w-full text-left p-2 hover:bg-blue-100 rounded"
                  onClick={() => setText("I'm having a great day and feeling positive!")}
                >
                  Positive message (low risk)
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div>
            {analysis && mode === 'single' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Risk Level</label>
                    <div className="mt-2">
                      <RiskLevelBadge level={analysis.riskLevel} score={analysis.riskScore} />
                    </div>
                  </div>

                  {analysis.flags && Object.values(analysis.flags).some(v => v) && (
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-2 block">Detected Concerns</label>
                      <div className="flex flex-wrap gap-2">
                        {analysis.flags.selfHarm && (
                          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                            Self-Harm
                          </span>
                        )}
                        {analysis.flags.violence && (
                          <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                            Violence
                          </span>
                        )}
                        {analysis.flags.toxicity && (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                            Toxicity
                          </span>
                        )}
                        {analysis.flags.hate && (
                          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                            Hate Speech
                          </span>
                        )}
                        {analysis.flags.sexual && (
                          <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-medium">
                            Sexual Content
                          </span>
                        )}
                        {analysis.flags.mentalHealthConcern && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            Mental Health
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {analysis.requiresAlert && (
                    <AlertCard
                      type="error"
                      title="Alert Required"
                      message="This message has been flagged as requiring immediate attention."
                      actions={analysis.suggestedActions}
                    />
                  )}

                  {!analysis.requiresAlert && analysis.suggestedActions.length > 0 && (
                    <AlertCard
                      type="info"
                      title="Recommendations"
                      message="Consider the following actions:"
                      actions={analysis.suggestedActions}
                    />
                  )}
                </div>
              </div>
            )}

            {conversationAnalysis && mode === 'conversation' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Conversation Analysis</h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Overall Risk</label>
                    <div className="mt-2">
                      <RiskLevelBadge
                        level={conversationAnalysis.overallRiskLevel}
                        score={conversationAnalysis.overallRiskScore}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">Messages Analyzed</div>
                      <div className="text-2xl font-bold text-gray-900">{conversationAnalysis.messageCount}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">Critical Messages</div>
                      <div className="text-2xl font-bold text-red-600">{conversationAnalysis.criticalMessages.length}</div>
                    </div>
                  </div>

                  {conversationAnalysis.isEscalating && (
                    <AlertCard
                      type="warning"
                      title="Escalation Detected"
                      message="The conversation shows signs of increasing risk over time."
                    />
                  )}

                  {conversationAnalysis.sentimentTrend === 'declining' && (
                    <AlertCard
                      type="warning"
                      title="Declining Sentiment"
                      message="The overall sentiment in this conversation is becoming more negative."
                    />
                  )}

                  {conversationAnalysis.recommendations.length > 0 && (
                    <AlertCard
                      type="info"
                      title="Recommendations"
                      message="Based on the conversation analysis:"
                      actions={conversationAnalysis.recommendations}
                    />
                  )}
                </div>
              </div>
            )}

            {!analysis && !conversationAnalysis && (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
                <div className="text-6xl mb-4">🔍</div>
                <p>No analysis yet. Enter some text and click analyze to see results.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
