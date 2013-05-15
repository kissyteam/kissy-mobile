/*
	从Modernizr.js中移植出来
*/
KISSY.add('mobile/app/1.2/demo/lottery/js/widget/slide/css3' , function(S) {
	var css3 = {},
	docElement = document.documentElement,
	mod = 'modernizr',
	injectElementWithStyles = function( rule, callback, nodes, testnames ) {
		var style, ret, node,
		div = document.createElement('div'),
		  // After page load injecting a fake body doesn't work so check if body exists
		body = document.body,
		  // IE6 and 7 won't return offsetWidth or offsetHeight unless it's in the body element, so we fake it.
		fakeBody = body ? body : document.createElement('body');
		
		if ( parseInt(nodes, 10) ) {
		  // In order not to give false positives we create a node for each test
		  // This also allows the method to scale for unspecified uses
		  while ( nodes-- ) {
			  node = document.createElement('div');
			  node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
			  div.appendChild(node);
		  }
		}
		
		// <style> elements in IE6-9 are considered 'NoScope' elements and therefore will be removed
		// when injected with innerHTML. To get around this you need to prepend the 'NoScope' element
		// with a 'scoped' element, in our case the soft-hyphen entity as it won't mess with our measurements.
		// msdn.microsoft.com/en-us/library/ms533897%28VS.85%29.aspx
		// Documents served as xml will throw if using &shy; so use xml friendly encoded version. See issue #277
		style = ['&#173;','<style id="s', mod, '">', rule, '</style>'].join('');
		div.id = mod;
		// IE6 will false positive on some tests due to the style element inside the test div somehow interfering offsetHeight, so insert it into body or fakebody.
		// Opera will act all quirky when injecting elements in documentElement when page is served as xml, needs fakebody too. #270
		(body ? div : fakeBody).innerHTML += style;
		fakeBody.appendChild(div);
		if ( !body ) {
		  //avoid crashing IE8, if background image is used
		  fakeBody.style.background = "";
		  docElement.appendChild(fakeBody);
		}
		
		ret = callback(div, rule);
		// If this is done after page load we don't want to remove the body so check if body exists
		!body ? fakeBody.parentNode.removeChild(fakeBody) : div.parentNode.removeChild(div);
		return !!ret;
	}
	var cssomPrefixes = 'Webkit Moz O ms'.split(' '),
	mStyle = docElement.style;
	function is( obj, type ) {
		return typeof obj === type;
	}
	function testProps( props, prefixed ) {
		for ( var i in props ) {
			if ( mStyle[ props[i] ] !== undefined ) {
				return prefixed == 'pfx' ? props[i] : true;
			}
		}
		return false;
	}
	function testPropsAll( prop, prefixed, elem ) {
		var ucProp = prop.charAt(0).toUpperCase() + prop.substr(1),
			props = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

		// did they call .prefixed('boxSizing') or are we just testing a prop?
		if(is(prefixed, "string") || is(prefixed, "undefined")) {
		  return testProps(props, prefixed);

		// otherwise, they called .prefixed('requestAnimationFrame', window[, elem])
		} else {
		  //props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
		  //return testDOMProps(props, prefixed, elem);
		}
	}
	css3['hasTransform'] = function() {
        return !!testPropsAll('transform');
    };
	css3['has3d'] = function(){
		var ret = !!testPropsAll('perspective');
		// Webkit's 3D transforms are passed off to the browser's own graphics renderer.
		// It works fine in Safari on Leopard and Snow Leopard, but not in Chrome in
		// some conditions. As a result, Webkit typically recognizes the syntax but
		// will sometimes throw a false positive, thus we must do a more thorough check:
		if ( ret && 'webkitPerspective' in docElement.style ) {
		  // Webkit allows this media query to succeed only if the feature is enabled.
		  // `@media (transform-3d),(-webkit-transform-3d){ ... }`
		  injectElementWithStyles('@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}', function( node, rule ) {
			ret = node.offsetLeft === 9 && node.offsetHeight === 3;
		  });
		}
		return ret;
	}
	return css3;
} , {
	requires: [
	
	]
});
