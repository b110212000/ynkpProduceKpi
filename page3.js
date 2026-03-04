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