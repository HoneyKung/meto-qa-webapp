import { useState, useEffect } from 'react'
import questionsData from './data/questions.json'
import './index.css'

function App() {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [started, setStarted] = useState(false)

  // Shuffle questions on load
  useEffect(() => {
    const shuffled = [...questionsData].sort(() => Math.random() - 0.5)
    setQuestions(shuffled)
  }, [])

  const currentQ = questions[currentIndex]

  const handleStart = () => setStarted(true)

  const handleNext = () => {
    setUserInput('')
    setEvaluation(null)
    setShowAnswer(false)
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      alert("จบการฝึกซ้อมครบทุกข้อแล้ว! เก่งมากครับ!")
      setCurrentIndex(0)
    }
  }

  const analyzeAnswer = () => {
    if (!userInput.trim()) return

    const inputLower = userInput.toLowerCase()
    let matchCount = 0
    const matchedKeywords = []
    const missingKeywords = []

    currentQ.keywords.forEach(kw => {
      const kwLower = kw.toLowerCase()
      if (inputLower.includes(kwLower)) {
        matchCount++
        matchedKeywords.push(kw)
      } else {
        missingKeywords.push(kw)
      }
    })

    const totalKeywords = currentQ.keywords.length
    const score = Math.round((matchCount / totalKeywords) * 100)

    let feedback = ""
    if (score >= 80) feedback = "ยอดเยี่ยม! ตอบได้ตรงประเด็นและครบถ้วน"
    else if (score >= 50) feedback = "ดีครับ แต่ยังขาดประเด็นสำคัญบางส่วนไป"
    else feedback = "ยังไม่ค่อยตรงประเด็น ลองดูแนวคำตอบนะครับ"

    setEvaluation({
      score,
      feedback,
      matchedKeywords,
      missingKeywords
    })
    setShowAnswer(true)
  }

  if (!started) {
    return (
      <div className="app-container">
        <div className="glass-card welcome-card">
          <div className="logo-placeholder">METO Q&A</div>
          <h1>ระบบฝึกซ้อมสัมภาษณ์โปรเจค</h1>
          <p>จำลองสถานการณ์ตอบคำถามสอบป้องกันโปรเจค (Defense) ด้วยคำถามจากสไลด์และรายงาน</p>
          <div className="stats">
            <div className="stat-item">
              <span className="stat-value">{questionsData.length}</span>
              <span className="stat-label">คำถามทั้งหมด</span>
            </div>
          </div>
          <button className="btn-primary" onClick={handleStart}>เริ่มการฝึกซ้อม</button>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">METO Defense</div>
        <div className="progress">
          ข้อที่ {currentIndex + 1} / {questions.length}
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="question-section">
          <div className="category-badge">
            {currentQ?.category === 'Slide' ? '📑 คำถามจากสไลด์' : '📝 คำถามจากรายงาน'}
          </div>
          <h2 className="question-text">{currentQ?.question}</h2>
        </div>

        <div className="answer-section">
          <textarea 
            className="user-input"
            placeholder="พิมพ์คำตอบของคุณที่นี่เหมือนเวลาอธิบายจริง..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={showAnswer}
          ></textarea>
          
          {!showAnswer ? (
            <div className="action-buttons">
              <button className="btn-secondary" onClick={() => setShowAnswer(true)}>นึกไม่ออก (ดูเฉลย)</button>
              <button className="btn-primary" onClick={analyzeAnswer}>ส่งคำตอบ</button>
            </div>
          ) : (
            <button className="btn-primary" onClick={handleNext}>ข้อถัดไป ➔</button>
          )}
        </div>

        {showAnswer && (
          <div className="result-section glass-card">
            {evaluation && (
              <div className="evaluation-box">
                <div className="score-circle" style={{ borderColor: evaluation.score >= 80 ? '#4CAF50' : evaluation.score >= 50 ? '#FFC107' : '#F44336' }}>
                  <span className="score-value">{evaluation.score}%</span>
                </div>
                <div className="eval-details">
                  <h3>{evaluation.feedback}</h3>
                  {evaluation.missingKeywords.length > 0 && (
                    <p className="keywords">
                      <strong>คีย์เวิร์ดที่ขาดไป:</strong> 
                      {evaluation.missingKeywords.map(k => <span key={k} className="kw-tag missing">{k}</span>)}
                    </p>
                  )}
                  {evaluation.matchedKeywords.length > 0 && (
                    <p className="keywords">
                      <strong>คีย์เวิร์ดที่ตอบโดน:</strong> 
                      {evaluation.matchedKeywords.map(k => <span key={k} className="kw-tag matched">{k}</span>)}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="model-answer">
              <h3>💡 แนวคำตอบที่แนะนำ:</h3>
              <p>{currentQ?.modelAnswer}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
