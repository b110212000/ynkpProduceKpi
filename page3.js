let currentVoteRound = "";

$(document).ready(function() {
    $('#modal-container').load('modal.html', function(response, status, xhr) {
        if (status == "error") {
            console.error("載入 Modal 失敗: " + xhr.status + " " + xhr.statusText);
        } else {
            $('#voteRuleModal').modal('show');
            console.log("Modal 載入成功！");
        }
    });

    
    let baseCsvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSJq2DTGgWg4lnoO2jsqWJfvNkF2o4k1Geg_JurLsvSIvsercYPi90wGGnwJ0-GsnsBKisfUEySglgh/pub?single=true&output=csv&gid=';

    let settingGid = "126944775"; 
    let listGid = "2028933515";

    $.ajax({
        url: baseCsvUrl + settingGid,
        type: 'GET',
        cache: false,
        success: function(settingCsv) {
            let lines = settingCsv.split('\n');
            let now = new Date(); 

            // 從第二行開始讀取 (跳過標題)
            for(let i = 1; i < lines.length; i++) {
                let cols = lines[i].split(',');
                if(cols.length < 3) continue;

                let round = cols[0].replace(/"/g, '').trim();
                let startTime = new Date(cols[1].trim());
                let endTime = new Date(cols[2].trim());

                // 判斷當下時間是否落在這輪之內
                if (now >= startTime && now <= endTime) {
                    currentVoteRound = round;
                    break; 
                }
            }

            // =========================================
            // 步驟 2：判斷狀態並顯示對應畫面
            // =========================================
            if (currentVoteRound === "") {
                // 如果不在任何一輪的時間內
                $('#candidate-list').addClass('d-none');
                $('.sticky-bottom-wrapper').addClass('d-none');
                $('#notOpenContainer').removeClass('d-none');
                return;
            }

            if (localStorage.getItem('voted_round_' + currentVoteRound) === 'true') {
                // 如果這輪已經投過票了
                $('#candidate-list').addClass('d-none');
                $('.sticky-bottom-wrapper').addClass('d-none');
                $('#alreadyVotedContainer').removeClass('d-none');
                return;
            }

            // 狀態正常：開始去抓名單，並告訴它現在是哪一輪！
            fetchCandidateList(currentVoteRound);
        }
    });

    function fetchCandidateList(targetRound) {
        $.ajax({
            url: baseCsvUrl + listGid,
            type: 'GET',
            cache: false,
            success: function(listCsv) {
                let lines = listCsv.split('\n');
                let htmlContent = '';

                for(let i = 1; i < lines.length; i++) {
                    let cols = lines[i].split(',');
                    // 確保有 name, image, round 這三個欄位
                    if(cols.length < 3) continue; 
                    
                    let name = cols[0].replace(/"/g, '').trim();
                    let imageName = cols[1].replace(/"/g, '').trim();
                    let candidateRound = cols[2].replace(/"/g, '').trim();

                    // 🌟 核心過濾機制 🌟
                    // 如果這個人的輪數，不等於現在正在進行的輪數，就跳過他不顯示！
                    if (candidateRound !== targetRound) {
                        continue; 
                    }

                    htmlContent += `
                    <div class="col-4 d-flex flex-column align-items-center mb-3">
                        <div class="position-relative mb-2">
                            <img src="${imageName}" alt="${name}" class="avatar-circle" crossorigin="anonymous">
                        </div>
                        <div class="text-white small fw-bold mt-1">${name}</div>
                    </div>
                    `;
                }
                
                // 把過濾完的名單塞進畫面上
                $('#candidate-list').html(htmlContent);
            }
        });
    }

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
    let selectedName = $(this).parent().siblings('.text-white').text();

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
    let selectedName = $selectedImg.parent().siblings('.text-white').text();

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
    localStorage.setItem('myPickName', selectedName);
    localStorage.setItem('myPickImg', 'ori' + selectedImgSrc);
    localStorage.setItem('voted_round_' + currentVoteRound, 'true');

    let googleScriptUrl = "https://script.google.com/macros/s/AKfycbxaF1lkoze4zc6DcYmcLIbfLc09QOF5m6rFxAIdga9lcoLmFbaRkhR8LV0MLrAL53_yfQ/exec";

    // 改變按鈕狀態，讓使用者知道正在傳送中
    let $btn = $(this);
    $btn.text('投票傳送中...').prop('disabled', true);

    // 透過 jQuery 發送請求給 Google
    $.ajax({
        // 在網址後面加上參數 ?pickName=xxx (例如：?pickName=多賢)
        url: googleScriptUrl + "?pickName=" + encodeURIComponent(selectedName) + "&round=" + currentVoteRound,
        type: "GET",
        success: function(response) {
            // 傳送成功後，關閉 Modal，並跳轉到證書頁面
            $('#confirmVoteModal').modal('hide');
            window.location.href = "page4.html"; 
        },
        error: function() {
            localStorage.removeItem('voted_round_' + currentVoteRound);
            // 萬一網路出錯的防呆機制
            alert("投票傳送發生異常，請確認網路狀態後重試！");
            $btn.text('確認').prop('disabled', false);
        }
    });
});