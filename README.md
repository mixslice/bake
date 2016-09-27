# Bake

Bake is a distributed incremental rendering system for none-linear editing system.

## Cake

`cake` describe a minimal render unit for workers. Each clip inside cake has the same duration. A clip's `offset` value is the shift to the start of the first clip.

<img src="https://cloud.githubusercontent.com/assets/685488/18865969/67da666a-84d0-11e6-9f77-8c98f729f050.png" width="544">

```javascript
{
  [md5hash]: 
     { ranges: [ { start, end } ],
       clips:
        [ { offset, video: [Object] },
          { offset,
            'adjust-crop': [Object],
            video: [Object],
            'filter-video': [Object] } ] },
}
```

Please take a look at the [sample output](https://gist.github.com/zzq889/c639c423425ce4835092b6661f1f77e8).

## Resources

- [Algorithm](https://drive.google.com/open?id=1WyTdW3FhxeHdlc-loAnqd5VzO0-PBm-ME2XNACtRjrU)
