import Identicon from 'identicon.js';
import icons from './icons';

function generateImage(hash, size = 40) {
  const image = new Identicon(hash, {
    foreground: [255, 255, 255, 255],
    background: [255, 255, 255, 1],
    margin: 0,
    size: size * 2, // 2x for retina
    format: 'svg',
  });

  return image.toString(true);
}

class TokenIcon extends HTMLElement {
  connectedCallback() {
    const hash = this.getAttribute('hash').toLowerCase();

    this.setIconColor(this.getAttribute('color') || '#fff');

    const customIcon = icons[hash];
    if ( customIcon ) {
      customIcon().then(({default: icon}) => this.setTemplate(icon))
    } else {
      this.setTemplate(generateImage(hash, 40))
    }
  }

  setTemplate(icon, isIdenticon) {
    this.createShadowRoot().innerHTML = `
      <style>
        :host {
          display: inline-block;
          width: 24px;
          height: 24px;
        }
        
        svg {
          width: 100%;
          height: 100%;
          fill: currentColor;
        }
        
        svg g {
          fill: currentColor !important;
          stroke: none !important;
          stroke-width: 0 !important;
        }
      </style>
      ${icon}
    `;

    if (isIdenticon) {
      const svgElement = this.shadowRoot.querySelector('svg');
      svgElement.setAttribute('viewBox', '0 0 80 80');
      svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    }
  }

  setIconColor(color = '#fff') {
    this.style.color = color;
  }
}

customElements.define('token-icon', TokenIcon);
