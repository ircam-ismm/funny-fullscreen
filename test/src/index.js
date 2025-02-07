import { html, render } from 'lit';
import funnyFullscreen from '../../index.js';

import '@ircam/sc-components/sc-button.js';

funnyFullscreen.enable();

render(html`
  <div class="top-right"></div>
  <div class="bottom-left"></div>
  <sc-button
    @input=${() => funnyFullscreen.enable()}
  >Enable</sc-button>
  <sc-button
    @input=${() => funnyFullscreen.disable()}
  >Disable</sc-button>
`, document.body);


