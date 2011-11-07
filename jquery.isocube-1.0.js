/*
 * jQuery isocube v1.0
 * http://isocube.devel.bkahlert.com/
 *
 * Copyright 2011, Björn kahlert
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 * 
 * Date: Mon Nov 7 02:01:15 2011 +0100
 *
 * Requires:
 *   jQuery 2d Transform v0.9.3
 *   http://wiki.github.com/heygrady/transform/
 *
 * Usage:
 *  $(selector).isocube([options]);
 *
 * Options:
 *   alpha: degree by which the top line of the top face of the cube is skewed
 *     0 makes the top face invisible
 *     45 makes the top face look like a square
 *     90 is invalid and would result in a rectangle with unlimited height
 *   shadow:
 *     true if a shadow should be casted
 */
(function($){
	$.fn.isocube = function(options) {  
	
		if(this.css("position") != "absolute" && this.css("position") != "relative")
			this.css({ position: 'relative' });

		var settings = {
			alpha: 30,
			shadow: false
		};
		
		if(options) $.extend( settings, options );
		
		function createMarkup(c) {
			c.addClass("isocube");
			
			// add right face if necessary
			if(c.children(".face.right").length == 0) {
				c.append('<div class="face right"><div></div></div>');
			}
			
			// add left face if necessary
			// moves all markup into the newly created face
			if(c.children(".face.left").length == 0) {
				var leftFace = $('<div class="face left"><div></div></div>');
				c.append(leftFace);
				leftFace.append(c.children().filter(":not(.face)"));
			}
			
			// add top face if necessary
			if(c.children(".face.top").length == 0) {
				c.append('<div class="face top"><div></div></div>');
			}
			
			// add top face if necessary
			if(settings.shadow && c.children(".shadow").length == 0) {
				c.append('<div class="shadow"><div></div></div>');
			}
		}
	
		return this.each(function() {
			
			var isocubeContainer = $(this);
			createMarkup(isocubeContainer);
			
			var dataOptions = {
				alpha: isocubeContainer.attr("data-alpha"),
				shadow: isocubeContainer.attr("data-shadow")
			}
			
			var currentSettings = $.extend( {}, settings, dataOptions );
		     
			var w=isocubeContainer.width();
			var h=isocubeContainer.height();
			
			var alpha = currentSettings.alpha;
			var radianAlpha = alpha*(Math.PI/180);
			var radianBeta = (45-alpha)*(Math.PI/180); // rotated angle
			
			var a = w/(Math.SQRT2*(Math.tan(radianBeta)+1));			// width/height of top side
			var delta_c = (1/Math.SQRT2-0.5)*a;							// distance between rotated top side and outer circle
			var delta_rc = (Math.SQRT2*0.5)*Math.tan(radianBeta)*a;		// distance between outer circle and rotated&skewed top side
			var topLeft = delta_c + delta_rc;
			var topTop = delta_c - delta_rc;
			
			var f = w*Math.tan(radianAlpha);							// vertical diameter of top side
			var sideTop = f*0.75;
			var sideWidth = w/2;
			var sideHeight = h-f;
			
			isocubeContainer.children(".face").css({ position: "absolute" });
			isocubeContainer.children(".shadow").css({ position: "absolute" });
			
			isocubeContainer.children(".face.top")
				.css({ top: topTop + "px", left: topLeft + "px", width: a + "px", height: a + "px" })
				.transform({ rotate: "45deg", skew: [ (alpha-45) + "deg", (alpha-45) + "deg" ] });
			
			isocubeContainer.children(".face.left")
				.css({ top: sideTop + "px", left: "0px", width: sideWidth, height: sideHeight })
				.transform({ skewY: alpha + "deg" });
			
			isocubeContainer.children(".face.right")
				.css({ top: sideTop + "px", left: w/2 + "px", width: sideWidth, height: sideHeight })
				.transform({ skewY: -alpha + "deg" });

			if(currentSettings.shadow) isocubeContainer.children(".shadow")
				.css({ top: topTop+f*0.5+sideHeight + "px", left: topLeft-w/2 + "px", width: a + "px", height: a + "px" })
				.transform({ rotate: "45deg", skew: [ (alpha-45) + "deg", (alpha-45) + "deg" ] });
		});
	};
})(jQuery);