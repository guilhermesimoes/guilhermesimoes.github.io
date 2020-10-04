class PlayPauseButton {
    constructor(el, onAction) {
      this.el = el;
      this.onAction = onAction;
      this.el.addEventListener('click', this.onClick.bind(this));
    }

    onClick() {
      var state = this.goToNextState();
      if (this.onAction) { return this.onAction(state) };
    }

    goToNextState() {
      var useEl = this.el.querySelector('use');
      var iconId = useEl.getAttribute('xlink:href');
      var currentIcon = document.querySelector(iconId);
      var nextIcon = currentIcon.getAttribute('data-next-icon');

      useEl.setAttribute('xlink:href', '#' + nextIcon);

      if (nextIcon === 'play-icon') {
        return 'paused';
      } else {
        return 'playing';
      }
    }
};

class Slider {
  constructor(container, animationDuration) {
    this.prevTimestamp = 0;
    this.animationState = 'paused';
    this.input = container.querySelector('input');
    var button = container.querySelector('button');
    this.playPauseButton = new PlayPauseButton(button, state => {
      this.animationState = state;
      if (state === 'playing' && this.value === this.max) {
        this.input.value = 0;
      }
    });

    this.input.addEventListener('input', () => {
      if (this.animationState === 'playing') {
        this.animationState = this.playPauseButton.goToNextState();
      }
    });

    this.step = this.max / animationDuration;
    this.tick = this.tick.bind(this);
    requestAnimationFrame(this.tick);
  }

  tick(timestamp) {
    if (this.animationState === 'playing') {
      var value = this.value;
      if (value < this.max) {
        var timeInterval = timestamp - this.prevTimestamp;
        this.value = value + timeInterval * this.step;
      } else {
        this.animationState = this.playPauseButton.goToNextState();
      }
    }
    this.prevTimestamp = timestamp;
    requestAnimationFrame(this.tick);
  }

  set value(val) {
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
