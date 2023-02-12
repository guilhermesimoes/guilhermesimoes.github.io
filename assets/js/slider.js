// taken from https://github.com/chenglou/tween-functions/blob/master/index.js
// t: current time, b: beginning value, _c: final value, d: total duration
function easeInOutCubic(t, b, _c, d) {
    var c = _c - b;
    if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t + b;
    } else {
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    }
}

function clamp(val) {
    return Math.max(Math.min(val, 1), 0);
}

class Transition {
    constructor(duration, cb, easeFn) {
        this.duration = duration;
        this.cb = cb;
        this.easeFn = easeFn || easeInOutCubic;
        this.tick = this.tick.bind(this);
        this.isRunning = false;
    }

    start() {
        this.startTimestamp = performance.now();
        if (this.isRunning === false) {
            this.isRunning = true;
            requestAnimationFrame(this.tick);
        }
    }

    tick(timestamp) {
        var timeElapsed = timestamp - this.startTimestamp;
        var from = 0;
        var to = 1;

        this.progress = clamp(this.easeFn(timeElapsed, from, to, this.duration));
        this.cb(this.progress);
        if (timeElapsed < this.duration) {
            requestAnimationFrame(this.tick);
        } else {
            this.isRunning = false;
        }
    }
}

class PlayPauseButton {
    constructor(el, onAction) {
      this.el = el;
      this.onAction = onAction;
      this.replaceUseWithPath();
      this.el.addEventListener('click', this.onClick.bind(this));
      this.transition = new Transition(250, this.tick.bind(this));
    }

    replaceUseWithPath() {
        var useEl = this.el.querySelector("use");
        var iconId = useEl.getAttribute("xlink:href");
        var iconEl = document.querySelector(iconId);
        var nextState = iconEl.getAttribute("data-next-state");
        var iconPath = iconEl.getAttribute("d");

        this.pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
        this.pathEl.setAttribute("data-next-state", nextState);
        this.pathEl.setAttribute("d", iconPath);

        var svgEl = this.el.querySelector("svg");
        svgEl.replaceChild(this.pathEl, useEl);
    }

    onClick() {
      var state = this.goToNextState();
      if (this.onAction) { return this.onAction(state) };
    }

    goToNextState() {
      var iconPath = this.pathEl.getAttribute("d");

      var nextState = this.pathEl.getAttribute("data-next-state");
      var nextIconEl = document.querySelector(`[data-state="${nextState}"]`);
      var nextIconPath = nextIconEl.getAttribute("d");
      var nextNextState = nextIconEl.getAttribute("data-next-state");

      this.pathEl.setAttribute("data-next-state", nextNextState);
      this.pathInterpolator = d3.interpolatePath(iconPath, nextIconPath);
      this.transition.start();

      return nextState;
    }

    tick(progress) {
      this.pathEl.setAttribute("d", this.pathInterpolator(progress));
    }
};

class Slider {
  constructor(container, options) {
    var options = Object.assign({ animationDurationMs: 1500, fillMode: 'backwards' }, options);
    this.prevTimestamp = 0;
    this.fillMode = options.fillMode;
    this.animationState = 'paused';
    this.display = container.querySelector('.display');
    this.input = container.querySelector('input');
    var button = container.querySelector('button');
    this.playPauseButton = new PlayPauseButton(button, this.onPlayPause.bind(this));
    this.input.addEventListener('input', this.onInputChange.bind(this));

    this.step = this.max / options.animationDurationMs;
    this.tick = this.tick.bind(this);
  }

  onPlayPause(state) {
    this.animationState = state;
    if (state === 'playing') {
      if (this.value === this.max) {
        this.value = 0;
      }

      this.prevTimestamp = performance.now();
      requestAnimationFrame(this.tick);
    }
  }

  onInputChange(event) {
    this.display.textContent = ~~event.target.value;
    if (this.animationState === 'playing') {
      this.animationState = this.playPauseButton.goToNextState();
    }
  }

  tick(timestamp) {
    if (this.animationState === 'playing') {
      var value = this.value;
      if (value < this.max) {
        var timeInterval = timestamp - this.prevTimestamp;
        this.value = Math.min(value + timeInterval * this.step, this.max);
      } else {
        if (this.fillMode === 'backwards') {
          setTimeout(() => {
            this.value = 0;
          }, 100);
        }
        this.animationState = this.playPauseButton.goToNextState();
      }
      this.prevTimestamp = timestamp;
      requestAnimationFrame(this.tick);
    }
  }

  set value(val) {
    this.display.textContent = val.toFixed(0);
    this.input.value = val;
  }

  get value() {
    return parseFloat(this.input.value);
  }

  get max() {
    if (this.maxVal) {
      return this.maxVal;
    }
    this.maxVal = parseFloat(this.input.max);
    return this.maxVal;
  }
};
