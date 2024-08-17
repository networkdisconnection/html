document.addEventListener('DOMContentLoaded', function() {
  try {
    // 獲取本地訪問次數
    let localVisitCount = parseInt(sessionStorage.getItem('visitCount'), 10) || 0;
    localVisitCount = Math.max(1, localVisitCount + 1);
    sessionStorage.setItem('visitCount', localVisitCount.toString());

    // 更新或創建計數器元素
    let counterElement = document.getElementById('pageCounter');
    if (!counterElement) {
      counterElement = document.createElement('div');
      counterElement.id = 'pageCounter';
      document.body.appendChild(counterElement);
    }

    // 顯示本地訪問次數
    counterElement.textContent = `本地訪問次數：${localVisitCount}`;

    console.log('更新會話訪問計數：', localVisitCount);

    // 獲取唯一訪問者數量
    fetch('https://api.networkdisconnection.tw/api/increment-visit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
      if (data && data.totalVisits !== undefined) {
        counterElement.textContent += ` | 唯一訪問者數量：${data.totalVisits}`;
        if (data.isNewVisitor) {
          console.log('這是一個新的唯一訪問者');
        } else {
          console.log('這個 IP 之前已經訪問過');
        }
      }
    })
    .catch((error) => {
      console.error('無法更新唯一訪問者計數:', error);
    });

  } catch (error) {
    console.error('更新訪問計數時發生錯誤:', error);
  }
});
