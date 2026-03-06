$(document).ready(function() {
    $('#modal-container').load('modal.html', function(response, status, xhr) {
        if (status == "error") {
            console.error("載入 Modal 失敗: " + xhr.status + " " + xhr.statusText);
        } else {
            $('#voteRuleModal').modal('show');
            console.log("Modal 載入成功！");
        }
    });

    $.get('people.csv', function(csvData) {
        
        // 將 CSV 內容依照「換行符號」切成一行一行的陣列
        let lines = csvData.split('\n');
        let htmlContent = '';

        // 使用迴圈讀取每一行 (從 i=1 開始，因為 i=0 是標題 'name,Image')
        for(let i = 1; i < lines.length; i++) {
            let line = lines[i].trim(); // 去除前後空白
            
            // 如果這行是空的就跳過 (避免讀到 CSV 最後一行的空行)
            if(!line) continue;
            
            // 依照「逗號」把名字和圖片檔名切開
            let cols = line.split(',');
            let name = cols[0].trim();
            let imageName = cols[1].trim();

            // 組合 HTML 字串，並套用你的 images 資料夾路徑
            htmlContent += `
            <div class="col-4">
                <img src="images/${imageName}" alt="${name}" class="avatar-circle mx-auto mb-2">
                <div class="text-white small fw-bold">${name}</div>
            </div>
            `;
        }

        // 把組合好的 HTML 一次性塞進我們準備好的容器裡！
        $('#candidate-list').html(htmlContent);
        
    }).fail(function() {
        console.error("無法讀取 data.csv，請確認檔案是否存在，以及是否使用 Local Server 執行！");
    });
})

$('#openRuleBtn').click(function() {
    // 使用你記得的寫法：呼叫 .modal('show') 把視窗彈出來！
    $('#voteRuleModal').modal('show');
});

// =========================================
// 練習生頭像 單選邏輯
// =========================================
$('#candidate-list').on('click', '.avatar-circle', function() {
        
    // 1. 清除所有人的選取狀態
    $('.avatar-circle').removeClass('selected-avatar');
    
    // 2. 只為當前被點擊的這個頭像加上選取狀態
    $(this).addClass('selected-avatar');
    
    // 3. 抓取被選到的名字，並更新按鈕文字
    let selectedName = $(this).siblings('.text-white').text();
    $('.bottom-action-btn .fs-5').text('確認 PICK：' + selectedName);
});

$('.bottom-action-btn').click(function() {
    
    // 1. 先檢查有沒有選人
    let $selectedImg = $('.selected-avatar');
    if ($selectedImg.length === 0) {
        alert("請先點擊頭像選擇一位練習生喔！");
        return;
    }

    // 2. 抓出剛剛選到的名字
    let selectedName = $selectedImg.siblings('.text-white').text();

    // 3. 把名字動態塞進我們剛剛寫好的 Modal 裡面
    $('#confirmCandidateName').text(selectedName);

    // 4. 把確認 Modal 彈出來！
    $('#confirmVoteModal').modal('show');
});

$('#finalConfirmBtn').click(function() {
    
    // 1. 抓取剛剛選到的名字和照片的 src
    let selectedName = $('#confirmCandidateName').text();
    let selectedImgSrc = $('.selected-avatar').attr('src');

    // 2. 把資料存進瀏覽器的「網頁暫存 (sessionStorage)」裡
    // 這樣就算跳轉到下一頁，資料也不會不見！
    sessionStorage.setItem('myPickName', selectedName);
    sessionStorage.setItem('myPickImg', selectedImgSrc);

    // 3. 關閉 Modal，並跳轉到我們的證書頁面！
    $('#confirmVoteModal').modal('hide');
    window.location.href = "page4.html"; 
});