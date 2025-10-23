import React, { useState } from 'react';
import { Lightbulb, TrendingUp, MapPin, Globe, DollarSign, Clock, Target, Zap, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

const IdeaForge = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [formData, setFormData] = useState({
    background: '',
    capital: '',
    lifestyle: '',
    risk: 'Medium',
    timeCommitment: '',
    businessModels: '',
    profitRange: '',
    timeline: '',
    geographic: '',
    longTerm: '',
    notes: ''
  });
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const questions = [
    {
      id: 'background',
      question: 'What are your background & skills?',
      subtitle: 'List your experience, expertise, or professional background',
      placeholder: 'e.g., sales, marketing, SaaS, design, finance, fitness, software development',
      type: 'textarea',
      icon: <Target className="w-6 h-6" />
    },
    {
      id: 'capital',
      question: 'What is your available capital/budget?',
      subtitle: 'How much can you invest to start this business?',
      placeholder: 'e.g., $25K, $100K, or minimal startup cost',
      type: 'text',
      icon: <DollarSign className="w-6 h-6" />
    },
    {
      id: 'lifestyle',
      question: 'What are your lifestyle goals?',
      subtitle: 'What kind of work-life balance are you seeking?',
      placeholder: 'e.g., remote freedom, creative fulfillment, semi-passive income',
      type: 'textarea',
      icon: <Globe className="w-6 h-6" />
    },
    {
      id: 'risk',
      question: 'What is your risk tolerance?',
      subtitle: 'How comfortable are you with business uncertainty?',
      type: 'select',
      options: ['Low', 'Medium', 'High'],
      icon: <TrendingUp className="w-6 h-6" />
    },
    {
      id: 'timeCommitment',
      question: 'How much time can you commit?',
      subtitle: 'Weekly hours you can dedicate to this business',
      placeholder: 'e.g., 10 hrs/week, full-time operator, weekends only',
      type: 'text',
      icon: <Clock className="w-6 h-6" />
    },
    {
      id: 'businessModels',
      question: 'What business models interest you?',
      subtitle: 'Select or describe your preferred approach',
      placeholder: 'e.g., SaaS, e-commerce, agency, local service, consulting',
      type: 'textarea',
      icon: <Lightbulb className="w-6 h-6" />
    },
    {
      id: 'profitRange',
      question: 'What is your desired profit range?',
      subtitle: 'Target monthly or annual income goal',
      placeholder: 'e.g., $10K/month or $250K/year',
      type: 'text',
      icon: <DollarSign className="w-6 h-6" />
    },
    {
      id: 'timeline',
      question: 'What is your timeline to launch?',
      subtitle: 'How soon do you want to get started?',
      placeholder: 'e.g., 3 months, 6 months, 1 year',
      type: 'text',
      icon: <Zap className="w-6 h-6" />
    },
    {
      id: 'geographic',
      question: 'Any geographic constraints?',
      subtitle: 'Where can/do you want to operate?',
      placeholder: 'e.g., global, regional, location-bound, remote only',
      type: 'text',
      icon: <MapPin className="w-6 h-6" />
    },
    {
      id: 'longTerm',
      question: 'What is your long-term goal?',
      subtitle: 'What are you ultimately building toward?',
      placeholder: 'e.g., build and sell, lifestyle income, replace job income',
      type: 'textarea',
      icon: <Target className="w-6 h-6" />
    },
    {
      id: 'notes',
      question: 'Any other notes or unique advantages?',
      subtitle: 'Network, expertise, niche interests, or other context',
      placeholder: 'e.g., I have connections in healthcare, passionate about sustainability',
      type: 'textarea',
      icon: <Sparkles className="w-6 h-6" />
    }
  ];

  const handleInputChange = (value) => {
    const currentQuestion = questions[currentStep];
    setFormData(prev => ({ ...prev, [currentQuestion.id]: value }));
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateIdeas();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateIdeas = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const prompt = `Act as an experienced business strategist, investor, and startup advisor. Generate 10 tailored business ideas aligned with the following profile:

Background/Skills: ${formData.background}
Available Capital: ${formData.capital}
Lifestyle Goals: ${formData.lifestyle}
Risk Tolerance: ${formData.risk}
Time Commitment: ${formData.timeCommitment}
Preferred Business Models: ${formData.businessModels}
Desired Profit Range: ${formData.profitRange}
Timeline to Launch: ${formData.timeline}
Geographic Constraints: ${formData.geographic}
Long-Term Goal: ${formData.longTerm}
Additional Notes: ${formData.notes}

Generate 10 unique business ideas: 5 location-independent and 5 location-based.

For each idea, provide ONLY valid JSON in this exact format (no additional text or markdown):
{
  "ideas": [
    {
      "type": "remote",
      "name": "Business Name",
      "summary": "One-sentence summary",
      "model": "Revenue model description",
      "difficulty": "Low/Medium/High",
      "startupCost": "$X,XXX-$X,XXX",
      "profitRange": "$X-$X/month (12-24 mo)",
      "scalability": 7,
      "fit": "Why this fits their profile",
      "steps": ["Step 1", "Step 2", "Step 3", "Step 4"]
    }
  ],
  "topRecommendations": {
    "bestOverall": "Business Name",
    "bestOverallReason": "Why it's the best fit",
    "highestProfit": "Business Name", 
    "highestProfitReason": "Why it has highest profit potential",
    "fastestLaunch": "Business Name",
    "fastestLaunchReason": "Why it's fastest to launch"
  }
}

CRITICAL: Return ONLY the JSON object, no markdown code blocks, no explanations. First 5 ideas should have "type": "remote", last 5 should have "type": "local".`;

      const response = await fetch("/api/generate-ideas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      let responseText = data.content[0].text;
      
      // Clean up response - remove markdown code blocks if present
      responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      
      const parsedData = JSON.parse(responseText);
      
      setIdeas(parsedData.ideas);
      setShowResults(true);
      
    } catch (err) {
      console.error("Error generating ideas:", err);
      setError("Failed to generate ideas. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const progress = ((currentStep + 1) / questions.length) * 100;
  const currentQ = questions[currentStep];
  const currentValue = formData[currentQ.id];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            <Sparkles className="absolute inset-0 m-auto w-10 h-10 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Generating Your Ideas...</h2>
          <p className="text-gray-600">AI is analyzing your profile and creating personalized business opportunities</p>
          <p className="text-sm text-gray-500 mt-2">This may take 30-60 seconds...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setShowResults(false);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    const remoteIdeas = ideas.filter(i => i.type === 'remote');
    const localIdeas = ideas.filter(i => i.type === 'local');

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Personalized Business Ideas</h1>
            <p className="text-xl text-gray-600">10 tailored opportunities based on your unique profile</p>
          </div>

          {/* Remote Ideas */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-8 h-8 text-indigo-600" />
              <h2 className="text-3xl font-bold text-gray-900">Location-Independent Businesses</h2>
            </div>
            <div className="grid gap-6">
              {remoteIdeas.map((idea, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-600 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{idea.name}</h3>
                      <p className="text-gray-600 text-lg">{idea.summary}</p>
                    </div>
                    <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ml-4">
                      Scalability: {idea.scalability}/10
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Revenue Model</p>
                      <p className="font-semibold text-gray-900">{idea.model}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Startup Cost</p>
                      <p className="font-semibold text-gray-900">{idea.startupCost}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Expected Profit Range</p>
                      <p className="font-semibold text-gray-900">{idea.profitRange}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Difficulty</p>
                      <p className="font-semibold text-gray-900">{idea.difficulty}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Why It Fits Your Profile:</p>
                    <p className="text-gray-600">{idea.fit}</p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Key Success Steps:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      {idea.steps.map((step, i) => (
                        <li key={i} className="text-gray-600">{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Local Ideas */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-8 h-8 text-purple-600" />
              <h2 className="text-3xl font-bold text-gray-900">Location-Based Businesses</h2>
            </div>
            <div className="grid gap-6">
              {localIdeas.map((idea, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{idea.name}</h3>
                      <p className="text-gray-600 text-lg">{idea.summary}</p>
                    </div>
                    <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ml-4">
                      Scalability: {idea.scalability}/10
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Revenue Model</p>
                      <p className="font-semibold text-gray-900">{idea.model}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Startup Cost</p>
                      <p className="font-semibold text-gray-900">{idea.startupCost}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Expected Profit Range</p>
                      <p className="font-semibold text-gray-900">{idea.profitRange}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Difficulty</p>
                      <p className="font-semibold text-gray-900">{idea.difficulty}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Why It Fits Your Profile:</p>
                    <p className="text-gray-600">{idea.fit}</p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Key Success Steps:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      {idea.steps.map((step, i) => (
                        <li key={i} className="text-gray-600">{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Recommendation */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-4">Strategic Recommendation</h2>
            <div className="space-y-4">
              <p className="text-lg">Based on your unique profile, here are the top 3 ideas to prioritize:</p>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <p className="font-bold text-xl mb-2">🥇 Best Overall Fit: {remoteIdeas[0]?.name || 'AI-Generated Recommendation'}</p>
                <p>This idea combines the optimal balance of your skills, resources, and goals.</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <p className="font-bold text-xl mb-2">🥈 Highest Profit Potential: {remoteIdeas[1]?.name || 'AI-Generated Recommendation'}</p>
                <p>Maximum long-term revenue and scaling opportunity based on your profile.</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <p className="font-bold text-xl mb-2">🥉 Fastest to Launch: {remoteIdeas[3]?.name || localIdeas[0]?.name}</p>
                <p>Quickest path to revenue with your available resources and timeline.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button 
              onClick={() => {
                setShowResults(false);
                setCurrentStep(0);
                setIdeas([]);
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Start New Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-600">
              Question {currentStep + 1} of {questions.length}
            </span>
            <span className="text-sm font-semibold text-indigo-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-indigo-100 p-3 rounded-lg text-indigo-600 flex-shrink-0">
              {currentQ.icon}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {currentQ.question}
              </h2>
              <p className="text-gray-600">{currentQ.subtitle}</p>
            </div>
          </div>

          {/* Input Field */}
          <div className="mb-8">
            {currentQ.type === 'textarea' ? (
              <textarea
                value={currentValue}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={currentQ.placeholder}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors min-h-32 text-lg"
              />
            ) : currentQ.type === 'select' ? (
              <select
                value={currentValue}
                onChange={(e) => handleInputChange(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors text-lg"
              >
                {currentQ.options.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={currentValue}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={currentQ.placeholder}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors text-lg"
              />
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            {currentStep > 0 && (
              <button
                onClick={prevStep}
                className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
            )}
            <button
              onClick={nextStep}
              disabled={!currentValue}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === questions.length - 1 ? (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate My Ideas
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Brand Footer */}
        <div className="text-center mt-8">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Lightbulb className="w-5 h-5" />
            <span className="font-bold text-lg">IdeaForge</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">AI-Powered Business Idea Generator</p>
        </div>
      </div>
    </div>
  );
};

export default IdeaForge;
