// 도노트 임베드 위젯 SDK
// Vanilla JS + Shadow DOM으로 스타일 격리
// 사용법: <script src="https://donote.site/widget/sdk.js" data-handle="username"></script>

(function () {
  'use strict';

  // 위젯 스타일 정의
  const styles = `
    @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
    @import url('https://fonts.googleapis.com/css2?family=Gamja+Flower&display=swap');

    :host {
      display: inline-block;
      font-family: 'Pretendard', sans-serif;
      --cream-yellow: #FFD95A;
      --coral-pink: #FF6B6B;
      --paper-white: #F9F9F9;
      --text-main: #333333;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    .donote-widget {
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      transition: transform 0.2s ease;
      position: relative;
    }
    
    .donote-widget:hover {
      transform: translateY(-2px);
    }

    /* 🎫 빈티지 티켓 스타일 */
    .donote-ticket {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 24px;
      background: white;
      color: var(--text-main);
      position: relative;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
      
      /* 톱니바퀴 (Serrated Edge) - 좌우 */
      --r: 6px; /* radius */
      background-image: 
        radial-gradient(circle at 0 50%, transparent var(--r), white calc(var(--r) + 0.5px)), 
        radial-gradient(circle at 100% 50%, transparent var(--r), white calc(var(--r) + 0.5px));
      background-size: 100% 20px; /* 톱니 간격 */
      background-position: 0 0;
      background-repeat: repeat-y;
      
      /* 마스크로 깔끔하게 처리 (지원 브라우저용) */
      mask: 
        radial-gradient(circle at 0 10px, transparent 6px, black 6.5px) 0 0 / 100% 20px,
        radial-gradient(circle at 100% 10px, transparent 6px, black 6.5px) 0 0 / 100% 20px;
      mask-composite: intersect;
    }

    /* Fallback for mask (단순 보더) */
    @supports not (mask: radial-gradient(circle, #000 1px, transparent 0)) {
      .donote-ticket {
        border-right: 2px dashed #ccc;
        border-left: 2px dashed #ccc;
        border-radius: 8px;
        background-image: none;
      }
    }
    
    .donote-ticket .icon {
      font-size: 28px;
      filter: drop-shadow(0 2px 2px rgba(0,0,0,0.1));
    }
    
    .donote-ticket .content {
      display: flex;
      flex-direction: column;
    }
    
    .donote-ticket .label {
      font-family: 'Gamja Flower', cursive;
      font-size: 14px;
      color: #666;
      margin-bottom: 2px;
    }
    
    .donote-ticket .text {
      font-weight: 700;
      font-size: 16px;
      color: var(--text-main);
    }

    /* 🏷️ 스탬프 버튼 스타일 */
    .donote-button {
      background: white;
      border: 2px dashed #ccc;
      padding: 10px 20px;
      border-radius: 4px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: 'Gamja Flower', cursive;
      font-size: 18px;
      color: #555;
      position: relative;
    }
    
    .donote-button:hover {
      border-color: var(--coral-pink);
      color: var(--coral-pink);
      background: #FFF0F0;
    }

    .donote-button .icon {
      font-size: 20px;
    }

    /* 테마 적용 */
    .theme-yellow .text { color: #D9A000; }
    .theme-coral .text { color: #E05050; }
    
    /* 💬 툴팁 (말풍선) */
    .tooltip {
      position: absolute;
      bottom: 110%;
      left: 50%;
      transform: translateX(-50%) scale(0.8);
      padding: 6px 12px;
      background: var(--text-main);
      color: white;
      font-size: 12px;
      font-weight: bold;
      border-radius: 20px;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      pointer-events: none;
      z-index: 100;
    }
    
    .tooltip::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 5px solid transparent;
      border-top-color: var(--text-main);
    }
    
    .donote-widget:hover .tooltip {
      opacity: 1;
      visibility: visible;
      transform: translateX(-50%) scale(1);
      bottom: 120%;
    }
    `;

  // Web Component 정의
  class DonoteWidget extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
      return ['handle', 'style-type', 'theme', 'text'];
    }

    connectedCallback() {
      this.render();
    }

    attributeChangedCallback() {
      this.render();
    }

    render() {
      const handle = this.getAttribute('handle') || 'demo';
      const styleType = this.getAttribute('style-type') || 'ticket';
      const theme = this.getAttribute('theme') || 'yellow';
      const text = this.getAttribute('text') || '커피 한 잔 ☕';
      const url = `https://donote.site/${handle}`;

      let widgetHTML = '';

      if (styleType === 'ticket') {
        widgetHTML = `
          <a href="${url}" target="_blank" class="donote-widget donote-ticket theme-${theme}">
            <span class="tooltip">Write a note! ✍️</span>
            <span class="icon">🍩</span>
            <div class="content">
              <div class="label">To. ${handle}</div>
              <div class="text">${text}</div>
            </div>
          </a>
        `;
      } else if (styleType === 'button') {
        widgetHTML = `
          <a href="${url}" target="_blank" class="donote-widget donote-button theme-${theme}">
            <span class="tooltip">Write a note! ✍️</span>
            <span class="icon">🍩</span>
            <span>${text}</span>
          </a>
        `;
      } else if (styleType === 'mini') {
        widgetHTML = `
          <a href="${url}" target="_blank" class="donote-widget donote-mini theme-${theme}">
            <span class="tooltip">Write a note! ✍️</span>
            <span class="icon">💌</span>
            <span>${text}</span>
          </a>
        `;
      }

      this.shadowRoot.innerHTML = `
        <style>${styles}</style>
        ${widgetHTML}
      `;
    }
  }

  // 커스텀 엘리먼트 등록
  if (!customElements.get('donote-widget')) {
    customElements.define('donote-widget', DonoteWidget);
  }

  // 자동 초기화: data-handle 속성이 있는 스크립트 태그 찾기
  document.addEventListener('DOMContentLoaded', function () {
    const scripts = document.querySelectorAll('script[data-donote-handle]');
    scripts.forEach(script => {
      const handle = script.getAttribute('data-donote-handle');
      const style = script.getAttribute('data-donote-style') || 'ticket';
      const theme = script.getAttribute('data-donote-theme') || 'yellow';
      const text = script.getAttribute('data-donote-text') || '커피 한 잔 ☕';

      const widget = document.createElement('donote-widget');
      widget.setAttribute('handle', handle);
      widget.setAttribute('style-type', style);
      widget.setAttribute('theme', theme);
      widget.setAttribute('text', text);

      script.parentNode.insertBefore(widget, script.nextSibling);
    });
  });

  // 전역 API 노출
  window.Donote = {
    create: function (container, options = {}) {
      const widget = document.createElement('donote-widget');
      widget.setAttribute('handle', options.handle || 'demo');
      widget.setAttribute('style-type', options.style || 'ticket');
      widget.setAttribute('theme', options.theme || 'yellow');
      widget.setAttribute('text', options.text || '커피 한 잔 ☕');

      if (typeof container === 'string') {
        document.querySelector(container).appendChild(widget);
      } else {
        container.appendChild(widget);
      }

      return widget;
    }
  };

})();
