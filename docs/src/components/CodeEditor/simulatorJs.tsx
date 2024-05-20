
export default `

const nluxSimulator = (() => {
    let _prompt = null;
    let _simulatorEnabled = true;
    let _promptBoxInput = null;
    return {
        get simulatorEnabled() {
            return _simulatorEnabled;
        },
        enableSimulator: () => {
            _simulatorEnabled = true;
        },
        disableSimulator: () => {
            _simulatorEnabled = false;
        },
        get prompt() {
            return _prompt;
        },
        setPrompt(prompt) {
            _prompt = prompt;
            nluxSimulator.checkForPromptSimulation();
        },
        onPromptBoxDetected: (promptBoxInput) => {
            _promptBoxInput = promptBoxInput;
            nluxSimulator.checkForPromptSimulation();
        },
        checkForPromptSimulation: () => {
            if (!_prompt || !_promptBoxInput || !_simulatorEnabled) {
                return;
            }

            let promptToType = nluxSimulator.prompt;
            if (!promptToType) {
                return;
            }
        
            _promptBoxInput.addEventListener("click", () => {
                nluxSimulator.disableSimulator();
            });
        
            _promptBoxInput.addEventListener("keydown", () => {
                nluxSimulator.disableSimulator();
            });
        
            const submitOnDoneTyping = () => {
                if (nluxSimulator.simulatorEnabled) {
                    const event = new KeyboardEvent('keydown', {
                      key: 'Enter',
                      code: 'Enter',
                      which: 13,
                      keyCode: 13,
                    });
        
                    _promptBoxInput.dispatchEvent(event);
                    nluxSimulator.disableSimulator();
                }
            };
        
            let userClicked = false;
            const typeNextChar = () => {
                if (!nluxSimulator.simulatorEnabled) {
                    return;
                }
        
                if (promptToType.length === 0) {
                    submitOnDoneTyping();
                    return;
                }
        
                _promptBoxInput.value += promptToType[0];
                _promptBoxInput.dispatchEvent(new Event("input"));
                promptToType = promptToType.slice(1);
                
                const interval = Math.floor(Math.random() * 60) + 20;
                setTimeout(typeNextChar, interval);
            };
            
            typeNextChar();
        },
    };
})();

const checkInputInterval = setInterval(() => {
    const promptBoxInput = document.querySelector(".nluxc-root .nluxc-prompt-box-text-input");
    if (promptBoxInput) {
        clearInterval(checkInputInterval);
        if (typeof nluxSimulator.onPromptBoxDetected === "function") {
            setTimeout(() => {
                nluxSimulator.onPromptBoxDetected(promptBoxInput);
            }, 1000);
        }
    }
}, 200);
`;
