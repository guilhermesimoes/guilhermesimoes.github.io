class PlayPauseButton {
    constructor(el, onAction) {
      this.el = el;
      this.animationDuration = 200;
      this.onAction = onAction;
      this.replaceUseWithPath();
      this.el.addEventListener('click', this.onClick.bind(this));
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
      var nextState = this.pathEl.getAttribute("data-next-state");
      var nextIconEl = document.querySelector(`[data-state="${nextState}"]`);
      var iconPath = nextIconEl.getAttribute("d");
      var nextNextState = nextIconEl.getAttribute("data-next-state");

      d3.select(this.pathEl)
          .attr("data-next-state", nextNextState)
          .transition()
              .duration(this.animationDuration)
              .attr("d", iconPath);

      return nextState;
    }
};

class Slider {
  constructor(container, { animationDuration, fillMode = 'backwards' }) {
    this.prevTimestamp = 0;
    this.fillMode = fillMode;
    this.animationState = 'paused';
    this.display = container.querySelector('.display');
    this.input = container.querySelector('input');
    var button = container.querySelector('button');
    this.playPauseButton = new PlayPauseButton(button, this.onPlayPause.bind(this));
    this.input.addEventListener('input', this.onInputChange.bind(this));

    this.step = this.max / animationDuration;
    this.tick = this.tick.bind(this);
    requestAnimationFrame(this.tick);
  }

  onPlayPause(state) {
    this.animationState = state;
    if (state === 'playing' && this.value === this.max) {
      this.input.value = 0;
    }
  }

  onInputChange(event) {
    this.display.textContent = event.target.value;
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
          this.value = 0;
        }
        this.animationState = this.playPauseButton.goToNextState();
      }
    }
    this.prevTimestamp = timestamp;
    requestAnimationFrame(this.tick);
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
