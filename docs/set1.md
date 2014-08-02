```javascript

var exampleSet = {
	setInfo: {
		name: 'my-example-set',
		swing: 0.5,
		bpm: 165
	},

	pool: [
		{
			name: 'bd1',
			volume: 1.0,
			sampleType: 'builtin',
			sampleId: 'abcd-abcd'
		},
		{
			name: 'sd1',
			volume: 1.0,
			sampleType: 'builtin',
			sampleId: 'abcd-abcd'
		},
		{
			name: 'fx',
			volume: 0.4,
			sampleType: 'local',
			sampleId: 'abcd-abcd'
		}
	],

	patterns: [
		{
			name: 'intro',
			length: 8,
			locked: false,
			rows: [
				{
					poolEntry: 'bd1',
					steps: [1, 0, 0, 0, 1, 0, 0, 0]
				},
				{
					poolEntry: 'sd1',
					steps: [0, 0, 1, 0, 0, 0, 1, 0]
				}
			]
		},
		{
			name: 'verse',
			length: 8,
			locked: false,
			rows: [
				{
					poolEntry: 'bd1',
					steps: [1, 0, 0, 1, 0, 0, 1, 0]
				},
				{
					poolEntry: 'sd1',
					steps: [0, 0, 1, 0, 0, 1, 0, 0]
				},
				{
					poolEntry: 'fx',
					steps: [1, 0, 0, 0, 0, 0, 0, 0]
				}
			]
		}
	],

	song: {
		locked: false,
		rows: [
			{
				pattern: 'intro',
				offset: 0,
				len: 8,
				count: 4
			},
			{
				pattern: 'verse',
				offset: 0,
				len: 8,
				count: 2
			}
		]
	}

};

module.exports = exampleSet;
```
