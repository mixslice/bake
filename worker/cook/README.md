# Bake Cakes Into Movie Parts
Cakes are delicious building stones of a final moive. This package contains functions about how to render a cake.

## Cake Definition
Each `cake` has layers, layers are overlayed on each other and then produce a final cake.

Each `layer` has its video source, time to start, time to stop, effects on itself.

```
# Cake is consists of layers.
cake = {
    'uid': xxxxxx-rangestart-rangeend  # hash id and range of the cake
    'layers': [layer0, layer1, layer2],  # layer0 is on the bottom.
    'range_start': 130,  # the range start of cake
    'range_end': 166,   # the range end of cake
}

# Each layer is consists of resource (single video) and its effects on the layer
layer = {
    'resource':'resource file location', # it can be a protocol and network location see "ffmpeg protocol"
    'start': 'start frame',
    'end': 'end frame',
    'filters': [
        {'name':'filter-name', 'values':[value1, value2,...], 'kwvalues':{dict}},
        {dict},
        {dict},
    ]
}
```

## Bake
The way we render the `cake` is called `bake`. Currently we are baking by calling ffmpeg command line.

## Worker
The worker is a unit that keeps status of rendering progress, and can be configed to different level of rendering. (eg. slow or fast). A calling program can import worker and render movie clips. Or they can wrap around it and make a callable web service.
