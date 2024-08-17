$(function () {
  // 選擇終端顯示區域
  const $terminal = $(".terminal");
  let typewriterInterval;

  // 設定打字機效果的選項
  const typewritingOptions = {
    typing_interval: 300, // 將打字間隔調整為300毫秒，可以根據需要進一步調整
  };

  // 定義要顯示的消息數組
  const messages = [
    ">啟動資料傳輸作業...\n",
    ">資料傳輸錯誤404 Not Found\n",
    ">找不到這個網頁\n",
    ">資料傳輸中止\n"
  ];

  // 開始打字機動畫的函數
  const startTypewriterAnimation = (texts) => {
    let textIndex = 0;  // 當前處理的文本索引
    let charIndex = 0;  // 當前處理的字符索引
    let fullText = "";  // 存儲完整的顯示文本

    // 打字效果的核心函數
    const typeChar = () => {
      // 檢查是否已經處理完所有文本
      if (textIndex >= texts.length) {
        clearInterval(typewriterInterval);
        typewriterInterval = null;
        return;
      }

      let currentText = texts[textIndex];

      // 檢查是否還有字符需要顯示
      if (charIndex < currentText.length) {
        fullText += currentText[charIndex];
        charIndex++;
      } else {
        // 當前文本處理完畢，準備處理下一條消息
        fullText += "\n";
        textIndex++;
        charIndex = 0;
      }

      // 更新終端顯示內容
      updateTerminal(fullText);
    };

    // 初始化終端顯示
    $terminal.empty().append('<span class="cursor"></span>');
    // 設置定時器來執行打字效果
    typewriterInterval = setInterval(typeChar, typewritingOptions.typing_interval);
  };

  // 使用事件委託來處理按鈕點擊
  $(".controls-container").on("click touchstart", "button", function(e) {
    e.preventDefault(); // 防止默認行為
    const buttonId = $(this).attr('id');
    
    switch(buttonId) {
      case "start-typewriter-btn":
        $terminal.empty();
        startTypewriterAnimation(messages);
        break;
      case "stop-typewriter-btn":
        clearInterval(typewriterInterval);
        typewriterInterval = null;
        break;
      case "clear-btn":
        $terminal.empty();
        break;
    }

    // 確保頁腳和頁角計數器內容不變
    $footer.html(originalFooterContent);
    $pageCounter.html(originalPageCounterContent);
  });

  // 確保頁面加載時執行初始打字機效果
  startTypewriterAnimation(messages);

  // 滾動條顯示/隱藏
  $terminal.on('mouseenter', function() {
    $(this).addClass('show-scrollbar');
  }).on('mouseleave', function() {
    $(this).removeClass('show-scrollbar');
  });

  // 滾動到底部的函數
  function scrollToBottom(element) {
    element.scrollTop = element.scrollHeight;
  }

  const $footer = $("footer");
  const $pageCounter = $("#pageCounter");
  
  // 保存原始內容
  const originalFooterContent = $footer.html();
  const originalPageCounterContent = $pageCounter.html();

  // 更新終端顯示內容的函數
  function updateTerminal(fullText) {
    $terminal.html(fullText + '<span class="cursor"></span>');
    
    // 調整終端機高度
    $terminal.css('height', 'auto');
    let newHeight = $terminal.prop('scrollHeight');
    $terminal.css('height', Math.min(newHeight, 300) + 'px');
    
    // 滾動到底部
    $terminal.scrollTop($terminal[0].scrollHeight);

    // 恢復頁腳和頁角計數器的原始內容
    $footer.html(originalFooterContent);
    $pageCounter.html(originalPageCounterContent);
  }
});
