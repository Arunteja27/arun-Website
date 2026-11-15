import { useRef, useState } from 'react';
import demoPoster from '../../assets/repolens-demo-poster.webp';
import demoVideo from '../../assets/repolens-demo.mp4';
import './repolens.css';

const repository = 'https://github.com/Arunteja27/repolens-ai';
const liveApp = 'https://repolens-frontend-jbcqjymb5a-uc.a.run.app/';
const sourceBase = `${repository}/blob/0d4f3f42f19547067240bf0c4b6d6277cbd2298b/backend/repolens/services`;
const tabs = [
  { id: 'demo', label: 'Demo' },
  { id: 'walkthrough', label: 'How it works' },
];
const sources = [
  {
    label: 'Rank matches',
    path: 'retrieval.py',
    start: 209,
    lines: [
      '        vector_weight = 0.45 if self.embeddings.provider.provider_name == "hashing" else 0.8',
      '        for weight, source_results in (',
      '            (vector_weight, vector_results),',
      '            (1.0, bm25_results),',
      '        ):',
      '            for rank, chunk in enumerate(source_results, start=1):',
      '                scores[chunk.id] = scores.get(chunk.id, 0.0) + (weight / (40 + rank))',
      '                combined.setdefault(chunk.id, chunk)',
    ],
    highlight: 215,
  },
  {
    label: 'Check evidence',
    path: 'answering.py',
    start: 59,
    lines: [
      '        if not self._has_sufficient_evidence(analysis, assessed):',
      '            return self._unknown_response(started_at)',
      '',
      '        if analysis.asks_for_configuration:',
      '            answer_text, citations = self._answer_configuration_question(assessed)',
    ],
    highlight: 60,
  },
  {
    label: 'Build citations',
    path: 'answering.py',
    start: 228,
    lines: [
      '    def _citation(chunk: RetrievedChunk) -> Citation:',
      '        return Citation(',
      '            file_path=chunk.file_path,',
      '            start_line=chunk.start_line,',
      '            end_line=chunk.end_line,',
      '        )',
    ],
    highlight: 231,
  },
];
const steps = [
  ['Index the repo', 'Break its code into searchable chunks and keep the original file paths and line numbers.'],
  ['Find relevant code', 'Rank candidates from both BM25 keyword search and vector search.'],
  ['Show the evidence', 'Build an extractive answer and cite the code that supports it.'],
];

export default function RepoLens() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedSource, setSelectedSource] = useState(0);
  const tabButtons = useRef([]);
  const videoRef = useRef(null);
  const source = sources[selectedSource];
  const sourceEnd = source.start + source.lines.length - 1;
  const sourceUrl = `${sourceBase}/${source.path}#L${source.start}-L${sourceEnd}`;

  function selectTab(index) {
    if (index !== 0) videoRef.current?.pause();
    setActiveTab(index);
  }

  function handleTabKey(event, index) {
    let nextTab;
    switch (event.key) {
      case 'ArrowLeft':
        nextTab = (index + tabs.length - 1) % tabs.length;
        break;
      case 'ArrowRight':
        nextTab = (index + 1) % tabs.length;
        break;
      case 'Home':
        nextTab = 0;
        break;
      case 'End':
        nextTab = tabs.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    selectTab(nextTab);
    tabButtons.current[nextTab]?.focus();
  }

  return (
    <section className="repolens-feature" id="repolens" aria-labelledby="repolens-title" tabIndex={-1}>
      <div className="redesign-shell repolens-layout">
        <header className="repolens-header">
          <h2 id="repolens-title" className="repolens-title">RepoLens AI</h2>
          <div>
            <p className="repolens-mode"><strong>No LLM used in the live demo</strong></p>
            <p className="repolens-description">
              A repository Q&amp;A tool that combines BM25 keyword search and hashed vectors to answer from
              retrieved code, with citations to exact file and line ranges.
            </p>
            <div className="repolens-project-links">
              <a className="repolens-live-link" href={liveApp} target="_blank" rel="noreferrer">
                Open live app <span aria-hidden="true">↗</span>
              </a>
              <a className="repolens-repo-link" href={repository} target="_blank" rel="noreferrer">
                GitHub <span aria-hidden="true">↗</span>
              </a>
              <a className="repolens-repo-link" href="#project-archive">
                More projects <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
        </header>

        <div className="repolens-tabs" role="tablist" aria-label="Explore RepoLens">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              ref={(button) => { tabButtons.current[index] = button; }}
              type="button"
              role="tab"
              id={`repolens-tab-${tab.id}`}
              aria-controls={`repolens-panel-${tab.id}`}
              aria-selected={activeTab === index}
              tabIndex={activeTab === index ? 0 : -1}
              onClick={() => selectTab(index)}
              onKeyDown={(event) => handleTabKey(event, index)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          className="repolens-panel repolens-demo"
          id="repolens-panel-demo"
          role="tabpanel"
          aria-labelledby="repolens-tab-demo"
          hidden={activeTab !== 0}
        >
          <figure className="repolens-recording">
            <figcaption id="repolens-video-description">
              Watch RepoLens find where Code Spa defines its control panel and settings, then inspect the
              source citations.
            </figcaption>
            <div className="repolens-video-frame">
              <video
                ref={videoRef}
                aria-label="RepoLens AI product demo"
                aria-describedby="repolens-video-description"
                className="repolens-video"
                src={demoVideo}
                poster={demoPoster}
                controls
                playsInline
                preload="none"
              >
                <a href={demoVideo}>Download the RepoLens AI product demo.</a>
              </video>
            </div>
          </figure>
        </div>

        <div
          className="repolens-panel repolens-walkthrough"
          id="repolens-panel-walkthrough"
          role="tabpanel"
          aria-labelledby="repolens-tab-walkthrough"
          hidden={activeTab !== 1}
          tabIndex={0}
        >
          <ol className="repolens-steps">
            {steps.map(([title, detail]) => (
              <li key={title}>
                <h3>{title}</h3>
                <p>{detail}</p>
              </li>
            ))}
          </ol>
          <div className="repolens-example">
            <div className="repolens-answer">
              <p className="repolens-walkthrough-label">Source walkthrough</p>
              <h3>How does RepoLens decide whether it has enough evidence to answer?</h3>
              <p>
                RepoLens combines the ranks from BM25 and vector search, giving BM25 more weight in
                hashing mode. The answerer checks the retrieved evidence and returns an unknown response
                if support is too weak. When it answers, citations use the source chunks’ stored paths
                and line ranges.
              </p>
              <div className="repolens-citations" role="group" aria-label="Cited code">
                {sources.map(({ label }, index) => (
                  <button
                    key={label}
                    type="button"
                    aria-controls="repolens-source-preview"
                    aria-pressed={selectedSource === index}
                    onClick={() => setSelectedSource(index)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="repolens-source" id="repolens-source-preview">
              <div className="repolens-source-bar">
                <span aria-live="polite">{source.path}:{source.start}–{sourceEnd}</span>
                <a href={sourceUrl} target="_blank" rel="noreferrer">
                  Source <span aria-hidden="true">↗</span>
                </a>
              </div>
              <pre aria-label={`Source excerpt from ${source.path}`}>
                <code>
                  {source.lines.map((line, index) => {
                    const lineNumber = source.start + index;
                    return (
                      <span
                        className={lineNumber === source.highlight ? 'repolens-line is-highlighted' : 'repolens-line'}
                        key={`${source.path}:${lineNumber}`}
                      >
                        <span aria-hidden="true">{lineNumber}</span>
                        <span>{line || ' '}</span>
                      </span>
                    );
                  })}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
