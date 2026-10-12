---
layout: post
title: "Nullish Coalescing Operator Chart"
date: 2026-05-27 08:00:45 +0000
image:
  path: /assets/images/csp-directives-chart.png
  alt: "Nullish coalescing operator chart."
tags: [D3, Web]
---

<div class="bleed">
<svg xmlns="http://www.w3.org/2000/svg" width="972" height="1624" class="mermaid-flowchart" viewBox="0 0 972 1624">
  <marker id="a" class="marker flowchart-v2" markerHeight="8" markerUnits="userSpaceOnUse" markerWidth="8" orient="auto" refX="5" refY="5" viewBox="0 0 10 10">
    <path d="m0 0 10 5-10 5z" class="arrowMarkerPath" style="stroke-width:1px;stroke-dasharray:1px,0"/>
  </marker>
  <g class="root">
    <g marker-end="url(#a)" class="edgePaths">
      <path d="M311.01 110v46" class="flowchart-link"/>
      <path d="m272.73 362.43-5.83 12.48c-5.82 12.48-17.46 37.43-23.28 55.34s-5.82 28.77-5.82 34.2v5.43" class="flowchart-link"/>
      <path d="m404.42 307.31 75.08 21.67c75.1 21.66 225.25 64.99 300.33 109.02 75.09 44.03 75.09 88.77 75.09 133.51v822.78c0 43.7 0 87.41-1.46 114.72-1.45 27.3-4.36 38.2-5.81 43.66l-1.45 5.45" class="flowchart-link"/>
      <path d="m190.79 622.15-12.94 13.94c-12.94 13.93-38.82 41.8-51.75 72.34-12.94 30.56-12.94 63.8-12.94 79v16.62" class="flowchart-link"/>
      <path d="m284.81 622.15 12.94 13.94c12.94 13.93 38.82 41.8 51.75 61.16s12.94 30.22 13.5 34.5v5.43" class="flowchart-link"/>
      <path d="m315.23 883.37-14.05 13.97c-14.06 13.96-42.16 41.9-56.22 75.36-14.05 33.47-14.05 72.47-14.05 91v19.5" class="flowchart-link"/>
      <path d="m409.65 883.37 14.06 13.97c14.05 13.96 42.16 41.9 56.21 61.3s14.06 30.25 14.5 52v5.43" class="flowchart-link"/>
      <path d="m454.5 1159.5-15.065 16.596c-24.249 26.739-50.669 56.429-63.879 87.959s-13.21 64.9-13.21 81.58v16.69" class="flowchart-link"/>
      <path d="m539.5 1164 8 9c25.983 29.196 52.403 58.886 65.613 79.156s13.21 31.14 13.21 36.57v5.43" class="flowchart-link"/>
      <path d="m594.11 1457.23-5.7 11.37c-5.7 11.36-17.12 34.09-22.82 50.88-5.71 16.8-5.71 27.66-5.71 33.09v5.43" class="flowchart-link"/>
      <path d="m674.37 1440.18 15.06 14.2a8989 8989 0 0 0 66.78 62.5 1766 1766 0 0 0 41.13 36.84l6.52 5.66" class="flowchart-link"/>
    </g>
    <g class="edgeLabels">
      <rect class="background" style="stroke:none"/>
      <g class="edgeLabel">
        <g class="label">
          <path d="M223.91 425.72h27.78v23.17h-27.78z" class="background"/>
          <text y="-10.1" text-anchor="middle" transform="translate(237.8 426.72)"><tspan x="0" y="-.1em" class="text-outer-tspan row" dy="1.1em"><tspan class="text-inner-tspan">No</tspan></tspan></text>
        </g>
      </g>
      <g class="edgeLabel">
        <g class="label">
          <path d="M838.2 955.58h33.43v23.17H838.2z" class="background"/>
          <text y="-10.1" text-anchor="middle" transform="translate(854.92 956.58)"><tspan x="0" y="-.1em" class="text-outer-tspan row" dy="1.1em"><tspan class="text-inner-tspan">Yes</tspan></tspan></text>
        </g>
      </g>
      <g class="edgeLabel">
        <g class="label">
          <path d="M108 698h33.43v23.17H108z" class="background"/>
          <text y="-10.1" text-anchor="middle" transform="translate(124 698)"><tspan x="0" y="-.1em" class="text-outer-tspan row" dy="1.1em"><tspan class="text-inner-tspan">Yes</tspan></tspan></text>
        </g>
      </g>
      <g class="edgeLabel">
        <g class="label">
          <path d="M343 694.17h27.78v23.17h-27.78z" class="background"/>
          <text y="-10.1" text-anchor="middle" transform="translate(357 695)"><tspan x="0" y="-.1em" class="text-outer-tspan row" dy="1.1em"><tspan class="text-inner-tspan">No</tspan></tspan></text>
        </g>
      </g>
      <g class="edgeLabel">
        <g class="label">
          <path d="M230 955h33.43v23.17h-33.43z" class="background"/>
          <text y="-10.1" text-anchor="middle" transform="translate(246 956)"><tspan x="0" y="-.1em" class="text-outer-tspan row" dy="1.1em"><tspan class="text-inner-tspan">Yes</tspan></tspan></text>
        </g>
      </g>
      <g class="edgeLabel">
        <g class="label">
          <path d="M474 955.58h27.78v23.17h-27.78z" class="background"/>
          <text y="-10.1" text-anchor="middle" transform="translate(488 957)"><tspan x="0" y="-.1em" class="text-outer-tspan row" dy="1.1em"><tspan class="text-inner-tspan">No</tspan></tspan></text>
        </g>
      </g>
      <g class="edgeLabel">
        <g class="label">
          <path d="M360 1251.6h33.43v23.17h-33.43z" class="background"/>
          <text y="-10.1" text-anchor="middle" transform="translate(377 1253)"><tspan x="0" y="-.1em" class="text-outer-tspan row" dy="1.1em"><tspan class="text-inner-tspan">Yes</tspan></tspan></text>
        </g>
      </g>
      <g class="edgeLabel">
        <g class="label">
          <path d="M607 1251.6h27.78v23.17h-27.78z" class="background"/>
          <text y="-10.1" text-anchor="middle" transform="translate(621 1252.6)"><tspan x="0" y="-.1em" class="text-outer-tspan row" dy="1.1em"><tspan class="text-inner-tspan">No</tspan></tspan></text>
        </g>
      </g>
      <g class="edgeLabel">
        <g class="label">
          <path d="M546 1513.83h33.43V1537h-33.43z" class="background"/>
          <text y="-10.1" text-anchor="middle" transform="translate(562 1515)"><tspan x="0" y="-.1em" class="text-outer-tspan row" dy="1.1em"><tspan class="text-inner-tspan">Yes</tspan></tspan></text>
        </g>
      </g>
      <g class="edgeLabel">
        <g class="label">
          <path d="M725.97 1490.35h27.78v23.17h-27.78z" class="background"/>
          <text y="-10.1" text-anchor="middle" transform="translate(740 1491.35)"><tspan x="0" y="-.1em" class="text-outer-tspan row" dy="1.1em"><tspan class="text-inner-tspan">No</tspan></tspan></text>
        </g>
      </g>
    </g>
    <g class="nodes">
      <g class="node">
        <path d="M181.01 8h260v102h-260z" class="basic label-container"/>
        <g class="label" transform="translate(200 34)">
          <rect/>
          <foreignObject width="220" height="48">
            <div xmlns="http://www.w3.org/1999/xhtml" style="display:table;line-height:1.5;max-width:220px;text-align:center;">
              <span class="nodeLabel">
                <p>
                  When can you use ?? if you care about bundle-size
                </p>
              </span>
            </div>
          </foreignObject>
        </g>
      </g>
      <g class="node">
        <path d="m311.51 400.72 97.64-97.64-97.64-97.64-97.64 97.64z" class="label-container"/>
        <g class="label" transform="translate(248 259)">
          <rect/>
          <foreignObject width="120" height="48">
            <div xmlns="http://www.w3.org/1999/xhtml" style="display:table-cell;line-height:1.5;max-width:120px;text-align:center">
              <span class="nodeLabel">
                <p>
                  Using ES2020 or above?
                </p>
              </span>
            </div>
          </foreignObject>
        </g>
      </g>
      <g class="node">
        <path d="m238.3 669.17 97.64-97.64-97.64-97.64-97.64 97.64z" class="label-container"/>
        <g class="label" transform="translate(167.16 559.52)">
          <rect/>
          <foreignObject width="141" height="24">
            <div xmlns="http://www.w3.org/1999/xhtml" style="display:table-cell;white-space:nowrap;line-height:1.5;max-width:200px;text-align:center">
              <span class="nodeLabel">
                <p>
                  Doing `num ?? 0`?
                </p>
              </span>
            </div>
          </foreignObject>
        </g>
      </g>
      <g class="node">
        <path d="M711.93 1562h252.08v54H711.93z" class="basic label-container"/>
        <g class="label" transform="translate(741.93 1577)">
          <rect/>
          <foreignObject width="192" height="24">
            <div xmlns="http://www.w3.org/1999/xhtml" style="display:table-cell;white-space:nowrap;line-height:1.5;max-width:200px;text-align:center">
              <span class="nodeLabel">
                <p>
                  Sure, feel free to use `??`
                </p>
              </span>
            </div>
          </foreignObject>
        </g>
      </g>
      <g class="node">
        <path d="M8 809.46h210.32v54H8z" class="basic label-container"/>
        <g class="label" transform="translate(38 824.46)">
          <rect/>
          <foreignObject width="150" height="24">
            <div xmlns="http://www.w3.org/1999/xhtml" style="display:table-cell;white-space:nowrap;line-height:1.5;max-width:200px;text-align:center">
              <span class="nodeLabel">
                <p>
                  Stop! Use `num || 0`
                </p>
              </span>
            </div>
          </foreignObject>
        </g>
      </g>
      <g class="node">
        <path d="m362.95 930.58 94.12-94.12-94.12-94.13-94.13 94.13z" class="label-container"/>
        <g class="label" transform="translate(295.32 824.46)">
          <rect/>
          <foreignObject width="134" height="24">
            <div xmlns="http://www.w3.org/1999/xhtml" style="display:table-cell;white-space:nowrap;line-height:1.5;max-width:200px;text-align:center">
              <span class="nodeLabel">
                <p>
                  Doing `str ?? &quot;&quot;`?
                </p>
              </span>
            </div>
          </foreignObject>
        </g>
      </g>
      <g class="node">
        <path d="M129.27 1088.18h203.28v54H129.27z" class="basic label-container"/>
        <g class="label" transform="translate(159.27 1103.18)">
          <rect/>
          <foreignObject width="143" height="24">
            <div xmlns="http://www.w3.org/1999/xhtml" style="display:table-cell;white-space:nowrap;line-height:1.5;max-width:200px;text-align:center">
              <span class="nodeLabel">
                <p>
                  Stop! Use `str || &quot;&quot;`
                </p>
              </span>
            </div>
          </foreignObject>
        </g>
      </g>
      <g class="node">
        <path d="M494.48 1209l94.12-94.12-94.12-94.13-94.13 94.13z" class="label-container"/>
        <g class="label" transform="translate(409.55 1103.18)">
          <rect/>
          <foreignObject width="169" height="24">
            <div xmlns="http://www.w3.org/1999/xhtml" style="display:table-cell;white-space:nowrap;line-height:1.5;max-width:200px;text-align:center">
              <span class="nodeLabel">
                <p>
                  Doing `bool ?? false`?
                </p>
              </span>
            </div>
          </foreignObject>
        </g>
      </g>
      <g class="node">
        <path d="M243.3 1367.3h237.88v54H243.3z" class="basic label-container"/>
        <g class="label" transform="translate(273.3 1382.3)">
          <rect/>
          <foreignObject width="178" height="24">
            <div xmlns="http://www.w3.org/1999/xhtml" style="display:table-cell;white-space:nowrap;line-height:1.5;max-width:200px;text-align:center">
              <span class="nodeLabel">
                <p>
                  Stop! Use `bool || false`
                </p>
              </span>
            </div>
          </foreignObject>
        </g>
      </g>
      <g class="node">
        <path d="m626.2 1488.83 94.55-94.53-94.54-94.54-94.53 94.54z" class="label-container"/>
        <g class="label" transform="translate(558.18 1382.3)">
          <rect/>
          <foreignObject width="135" height="24">
            <div xmlns="http://www.w3.org/1999/xhtml" style="display:table-cell;white-space:nowrap;line-height:1.5;max-width:200px;text-align:center">
              <span class="nodeLabel">
                <p>
                  Doing `obj ?? {}`?
                </p>
              </span>
            </div>
          </foreignObject>
        </g>
      </g>
      <g class="node">
        <path d="M457.83 1562h204.1v54h-204.1z" class="basic label-container"/>
        <g class="label" transform="translate(488 1577)">
          <rect/>
          <foreignObject width="144" height="24">
            <div xmlns="http://www.w3.org/1999/xhtml" style="display:table-cell;white-space:nowrap;line-height:1.5;max-width:200px;text-align:center">
              <span class="nodeLabel">
                <p>
                  Stop! Use `obj || {}`
                </p>
              </span>
            </div>
          </foreignObject>
        </g>
      </g>
    </g>
  </g>
</svg>
</div>

```
graph TB
    A["When can you use ?? if you care about bundle-size"] --> B{"Using ES2020 or above?"};
    B -->|No| C{"Doing `num ?? 0`?"};
    B -->|Yes| K["Sure, feel free to use `??`"];
    C -->|Yes| D["Stop! Use `num || 0`"];
    C -->|No| E{"Doing `str ?? ''`?"};
    E -->|Yes| F["Stop! Use `str || ''`"];
    E -->|No| G{"Doing `bool ?? false`?"};
    G -->|Yes| H["Stop! Use `bool || false`"];
    G -->|No| I{"Doing `obj ?? {}`?"};
    I -->|Yes| J["Stop! Use `obj || {}`"];
    I -->|No| K["Sure, feel free to use `??`"];
```

[Proof][Playground]

[Playground]: https://www.typescriptlang.org/play/?target=6#code/G4QwTgBAdgrgtgGggZwC5iQIwPbYDZLaYBWA3AFDkD0VEAvA408y62+05bHBAPy8QADNVrBk5bhAA+UoZRr0OS5SoaU0kfhABE2kRDHkN02bvm1Vlq53I58fAQDMQeZAFN9hu3hMRnrj31rYNVKImIHCABvAF9PcXDfWKA

https://gist.github.com/guilhermesimoes/586a96cc6700a962b2fb58bd5bc600b1
