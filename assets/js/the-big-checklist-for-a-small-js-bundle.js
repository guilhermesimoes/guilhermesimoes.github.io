var form = document.querySelector('form');
var userDoneTasks;
try {
  userDoneTasks = JSON.parse(localStorage.getItem('jsBundleTasks')) || {};
} catch (_error) {
  userDoneTasks = {};
}

checkUserDoneTasks();
form.addEventListener('click', toggleTask);

function toggleTask(event) {
  var task = findCheckbox(event.target);
  if (task) {
    if (task.checked) {
      userDoneTasks[task.id] = true;
    } else {
      delete userDoneTasks[task.id];
    }
    localStorage.setItem('jsBundleTasks', JSON.stringify(userDoneTasks));
  }
}

async function checkUserDoneTasks() {
  var tasks = form.querySelectorAll('[type="checkbox"]');
  for (var task of tasks) {
    if (userDoneTasks[task.id]) {
      task.checked = true;
    }
  }
}

function findCheckbox(el) {
  if (el.getAttribute('type') === 'checkbox') return el;
  return el.querySelector('[type="checkbox"]');
}

var template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      position: relative;
      display: inline-block;
    }

    :host svg {
      position: absolute;
      pointer-events: none;
      stroke-linecap: round;
      stroke-width: 0.5;
      fill: none;
      overflow: visible;
    }

    :host .border {
      stroke: currentColor;
    }

    :host .line {
      stroke-width: 1;
      stroke: rgba(10,128,0,.82);
      stroke-linejoin: round;
    }

    ::slotted(input) {
      opacity: 0;
    }
  </style>
  <svg viewbox='0 0 10 10'>
    <path class='border'></path>
    <path class='line'></path>
  </svg>
  <slot></slot>
`;

class HandDrawnCheckbox extends HTMLElement {
  connectedCallback() {
    this.checkbox = this.querySelector('input[type="checkbox"]');
    this.checkbox.addEventListener('change', this._onChange);

    if (!this.shadowRoot) {
      var templateClone = template.content.cloneNode(true);
      var borderEl = templateClone.querySelector('.border');
      borderEl.setAttribute('d', getBorderPath());
      this.checkmarkEl = templateClone.querySelector('.line');

      var shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(templateClone);
    }

    this._onChange();
  }

  disconnectedCallback() {
    this.checkbox.removeEventListener('change', this._onChange);
  }

  _onChange = () => {
    toggleVisibility(this.checkmarkEl, this.checkbox);
  }
}

function toggleVisibility(checkmarkEl, checkbox) {
  if (checkbox.checked) {
    checkmarkEl.setAttribute('d', getLine1Path());
    checkmarkEl.style.transition = 'none';
    checkmarkEl.style.strokeDasharray = checkmarkEl.style.strokeDashoffset = getPathLength(checkmarkEl);

    setTimeout(() => {
      if (!checkbox.checked) { return; }
      checkmarkEl.style.transition = 'stroke-dashoffset 200ms ease';
      checkmarkEl.style.strokeDashoffset = 0;
    }, 10);
  } else {
    checkmarkEl.style.strokeDashoffset = getPathLength(checkmarkEl);
  }
}

function getPathLength(path) {
  return Math.ceil(path.getTotalLength()) + 1; // Handle rounding issues
}

var checkStartXRange = [0.4, 2];
var checkStartYRange = [4, 5];
var checkMidXRange = [4.5, 5.5];
var checkMidYRange = [8, 9.8];
var checkEndXRange = [8.5, 9.8];
var checkEndYRange = [0.2, 2];
var borderCorner1Range = [0.2, 0.8];
var borderCorner2Range = [9.2, 9.8];

function getBorderPath() {
  return `M${getPoint(borderCorner1Range)} ${getPoint(borderCorner1Range)}L${getPoint(borderCorner2Range)} ${getPoint(borderCorner1Range)}M${getPoint(borderCorner2Range)} ${getPoint(borderCorner1Range)}L${getPoint(borderCorner2Range)} ${getPoint(borderCorner2Range)}M${getPoint(borderCorner2Range)} ${getPoint(borderCorner2Range)}L${getPoint(borderCorner1Range)} ${getPoint(borderCorner2Range)}M${getPoint(borderCorner1Range)} ${getPoint(borderCorner2Range)}L${getPoint(borderCorner1Range)} ${getPoint(borderCorner1Range)}M${getPoint(borderCorner1Range)} ${getPoint(borderCorner1Range)}`;
}

function getLine1Path() {
  const curveMidPointX = getPoint([3, 3.8])
  const curveMidPointY = getPoint([6.4, 7])
  return `M${getPoint(checkStartXRange)} ${getPoint(checkStartYRange)}C${curveMidPointX} ${curveMidPointY} ${curveMidPointX} ${curveMidPointY} ${getPoint(checkMidXRange)} ${getPoint(checkMidYRange)}L${getPoint(checkEndXRange)} ${getPoint(checkEndYRange)}`;
}

function getPoint(range) {
  var [start, end] = range;
  var diff = end - start;
  return +(start + Math.random() * diff).toFixed(2);
}

customElements.define('handdrawn-checkbox', HandDrawnCheckbox);
