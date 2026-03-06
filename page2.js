$(document).ready(function() {
    let googleSheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSJq2DTGgWg4lnoO2jsqWJfvNkF2o4k1Geg_JurLsvSIvsercYPi90wGGnwJ0-GsnsBKisfUEySglgh/pub?gid=0&single=true&output=csv';
    $.ajax({
        url: googleSheetUrl,
        dataType: 'text',
        success: function(data) {
            const container = $('#video-container');
            const rows = data.split('\n');
            
            // 從 i=1 開始迴圈 (略過標題列)
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i].trim();
                if (!row) continue; 
                
                // 依照逗號將欄位切開
                const columns = row.split(',');
                
                // 確認有抓到三個欄位：0是ID，1是標題，2是內容
                if (columns.length >= 3) {
                    const videoId = columns[0].trim(); // 加上 trim() 避免不小心複製到空白
                    const title = columns[1];
                    const content = columns[2];
                    
                    // 🌟 核心邏輯：用影片 ID 統一組合出「觀看連結」與「縮圖連結」
                    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
                    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
                    
                    // 組合 HTML
                    const videoHTML = `
                        <a href="${videoUrl}" target="_blank" class="video-item d-flex align-items-start p-3 border-bottom border-secondary text-decoration-none">
                            <div class="flex-shrink-0 me-3">
                                <img src="${thumbnailUrl}" class="video-img rounded-2" alt="影片縮圖">
                            </div>
                            <div class="video-info flex-grow-1">
                                <div class="fw-bold mb-1 text-white">${title}</div>
                                <div class="text-light opacity-75 small">${content}</div>
                            </div>
                        </a>
                    `;
                    
                    // 附加到畫面上
                    container.append(videoHTML);
                }
            }
        },
        error: function(xhr, status, error) {
            console.error("無法讀取 CSV：", error);
            $('#video-container').html('<p class="p-3 text-center text-secondary">無法載入影片資料，請確認是否透過本地伺服器 (Live Server) 開啟網頁。</p>');
        }
    });

    $('#modal-container').load('modal.html', function(response, status, xhr) {
        if (status == "error") {
            console.error("載入 Modal 失敗: " + xhr.status + " " + xhr.statusText);
        } else {
            console.log("Modal 載入成功！");
        }
    });
});