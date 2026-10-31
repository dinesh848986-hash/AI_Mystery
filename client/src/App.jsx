import { useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, BadgeCheck, BookOpen, Check, CircleDot, Clock3, Fingerprint, Lightbulb, LoaderCircle, LockKeyhole, MapPin, RotateCcw, Search, Shield, Sparkles, Target, Trophy, X } from 'lucide-react';
import { api } from './services/api.js';

const IconBall = CircleDot;

function Brand({ onClick }) {
  return <button className="brand" onClick={onClick} aria-label="AI Mystery Room home"><span className="brand-mark"><IconBall size={17} strokeWidth={1.8} /></span><span>AI MYSTERY ROOM<span className="brand-sub">CRICKET INVESTIGATION</span></span></button>;
}

function Header({ onHome, view }) {
  return <header className="topbar"><Brand onClick={onHome} /><div className="top-right"><span className="live-dot" />{view === 'game' ? 'INVESTIGATION IN PROGRESS' : 'A GAME OF CRICKET & CURIOSITY'}<span className="top-index">EST. 2025 <span>·</span> VOL. 01</span></div></header>;
}

function ErrorNotice({ message, onClose }) {
  if (!message) return null;
  return <div className="error-notice" role="alert"><span>{message}</span><button onClick={onClose} aria-label="Dismiss error"><X size={17} /></button></div>;
}

function Home({ onStart, loading, error, clearError }) {
  const [difficulty, setDifficulty] = useState('medium');
  const [format, setFormat] = useState('T20');
  return <>
    <Header onHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })} view="home" />
    <main>
      <section className="hero wrap">
        <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line" />THE GAME IS NEVER JUST THE GAME</div>
          <h1>Every match<br />leaves <em>a story.</em></h1>
          <p className="hero-desc">A close call. Three different stories. One truth hiding in the scorebook. Step into the room and find out what really happened.</p>
          <div className="hero-cta"><button className="button button-primary" onClick={() => onStart({ difficulty, format })} disabled={loading}>{loading ? <LoaderCircle className="spin" size={17} /> : <Search size={17} />}{loading ? 'Preparing your case…' : 'Open a new case'}{!loading && <ArrowRight size={17} />}</button><span className="cta-note"><LockKeyhole size={13} /> The truth stays sealed until your final call</span></div>
          <ErrorNotice message={error} onClose={clearError} />
        </div>
        <div className="hero-art" aria-label="A shadowy cricket ground at night">
          <div className="art-glow" /><div className="art-stamp">CASE FILE <b>001</b><span>NOT YET SOLVED</span></div>
          <div className="stadium"><div className="stadium-lights"><i/><i/><i/><i/></div><div className="stands"/><div className="field-ring"/><div className="pitch"><i/><i/><b/><b/></div><div className="field-spot"/><div className="boundary-line"/></div>
          <div className="art-caption"><span>THE HARBOR CUP · FINAL OVER</span><span>01—03</span></div>
        </div>
        <div className="hero-bottom"><span>YOUR CASE BEGINS WITH A QUESTION</span><ArrowDown size={16}/></div>
      </section>
      <section className="case-setup wrap" id="start"><div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line"/>BEFORE YOU ENTER</div><h2>Set the scene.</h2></div><p>Pick a format and level.<br/>The evidence is waiting.</p></div>
        <div className="setup-grid"><div className="setup-card"><div className="setup-label">01 <span>·</span> MATCH FORMAT</div><div className="choice-row">{['T20','ODI','Test'].map((item) => <button key={item} className={`choice ${format === item ? 'choice-active' : ''}`} onClick={() => setFormat(item)}>{item}{format === item && <Check size={13}/>}</button>)}</div><p>Every format tells a different kind of story.</p></div>
          <div className="setup-card"><div className="setup-label">02 <span>·</span> CASE DIFFICULTY</div><div className="choice-row">{['easy','medium','hard'].map((item) => <button key={item} className={`choice ${difficulty === item ? 'choice-active' : ''}`} onClick={() => setDifficulty(item)}>{item[0].toUpperCase()+item.slice(1)}{difficulty === item && <Check size={13}/>}</button>)}</div><p>How sharp is your eye for detail?</p></div>
          <button className="case-card" onClick={() => onStart({ difficulty, format })} disabled={loading}><span className="case-icon"><Fingerprint size={20}/></span><span className="case-meta">YOUR NEXT INVESTIGATION</span><strong>{loading ? 'Opening the case…' : 'The fictional case file'}</strong><span className="case-bottom">GENERATED FOR YOU <ArrowRight size={15}/></span></button>
        </div>
      </section>
      <section className="how wrap"><div className="how-title"><div className="eyebrow"><span className="eyebrow-line"/>A GOOD EYE BEATS A GOOD GUESS</div><h2>Read the game<br/>between the lines.</h2></div><div className="steps"><div className="step"><span>01</span><div><Search size={18}/><h3>Read the room</h3><p>Get the match context, the incident, and the people involved.</p></div></div><div className="step"><span>02</span><div><BookOpen size={18}/><h3>Follow the evidence</h3><p>Compare the accounts. Check the details. Ask for a hint if you need one.</p></div></div><div className="step"><span>03</span><div><Target size={18}/><h3>Make your call</h3><p>Choose carefully. You get one final answer per case.</p></div></div></div></section>
      <section className="archive wrap"><div className="archive-card"><div className="archive-mark"><Clock3 size={18}/></div><div><div className="eyebrow">THE ARCHIVES <span className="archive-tag">VERIFIED CASE</span></div><h2>Real matches.<br/><em>One true story.</em></h2><p>Investigate MS Dhoni’s run out in the 2019 World Cup semi-final. This historical case uses a verified scorecard; the match facts are not AI-generated.</p><button className="button button-quiet history-button" onClick={() => onStart({type:'historical',difficulty:'easy',format:'ODI'})} disabled={loading}>{loading?<LoaderCircle className="spin" size={15}/>:<Clock3 size={15}/>}Open the verified case <ArrowRight size={15}/></button></div><div className="archive-lock"><Shield size={20}/><span>FACTS FIRST</span></div></div></section>
    </main><Footer />
  </>;
}

function Footer() { return <footer className="footer wrap"><Brand onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}/><span>CRICKET IS A GAME OF MOMENTS. THIS IS A GAME OF QUESTIONS.</span><span>© LAST OVER</span></footer>; }

function Investigation({ mystery, token, onResult, error, setError }) {
  const [selected, setSelected] = useState('');
  const [hints, setHints] = useState([]);
  const [busy, setBusy] = useState(false);
  const askHint = async () => { setBusy(true); setError(''); try { const result = await api.getHint(token); setHints((current) => [...current, result.hint]); } catch (err) { setError(err.message); } finally { setBusy(false); } };
  const submit = async () => { setBusy(true); setError(''); try { onResult(await api.submitAnswer(token, selected)); } catch (err) { setError(err.message); setBusy(false); } };
  return <><Header onHome={() => window.location.reload()} view="game"/><main className="game-page wrap"><div className="breadcrumb"><button onClick={() => window.location.reload()}><ArrowLeft size={14}/> ALL CASES</button><span>/</span><span>INVESTIGATION ROOM</span><span className="case-number">CASE {String(mystery.mysteryId).slice(-4).toUpperCase()}</span></div>
    <div className="game-title"><div><div className="eyebrow"><span className="eyebrow-line"/>{mystery.type.toUpperCase()} CASE <span className="dot-sep">·</span> {mystery.format} <span className="dot-sep">·</span> {mystery.difficulty.toUpperCase()}</div><h1>{mystery.title}</h1></div><div className="case-stamp"><span>YOUR INVESTIGATION</span><strong>IN PROGRESS</strong></div></div>
    <ErrorNotice message={error} onClose={() => setError('')}/>
    <div className="game-layout"><div className="main-investigation"><section className="incident-panel"><div className="panel-label"><span><MapPin size={14}/> THE INCIDENT</span><span>FIELD NOTES · 01</span></div><p>{mystery.scenario}</p></section>
      <section className="evidence-section"><div className="panel-heading"><div><div className="eyebrow">THE PAPER TRAIL</div><h2>Evidence on record <span className="count">{String(mystery.evidence.length).padStart(2,'0')}</span></h2></div><span className="panel-meta"><LockKeyhole size={12}/> ALL CLUES RELEASED</span></div><div className="evidence-grid">{mystery.evidence.map((item, index) => <article className="evidence-card" key={item.id}><div className="evidence-top"><span className="evidence-index">EVIDENCE {String(index+1).padStart(2,'0')}</span><span className="evidence-type">{item.type.toUpperCase()}</span></div><h3>{item.title}</h3><p>{item.content}</p><div className="paper-line"/></article>)}</div></section>
      <section className="hint-panel"><div className="hint-icon"><Lightbulb size={17}/></div><div className="hint-content"><div className="hint-heading">Need another angle? <span>{3-hints.length} HINTS LEFT</span></div>{hints.length > 0 ? <div className="hint-list">{hints.map((hint,i) => <p key={i}><span>HINT 0{i+1}</span>{hint}</p>)}</div> : <p>Hints reveal a little more each time — and lower your score.</p>}</div><button className="button button-quiet" disabled={busy || hints.length >= 3} onClick={askHint}>{busy ? <LoaderCircle className="spin" size={15}/> : <Sparkles size={15}/>}Get a hint</button></section>
    </div><aside className="suspect-panel"><div className="panel-label"><span><Fingerprint size={14}/> PERSONS OF INTEREST</span><span>{mystery.suspects.length} ON FILE</span></div><h2>Who had a hand in it?</h2><p className="suspect-intro">Consider each account. Choose the player whose story doesn't add up.</p><div className="suspect-list">{mystery.suspects.map((suspect,index) => <button key={suspect.id} className={`suspect-card ${selected===suspect.id?'suspect-selected':''}`} onClick={() => setSelected(suspect.id)}><span className="suspect-num">0{index+1}</span><span className="suspect-info"><strong>{suspect.name}</strong><span>{suspect.role}</span><small>{suspect.profile}</small></span><span className="radio-dot">{selected===suspect.id && <i/>}</span></button>)}</div><div className="decision-box"><div className="decision-note"><BadgeCheck size={15}/><span>ONE ANSWER. NO TAKEBACKS.</span></div><button className="button button-primary submit-button" disabled={!selected||busy} onClick={submit}>{busy ? <LoaderCircle className="spin" size={16}/> : <>Make the call <ArrowRight size={16}/></>}</button><p>Your investigation is saved as you go.</p></div></aside></div>
    <div className="game-disclaimer"><Shield size={14}/>{mystery.type==='fictional'?'This is a fictional case. All players, teams and events are invented.':'Historical facts are based on the official PCB match scorecard.'}</div>
  </main><Footer/></>;
}

function Results({ result, mystery, onReplay }) {
  return <><Header onHome={onReplay} view="results"/><main className="results-page wrap"><div className="breadcrumb"><span>CASE CLOSED</span><span>/</span><span>YOUR FINDINGS</span></div><div className={`result-hero ${result.correct?'result-correct':'result-incorrect'}`}><div className="result-symbol">{result.correct?<BadgeCheck size={29}/>:<Fingerprint size={29}/>}</div><div className="eyebrow"><span className="eyebrow-line"/>THE VERDICT IS IN</div><h1>{result.correct?<>Well read.<br/><em>You found the truth.</em></>:<>Not quite.<br/><em>Here’s what happened.</em></>}</h1><p>{result.correct?'You followed the evidence and made the right call.':'Every good investigation teaches you something. Here’s how the clues fit together.'}</p></div><div className="result-grid"><section className="reveal-card"><div className="eyebrow">THE PLAYER RESPONSIBLE</div><h2>{result.correctAnswer.name}</h2><span className="role-pill">{mystery.suspects.find(s=>s.id===result.correctAnswer.id)?.role || 'Player'}</span><div className="reveal-rule"/><p>{result.explanation}</p>{result.sourceUrl&&<a className="source-link" href={result.sourceUrl} target="_blank" rel="noreferrer">View the official match scorecard <ArrowRight size={13}/></a>}</section><section className="score-card"><Trophy size={20}/><span className="score-label">YOUR CASE SCORE</span><strong>{result.score}<small> / 100</small></strong><span className="score-note">{result.correct?(result.score===100?'Clean read. No hints needed.':`${(100-result.score)/20} hints used — deductions applied.`):'The answer was a tough one.'}</span></section></div><section className="result-evidence"><div className="eyebrow">THE CLUES, IN HINDSIGHT</div><h2>What the evidence showed.</h2><div className="result-clues">{result.evidence.map((item,index)=><article key={item.id}><span>0{index+1}</span><div><h3>{item.title}</h3><p>{item.content}</p></div><Check size={15}/></article>)}</div></section><button className="button button-primary replay-button" onClick={onReplay}><RotateCcw size={16}/>Open another case <ArrowRight size={16}/></button></main><Footer/></>;
}

export default function App() {
  const [view, setView] = useState('home');
  const [loading, setLoading] = useState(false);
  const [mystery, setMystery] = useState(null);
  const [token, setToken] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const start = async (options) => {
    setLoading(true); setError('');
    try { const newMystery = await api.createMystery(options); const session = await api.createSession(newMystery.mysteryId); setMystery(newMystery); setToken(session.sessionToken); setView('game'); window.scrollTo(0,0); }
    catch (err) { setError(err.message); window.scrollTo({top:0,behavior:'smooth'}); }
    finally { setLoading(false); }
  };
  const replay = () => { setView('home'); setMystery(null); setToken(''); setResult(null); setError(''); window.scrollTo(0,0); };
  if (view === 'game' && mystery) return <Investigation mystery={mystery} token={token} onResult={(answer) => { setResult(answer); setView('results'); window.scrollTo(0,0); }} error={error} setError={setError}/>;
  if (view === 'results' && result && mystery) return <Results result={result} mystery={mystery} onReplay={replay}/>;
  return <Home onStart={start} loading={loading} error={error} clearError={() => setError('')}/>;
}
