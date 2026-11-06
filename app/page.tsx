"use client";

import { useState } from "react";

type GeneratedImage = { url: string; id: string };

const examples = [
  "A cinematic photograph of a futuristic supercar on a rain-soaked neon street, reflections, dramatic lighting, ultra detailed",
  "A tiny cozy cabin in a snowy forest at blue hour, warm glowing windows, dreamy cinematic atmosphere",
  "A premium product photograph of a transparent glass perfume bottle on sculptural stone, soft studio lighting"
];

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [ratio, setRatio] = useState("1:1");
  const [count, setCount] = useState(1);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    if (prompt.trim().length < 3) {
      setError("Write a prompt first — even a simple idea works.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, ratio, count })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Generation failed.");
      setImages(data.images.map((url: string, index: number) => ({ url, id: `${Date.now()}-${index}` })));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not generate images.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="AI Nobie home"><span className="brand-mark">N</span><span>AI <b>NOBIE</b></span></a>
        <div className="top-note"><span className="status-dot" /> YOUR IMAGINATION, RENDERED</div>
        <a className="github-link" href="https://github.com/jinoshaju2006/AI_nobie" target="_blank" rel="noreferrer">GitHub ↗</a>
      </header>

      <section className="hero">
        <div className="eyebrow"><span /> AI IMAGE STUDIO</div>
        <h1>Dream it.<br /><span>Make it real.</span></h1>
        <p className="intro">A blank canvas for your wildest ideas. Describe what you imagine and let AI bring it to life.</p>
      </section>

      <section className="studio">
        <div className="studio-heading"><div><span className="section-kicker">01 / CREATE</span><h2>Your next masterpiece</h2></div><span className="engine-tag">FLUX · AI</span></div>
        <label className="prompt-label" htmlFor="prompt">DESCRIBE YOUR IMAGE</label>
        <textarea id="prompt" value={prompt} onChange={e => setPrompt(e.target.value)} maxLength={2000} placeholder="A breathtaking cinematic landscape at golden hour..." />
        <div className="prompt-footer"><span>Be descriptive for better results</span><span>{prompt.length}/2000</span></div>

        <div className="examples"><span className="section-kicker">NEED INSPIRATION?</span>{examples.map((item, i) => <button key={i} onClick={() => setPrompt(item)}>{["Cinematic", "Dreamy", "Product"][i]} ↗</button>)}</div>

        <div className="controls">
          <div className="control-group"><label>ASPECT RATIO</label><div className="segmented">{["1:1", "4:5", "3:2", "16:9", "9:16"].map(x => <button key={x} className={ratio === x ? "selected" : ""} onClick={() => setRatio(x)}>{x}</button>)}</div></div>
          <div className="control-group count-control"><label>IMAGES</label><select value={count} onChange={e => setCount(Number(e.target.value))}><option value={1}>1 image</option><option value={2}>2 images</option><option value={3}>3 images</option><option value={4}>4 images</option></select></div>
        </div>

        {error && <p className="error" role="alert">{error}</p>}
        <button className="generate" onClick={generate} disabled={loading}><span>{loading ? "Creating your images..." : "✦  Generate images"}</span><span>{loading ? <i className="spinner" /> : "↗"}</span></button>
        <p className="fineprint">Generated with FLUX · Results may take a little time</p>
      </section>

      <section className="results">
        <div className="results-heading"><div><span className="section-kicker">02 / YOUR CANVAS</span><h2>Creations</h2></div>{images.length > 0 && <span className="result-count">{images.length} IMAGE{images.length > 1 ? "S" : ""}</span>}</div>
        {loading && <div className="loading-grid">{Array.from({ length: count }).map((_, i) => <div className="skeleton" key={i}><span>Dreaming up something beautiful…</span></div>)}</div>}
        {!loading && images.length === 0 && <div className="empty-state"><div className="empty-icon">✳</div><p>Your creations will appear here.</p><span>Start with a prompt above.</span></div>}
        {!loading && images.length > 0 && <div className="image-grid">{images.map(image => <article className="image-card" key={image.id}><img src={image.url} alt={prompt || "AI-generated artwork"} /><a href={image.url} download={`ai-nobie-${image.id}.png`} target="_blank" rel="noreferrer" className="download">↓ Download PNG</a></article>)}</div>}
      </section>

      <footer><a className="footer-brand" href="#">AI NOBIE</a><span>Made for the endlessly curious.</span><span>BY <b>EVO</b></span></footer>
    </main>
  );
}