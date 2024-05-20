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
          const submitButton = document.querySelector(
            ".nlux-AiChat-root .nlux-comp-prmptBox > button"
          );

          console.dir(submitButton);
          window.btt = submitButton;
          if (submitButton) {
            submitButton.click();
          }

          nluxSimulator.disableSimulator();
        }
      };

      let userClicked = false;
      const typeNextChar = () => {
        if (!nluxSimulator.simulatorEnabled) {
          return;
        }

        _promptBoxInput.focus();
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
  const promptBoxInput = document.querySelector(
    ".nlux-AiChat-root .nlux-comp-prmptBox > textarea"
  );
  if (promptBoxInput) {
    clearInterval(checkInputInterval);
    if (typeof nluxSimulator.onPromptBoxDetected === "function") {
      setTimeout(() => {
        nluxSimulator.onPromptBoxDetected(promptBoxInput);
      }, 1000);
    }
  }
}, 200);

setTimeout(() => {
  nluxSimulator?.setPrompt(
    "How can AI chatbots improve the user experience on my website?"
  );
}, 1000);

setTimeout(() => {
  nluxSimulator?.setPrompt("Hi");
}, 1000);

`;
