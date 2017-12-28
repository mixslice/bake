## Requirements

for localtest: place your videos inside ./videos folder

for server test: see the docker-compose.yml, which ./videos folder is projected, and then put the videos inside that folder.
## How to start

See the docker-compose.yml

## API

### `POST /app/render`

BODY
```
{
	"cakes" : [
				  {
				    "hash": "9b9a6b534566e1425b9a59e4a3ad8934",
				    "ranges": [
				      {
				        "start": 0,
				        "end": 140
				      },
				      {
				        "start": 786,
				        "end": 901
				      }
				    ],
				    "clips": [
				      {
				        "offset": 0,
				        "video": {
				          "offset": 0,
				          "ref": "77b2229en0b5dn4f4fn88e2n4798bfff66aa",
				          "duration": 1118
				        }
				      }
				    ]
				  },
				  {
				    "hash": "e19cb00c065230a22f3ee596d9d2f3da",
				    "ranges": [
				      {
				        "start": 0,
				        "end": 156
				      },
				      {
				        "start": 325,
				        "end": 463
				      },
				      {
				        "start": 784,
				        "end": 915
				      }
				    ],
				    "clips": [
				      {
				        "offset": 0,
				        "video": {
				          "offset": 0,
				          "ref": "42452a7dne624n4363nbaadn64d422d53f12",
				          "duration": 915
				        }
				      }
				    ]
				  },
				  {
				    "hash": "dee075b4358e45d991a3862698b686f4",
				    "ranges": [
				      {
				        "start": 0,
				        "end": 169
				      }
				    ],
				    "clips": [
				      {
				        "offset": 0,
				        "video": {
				          "offset": 0,
				          "ref": "4f7b022fn88b3n4703n9ac4n642fbdcc817a",
				          "duration": 513
				        }
				      }
				    ]
				  },
				  {
				    "hash": "79a36da9e910f3e97677ecf9d4ef0092",
				    "ranges": [
				      {
				        "start": 580,
				        "end": 786
				      }
				    ],
				    "clips": [
				      {
				        "offset": 0,
				        "video": {
				          "offset": 0,
				          "ref": "77b2229en0b5dn4f4fn88e2n4798bfff66aa",
				          "duration": 1118
				        }
				      },
				      {
				        "offset": 273,
				        "adjust-crop": {
				          "mode": "trim",
				          "trim-rect": {
				            "right": "88.8889"
				          }
				        },
				        "video": {
				          "offset": 0,
				          "ref": "4f7b022fn88b3n4703n9ac4n642fbdcc817a",
				          "duration": 513
				        }
				      }
				    ]
				  }
]

}
```

RESPONSE 200

```
{
    "ffmpeg_cakes": 
    	[
    		"9b9a6b534566e1425b9a59e4a3ad8934-0-140",
    		"9b9a6b534566e1425b9a59e4a3ad8934-786-901",
    		"e19cb00c065230a22f3ee596d9d2f3da-0-156",
    		"e19cb00c065230a22f3ee596d9d2f3da-325-463",
    		"e19cb00c065230a22f3ee596d9d2f3da-784-915",
    		"dee075b4358e45d991a3862698b686f4-0-169",
    		"79a36da9e910f3e97677ecf9d4ef0092-580-786"
    	]
}
```

Redis `key, value`

If in progress
```
key: 79a36da9e910f3e97677ecf9d4ef0092-580-786

value:
{
	'out_time': '00:00:03.133333',
	'dup_frames': '0',
	'total_size': '1436163',
	'speed': '0.383x',
	'frame': '116',
	'percent': 56, 
	'out_time_ms': '3133333', 
	'fps': '14.2', 
	'stream_0_0_q': '24.0', 
	'progress': 'continue', 
	'bitrate': '3666.8kbits/s', 
	'drop_frames': '0'
}
```

If ended
```
key: e19cb00c065230a22f3ee596d9d2f3da-0-156

value:
{
	'out_time': '00:00:05.133333',
	'dup_frames': '0',
	'total_size': '3547511',
	'speed': '1.09x',
	'frame': '156',
	'percent': 100,
	'out_time_ms': '5133333',
	'fps': '33.3',
	'stream_0_0_q': '-1.0',
	'progress': 'end',
	'bitrate': '5528.6kbits/s',
	'drop_frames': '0'
}

```


POST `/app/concat`

BODY

```
{
	"sequence" : [
					{
					    "src": "9b9a6b534566e1425b9a59e4a3ad8934-0-140",
					    "start": 0,
					    "end": 117
					}, {
					    "src": "e19cb00c065230a22f3ee596d9d2f3da-0-156"
					}, {
					    "src": "dee075b4358e45d991a3862698b686f4-0-169"
					}, {
					    "src": "e19cb00c065230a22f3ee596d9d2f3da-325-463"
					}, {
					    "src": "79a36da9e910f3e97677ecf9d4ef0092-580-786"
					}, {
					    "src": "9b9a6b534566e1425b9a59e4a3ad8934-786-901"
					}, {
					    "src": "e19cb00c065230a22f3ee596d9d2f3da-784-915"
					}
				]
}
```


RESPONSE 200
```
# if failed, for example, some video parts are missing.
{"success": false, "result_file_name": "demo-20161023-045228.mp4"}
# if good
{"success": true, "result_file_name": "demo-20161023-045558.mp4"}
```
