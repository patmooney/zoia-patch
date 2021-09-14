# zoia-patch - WIP

Node module for parsing Zoia patches

```
const { fromFile } = require('zoia-patch');
const patch = await fromFile('./my-patch.bin');
console.log(patch.schema);

{
  "name": "abcdEfghijklmno",
  "modules": {
    "data": [
      {
        "len": 14,
        "type": 1,
        "typeName": "Audio Input",
        "unknown": 0,
        "pageNumber": 0,
        "colour": 3,
        "colourName": "Red",
        "gridPosition": 0,
        "numberOfParams": 0,
        "modVersion": 0,
        "options": [1, 0, 0, 0, 0, 0, 0, 0],
        "params": [1000, 1024],
        "name": ""
      },
      ...
    ],
    "count": 5,
    "offsetEnd": 84
  },
  "connections": {
    "data": [
      {
        "sourceModule": 0,
        "sourceOutput": 0,
        "destinationModule": 2,
        "destinationInput": 0,
        "signalStrength": 10000
      },
      ...
    ],
    "count": 3,
    "offsetEnd": 100
  },
  "pages": {
    "data": [],
    "count": 0,
    "offsetEnd": 101
  }
}
```

### TODO
 - Add module specific meta to taxonomy (names of options/parameters etc)
