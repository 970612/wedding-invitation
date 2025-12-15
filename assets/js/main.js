(function() {
  // 轮播图功能
  function initSlider() {
    const slider = document.querySelector('.slider');
    if (!slider) return;
    
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.querySelector('.slider-dots');
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');
    
    let currentSlide = 0;
    let slideInterval;
    
    // 创建指示点
    function createDots() {
      slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
      });
    }
    
    // 更新指示点状态
    function updateDots() {
      const dots = document.querySelectorAll('.dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
      });
    }
    
    // 切换到指定幻灯片
    function goToSlide(index) {
      slides.forEach(slide => slide.classList.remove('active'));
      currentSlide = (index + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
      updateDots();
    }
    
    // 下一张
    function nextSlide() {
      goToSlide(currentSlide + 1);
    }
    
    // 上一张
    function prevSlide() {
      goToSlide(currentSlide - 1);
    }
    
    // 自动播放
    function startAutoPlay() {
      if (SLIDER_CONFIG.autoplay) {
        stopAutoPlay();
        slideInterval = setInterval(nextSlide, SLIDER_CONFIG.autoplaySpeed);
      }
    }
    
    function stopAutoPlay() {
      if (slideInterval) {
        clearInterval(slideInterval);
      }
    }
    
    // 事件监听
    if (prevBtn) prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoPlay();
    });
    
    if (nextBtn) nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoPlay();
    });
    
    // 鼠标悬停时暂停自动播放
    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);
    
    // 触摸事件
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoPlay();
    }, { passive: true });
    
    slider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startAutoPlay();
    }, { passive: true });
    
    function handleSwipe() {
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) { // 最小滑动距离
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }
    
    // 初始化
    createDots();
    startAutoPlay();
  }
  
  // 初始化页面效果
  document.addEventListener('DOMContentLoaded', () => {
    initSlider();
    initScrollAnimations();
    initParallaxEffect();
  });
  
  // 初始化滚动动画
  function initScrollAnimations() {
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      
      elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
          element.classList.add('visible');
        }
      });
      
      // 检查是否所有动画元素都已显示
      const allAnimated = document.querySelectorAll('.animate-on-scroll.visible').length === 
                         document.querySelectorAll('.animate-on-scroll').length;
      
      if (allAnimated) {
        window.removeEventListener('scroll', animateOnScroll);
      }
    };
    
    // 初始检查一次
    animateOnScroll();
    
    // 滚动时检查
    window.addEventListener('scroll', animateOnScroll);
  }
  
  // 视差效果
  function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    window.addEventListener('scroll', () => {
      const scrollPosition = window.pageYOffset;
      hero.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
    });
  }

  const cfg = window.WEDDING_CONFIG || {};
  const weddingDateStr = cfg.weddingDate || '2025-10-01 11:30:00';
  const addressText = cfg.addressText || '';
  const mapKeyword = cfg.mapSearchKeyword || addressText;
  const formEndpoint = (cfg.formEndpoint || '').trim();

  // Countdown
  const target = new Date(weddingDateStr.replace(/-/g,'/')).getTime();
  function updateCountdown() {
    const now = Date.now();
    let diff = Math.max(0, target - now);
    const sec = Math.floor(diff / 1000) % 60;
    const min = Math.floor(diff / 60000) % 60;
    const hr  = Math.floor(diff / 3600000) % 24;
    const day = Math.floor(diff / 86400000);
    setText('cd-days', day);
    setText('cd-hours', pad2(hr));
    setText('cd-minutes', pad2(min));
    setText('cd-seconds', pad2(sec));
  }
  function setText(id, text) { var el = document.getElementById(id); if (el) el.textContent = text; }
  function pad2(n){ return n < 10 ? '0'+n : ''+n; }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Fill texts
  document.getElementById('weddingDateText').textContent = weddingDateStr.slice(0,16);
  document.getElementById('weddingAddressText').textContent = addressText;

  // Calendar (.ics download)
  document.getElementById('addCalendarBtn').addEventListener('click', function(){
    const dt = new Date(weddingDateStr.replace(/-/g,'/'));
    const dtStart = toICSDate(dt);
    const dtEnd = toICSDate(new Date(dt.getTime() + 2*3600000));
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      'DTSTART:'+dtStart,
      'DTEND:'+dtEnd,
      'SUMMARY:'+escapeICS('我们的婚礼'),
      'LOCATION:'+escapeICS(addressText),
      'DESCRIPTION:'+escapeICS('诚邀您参加我们的婚礼'),
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'wedding.ics'; a.click();
    URL.revokeObjectURL(url);
  });
  function toICSDate(d){
    const y=d.getUTCFullYear(), m=pad2(d.getUTCMonth()+1), da=pad2(d.getUTCDate());
    const h=pad2(d.getUTCHours()), mi=pad2(d.getUTCMinutes()), s=pad2(d.getUTCSeconds());
    return `${y}${m}${da}T${h}${mi}${s}Z`;
  }
  function escapeICS(s){ return String(s||'').replace(/[\n,;]/g, ' '); }

  // Map open
  document.getElementById('openMapBtn').addEventListener('click', function(){
    const q = encodeURIComponent(mapKeyword || addressText);
    const url = `https://uri.amap.com/search?keyword=${q}`;
    window.open(url, '_blank');
  });

  // Gallery lightbox
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbClose = document.getElementById('lightboxClose');
  document.querySelectorAll('.grid__item').forEach(function(img){
    img.addEventListener('click', function(){
      lbImg.src = img.src; lb.classList.add('open'); lb.setAttribute('aria-hidden','false');
    });
  });
  function closeLB(){ lb.classList.remove('open'); lb.setAttribute('aria-hidden','true'); }
  lbClose.addEventListener('click', closeLB);
  lb.addEventListener('click', function(e){ if(e.target===lb) closeLB(); });

  // RSVP
  const form = document.getElementById('rsvpForm');
  const tip = document.getElementById('rsvpTip');
  const submitBtn = form.querySelector('button[type="submit"]');
  let lastSubmitTs = 0;

  form.addEventListener('submit', async function(e){
    e.preventDefault();
    const name = document.getElementById('guestName').value.trim();
    const count = parseInt(document.getElementById('guestCount').value, 10) || 1;
    const phone = document.getElementById('guestPhone').value.trim();
    const note = document.getElementById('guestNote').value.trim();
    if(!name){ showTip('请填写姓名'); return; }
    if(count < 1 || count > 10){ showTip('人数需在 1~10 之间'); return; }
    if(!/^1\d{10}$/.test(phone)){ showTip('请填写有效的手机号'); return; }
    // 10 秒防重复
    const nowTs = Date.now();
    if(nowTs - lastSubmitTs < 10000){ showTip('请勿频繁提交'); return; }
    lastSubmitTs = nowTs;
    // 本地去重：相同手机号 30 分钟内只保留一次
    const key = 'wedding_rsvp_records';
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    const thirtyMin = 30*60*1000;
    const exists = list.find(r => r.phone === phone && (nowTs - (r.ts||0) < thirtyMin));
    if(exists){ showTip('您已提交，无需重复'); return; }
    const rec = { name, count, phone, note, ts: Date.now() };
    list.push(rec);
    localStorage.setItem(key, JSON.stringify(list));
    // 按钮状态
    submitBtn.disabled = true; submitBtn.textContent = '提交中...';
    if(formEndpoint){
      try {
        let res;
        if(/getform\.io\//i.test(formEndpoint)) {
          // Getform 推荐使用 FormData
          const fd = new FormData();
          Object.keys(rec).forEach(k => fd.append(k, String(rec[k] ?? '')));
          res = await fetch(formEndpoint, { method: 'POST', body: fd });
        } else if(/script\.google\.com\/macros\//i.test(formEndpoint)) {
          // Google Apps Script：使用 urlencoded 简单请求，避免预检
          const params = new URLSearchParams();
          Object.keys(rec).forEach(k => params.append(k, String(rec[k] ?? '')));
          res = await fetch(formEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
            body: params,
            mode: 'cors'
          });
        } else {
          res = await fetch(formEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rec)
          });
        }
        if(!res.ok) throw new Error('remote not ok');
      } catch (_) {
        showTip('已本地保存，网络提交失败');
      }
    }
    form.reset();
    submitBtn.disabled = false; submitBtn.textContent = '提交回执';
    showTip('提交成功，感谢您的回复！');
    // 跳转到感谢区块
    try { document.getElementById('thanks').scrollIntoView({ behavior: 'smooth' }); } catch(_) {}
  });
  function showTip(msg){ tip.textContent = msg; setTimeout(()=> tip.textContent='', 3000); }
  
  // 宾客留言板存储功能
  async function saveGuestMessageToSheet(name, message) {
    if (!formEndpoint) {
      showTip('未配置云端存储，仅本地保存');
      return;
    }
    
    const guestbookData = {
      type: 'guestbook',
      name: name,
      message: message,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent.substring(0, 100)
    };
    
    try {
      // 使用与RSVP相同的Google Apps Script提交方式
      const params = new URLSearchParams();
      Object.keys(guestbookData).forEach(k => params.append(k, String(guestbookData[k] ?? '')));
      
      const res = await fetch(formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: params,
        mode: 'cors'
      });
      
      if (!res.ok) throw new Error('提交失败');
      showTip('留言已保存到云端！');
    } catch (error) {
      console.error('保存到云端失败:', error);
      showTip('云端保存失败，已本地保存');
    }
  }
  
  // 从Google Sheets加载留言
  async function loadGuestMessagesFromSheet() {
    if (!formEndpoint) return;
    
    try {
      // 这里需要一个新的端点来获取留言数据
      // 暂时使用本地存储作为备选方案
      const localMessages = JSON.parse(localStorage.getItem('guestbook_messages') || '[]');
      if (localMessages.length > 0) {
        localMessages.forEach(msg => {
          addGuestMessageFromStorage(msg);
        });
      }
    } catch (error) {
      console.error('加载云端留言失败:', error);
    }
  }

  // Share + QR
  const urlInput = document.getElementById('inviteUrl');
  const qrImg = document.getElementById('qrImg');
  const copyBtn = document.getElementById('copyBtn');
  const exportBtn = document.getElementById('exportCsvBtn');
  const openSheetBtn = document.getElementById('openSheetBtn');
  const currentUrl = window.location.href;
  urlInput.value = currentUrl;
  function refreshQR(){
    const u = encodeURIComponent(urlInput.value.trim() || currentUrl);
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${u}`;
  }
  refreshQR();
  urlInput.addEventListener('input', refreshQR);
  copyBtn.addEventListener('click', async function(){
    try { await navigator.clipboard.writeText(urlInput.value); showTip('链接已复制'); } catch (_) { showTip('复制失败'); }
  });

  // 统计图表（近 7 天）
  function refreshStats(){
    const key = 'wedding_rsvp_records';
    const rows = JSON.parse(localStorage.getItem(key) || '[]');
    const submits = rows.length;
    const guests = rows.reduce((s,r)=> s + (parseInt(r.count,10)||0), 0);
    const uniq = new Set(rows.map(r=>r.phone)).size;
    setText('statSubmits', submits);
    setText('statGuests', guests);
    setText('statUnique', uniq);
    const trend = document.getElementById('trend');
    if(trend){
      const now = new Date();
      const days = [...Array(7)].map((_,i)=>{
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate()-6+i);
        const key = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
        const n = rows.filter(r=>{
          const rd = new Date(r.ts||0); const k = `${rd.getFullYear()}-${rd.getMonth()+1}-${rd.getDate()}`;
          return k===key;
        }).length;
        return { date: d, n };
      });
      trend.innerHTML = '';
      const max = Math.max(1, ...days.map(d=>d.n));
      days.forEach(d=>{
        const bar = document.createElement('div');
        bar.title = `${d.date.getMonth()+1}/${d.date.getDate()}：${d.n}`;
        bar.style.height = `${(d.n/max)*100}%`;
        bar.style.background = 'var(--primary)';
        bar.style.borderRadius = '8px';
        bar.style.boxShadow = 'var(--shadow)';
        trend.appendChild(bar);
      });
    }
  }
  refreshStats();
  // 导出 CSV（本机本地存储）
  if(exportBtn){
    exportBtn.addEventListener('click', function(){
      const key = 'wedding_rsvp_records';
      const rows = JSON.parse(localStorage.getItem(key) || '[]');
      if(!rows.length){ showTip('暂无本地记录'); return; }
      const to2 = n => n<10?'0'+n:n;
      const fmt = t => { const d=new Date(t||Date.now()); return `${d.getFullYear()}-${to2(d.getMonth()+1)}-${to2(d.getDate())} ${to2(d.getHours())}:${to2(d.getMinutes())}`; };
      const csv = '时间,姓名,人数,手机,留言\n' + rows.map(r => [fmt(r.ts), r.name, r.count, r.phone, (r.note||'').replace(/"/g,'""')].map(x=>`"${x}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='rsvp_local.csv'; a.click(); URL.revokeObjectURL(a.href);
    });
  }
  if(openSheetBtn){ openSheetBtn.addEventListener('click', function(){ if(cfg.sheetUrl) window.open(cfg.sheetUrl, '_blank'); else showTip('未配置云端表格链接'); }); }

  // 创建浮动爱心背景
  function createFloatingHearts() {
    const heartsContainer = document.getElementById('floatingHearts');
    if (!heartsContainer) return;
    
    for (let i = 0; i < 15; i++) {
      const heart = document.createElement('div');
      heart.className = 'floating-heart';
      heart.innerHTML = '♥';
      heart.style.left = Math.random() * 100 + '%';
      heart.style.top = Math.random() * 100 + '%';
      heart.style.animationDelay = Math.random() * 6 + 's';
      heart.style.fontSize = (Math.random() * 15 + 15) + 'px';
      heartsContainer.appendChild(heart);
    }
  }

  // BGM toggle (user gesture to start)
  const audio = document.getElementById('bgm');
  const audioToggle = document.getElementById('audioToggle');
  function toggleAudio(){
    if(!audio.src){ showTip('请替换音频文件 assets/img/bgm.mp3'); return; }
    if(audio.paused){ audio.play().then(()=> audioToggle.classList.add('playing')).catch(()=>showTip('自动播放受限，请再次点击')); }
    else { audio.pause(); audioToggle.classList.remove('playing'); }
  }
  audioToggle.addEventListener('click', toggleAudio);
  audioToggle.addEventListener('keydown', function(e){ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); toggleAudio(); } });

  // 宾客留言板功能
  function addGuestMessage() {
    const messageInput = document.getElementById('newMessage');
    const message = messageInput.value.trim();
    
    if (!message) {
      showTip('请输入您的祝福');
      return;
    }
    
    // 生成随机宾客姓名
    const guestNames = ['匿名宾客', '神秘嘉宾', '幸福使者', '爱的见证者', '美好祝福者', '温馨朋友', '快乐伙伴'];
    const randomName = guestNames[Math.floor(Math.random() * guestNames.length)];
    
    // 使用新的添加函数
    addGuestMessageWithData(randomName, message);
    
    // 清空输入框
    messageInput.value = '';
  }

  // 自动滚动留言板
  let scrollInterval = null;
  let isScrolling = true;
  
  function autoScrollGuestbook() {
    const guestbookMessages = document.getElementById('guestbookMessages');
    if (!guestbookMessages) return;
    
    // 启用滚动
    guestbookMessages.style.overflowY = 'auto';
    
    let scrollDirection = 1;
    let scrollSpeed = 0.5;
    
    // 鼠标悬停时暂停滚动
    guestbookMessages.addEventListener('mouseenter', () => {
      isScrolling = false;
    });
    
    guestbookMessages.addEventListener('mouseleave', () => {
      if (document.getElementById('pauseScrollBtn').textContent.includes('暂停')) {
        isScrolling = true;
      }
    });
    
    // 触摸设备暂停滚动
    let touchStartY = 0;
    guestbookMessages.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
      isScrolling = false;
    });
    
    guestbookMessages.addEventListener('touchend', () => {
      if (document.getElementById('pauseScrollBtn').textContent.includes('暂停')) {
        setTimeout(() => {
          isScrolling = true;
        }, 1000);
      }
    });
    
    scrollInterval = setInterval(() => {
      if (!isScrolling) return;
      
      if (guestbookMessages.scrollTop >= guestbookMessages.scrollHeight - guestbookMessages.clientHeight) {
        scrollDirection = -1;
      } else if (guestbookMessages.scrollTop <= 0) {
        scrollDirection = 1;
      }
      
      guestbookMessages.scrollTop += scrollDirection * scrollSpeed;
    }, 30);
  }

  // 切换滚动状态
  function toggleScroll() {
    const btn = document.getElementById('pauseScrollBtn');
    if (isScrolling) {
      isScrolling = false;
      btn.textContent = '▶️ 开始滚动';
      btn.style.background = '#4CAF50';
    } else {
      isScrolling = true;
      btn.textContent = '⏸️ 暂停滚动';
      btn.style.background = 'var(--primary)';
    }
  }

  // 添加测试留言
  function addTestMessage() {
    const testMessages = [
      { name: '测试用户1', text: '这是一条测试留言，用来测试滚动效果！' },
      { name: '测试用户2', text: '滚动效果真的很棒，看起来很流畅！' },
      { name: '测试用户3', text: '留言板功能完全正常，可以正常添加新留言！' },
      { name: '测试用户4', text: '悬浮滚动展示效果非常优雅！' },
      { name: '测试用户5', text: '这个婚礼请柬设计得太美了！' }
    ];
    
    const randomMessage = testMessages[Math.floor(Math.random() * testMessages.length)];
    addGuestMessageWithData(randomMessage.name, randomMessage.text);
  }

  // 宾客留言板功能
  function addGuestMessage() {
    const messageInput = document.getElementById('newMessage');
    const message = messageInput.value.trim();
    
    if (!message) {
      showTip('请输入您的祝福');
      return;
    }
    
    // 生成随机宾客姓名
    const guestNames = ['匿名宾客', '神秘嘉宾', '幸福使者', '爱的见证者', '美好祝福者', '温馨朋友', '快乐伙伴'];
    const randomName = guestNames[Math.floor(Math.random() * guestNames.length)];
    
    // 使用新的添加函数
    addGuestMessageWithData(randomName, message);
    
    // 清空输入框
    messageInput.value = '';
  }

  // 微信分享功能
  function initWechatShare() {
    // 检测是否在微信中打开
    const isWechat = /MicroMessenger/i.test(navigator.userAgent);
    
    if (isWechat) {
      // 在微信中，显示分享提示
      showWechatShareTip();
      
      // 监听微信分享事件
      document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
        WeixinJSBridge.on('menu:share:appmessage', function (argv) {
          WeixinJSBridge.invoke('shareTimeline', {
            title: '司武坤 · 宋梦婷 的婚礼请柬',
            desc: '诚邀您见证我们的幸福时刻',
            link: window.location.href,
            imgUrl: window.location.origin + '/assets/img/cover.jpg'
          });
        });
        
        WeixinJSBridge.on('menu:share:timeline', function (argv) {
          WeixinJSBridge.invoke('shareTimeline', {
            title: '司武坤 · 宋梦婷 的婚礼请柬',
            desc: '诚邀您见证我们的幸福时刻',
            link: window.location.href,
            imgUrl: window.location.origin + '/assets/img/cover.jpg'
          });
        });
      });
    }
  }
  
  // 显示微信分享提示
  function showWechatShareTip() {
    const shareTip = document.createElement('div');
    shareTip.className = 'wechat-share-tip';
    shareTip.innerHTML = `
      <div class="share-tip-content">
        <div class="share-tip-icon">📱</div>
        <div class="share-tip-text">点击右上角"..."分享给朋友</div>
        <button class="share-tip-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    document.body.appendChild(shareTip);
    
    // 3秒后自动隐藏
    setTimeout(() => {
      if (shareTip.parentElement) {
        shareTip.remove();
      }
    }, 5000);
  }

  // 从Google Sheets读取留言
  async function loadGuestMessagesFromSheet() {
    if (!formEndpoint) return;
    
    try {
      // 使用现有的formEndpoint来读取数据
      // 由于Google Apps Script的限制，我们需要通过POST请求来获取数据
      const response = await fetch(formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: 'action=read_guestbook',
        mode: 'cors'
      });
      
      if (response.ok) {
        const data = await response.text();
        
        // 尝试解析返回的数据
        let messages = [];
        try {
          // 如果返回的是JSON格式
          if (data.startsWith('{') || data.startsWith('[')) {
            const jsonData = JSON.parse(data);
            messages = jsonData.messages || jsonData || [];
          } else {
            // 如果返回的是CSV格式或其他格式，尝试解析
            messages = parseSheetData(data);
          }
          
          if (messages && messages.length > 0) {
            // 清空现有留言
            const guestbookMessages = document.getElementById('guestbookMessages');
            guestbookMessages.innerHTML = '';
            
            // 添加从Google Sheets读取的留言
            messages.forEach((msg, index) => {
              if (msg.name && msg.message) {
                addGuestMessageFromSheet({
                  id: index + 1,
                  name: msg.name,
                  message: msg.message
                });
              }
            });
            
            showTip(`已从云端加载 ${messages.length} 条留言`);
          }
        } catch (parseError) {
          console.error('解析数据失败:', parseError);
          showTip('数据格式错误，保持预设留言');
        }
      }
    } catch (error) {
      console.error('从Google Sheets读取留言失败:', error);
      // 如果读取失败，保持预设留言
    }
  }
  
  // 解析Google Sheets数据
  function parseSheetData(data) {
    const messages = [];
    
    // 尝试解析CSV格式
    const lines = data.split('\n');
    if (lines.length > 1) {
      // 跳过标题行，从第二行开始
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
          const columns = line.split(',').map(col => col.replace(/"/g, ''));
          if (columns.length >= 5) {
            // 根据你的表格结构：填写时间,姓名,人数,手机号码,留言,数据汇总
            const name = columns[1]; // 姓名列
            const message = columns[4]; // 留言列
            
            if (name && message && name !== '姓名' && message !== '留言') {
              messages.push({
                name: name,
                message: message
              });
            }
          }
        }
      }
    }
    
    return messages;
  }

  // 从存储数据添加留言（不保存到存储）
  function addGuestMessageFromSheet(messageData) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'guest-message';
    messageDiv.setAttribute('data-message-id', messageData.id);
    messageDiv.style.animation = 'slideInUp 0.5s ease forwards';
    
    messageDiv.innerHTML = `
      <div class="guest-name">${messageData.name}</div>
      <div class="guest-text">${messageData.message}</div>
    `;
    
    const guestbookMessages = document.getElementById('guestbookMessages');
    guestbookMessages.appendChild(messageDiv);
  }

  // 使用指定数据添加留言
  function addGuestMessageWithData(name, message) {
    // 创建新留言
    const messageDiv = document.createElement('div');
    messageDiv.className = 'guest-message';
    messageDiv.style.animation = 'slideInUp 0.5s ease forwards';
    
    // 生成唯一ID
    const messageId = Date.now();
    messageDiv.setAttribute('data-message-id', messageId);
    
    messageDiv.innerHTML = `
      <div class="guest-name">${name}</div>
      <div class="guest-text">${message}</div>
    `;
    
    // 添加到留言板
    const guestbookMessages = document.getElementById('guestbookMessages');
    guestbookMessages.appendChild(messageDiv);
    
    // 滚动到最新留言
    guestbookMessages.scrollTop = guestbookMessages.scrollHeight;
    
    // 保存到Google Sheets
    saveGuestMessageToSheet(name, message);
    
    // 显示成功提示
    showTip('留言添加成功！');
  }

  // 初始化浮动爱心
  createFloatingHearts();
  
  // 初始化留言板自动滚动
  setTimeout(() => {
    autoScrollGuestbook();
  }, 2000);
  
  // 加载之前保存的留言
  loadGuestMessagesFromSheet();
  
  // 初始化微信分享
  initWechatShare();
  // 将函数暴露到全局作用域，以便HTML的onclick属性可以访问
  window.addGuestMessage = addGuestMessage;
  window.toggleScroll = toggleScroll;
  window.addTestMessage = addTestMessage;
})();
