$(function () {
  const $terminal = $(".terminal");
  const $input = $("#input");
  const $submitBtn = $("#submit-btn");
  const $startTypewriterBtn = $("#start-typewriter-btn");
  const $clearBtn = $("#clear-btn");
  let inputCounter = 0;
  let typewriterInterval;

  const typewritingOptions = {
    typing_interval: 200,
    blink_interval: "0.5s",
    cursor_color: "#006923",
  };

  const rewriteOptions = {
    typing_interval: 100,
    blink_interval: "0.5s",
    cursor_color: "#006923",
  };

  const startMessage = ">啟動資料傳輸作業...\n";
  const errorMessage = ">資料傳輸錯誤404 Not Found\n";
  const notMessage = ">找不到這個網頁\n";
  const stopMessage = ">資料傳輸中止\n";

  const startTypewriterAnimation = (text, callback) => {
    let lines = text.split('\n');
    let lineIndex = 0;
    let currentIndex = 0;

    typewriterInterval = setInterval(() => {
      if (currentIndex < lines[lineIndex].length) {
        $terminal.append(escapeHtml(lines[lineIndex][currentIndex]));
        currentIndex++;
      } else {
        $terminal.append('<br>');
        lineIndex++;
        currentIndex = 0;
      }

      if (lineIndex >= lines.length) {
        clearInterval(typewriterInterval);
        typewriterInterval = null;
        if (callback) {
          callback();
        }
      }
    }, typewritingOptions.typing_interval);
  };

  const startTypewriting = () => $terminal.typewriting(startMessage, typewritingOptions);
  const showErrorMessage = () => $terminal.rewrite(errorMessage, rewriteOptions);

  $startTypewriterBtn.on("click", () => {
    $terminal.html("");
    startTypewriterAnimation(startMessage, () => {
      startTypewriterAnimation(errorMessage, () => {
        startTypewriterAnimation(notMessage, () => {
          startTypewriterAnimation(stopMessage);
        });
      });
    });
  });

  $("#stop-typewriter-btn").on("click", () => {
    clearInterval(typewriterInterval);
    typewriterInterval = null;
  });

  $clearBtn.on("click", () => {
    $terminal.html("");
    inputCounter = 0;
  });

  $submitBtn.on('click', () => {
    const inputText = $input.val().trim();
    if (inputCounter >= 3) {
      $input.val('');
      inputCounter = 0;
      return;
    }
    if (inputText !== '') {
      $terminal.append(`> ${escapeHtml(inputText)}<br>`);
      $input.val('');
      inputCounter++;
    }
  });

  const TYPEWRITING_DELAY = 1000;
  const ERROR_MESSAGE_DELAY = TYPEWRITING_DELAY + typewritingOptions.typing_interval * startMessage.length + 100;

  // Ensure initial typewriting effect when loading the page
  setTimeout(startTypewriting, TYPEWRITING_DELAY);
  setTimeout(showErrorMessage, ERROR_MESSAGE_DELAY);

  // Add this part to ensure the initial typewriting effect when loading the page
  startTypewriterAnimation(startMessage, () => {
    startTypewriterAnimation(errorMessage, () => {
      startTypewriterAnimation(notMessage, () => {
        startTypewriterAnimation(stopMessage);
      });
    });
  });

  // Function to escape HTML entities
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }
});
