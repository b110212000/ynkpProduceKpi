$(document).ready(function() {
    $('#modal-container').load('modal.html', function(response, status, xhr) {
        if (status == "error") {
            console.error("載入 Modal 失敗: " + xhr.status + " " + xhr.statusText);
        } else {
            $('#voteRuleModal').modal('show');
            console.log("Modal 載入成功！");
        }
    });
})

$('#openRuleBtn').click(function() {
    // 使用你記得的寫法：呼叫 .modal('show') 把視窗彈出來！
    $('#voteRuleModal').modal('show');
});

// =========================================
// 練習生頭像 單選邏輯
// =========================================
$('.avatar-circle').click(function() {
    
    // 1. 清除所有人的選取狀態 (把 selected-avatar 這個 class 拔掉)
    $('.avatar-circle').removeClass('selected-avatar');
    
    // 2. 只為當前被點擊的這個頭像加上選取狀態
    $(this).addClass('selected-avatar');
    
    // 3. (進階實用) 抓取你選到了誰！
    // 透過 .siblings() 找到旁邊的 div 文字，你就可以知道選到了誰
    let selectedName = $(this).siblings('.text-white').text();
    console.log("目前 PICK 的練習生是：" + selectedName);

    // 你也可以順便把底部按鈕的文字動態換掉，讓使用者更有感！
    $('.bottom-action-btn .fs-5').text('確認 PICK：' + selectedName);
});