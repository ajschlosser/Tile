//removeIf(production)
/*
	This file is part of Tile.

	Tile is a 2D JavaScript tile engine for the HTML5 canvas
	Copyright (C) 2015 Aaron John Schlosser

	Tile is free software; you can redistribute it and/or
	modify it under the terms of the GNU General Public License
	as published by the Free Software Foundation; either version 2
	of the License, or (at your option) any later version.

	Tile is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program; if not, write to the Free Software
	Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/
//endRemoveIf(production)

// --------------------------------------------------
// UI

var ui = {
	modal: {
		display: 'block',
		template: 'modal.html',
		controller: function(scope) {
			scope.title = 'hi :)';
			scope.message = 'ok';
			scope.update = function(title, message) {
				scope.title = title;
				scope.message = message;
			};
			scope.close = function(el) {
				this.hide();
			};
		}
	},
	status: {
		display: 'block',
		template: 'content.html',
		controller: function(scope) {
			scope.content = 'Generating world...';
			scope.update = function(s) {
				scope.content = s;
			};
		}
	},
	tools: {
		display: 'inline',
		template: 'tools.html',
		controller: function(scope) {
			scope.status = 'disabled';
			scope.canDeepen = function(el) {
				game.state().toggle('canDeepen');
				if (scope.status === 'disabled') {
					scope.status = 'enabled';
					el.className = 'selected';
				} else {
					scope.status = 'disabled';
					el.className = '';
				}
			};
		}
	}
};

// END UI
// --------------------------------------------------
