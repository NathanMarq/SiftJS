var SIFT = (function(SIFT){

  /*
  *   Constructor stuff here
  */


  SIFT.version = "0.0.1";

  return SIFT;

})(SIFT || {});

SIFT.sourceImages = {};
SIFT.destinations = {};
SIFT.tempCanvas = document.createElement("canvas");
SIFT.tempCTX = SIFT.tempCanvas.getContext("2d");

SIFT.newSourceImage = function(imageLocation, callback){

  if(!SIFT.sourceImages[imageLocation]){

    var newImage = new Image();

    newImage.onload = function(){

      SIFT.sourceImages[imageLocation] = newImage;
      callback(newImage);

    };

    newImage.src = imageLocation;

  }

};

SIFT.imageCache = {

  saveFromData: function(imageData, name){
    var newCanvas = document.createElement('canvas');
    var ctx = newCanvas.getContext('2d');

    newCanvas.width = imageData.width;
    newCanvas.height = imageData.height;

    ctx.putImageData(imageData, 0, 0);

    var dataURL = newCanvas.toDataURL("image/png");

    var newImage = new Image();

    newImage.onload = function(){
      SIFT.imageCache.saved[name] = newImage;
    };

    newImage.src = dataURL;

    newCanvas = null;

    return this.saved[name];

  },

  saveFromImage: function(imageObj, name){



  },

  get: function(name){

    return this.saved[name];

  },

  saved: {}

};


SIFT.baseAlgorithms = {

  // for dynamic kernels, we do a horizontal pass and a vertical one
  // these are taken from https://github.com/kig/canvasfilters/blob/master/filters.js
  convolveHorizontal: function(pixels, weights, opaque){

    var side = weights.length;
    var halfSide = Math.floor(side/2);

    var src = pixels.data;
    var sw = pixels.width;
    var sh = pixels.height;

    var w = sw;
    var h = sh;
    var output = SIFT.tempCTX.createImageData(w, h);
    var dst = output.data;

    var alphaFac = opaque ? 1 : 0;

    for (var y=0; y<h; y++) {
      for (var x=0; x<w; x++) {
        var sy = y;
        var sx = x;
        var dstOff = (y*w+x)*4;
        var r=0, g=0, b=0, a=0;
        for (var cx=0; cx<side; cx++) {
          var scy = sy;
          var scx = Math.min(sw-1, Math.max(0, sx + cx - halfSide));
          var srcOff = (scy*sw+scx)*4;
          var wt = weights[cx];
          r += src[srcOff] * wt;
          g += src[srcOff+1] * wt;
          b += src[srcOff+2] * wt;
          a += src[srcOff+3] * wt;
        }
        dst[dstOff] = r;
        dst[dstOff+1] = g;
        dst[dstOff+2] = b;
        dst[dstOff+3] = a + alphaFac*(255-a);
      }
    }
    return output;

  },

  convolveVertical: function(pixels, weights, opaque){

    var side = weights.length;
    var halfSide = Math.floor(side/2);

    var src = pixels.data;
    var sw = pixels.width;
    var sh = pixels.height;

    var w = sw;
    var h = sh;
    var output = SIFT.tempCTX.createImageData(w, h);
    var dst = output.data;

    var alphaFac = opaque ? 1 : 0;

    for (var y=0; y<h; y++) {
      for (var x=0; x<w; x++) {
        var sy = y;
        var sx = x;
        var dstOff = (y*w+x)*4;
        var r=0, g=0, b=0, a=0;
        for (var cy=0; cy<side; cy++) {
          var scy = Math.min(sh-1, Math.max(0, sy + cy - halfSide));
          var scx = sx;
          var srcOff = (scy*sw+scx)*4;
          var wt = weights[cy];
          r += src[srcOff] * wt;
          g += src[srcOff+1] * wt;
          b += src[srcOff+2] * wt;
          a += src[srcOff+3] * wt;
        }
        dst[dstOff] = r;
        dst[dstOff+1] = g;
        dst[dstOff+2] = b;
        dst[dstOff+3] = a + alphaFac*(255-a);
      }
    }
    return output;

  },

  convolveKernel: function(pixels, kernel, opaque){
    opaque = opaque || false;

    var side = Math.round(Math.sqrt(kernel.length));
    var halfSide = Math.floor(side/2);
    var src = pixels.data;
    var sw = pixels.width;
    var sh = pixels.height;

    // pad output by the convolution matrix
    var w = sw;
    var h = sh;
    var output = SIFT.tempCTX.createImageData(w, h);
    var dst = output.data;

    // go through the destination image pixels
    var alphaFac = opaque ? 1 : 0;
    for (var y=0; y<h; y++) {
      for (var x=0; x<w; x++) {
        var sourceY = y;
        var sourceX = x;
        var dstOff = (y*w+x)*4;

        // calculate the weighed sum of the source image pixels that
        // fall under the convolution matrix
        var r=0, g=0, b=0, a=0;
        for (var cy=0; cy<side; cy++) {
          for (var cx=0; cx<side; cx++) {

            var sourceConvY = sourceY + cy - halfSide;
            var sourceConvX = sourceX + cx - halfSide;

            // if the convolution kernel goes off the edge of the image,
            // take the next pixel from the other side of the source image's edge
            // (works best with repeated textures, perhaps have an option here?)
            sourceConvY = (sourceConvY > sh || sourceConvY < 0) ? (Math.abs(sourceConvY % sh)) : sourceConvY;
            sourceConvX = (sourceConvX > sw || sourceConvX < 0) ? (Math.abs(sourceConvX % sw)) : sourceConvX;

            var srcOff = (sourceConvY*sw+sourceConvX)*4;
            var wt = kernel[cy*side+cx];

            r += src[srcOff] * wt;
            g += src[srcOff+1] * wt;
            b += src[srcOff+2] * wt;
            a += src[srcOff+3] * wt;

          }
        }
        dst[dstOff] = r;
        dst[dstOff+1] = g;
        dst[dstOff+2] = b;
        dst[dstOff+3] = a + alphaFac*(255-a);
      }
    }

    return output;

  },

  convolveKernelFloat32:  function(pixels, kernel, opaque){
    opaque = opaque || false;


    var side = Math.round(Math.sqrt(kernel.length));
    var halfSide = Math.floor(side/2);
    var src = pixels.data;
    var sw = pixels.width;
    var sh = pixels.height;

    // pad output by the convolution matrix
    var w = sw;
    var h = sh;


    var output = {
                width: w, height: h, data: new Float32Array(w*h*4)
              };
    var dst = output.data;

    // go through the destination image pixels
    var alphaFac = opaque ? 1 : 0;

    for (var y=0; y<h; y++) {
      for (var x=0; x<w; x++) {
        var sourceY = y;
        var sourceX = x;
        var dstOff = (y*w+x)*4;

        // calculate the weighed sum of the source image pixels that
        // fall under the convolution matrix
        var r=0, g=0, b=0, a=0;
        for (var cy=0; cy<side; cy++) {
          for (var cx=0; cx<side; cx++) {
            var sourceConvY = sourceY + cy - halfSide;
            var sourceConvX = sourceX + cx - halfSide;

            // if the convolution kernel goes off the edge of the image,
            // take the next pixel from the other side of the source image's edge
            // (works best with repeated textures, perhaps have an option here?)
            sourceConvY = (sourceConvY > sh || sourceConvY < 0) ? (Math.abs(sourceConvY % sh)) : sourceConvY;
            sourceConvX = (sourceConvX > sw || sourceConvX < 0) ? (Math.abs(sourceConvX % sw)) : sourceConvX;

            var srcOff = (sourceConvY*sw+sourceConvX)*4;
            var wt = kernel[cy*side+cx];

            r += src[srcOff] * wt;
            g += src[srcOff+1] * wt;
            b += src[srcOff+2] * wt;
            a += src[srcOff+3] * wt;
          }
        }
        dst[dstOff] = r;
        dst[dstOff+1] = g;
        dst[dstOff+2] = b;
        dst[dstOff+3] = a + alphaFac*(255-a);
      }
    }

    return output;

  },

  // FROM: http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c

  /**
   * Converts an RGB color value to HSV. Conversion formula
   * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
   * Assumes r, g, and b are contained in the set [0, 255] and
   * returns h, s, and v in the set [0, 1].
   *
   * @param   Number  r       The red color value
   * @param   Number  g       The green color value
   * @param   Number  b       The blue color value
   * @return  Array           The HSV representation
   */
  rgbToHsv: function(r, g, b){
      r = r/255, g = g/255, b = b/255;
      var max = Math.max(r, g, b), min = Math.min(r, g, b);
      var h, s, v = max;

      var d = max - min;
      s = max == 0 ? 0 : d / max;

      if(max == min){
          h = 0; // achromatic
      }else{
          switch(max){
              case r: h = (g - b) / d + (g < b ? 6 : 0); break;
              case g: h = (b - r) / d + 2; break;
              case b: h = (r - g) / d + 4; break;
          }
          h /= 6;
      }

      return [h, s, v];
  },

  /**
   * Converts an HSV color value to RGB. Conversion formula
   * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
   * Assumes h, s, and v are contained in the set [0, 1] and
   * returns r, g, and b in the set [0, 255].
   *
   * @param   Number  h       The hue
   * @param   Number  s       The saturation
   * @param   Number  v       The value
   * @return  Array           The RGB representation
   */
  hsvToRgb: function(h, s, v){
      var r, g, b;

      var i = Math.floor(h * 6);
      var f = h * 6 - i;
      var p = v * (1 - s);
      var q = v * (1 - f * s);
      var t = v * (1 - (1 - f) * s);

      switch(i % 6){
          case 0: r = v, g = t, b = p; break;
          case 1: r = q, g = v, b = p; break;
          case 2: r = p, g = v, b = t; break;
          case 3: r = p, g = q, b = v; break;
          case 4: r = t, g = p, b = v; break;
          case 5: r = v, g = p, b = q; break;
      }

      return [r * 255, g * 255, b * 255];
  }

};
