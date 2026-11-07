/* ---- Version 1: original skill chart data (kept for reference) ----
//Skill Chart Data
var skillData = {
	skill1: [
		{
			title: "Explainable AI",
            color: "#00C5CD",
			border: "4px solid #f4709f",
			value: '90%'
		},
		{
			title: "Natural Language Processing",
            color: "#00C5CD",
			border: "4px solid #f4709f",
			value: '100%'
		},
		{
			title: "Clustering",
            color: "#00C5CD",
			border: "4px solid #f4709f",
			value: '105%'
		},
        {
            title: "Jupyter Notebooks",
            color: "#00C5CD",
            border: "4px solid #f4709f",
            value: '95%'
        },
        {
            title: "PyTorch",
            color: "#00C5CD",
            border: "4px solid #f4709f",
            value: '105%'
        }
       
    
	],
	skill2: [
		{
			title: "Web Scraping using Python",
			color: "#1b7ee4",
			border: "4px solid #8cc2f9",
			value: '90%'
		},
		{
			title: "Automation using Selenium",
			color: "#1b7ee4",
			border: "4px solid #8cc2f9",
			value: '105%'
		},
		{
			title: "Object Oriented Programming",
			color: "#1b7ee4",
			border: "4px solid #8cc2f9",
			value: '92%'
		},
        {
            title: "DBMS using SQL",
            color: "#1b7ee4",
            border: "4px solid #8cc2f9",
            value: '80%'
        },
    {
        title: "Hadoop & Map Reduce",
        color: "#1b7ee4",
        border: "4px solid #8cc2f9",
        value: '80%'
		}
	],
  skill3: [
		{
			title: "PHP",
            color: "#00CC66",
			border: "4px solid #e4f9b1",
			value: '95%'
		},
      {
          title: "Javascript",
          color: "#00CC66",
          border: "4px solid #e4f9b1",
          value: '85%'
      },
		{
			title: "HTML & CSS",
            color: "#00CC66",
			border: "4px solid #e4f9b1",
			value: '80%'
		},
    {
			title: "AJAX & JQuery",
            color: "#00CC66",
			border: "4px solid #e4f9b1",
			value: '75%'
		},
		{
			title: "Linux",
            color: "#00CC66",
			border: "4px solid #e4f9b1",
			value: '90%'
		}
	]
}
---- End version 1 ---- */

// Helper used by versions 2 and 3
function skillBar(title, value, color, border) {
	return { title: title, value: value, color: color, border: "4px solid " + border };
}

/* ---- Version 2: Oct 2026 refresh (kept for reference; to switch back, uncomment this
   block, comment out Version 3 below, and swap the <nav> in index.html) ----
//Skill Chart Data (Version 2, Oct 2026 refresh)
// Five categories, max five bars each (see #skill-bar1..5 in index.html).
// Each skill is grounded in published work or resume experience:
//   skill1 Generative AI       - NEPATEC v2.0, PermitTEC v0.1, MARBLE, PNNL LLM/RAG pipelines (7M+ pages)
//   skill2 Trustworthy AI      - TRIVEA, ReVise, Forte, Grid Edge'25, PRIVEE, USEC'23, CGF'20 STAR, Grid Kitchen DP
//   skill3 Visual Analytics    - PhD dissertation, PRIVEE, VALUE (HILDA), TRIVEA, ReVise (VIS'25), Forte
//   skill4 Machine Learning    - VRN3P, Forte, Grid Edge'25, VALUE, NEPATEC
//   skill5 Cloud & Backend     - AWS Bedrock / GCP Vertex AI batch LLM workflows, Flask APIs, SQL dashboards

var skillData = {
	skill1: [
		skillBar("LLM Pipelines",         '100%', "#00C5CD", "#7fe6ea"),
		skillBar("RAG Systems",           '95%',  "#00C5CD", "#7fe6ea"),
		skillBar("Prompt Engineering",    '95%',  "#00C5CD", "#7fe6ea"),
		skillBar("LangChain & HF",        '90%',  "#00C5CD", "#7fe6ea"),
		skillBar("Agentic AI",            '88%',  "#00C5CD", "#7fe6ea")
	],
	skill2: [
		skillBar("Explainable AI",        '100%', "#1b7ee4", "#8cc2f9"),
		skillBar("Privacy Risk Analysis", '95%',  "#1b7ee4", "#8cc2f9"),
		skillBar("Model Evaluation",      '92%',  "#1b7ee4", "#8cc2f9"),
		skillBar("Differential Privacy",  '88%',  "#1b7ee4", "#8cc2f9"),
		skillBar("Fairness & Recourse",   '85%',  "#1b7ee4", "#8cc2f9")
	],
	skill4: [
		skillBar("Python & sklearn",      '100%', "#8E44AD", "#d2a8e6"),
		skillBar("NLP & Text Mining",     '95%',  "#8E44AD", "#d2a8e6"),
		skillBar("Time-Series Forecast",  '95%',  "#8E44AD", "#d2a8e6"),
		skillBar("Deep Learning",         '90%',  "#8E44AD", "#d2a8e6"),
		skillBar("Statistical Modeling",  '88%',  "#8E44AD", "#d2a8e6")
	],
	skill3: [
		skillBar("Visual Analytics",      '100%', "#00CC66", "#a6f0c8"),
		skillBar("Human-AI Interaction",  '95%',  "#00CC66", "#a6f0c8"),
		skillBar("D3.js & React",         '92%',  "#00CC66", "#a6f0c8"),
		skillBar("Human-in-the-Loop",     '90%',  "#00CC66", "#a6f0c8"),
		skillBar("Dash & Tableau",        '88%',  "#00CC66", "#a6f0c8")
	],
	skill5: [
		skillBar("AWS Bedrock",           '92%',  "#D35400", "#f5b98c"),
		skillBar("Flask & REST APIs",     '92%',  "#D35400", "#f5b98c"),
		skillBar("SQL & MongoDB",         '88%',  "#D35400", "#f5b98c"),
		skillBar("GCP Vertex AI",         '85%',  "#D35400", "#f5b98c"),
		skillBar("Docker",                '85%',  "#D35400", "#f5b98c")
	]
}
---- End version 2 ---- */

//Skill Chart Data (Version 3, Nov 2026 regrouping)
// Agentic AI and Privacy are first-class categories. Differential privacy sits under
// Privacy & Security (it protects shared data, not ML models). No bar repeats its category name.
//   skill1 Agentic AI & LLMs  - MARBLE (multi-agent LLM teams), NEPATEC v2.0, PermitTEC v0.1, PNNL RAG pipeline (7M+ pages)
//   skill2 Privacy & Security - PRIVEE (VizSec'22), USEC'23, CGF'20 STAR, Grid Kitchen DP, VALUE (HILDA'23), PwC cyber security
//   skill3 Human-Centered AI  - TRIVEA, ReVise (VIS'25), Forte (ISGT'24), Grid Edge'25, PhD dissertation
//   skill4 Machine Learning   - VRN3P, Forte, Grid Edge'25, VALUE, NEPATEC
//   skill5 AI Engineering     - AWS Bedrock / GCP Vertex AI LLM batch workflows, Flask APIs, React + D3.js interfaces
var skillData = {
	skill1: [
		skillBar("LLM Pipelines",          '100%', "#00C5CD", "#7fe6ea"),
		skillBar("Multi-Agent Systems",    '95%',  "#00C5CD", "#7fe6ea"),
		skillBar("RAG Systems",            '95%',  "#00C5CD", "#7fe6ea"),
		skillBar("Prompt Engineering",     '92%',  "#00C5CD", "#7fe6ea"),
		skillBar("LLM Evaluation",         '90%',  "#00C5CD", "#7fe6ea")
	],
	skill2: [
		skillBar("Privacy Risk Analysis",  '100%', "#1b7ee4", "#8cc2f9"),
		skillBar("Differential Privacy",   '95%',  "#1b7ee4", "#8cc2f9"),
		skillBar("Privacy-Preserving Viz", '95%',  "#1b7ee4", "#8cc2f9"),
		skillBar("Secure Data Sharing",    '90%',  "#1b7ee4", "#8cc2f9"),
		skillBar("Cybersecurity",          '85%',  "#1b7ee4", "#8cc2f9")
	],
	skill3: [
		skillBar("Explainable AI",         '100%', "#00CC66", "#a6f0c8"),
		skillBar("Visual Analytics",       '100%', "#00CC66", "#a6f0c8"),
		skillBar("Human-in-the-Loop",      '92%',  "#00CC66", "#a6f0c8"),
		skillBar("Model Comparison",       '90%',  "#00CC66", "#a6f0c8"),
		skillBar("Algorithmic Recourse",   '88%',  "#00CC66", "#a6f0c8")
	],
	skill4: [
		skillBar("Python & sklearn",       '100%', "#8E44AD", "#d2a8e6"),
		skillBar("NLP & Text Mining",      '95%',  "#8E44AD", "#d2a8e6"),
		skillBar("Time-Series Forecast",   '95%',  "#8E44AD", "#d2a8e6"),
		skillBar("Deep Learning",          '90%',  "#8E44AD", "#d2a8e6"),
		skillBar("Statistical Modeling",   '88%',  "#8E44AD", "#d2a8e6")
	],
	skill5: [
		skillBar("AWS Bedrock",            '92%',  "#D35400", "#f5b98c"),
		skillBar("Flask & REST APIs",      '92%',  "#D35400", "#f5b98c"),
		skillBar("D3.js & React",          '92%',  "#D35400", "#f5b98c"),
		skillBar("LangChain & HF",         '90%',  "#D35400", "#f5b98c"),
		skillBar("GCP Vertex AI",          '85%',  "#D35400", "#f5b98c")
	]
}
