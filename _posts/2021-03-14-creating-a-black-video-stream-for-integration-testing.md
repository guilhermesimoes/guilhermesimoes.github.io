---
layout:   post
title:    "Creating a black video stream for integration testing"
subtitle: ""
date:     2021-03-14 14:48:36 +0100
---

Tired of Big Buck Bunny?

só precisas de criar um PNG preto
photopea

replicá-lo aos milhares com um script em bash, e usar o que está descrito acima
https://unix.stackexchange.com/questions/291065/duplicate-file-x-times-in-command-shell

a partir daí, se quiseres fazer HLS, podes usar a seguinte abordagem:
partir o vídeo preto em vários com o ffmpeg: https://google.github.io/shaka-packager/html/tutorials/encoding.html#h264-encoding
montar o HLS com o shaka-packager: https://google.github.io/shaka-packager/html/tutorials/hls.html#examples

o shaka-packager tem uma docker image que é relativamente simples de montar

o que demora mais tempo é acertar com os parâmetros certos na consola :slightly_smiling_face: (edited)

o ffmpeg consegues instalar com o brew