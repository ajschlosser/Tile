// --------------------------------------------------
// BEGIN TYPES

var types = {
	'*': {
		levels: {
			water: 0
		},
		actions: ['deepen', 'info', 'move']
	},
	grass: {
		actions: ['wetten']
	},
	water: {
		flows: true,
		actions: ['flood']
	},
	meadow: {
		actions: ['wetten']
	},
	town: {
		population: 500,
		growth: ['population']
	},
	farm: {
		yield: 10,
		actions: ['wetten']
	}
};

// END TYPES
// --------------------------------------------------