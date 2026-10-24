/* 올케어에듀 오답 입력 · 학습 현황 — 화면만 여기(깃허브)에 있고, 저장·집계는 반별 Apps Script가 합니다. (v2: 강사용 ?a= 지원) */
(function () {
  var API = window.API;
  var q = new URLSearchParams(location.search);
  var s = q.get('s') || '', p = q.get('p') || '', a = q.get('a') || '', v = q.get('v') || '';
  var box = document.getElementById('msg');

  function show(html) { box.innerHTML = html; }
  function fail(m) {
    show('<p style="font-size:16px;line-height:1.7">' + m + '</p>' +
         '<button onclick="location.reload()" style="margin-top:14px;border:0;background:#4E2A84;color:#fff;' +
         'padding:13px 26px;border-radius:12px;font-size:16px;font-weight:700">다시 열기</button>');
  }
  if (!s && !p && !a) { fail('링크가 올바르지 않아요.<br>학원에서 받은 <b>본인 전용 링크</b>로 들어와 주세요.'); return; }

  // google.script.run 대신 fetch 로 저장 요청을 보냅니다 (페이지 코드는 그대로 씀)
  var SHIM = '(function(){var API=' + JSON.stringify(API) + ';' +
    'function mk(ok,no){return new Proxy({},{get:function(_,k){' +
    'if(k==="withSuccessHandler")return function(h){return mk(h,no)};' +
    'if(k==="withFailureHandler")return function(h){return mk(ok,h)};' +
    'if(k==="withUserObject")return function(){return mk(ok,no)};' +
    'return function(){var a=[].slice.call(arguments);' +
    'fetch(API,{method:"POST",body:JSON.stringify({fn:k,args:a})})' +
    '.then(function(r){return r.json()})' +
    '.then(function(j){if(j.error){no&&no(new Error(j.error))}else{ok&&ok(j.result)}})' +
    '.catch(function(){no&&no(new Error("인터넷 연결을 확인하고 다시 눌러 주세요"))});};}})}' +
    'window.google={script:{run:mk(null,null)}};})();';

  var url = API + '?api=1&' + (a ? 'a=' + encodeURIComponent(a) + (v ? '&v=' + encodeURIComponent(v) : '') : p ? 'p=' + encodeURIComponent(p) : 's=' + encodeURIComponent(s));
  var tries = 0;
  (function go() {
    tries++;
    fetch(url).then(function (r) { return r.json(); }).then(function (j) {
      if (j.error) throw new Error(j.error);
      var tag = '<script>' + SHIM + '<\/script>';
      var html = String(j.html || '');
      html = /<head[^>]*>/i.test(html) ? html.replace(/<head[^>]*>/i, function (m) { return m + tag; }) : tag + html;
      if (!/name=["']?viewport/i.test(html)) html = '<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">' + html;
      document.open(); document.write(html); document.close();
      if (j.title) document.title = j.title;
    }).catch(function () {
      if (tries < 3) setTimeout(go, 1200 * tries);
      else fail('화면을 불러오지 못했어요.<br>인터넷 연결을 확인하고 다시 열어 주세요.');
    });
  })();
})();
