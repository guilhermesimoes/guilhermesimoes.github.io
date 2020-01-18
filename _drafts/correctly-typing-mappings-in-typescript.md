```ts
const adBreaks = yospaceSessionManager.session.timeline.elements
  .filter(element => element.type === YSTimelineElement.ADVERT)
  .map(this.mapYSElementToAdBreak);
  
private mapElementToAdBreak(element: YSTimelineElement): AdBreak {
    const { adverts } = element.adBreak;
    return {
        ads: adverts.map(this.getAdDataFromYospaceAd),
        type: AdBreakType.Midroll,
        streamType: AdStreamType.InStream,
        position: adverts[0].adBreak.startPosition,
    };
}
```

---

```ts
const adverts = advertAssets.map(advertAsset => ({
    startTime: 'start',
    endTime: 'end',
    type: TimelineItemType.Advert,
    asset: advertAsset,
    id: this.generateTimelineItemId(),
}));
```

VERSUS

```ts
const adverts: Array<TimelineItem> = advertAssets.map(advertAsset => ({
    startTime: 'start',
    endTime: 'end',
    type: TimelineItemType.Advert,
    asset: advertAsset,
    id: this.generateTimelineItemId(),
}));
```

VERSUS

```ts
const adverts = advertAssets.map<TimelineItem>(advertAsset => ({
    startTime: 'start',
    endTime: 'end',
    type: TimelineItemType.Advert,
    asset: advertAsset,
    id: this.generateTimelineItemId(),
}));
```

VERSUS

```ts
const adverts = advertAssets.map(somethingToAdvert);

function somethingToAdvert(something): Advert {
    return {
        startTime: 'start',
        endTime: 'end',
        type: TimelineItemType.Advert,
        asset: advertAsset,
        id: this.generateTimelineItemId(),
    }
}
```
