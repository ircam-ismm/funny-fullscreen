const zoneSize = 100; // in pixels

let inBottomLeftZoneId = null;
let inTopRightZoneId = null;
let timeoutId = null;
let timeoutTriggered = false;

function checkInTopRightZone(clientX, clientY) {
  if (clientX > window.innerWidth - zoneSize && clientY < zoneSize) {
    return true;
  }

  return false;
}

function checkInBottomLeftZone(clientX, clientY) {
  if (clientX < zoneSize && clientY > window.innerHeight - zoneSize) {
    return true;
  }

  return false;
}

function onTouchStart(e) {
  // bypass everything we can when in full screen
  if (document.fullscreenElement) {
    e.preventDefault();
    e.stopPropagation();
  }

  if (e.touches.length === 2) {
    for (let touch of e.touches) {
      const { identifier, clientX, clientY } = touch;

      if (checkInTopRightZone(clientX, clientY)) {
        inBottomLeftZoneId = identifier;
      }

      if (checkInBottomLeftZone(clientX, clientY)) {
        inTopRightZoneId = identifier;
      }
    }
  }

  if (inBottomLeftZoneId !== null && inTopRightZoneId !== null) {
    timeoutTriggered = false;
    timeoutId = setTimeout(() => {
      timeoutTriggered = true;
      // need some visual feedback
      const $div = document.createElement('div');
      $div.style.width = `${window.innerWidth}px`;
      $div.style.height = `${window.innerHeight}px`;
      $div.style.position = 'absolute';
      $div.style.top = '0px';
      $div.style.left = '0px';
      $div.style.zIndex = 1000000;
      $div.style.backgroundColor = '#cd7afaff';
      document.body.appendChild($div);

      setTimeout(() => $div.remove(), 100);
    }, 2000);
  }
}

function onTouchMove(e) {
  // bypass everything we can when in full screen
  if (document.fullscreenElement) {
    e.preventDefault();
    e.stopPropagation();
  }
}

function onTouchEnd(e) {
  // bypass everything we can when in full screen
  if (document.fullscreenElement) {
    e.preventDefault();
    e.stopPropagation();
  }

  // check if we didn't move outside the zones
  if (e.touches.length === 2) {
    for (let touch of e.touches) {
      const { identifier, clientX, clientY } = touch;

      // still in zone and didn't move
      if (!(checkInTopRightZone(clientX, clientY) && inBottomLeftZoneId === identifier)) {
        inBottomLeftZoneId = null;
      }

      if (!(checkInBottomLeftZone(clientX, clientY) && inTopRightZoneId === identifier)) {
        inTopRightZoneId = null;
      }
    }
  }

  if (timeoutTriggered && inBottomLeftZoneId !== null && inTopRightZoneId !== null) {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  inBottomLeftZoneId = null;
  inTopRightZoneId = null;
  clearTimeout(timeoutId);
}

export default {
  enable() {
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchEnd);
  },

  disable() {
    window.removeEventListener('touchstart', onTouchStart);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchend', onTouchEnd);
    window.removeEventListener('touchcancel', onTouchEnd);
  },
};