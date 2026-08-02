(() => {
  const root = document.documentElement;
  const storedTheme = localStorage.getItem('rsi-theme');
  const preferredLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  root.dataset.theme = storedTheme || (preferredLight ? 'light' : 'dark');

  const themeToggle = document.getElementById('theme-toggle');
  themeToggle?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('rsi-theme', root.dataset.theme);
  });

  const progress = document.getElementById('reading-progress-bar');
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);

  const compareData = {
    ordinary: {
      label: 'OBJECT-LEVEL OPTIMIZATION',
      title: 'The system produces a better answer or artifact.',
      copy: 'The output improves, but the mechanism that will solve tomorrow’s task remains unchanged. Self-critique, best-of-N, and one-off debugging usually live here.',
      equation: 'Q(y*) > Q(y)',
      transform: 'task optimizer',
      symbol: 'y*'
    },
    recursive: {
      label: 'META-LEVEL OPTIMIZATION',
      title: 'The system produces a better improver—and deploys it into the next cycle.',
      copy: 'The proposal, harness, training process, evaluator, or research methodology changes persistently. The key test is whether the successor now creates future improvements more effectively per unit resource.',
      equation: 'J(Pₜ₊₁) > J(Pₜ)',
      transform: 'improvement operator',
      symbol: 'Xₜ₊₁'
    }
  };
  const comparePanel = document.getElementById('compare-panel');
  document.querySelectorAll('.compare-button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.compare-button').forEach(x => x.classList.toggle('active', x === btn));
      const mode = btn.dataset.mode;
      const d = compareData[mode];
      comparePanel.classList.toggle('recursive', mode === 'recursive');
      document.getElementById('mode-label').textContent = d.label;
      document.getElementById('mode-title').textContent = d.title;
      document.getElementById('mode-copy').textContent = d.copy;
      document.getElementById('mode-equation').textContent = d.equation;
      document.getElementById('transform-label').textContent = d.transform;
      document.getElementById('successor-symbol').textContent = d.symbol;
    });
  });

  const ladder = [
    {code:'L0',status:'COMMON',title:'Transient self-refinement',description:'The model critiques, reranks, searches, or repairs one output. No durable component changes, so tomorrow’s improvement process is the same as today’s.',object:'Current answer or trajectory',evaluator:'Self-critique, tests, judge model',examples:'Self-Refine, best-of-N, test-time search',boundary:'No persistent gain in the future improvement operator'},
    {code:'L1',status:'COMMON',title:'Persistent experience adaptation',description:'The system writes durable memory, retrieval entries, reusable skills, or task procedures that improve later episodes without changing the base model.',object:'Memory, retrieval index, skill library',evaluator:'Task outcome plus retrieval utility',examples:'File-based memory, experience replay, skill synthesis',boundary:'Improves future behavior, but not necessarily the machinery that discovers new improvements'},
    {code:'L2',status:'DEPLOYED',title:'Training-time self-iteration',description:'The system generates data, critiques, curricula, preferences, or adversarial trajectories that are used to update its policy.',object:'Training data, reward signal, policy weights',evaluator:'Verifiers, reward models, human or environmental feedback',examples:'Self-play, self-training, synthetic data, GPT-Red',boundary:'Can be recursive in data generation, while objectives and training pipeline remain externally fixed'},
    {code:'L3',status:'DEMONSTRATED',title:'Harness self-modification',description:'An agent edits the code that controls its context, tools, memory, search, validation, subagents, or workflow, then evaluates and retains useful descendants.',object:'Agent harness and scaffold code',evaluator:'Executable benchmarks and regression tests',examples:'STOP, Self-Harness, DGM',boundary:'Usually a fixed base model and human-authored benchmark; meta-gain may be domain-specific'},
    {code:'L4',status:'EMERGING',title:'Bounded automated research',description:'Agents formulate hypotheses, implement experiments, run training, analyze results, share findings, and choose the next experiment inside a human-specified research environment.',object:'Methods, experiments, code, research portfolio',evaluator:'Outcome-gradable held-out metrics or strong domain verifiers',examples:'Anthropic AAR, AlphaEvolve, AI Scientist systems',boundary:'Humans still choose the problem, evaluator, compute envelope, and deployment decision'},
    {code:'L5',status:'NOT PUBLIC',title:'Closed successor-model development',description:'A system selects research directions, changes the training recipe or architecture, trains a general successor, independently validates it, and installs it as the next active improver.',object:'Full model-development pipeline',evaluator:'Independent capability, safety, and real-world validation',examples:'No public end-to-end demonstration',boundary:'Requires successor development, evaluation, authorization, and deployment to close in one loop'},
    {code:'L6',status:'UNPROVEN',title:'Sustained recursive ignition',description:'Across several generations, each successor becomes measurably more effective at creating the next successor under fixed or normalized compute, wall-clock, and human labor.',object:'The complete improvement operator',evaluator:'Multi-generation held-out improvement power',examples:'A proposed empirical regime, not a public result',boundary:'Must overcome diminishing returns, evaluator degradation, experiment latency, bottleneck migration, and governance cost'}
  ];
  const fields = ['code','status','title','description','object','evaluator','examples','boundary'];
  document.querySelectorAll('.ladder-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const d = ladder[Number(btn.dataset.level)];
      document.querySelectorAll('.ladder-item').forEach(x => { x.classList.toggle('active',x===btn); x.setAttribute('aria-selected',x===btn?'true':'false'); });
      document.getElementById('level-code').textContent=d.code;
      document.getElementById('level-status').textContent=d.status;
      document.getElementById('level-title').textContent=d.title;
      document.getElementById('level-description').textContent=d.description;
      document.getElementById('level-object').textContent=d.object;
      document.getElementById('level-evaluator').textContent=d.evaluator;
      document.getElementById('level-examples').textContent=d.examples;
      document.getElementById('level-boundary').textContent=d.boundary;
    });
  });

  const components = {
    model:{title:'Base model',copy:'The model supplies proposal generation, reasoning, code synthesis, and interpretation. Harness improvement can unlock more of a fixed model, but recursive structure cannot substitute for insufficient underlying capability.',surface:'Weights, architecture, decoding policy',failure:'Capability ceiling; poor long-horizon control',role:'Proposer now; possible successor target later'},
    context:{title:'Context manager',copy:'Selects what the model sees, compresses old state, retrieves evidence, and prevents long-running work from collapsing under context growth. Context policy is executable and therefore optimizable.',surface:'Retrieval, summarization, prioritization',failure:'Lost evidence; stale summaries; context poisoning',role:'Controls the model’s effective state and observability'},
    tools:{title:'Tools + permissions',copy:'Defines what the agent may read, write, execute, query, and deploy. Tool descriptions and implementations affect capability, while permission boundaries should remain outside the self-editing loop.',surface:'Tool APIs, schemas, routing, middleware',failure:'Permission creep; unsafe side effects; tool misuse',role:'Expands action space while imposing capability boundaries'},
    memory:{title:'Persistent memory',copy:'Stores artifacts, traces, negative results, code diffs, lineage, and research notes outside the transient context window. It makes improvement cumulative instead of episodic.',surface:'Files, indexes, skill libraries, experiment DB',failure:'Stale beliefs; unbounded growth; contaminated experience',role:'Carries evidence and successful methods across generations'},
    subagents:{title:'Subagents',copy:'Parallel workers explore distinct hypotheses, roles, or repositories. Diversity must be deliberately maintained or the population can collapse onto one high-reward strategy.',surface:'Roles, prompts, topology, scheduling',failure:'Correlated error; entropy collapse; coordination cost',role:'Scales search breadth and supports specialization'},
    runner:{title:'Experiment runner',copy:'Turns ideas into grounded evidence by compiling code, launching training, benchmarking kernels, and preserving logs in reproducible sandboxes.',surface:'Sandbox, job orchestration, resource allocation',failure:'Non-reproducibility; hidden compute; flaky measurements',role:'Connects language-model proposals to empirical reality'},
    evaluator:{title:'Evaluator',copy:'Scores correctness, performance, safety, and regressions. Because optimization exploits evaluator error, private tests, meta-evaluation, and external evidence should be administered independently.',surface:'Ideally read-only to the candidate',failure:'Reward hacking; leakage; evaluator capture',role:'Provides selection pressure and defines what survives'},
    governance:{title:'Governance control plane',copy:'Separates proposal, evaluation, authorization, deployment, monitoring, and rollback. A candidate should not be able to expand its own privileges or approve its own objective changes.',surface:'Externally administered policies and gates',failure:'Self-authorization; irreversible deployment; missing rollback',role:'Keeps recursive change corrigible and accountable'}
  };
  const setComponent = (key,node) => {
    document.querySelectorAll('.harness-node').forEach(n=>n.classList.toggle('active',n===node));
    const d=components[key];
    document.getElementById('component-title').textContent=d.title;
    document.getElementById('component-copy').textContent=d.copy;
    document.getElementById('component-surface').textContent=d.surface;
    document.getElementById('component-failure').textContent=d.failure;
    document.getElementById('component-role').textContent=d.role;
  };
  document.querySelectorAll('.harness-node').forEach(node=>{
    node.addEventListener('click',()=>setComponent(node.dataset.component,node));
    node.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setComponent(node.dataset.component,node)}});
  });

  document.querySelectorAll('.filter-button').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.filter-button').forEach(x=>x.classList.toggle('active',x===btn));
      const f=btn.dataset.filter;
      document.querySelectorAll('.reading-card').forEach(card=>{
        card.classList.toggle('hidden',f!=='all'&&!card.dataset.category.split(' ').includes(f));
      });
    });
  });

  const observedSections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.desktop-nav a')];
  const sectionObserver = new IntersectionObserver(entries => {
    const visible = entries.filter(x=>x.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(!visible) return;
    navLinks.forEach(a=>a.classList.toggle('current',a.getAttribute('href')===`#${visible.target.id}`));
  }, {rootMargin:'-20% 0px -65% 0px',threshold:[0,.1,.4]});
  observedSections.forEach(s=>sectionObserver.observe(s));
})();
