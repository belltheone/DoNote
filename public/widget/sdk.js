// 도노트 임베드 위젯 SDK
// Vanilla JS + Shadow DOM으로 스타일 격리
// 사용법: <script src="https://donote.kr/widget/sdk.js" data-handle="username"></script>

(function () {
    'use strict';

    // 위젯 스타일 정의
    const styles = `
    :host {
      display: inline-block;
      font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    .donote-widget {
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
    }
    
    .donote-widget:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    /* 티켓 스타일 */
    .donote-ticket {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 24px;
      border-radius: 12px;
      border: 2px dashed rgba(0, 0, 0, 0.1);
      position: relative;
    }
    
    .donote-ticket::before,
    .donote-ticket::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      background: white;
      border-radius: 50%;
      top: 50%;
      transform: translateY(-50%);
    }
    
    .donote-ticket::before { left: -10px; }
    .donote-ticket::after { right: -10px; }
    
    .donote-ticket .icon {
      font-size: 24px;
    }
    
    .donote-ticket .content {
      text-align: left;
    }
    
    .donote-ticket .label {
      font-size: 10px;
      opacity: 0.7;
    }
    
    .donote-ticket .text {
      font-size: 14px;
      font-weight: 600;
    }
    
    /* 버튼 스타일 */
    .donote-button {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      border-radius: 50px;
      font-size: 14px;
      font-weight: 600;
    }
    
    .donote-button .icon {
      font-size: 18px;
    }
    
    /* 미니 스타일 */
    .donote-mini {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 500;
    }
    
    .donote-mini .icon {
      font-size: 14px;
    }
    
    /* 색상 테마 */
    .theme-yellow {
      background-color: #FFD95A;
      color: #333;
    }
    
    .theme-coral {
      background-color: #FF6B6B;
      color: #fff;
    }
    
    .theme-white {
      background-color: #fff;
      color: #333;
      border: 1px solid #ddd;
    }
    
    .theme-dark {
      background-color: #333;
      color: #fff;
    }
    
    /* 호버 말풍선 */
    .tooltip {
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      padding: 6px 12px;
      background: #333;
      color: white;
      font-size: 12px;
      border-radius: 6px;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s ease;
      margin-bottom: 8px;
    }
    
    .tooltip::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 6px solid transparent;
      border-top-color: #333;
    }
    
    .donote-widget:hover .tooltip {
      opacity: 1;
      visibility: visible;
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
            const url = `https://donote.kr/${handle}`;

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
