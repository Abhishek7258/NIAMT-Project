# NIAMT Project

Academic project repository from a research internship at NIAMT, Ranchi. It contains a browser-based **Medical Symptom Checker** that uses the Google Gemini API, a browser **object-detection demo**, and supporting project documents.

## Contents

| Path | Description |
|---|---|
| `index.html`, `script.js`, `stylr.css` | Medical Symptom Checker web page. The user enters a Gemini API key, symptoms, age and gender, and the page sends them to the Gemini `generateContent` endpoint (`gemini-pro`) and displays the response |
| `ai-object-detection-master/` | Browser object-detection demo (camera + ml5.js COCO-SSD, Materialize UI, FPS slider and on/off toggle). Based on a third-party open-source project; see its own `README.md` for credits |
| `abhishek/` | Earlier copy of the symptom checker page (HTML/CSS/JS) |
| `Abhishek_project_report[1].pdf` | Project report |
| `Dr. DK Prabhakar.xlsx`, `oriantation Day1.png` | Supporting project material |

## Run locally

No build step is needed. Serve the folder with any static server and open it in a browser:

```bash
python -m http.server 8000
# Symptom checker:   http://localhost:8000/
# Object detection:  http://localhost:8000/ai-object-detection-master/   (allow camera access)
```

For the symptom checker, create a free key in [Google AI Studio](https://aistudio.google.com/app/apikey) and paste it into the page.

## Tech

HTML, CSS, vanilla JavaScript, Google Gemini REST API, ml5.js (COCO-SSD).

## Important notes

- **Not medical advice.** The symptom checker is a learning/demo project and must not be used for diagnosis.
- **API keys:** keys must never be committed. Enter yours in the page's input field; a browser-only app cannot keep a key secret, so a real deployment should call Gemini through a small backend.
- **Review before sharing:** the report, spreadsheet and images may contain personal or institutional information. Check them before keeping this repository public.
- No license is currently declared.
