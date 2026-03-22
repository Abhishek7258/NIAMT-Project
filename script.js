 
        let apiKey = 'AIzaSyDcseUXBwfhcfAOZZrsf4a-jfvb0aGm4ec';
        
        // API Key handling
        document.getElementById('apiKey').addEventListener('input', function(e) {
            apiKey = e.target.value.trim();
            updateStatusIndicator();
        });

        function updateStatusIndicator() {
            const indicator = document.getElementById('statusIndicator');
            if (apiKey) {
                indicator.className = 'status-indicator status-connected';
            } else {
                indicator.className = 'status-indicator status-disconnected';
            }
        }

        // Form submission
        document.getElementById('symptomForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!apiKey) {
                showError('Please enter your Gemini API key first.');
                return;
            }

            const symptoms = document.getElementById('symptoms').value.trim();
            const age = document.getElementById('age').value.trim();
            const gender = document.getElementById('gender').value.trim();

            if (!symptoms) {
                showError('Please describe your symptoms.');
                return;
            }

            await analyzeSymptoms(symptoms, age, gender);
        });

        async function analyzeSymptoms(symptoms, age, gender) {
            const loading = document.getElementById('loading');
            const results = document.getElementById('results');
            const analyzeBtn = document.getElementById('analyzeBtn');
            
            // Show loading state
            loading.style.display = 'block';
            results.style.display = 'none';
            analyzeBtn.disabled = true;
            clearError();

            try {
                const prompt = createMedicalPrompt(symptoms, age, gender);
                const response = await callGeminiAPI(prompt);
                
                if (response && response.candidates && response.candidates[0]) {
                    const content = response.candidates[0].content.parts[0].text;
                    displayResults(content);
                } else {
                    throw new Error('Invalid response from Gemini API');
                }
            } catch (error) {
                console.error('Error:', error);
                showError('Failed to analyze symptoms. Please check your API key and try again.');
            } finally {
                loading.style.display = 'none';
                analyzeBtn.disabled = false;
            }
        }

        function createMedicalPrompt(symptoms, age, gender) {
            let prompt = `As a medical AI assistant, analyze the following symptoms and provide a structured response:

SYMPTOMS: ${symptoms}`;
            
            if (age) prompt += `\nAGE: ${age}`;
            if (gender) prompt += `\nGENDER: ${gender}`;
            
            prompt += `

Please provide a response in the following format:

POSSIBLE CONDITIONS:
[List 2-3 most likely conditions based on symptoms, with brief explanations]

MEDICATION SUGGESTIONS:
[Suggest over-the-counter medications or general treatment approaches - always emphasize consulting a doctor for prescription medications]

RECOMMENDATIONS:
[Provide general health advice, when to seek immediate medical attention, and lifestyle recommendations]

Important: Always emphasize the importance of consulting healthcare professionals for proper diagnosis and treatment. Do not provide specific prescription medication dosages.`;

            return prompt;
        }

        async function callGeminiAPI(prompt) {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        }

        function displayResults(content) {
            const results = document.getElementById('results');
            
            // Parse the response
            const sections = parseResponse(content);
            
            document.getElementById('conditions').innerHTML = sections.conditions || 'No specific conditions identified.';
            document.getElementById('medications').innerHTML = sections.medications || 'No specific medications suggested.';
            document.getElementById('recommendations').innerHTML = sections.recommendations || 'Please consult a healthcare provider.';
            
            results.style.display = 'block';
            results.scrollIntoView({ behavior: 'smooth' });
        }

        function parseResponse(content) {
            const sections = {
                conditions: '',
                medications: '',
                recommendations: ''
            };

            // Split content into sections
            const lines = content.split('\n');
            let currentSection = '';
            
            for (let line of lines) {
                line = line.trim();
                
                if (line.toUpperCase().includes('POSSIBLE CONDITIONS:')) {
                    currentSection = 'conditions';
                    continue;
                } else if (line.toUpperCase().includes('MEDICATION SUGGESTIONS:')) {
                    currentSection = 'medications';
                    continue;
                } else if (line.toUpperCase().includes('RECOMMENDATIONS:')) {
                    currentSection = 'recommendations';
                    continue;
                }
                
                if (currentSection && line) {
                    sections[currentSection] += line + '<br>';
                }
            }

            return sections;
        }

        function showError(message) {
            clearError();
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error';
            errorDiv.textContent = message;
            document.querySelector('.main-content').appendChild(errorDiv);
        }

        function clearError() {
            const existingError = document.querySelector('.error');
            if (existingError) {
                existingError.remove();
            }
        }

        // Initialize
        updateStatusIndicator();
    