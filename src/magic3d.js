/*
Magic3D Version 1.0
Author: vngneers
Description: This library helps to enable 3D rotation (Using 3D transform) on any flat 2d image or html element without any need of 3d images.
License: GNU GPLv3
Usage: 
var rotator = new Magic3D({
	elementId: "content1",
	clipping: 50,
	maxDeg : 10,
	width: 400,
	height: 400
});

OR

var rotator = new Magic3D({
	elements: document.getElementsByClassName("class-name");
	clipping: 50,
	maxDeg : 10,
	width: 150,
	height: 150
});
*/
"use strict";


var Magic3D = function(_config)
{
	var elements = document.getElementById(_config.elementId) || _config.elements;
	
	if (!elements) return false;
	if (!elements.length) elements = [elements];
	for (var i = 0; i < elements.length; i++)
	{
		var rotator = new Magic3D_ThreeD_Transform_Rotate({
			element: elements[i],
			clipping: _config.clipping,
			maxDeg : _config.maxDeg,
			width: _config.width,
			height: _config.height,
			perspective : _config.perspective,
			easingBy : _config.easingBy			
		});
	}
}

var Magic3D_ThreeD_Transform_Rotate = function (_config)
{
	this.target = undefined;
	this.holder = undefined;
	this.config = undefined;
	this.currentDegX = 0;
	this.currentDegY = 0;
	var _class = this;
	
	this.setDefaultConfig = function(_config)
	{
		this.config = this.config || {};
		this.config.elementId = _config.elementId;
		this.config.perspective = _config.perspective || 100;
		this.config.clipping = _config.clipping || 0;
		this.config.maxDeg = _config.maxDeg || 10;
		this.config.easingBy = _config.easingBy || 20;
		this.config.width = _config.width;
		this.config.height = _config.height;
		this.config.element = _config.element;
		
		//Under testing, not usable, do not change the defined values
		this.config.horizontalRotation = true;
		this.config.verticalRotation = false;
	}
	
	this.init = function(_config)
	{
		this.setDefaultConfig(_config);
		try
		{
			this.target = this.config.element || this.getImgElement(this.config.elementId);
			this.initUI(this.target);
			this.initEvents(this.target);
		}
		catch (e)
		{
			throw e;
		}
	}
	
	this.initUI = function(target)
	{
		var targetWidth = this.config.width || target.offsetWidth;
		var targetHeight = this.config.height || target.offsetHeight;
		
		/*Add a wrapper div over the target element, to allow perspective and restrict the perspective to only target element*/
		this.holder = document.createElement("div");
		target.parentElement.insertBefore(this.holder, target);
		this.holder.appendChild(target);		
		
		/*holder decoration*/
		this.holder.className = "ThreeD_Holder";
		this.holder.style.perspective = this.config.perspective + "px";
		this.holder.style.overflow = "hidden";
		this.holder.style.width = targetWidth;
		this.holder.style.height = targetHeight - (this.config.clipping * 2);
		this.setElementNotDraggable(this.holder);
		
		/*child decoration*/
		target.style.width = targetWidth;
		target.style.height = targetHeight;
		target.style.transform = "rotateY(0deg)";
		//target.style.transformStyle =  "preserve-3d";
		target.style.position = "relative";
		target.style.top = (this.config.clipping * -1);
		
		this.setElementNotDraggable(target);
	}
	
	this.setElementNotDraggable = function(element)
	{
		Magic3D_EventListener(element, "dragstart", this.dragHandler);
		return;
		try
		{
			element.style.userDrag = "none";
			element.style.userSelect = "none"; 
			element.style.mozUserSelect = "none";
			element.style.webkitUserDrag = "none"; 
			element.style.webkitUserSelect = "none"; 
			element.style.msUserSelect = "none";
		}
		catch (e)
		{
			//some of the browser engine specific style attributes may throw error, but that's expected, hence silently digesting the errors here
		}
	}
	
	this.dragHandler = function(event)
	{
		event.preventDefault();
		return false;
	}
	
	this.initEvents = function (target)
	{
		var elementDragger = new Magic3D_ElementDrag(target);
		Magic3D_EventListener(target, elementDragger.Dragging_Event, this.rotate3DHandler);
		Magic3D_EventListener(target, elementDragger.DraggingEnd_Event, this.rotate3DEndHandler);
	}
	
	this.rotate3DEndHandler = function(event)
	{
		//TBD
	}
	
	this.rotate3DHandler = function(event)
	{
		_class.rotate3D(event.detail);
	}
	
	this.rotate3D = function(detail)
	{
		var horzOrigin = "center";
		var vertOrigin = "center";
		if (this.config.horizontalRotation) horzOrigin = this.rotate3DHorizontal(detail);
		if (this.config.verticalRotation) vertOrigin = this.rotate3DVertical(detail);
		
		this.holder.style.perspectiveOrigin = horzOrigin + " " + vertOrigin;
	}
	
	this.rotate3DHorizontal = function(detail)
	{
		var offsetX = detail.offsetX;
		var directionX = detail.directionX;
		var degX = 0;
		var maxDegX = this.config.maxDeg;
		
		degX = this.currentDegX + (offsetX / this.config.easingBy);
		degX = (directionX == "right") ? Math.min(degX, maxDegX) : Math.max(degX, (maxDegX * -1)); //bring value within limits
		
		this.currentDegX = degX;
		this.target.style.transform = "rotateY(" + this.currentDegX + "deg)"; //for horizontal transform, we use "rotateY", don't be confused
		return (this.currentDegX > 0) ? "left" : "right";
	}
	
	this.rotate3DVertical = function(detail)
	{
		var offsetY = detail.offsetY;
		var directionY = detail.directionY;
		var degY = 0;
		var maxDegY = this.config.maxDeg;
		
		degY = this.currentDegY + (offsetY / this.config.easingBy);
		degY = (directionY == "bottom") ? Math.min(degY, maxDegY) : Math.max(degY, (maxDegY * -1)); //bring value within limits
		
		this.currentDegY = degY;
		this.target.style.transform = "rotateX(" + this.currentDegY + "deg)"; //for vertical transform, we use "rotateX", don't be confused
		return (this.currentDegY > 0) ? "bottom" : "top";
	}
	
	this.getImgElement = function(selector)
	{
		//TODO: we may use JQuery to find selector
		//Right now I am assuming it as id
		
		var target = document.getElementById(selector);
		if (!target) throw new DOMException("No Image Element found with id:" + selector);
		return target;
	}
	
	this.init(_config);
}

var Magic3D_ElementDrag = function(element)
{
	this.registeredX = -1;
	this.registeredY = -1;
	this.Dragging_Event = "dragging";
	this.DraggingEnd_Event = "draggingend";
	var _class = this;
	
	this.init = function(element)
	{
		Magic3D_EventListener(element, "mousedown", this.mouseDownHandler);
		Magic3D_EventListener(element, "mousemove", this.mouseMoveHandler);
		Magic3D_EventListener(document, "mouseup", this.mouseUpHandler);
		
		//Add document level "mouseup" handler to stop the mousemove interaction
		Magic3D_EventListener(element, "mouseup", this.mouseUpHandler);

		Magic3D_EventListener(element, "touchstart", this.touchStartHandler);
		Magic3D_EventListener(element, "touchmove", this.touchMoveHandler);
		Magic3D_EventListener(element, "touchend", this.touchEndHandler);
	}
	
	this.registerStartPosition = function(x, y)
	{
		this.registeredX = x;
		this.registeredY = y;
	}
	
	this.drag = function(currentX, currentY)
	{
		if (this.registeredX < 0 || this.registeredY < 0) return false;
		
		var distanceMovedX = (currentX - this.registeredX);
		var directionX = (currentX > this.registeredX) ? "right" : "left";
		
		var distanceMovedY = (currentY - this.registeredY);
		var directionY = (currentY > this.registeredY) ? "bottom" : "top";
		
		var dragEvent = document.createEvent("CustomEvent");
		dragEvent.initCustomEvent(this.Dragging_Event, true, true, {"offsetX" : distanceMovedX, "directionX" : directionX, "offsetY" : distanceMovedY, "directionY" : directionY});
		element.dispatchEvent(dragEvent);
	}
	
	this.stopDrag = function()
	{
		this.registeredX = -1;
		var dragEvent = document.createEvent("CustomEvent");
		dragEvent.initCustomEvent(this.DraggingEnd_Event, true, true);
		element.dispatchEvent(dragEvent);
	}
	
	/*handlers*/
	this.mouseDownHandler = function(event)
	{
		_class.registerStartPosition(event.offsetX, event.offsetY);
		return false;
	}

	this.mouseMoveHandler = function(event)
	{
		_class.drag(event.offsetX, event.offsetY);
		return false;
	}

	this.mouseUpHandler = function(event)
	{
		_class.stopDrag();
		return false;
	}

	this.touchStartHandler = function(event)
	{
		if (event.touches.length != 1) return; //ignore multi touch events
		_class.registerStartPosition(event.touches[0].clientX, event.touches[0].clientY);
		event.preventDefault();
		return false;
	}

	this.touchMoveHandler = function(event)
	{
		if (event.touches.length != 1) return; //ignore multi touch events
		_class.drag(event.touches[0].clientX, event.touches[0].clientY);
		event.preventDefault();
		return false;
	}

	this.touchEndHandler = function(event)
	{
		_class.stopDrag();
	}
	
	this.init(element);
}

var Magic3D_EventListener = function (obj, event, callback)
{
	if (document.addEventListener) {                // For all major browsers, except IE 8 and earlier
		obj.addEventListener(event, callback);
	} else if (document.attachEvent) {              // For IE 8 and earlier versions
		obj.attachEvent(event, callback);
	}
}