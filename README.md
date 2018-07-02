# magic3djs

**Magic3D Version 1.0**

**Description:** This library helps to enable 3D rotation (Using 3D transform) on any flat 2d image or html element without any need of 3d images.
You just need a flat 2d image and a touch of Magic3D which enables a mouse-drag/mouse-rotate/touch effect on your content.
The effect will appear better on Flat 2D kind of image objects, like cards, TShirts etc.
This is all JS, and doesn't require any third party library likes JQuery or other.

### Browser Support:
This is been tested on few browsers including windows desktop and Android mobile, they are:
- Chrome, Firefox, Internet Explorer 11, Microsoft Edge, Android Chrome with touch support

### Syntax:
var rotator = new Magic3D({config-object});

**Config-object details here:**
Config-object:
{

	**elementId:** string, //dom id of the target element, if given, "elements" property will be ignored
	
	**elements:** array of dom elements, //use it if you want to apply effect on multiple elements with same settings, e.g. document.getElementsByClassName etc
	
	**clipping:** int [optional, default value: 0], top/bottom clipping area in pixels
	
	**maxDeg:** int [optional, default value: 10], rotation degree max limit (applies to both left or right rotation)
	
	**width:** int [optional, default value: calculates based on element], width of the effect container area
	
	**height:** int [optional, default value: calculates based on element], height of the effect container area
	
	**perspective:** int [optional, default value: 100], 3d-transform perspective amount, impacts the effect amount
	
	**easingBy:** int [optional, default value: 20], controls the speed of rotation
	
}

### Usage Example:

```js
var rotator = new Magic3D({
	elementId: "content1",
	clipping: 50,
	maxDeg : 10,
	width: 400,
	height: 400
});
```

OR

```js
var rotator = new Magic3D({
	elements: document.getElementsByClassName("class-name");
	clipping: 50,
	maxDeg : 10,
	width: 150,
	height: 150
});
```

**Enjoy, Please share your feedback through github.**
