import { useEffect, useMemo, useState } from "react";
import { generateSpeech, getVoices } from "./services/api";

const MAX_CHARACTERS = 500;

export default function App() {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState([]);
  const [language, setLanguage] = useState("");
  const [voice, setVoice] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getVoices()
      .then((items) => {
        setVoices(items);
        setLanguage(items[0]?.language || "");
      })
      .catch(() => setError("Could not load voices. Make sure the backend server is running."));
  }, []);

  const languages = useMemo(
    () => [...new Set(voices.map((item) => item.language))],
    [voices]
  );

  const availableVoices = useMemo(
    () => voices.filter((item) => item.language === language),
    [voices, language]
  );

  useEffect(() => {
    if (availableVoices.length) setVoice(availableVoices[0].name);
  }, [availableVoices]);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  function handleLanguageChange(event) {
    setLanguage(event.target.value);
    setAudioUrl("");
  }

  async function handleGenerate(event) {
    event.preventEventDefault?.();
    event.preventDefault();
    setError("");
    setAudioUrl("");
    setTranslatedText("");

    if (!text.trim()) {
      setError("Please enter text to convert.");
      return;
    }
    if (text.length > MAX_CHARACTERS) {
      setError(`Text must be ${MAX_CHARACTERS} characters or fewer.`);
      return;
    }

    setLoading(true);
    try {
      const result = await generateSpeech({ text: text.trim(), language, voice });
      setAudioUrl(result.audioUrl);
      setTranslatedText(result.translatedText || "");
    } catch (requestError) {
      const message = requestError.response?.data?.error;
      setError(message || "Could not generate speech. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setText("");
    setAudioUrl("");
    setTranslatedText("");
    setError("");
  }

  return (
    <main className="page">
      <section className="card">
        <header className="header">
          <div className="logo" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 15.5a3.5 3.5 0 0 0 3.5-3.5V6A3.5 3.5 0 1 0 8.5 6v6a3.5 3.5 0 0 0 3.5 3.5Zm-5-3.5H5a7 7 0 0 0 14 0h-2a5 5 0 0 1-10 0Zm4 6.5h2V22h-2v-3.5Z" />
            </svg>
          </div>
          <div>
            <h1>Text to Speech</h1>
            <p>Turn your words into natural audio</p>
          </div>
        </header>

        <form onSubmit={handleGenerate}>
          <div className="field-heading">
            <label htmlFor="text">Enter your text</label>
            <button type="button" className="clear-button" onClick={handleClear}>Clear</button>
          </div>
          <textarea
            id="text"
            value={text}
            maxLength={MAX_CHARACTERS}
            onChange={(event) => setText(event.target.value)}
            placeholder="Type or paste something here..."
            aria-describedby="text-count"
          />
          <div className="counts" id="text-count">
            <span>{wordCount} words</span>
            <span className={text.length >= MAX_CHARACTERS ? "limit" : ""}>
              {text.length}/{MAX_CHARACTERS} characters
            </span>
          </div>

          <div className="selectors">
            <div className="field">
              <label htmlFor="language">Language</label>
              <select id="language" value={language} onChange={handleLanguageChange}>
                {languages.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="voice">Voice</label>
              <select id="voice" value={voice} onChange={(event) => setVoice(event.target.value)}>
                {availableVoices.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.displayName} ({item.gender})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && <div className="error" role="alert">{error}</div>}

          <button className="generate" type="submit" disabled={loading || !text.trim()}>
            {loading ? <span className="spinner" /> : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 15.5a3.5 3.5 0 0 0 3.5-3.5V6A3.5 3.5 0 1 0 8.5 6v6a3.5 3.5 0 0 0 3.5 3.5Zm-5-3.5H5a7 7 0 0 0 14 0h-2a5 5 0 0 1-10 0Z" />
              </svg>
            )}
            {loading ? "Generating..." : "Generate Speech"}
          </button>
        </form>

        {audioUrl && (
          <div className="audio-section">
            {translatedText && (
              <div className="translated-text">
                <h2>Translated Text</h2>
                <p>{translatedText}</p>
              </div>
            )}
            <div className="audio-heading">
              <h2>Generated Audio</h2>
              <a className="download" href={audioUrl} download>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M11 3h2v10l3.5-3.5 1.4 1.4-5.9 5.9-5.9-5.9 1.4-1.4L11 13V3Zm-6 16h14v2H5v-2Z" />
                </svg>
                Download MP3
              </a>
            </div>
            <audio controls src={audioUrl}>
              Your browser does not support audio playback.
            </audio>
          </div>
        )}
      </section>
    </main>
  );
}
