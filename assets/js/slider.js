class Transition {
    constructor(duration, cb) {
        this.fullDuration = duration;
        this.cb = cb;
        this.tick = this.tick.bind(this);
    }

    start() {
        this.startTimestamp = performance.now();
        if (this.progress === undefined) {
            this.progress = 0;
            this.duration = this.fullDuration;
            requestAnimationFrame(this.tick);
        } else {
            this.duration = this.progress * this.fullDuration;
            this.progress = 1 - this.progress;
        }
    }

    tick(timestamp) {
        // TODO instead of a linear transition, implement D3's default ease-cubic https://github.com/d3/d3-transition#transition_ease
        var progressDuration = timestamp - this.startTimestamp;
        this.progress = Math.max(Math.min(progressDuration / this.duration, 1), 0);

        this.cb(this.progress);
        if (this.progress < 1) {
            requestAnimationFrame(this.tick);
        } else {
            this.progress = undefined;
        }
    }
}

class PlayPauseButton {
    constructor(el, onAction) {
      this.el = el;
      this.onAction = onAction;
      this.replaceUseWithPath();
      this.el.addEventListener('click', this.onClick.bind(this));
      this.transition = new Transition(200, this.tick.bind(this));
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
