//= require anchor-js/anchor.min.js
//= require_tree .

document.addEventListener('DOMContentLoaded', function() {
  anchors.options = {
    placement: 'left'
  };
  anchors.add(); // headers

  anchors.options = {
    placement: 'left',
    icon: '¶'
  };
  anchors.add('.post-content > p');
});
