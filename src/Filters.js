/*******************************************************************************
*
*     Filters
*
*     @TODO:
*     Filters to Add:
*       o texturize
*       o add noise
*       o render clouds
*
*
*******************************************************************************/

SIFT.Filter = {

    blackAndWhite: function(pixels, config){
      var level = config.level || 1;
      var data = pixels.data;

      for (var i=0; i<data.length; i+=4) {
        var r = data[i];
        var g = data[i+1];
        var b = data[i+2];
        // CIE luminance for the RGB
        // The human eye is bad at seeing red and blue, so we de-emphasize them.
        var greyVal = (0.2126*r) + (0.7152*g) + (0.0722*b);

        // add our level multiplier
        greyVal = greyVal;

        data[i] = data[i+1] = data[i+2] = greyVal;
      }

      return pixels;

    },

    saturation: function(pixels, config){
      var level = config.level || 1;

      for (var i=0; i<data.length; i+=4) {
        var r = data[i];
        var g = data[i+1];
        var b = data[i+2];

        // CIE luminance for the RGB
        // The human eye is bad at seeing red and blue, so we de-emphasize them.
        var greyVal = (0.2126*r) + (0.7152*g) + (0.0722*b);

        data[i] = data[i+1] = data[i+2] = greyVal;
      }

      return pixels;

    },

    brighten: function(pixels, config){
      var brightness = config.brightness || 50;
      var data = pixels.data;

      for (var i=0; i<data.length; i+=4) {
        data[i] += brightness;
        data[i+1] += brightness;
        data[i+2] += brightness;
      }

      return pixels;

    },

    contrast: function(pixels, config){
      var contrast = config.contrast || 0;
      var data = pixels.data;
      var factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

      for (var i=0; i<data.length; i+=4) {
        data[i] = factor * (data[i] - 128) + 128;
        data[i+1] = factor * (data[i+1] - 128) + 128;
        data[i+2] = factor * (data[i+2] - 128) + 128;
      }

      return pixels;

    },

    invert: function(pixels, config){
      var data = pixels.data;

      for (var i=0; i<data.length; i+=4) {
        data[i] = 255 - data[i];
        data[i+1] = 255 - data[i+1];
        data[i+2] = 255 - data[i+2];
      }

      return pixels;

    },

    gamma: function(pixels, config){
      var value = config.gamma || 0.5;

    // http://stackoverflow.com/questions/14012221/gamma-adjustment-on-the-html5-canvas
      var data = pixels.data;

      for (var i=0; i<data.length; i+=4) {
        data[i] = Math.pow(255 * (data[i] / 255), value);
        data[i+1] = Math.pow(255 * (data[i+1] / 255), value);
        data[i+2] = Math.pow(255 * (data[i+2] / 255), value);
      }

      return pixels;

    },

    threshold: function(pixels, config){
      var value = config.value || 100;
      var data = pixels.data;

      for (var i=0; i<data.length; i+=4) {
        var r = data[i];
        var g = data[i+1];
        var b = data[i+2];
        // clamp these down to black or white values:
        // @TODO add functionality for more than two resulting values
        var v = (0.2126*r + 0.7152*g + 0.0722*b >= threshold) ? 255 : 0;
        data[i] = data[i+1] = data[i+2] = v;
      }

      return pixels;

    },

    // FROM: http://en.wikipedia.org/wiki/Otsu's_method
    otsuThreshold: function(histogram, total) {
        var sum = 0;
        for (var i = 1; i < 256; ++i)
            sum += i * histogram[i];
        var sumB = 0;
        var wB = 0;
        var wF = 0;
        var mB;
        var mF;
        var max = 0.0;
        var between = 0.0;
        var threshold1 = 0.0;
        var threshold2 = 0.0;
        for (var i = 0; i < 256; ++i) {
            wB += histogram[i];
            if (wB == 0)
                continue;
            wF = total - wB;
            if (wF == 0)
                break;
            sumB += i * histogram[i];
            mB = sumB / wB;
            mF = (sum - sumB) / wF;
            between = wB * wF * Math.pow(mB - mF, 2);
            if ( between >= max ) {
                threshold1 = i;
                if ( between > max ) {
                    threshold2 = i;
                }
                max = between;
            }
        }
        return ( threshold1 + threshold2 ) / 2.0;
    },


/*
*
* LINKS:
*
* http://lodev.org/cgtutor/filtering.html
* https://developer.apple.com/Library/ios/documentation/Performance/Conceptual/vImage/ConvolutionOperations/ConvolutionOperations.html
* http://liman3d.com/tutorial_normalmaps.html
*
*
*/

    //@TODO: needs work.
    // Figure out why it's creating artifacts

    detectShadows: function(pixels, config){
      var amount = config.amount || 1;
      var maxSat = 0,
      minSat = 0,
      maxLum = 0,
      minLum = 0,
      data = pixels.data;

      var satValues = [];

      for (var i=0; i<data.length; i+=4) {

        var r = pixels.data[i];
        var g = pixels.data[i+1];
        var b = pixels.data[i+2];

        var pixelInHSV = SIFT.baseAlgorithms.rgbToHsv(r, g, b);

        // saturation
        maxSat = ( pixelInHSV[1] > maxSat) ? pixelInHSV[1] : maxSat;
        minSat = ( pixelInHSV[1] < minSat) ? pixelInHSV[1] : minSat;

        // luminocity
        maxLum = (pixelInHSV[2] > maxLum) ? pixelInHSV[2] : maxLum;
        minLum = (pixelInHSV[2] < minLum) ? pixelInHSV[2] : minLum;

        satValues[i] = pixelInHSV[1];
        satValues[i+1] = pixelInHSV[2];

      }

      var maxMinFactor = Math.round(maxSat-amount);
      var lumFactor = Math.round(maxLum-amount);

      //now, we need to iterate through again to determine the actual values:
      for (var j=0; j<data.length; j+=4) {

        if(satValues[j] <= maxMinFactor && satValues[j+1] <= lumFactor){

          data[j] = Math.round(255*(satValues[j]*(amount+2)));
          data[j+1] = Math.round(255*(satValues[j]*(amount+2)));
          data[j+2] = Math.round(255*(satValues[j]*(amount+2)));

        }
        else{
          data[j] = 0;
          data[j+1] = 0;
          data[j+2] = 0;
        }

      }

      // pixels = SIFT.Filter.gaussianBlur(pixels, { diameter: 5 }, 1);
      // pixels = SIFT.Filter.contrast(pixels, { contrast: 3 });

      return pixels;

    },

    sharpen: function(pixels, config){

    },

    // FROM: https://github.com/kig/canvasfilters/blob/master/filters.js
    gaussianBlur: function(pixels, config, opaque){
      var opaque = opaque || 1;
      var diameter = Math.abs(config.diameter) || 1;
      var filter;

      if(diameter < 1){
        return SIFT.baseAlgorithms.convolveKernel(pixels, SIFT.Kernel.gaussianBlur.threeByThree);
      }
      var radius = diameter / 2;
      var len = Math.ceil(diameter) + (1 - (Math.ceil(diameter) % 2));
      var weights = new Float32Array(len);
      var rho = (radius+0.5) / 3;
      var rhoSq = rho*rho;
      var gaussianFactor = 1 / Math.sqrt(2*Math.PI*rhoSq);
      var rhoFactor = -1 / (2*rho*rho);
      var wsum = 0;
      var middle = Math.floor(len/2);
      for (var i=0; i<len; i++) {
        var x = i-middle;
        var gx = gaussianFactor * Math.exp(x*x*rhoFactor);
        weights[i] = gx;
        wsum += gx;
      }
      for(var i=0; i<weights.length; i++){
        weights[i] /= wsum;
      }

      var results = SIFT.baseAlgorithms.convolveHorizontal(
                      SIFT.baseAlgorithms.convolveVertical(pixels, weights, opaque),
                      weights, opaque
                    );

      // return SIFT.baseAlgorithms.convolveKernel(pixels, weights);
      return results;

    },

    median: function(pixels, config, opaque){
      opaque = opaque || 1;
      console.log("starting median - " + config.diameter + "px");
      var diameter = Math.abs(config.diameter) || 1,
      iterations = config.iterations || 1,
      filter;

      var radius = diameter / 2;
      var len = Math.ceil(diameter) + (1 - (Math.ceil(diameter) % 2));

      var kernelLength = diameter*diameter;
      var middle = Math.round(kernelLength/2);
      var side = Math.round(Math.sqrt(kernelLength));
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
      // for(var i=0; i<iterations; i++){
      //   console.log("iteration number " + i);
        for (var y=0; y<h; y++) {
          for (var x=0; x<w; x++) {
            var sourceY = y;
            var sourceX = x;
            var dstOff = (y*w+x)*4;

            // calculate the median values from the list of rgb values that
            // fall under the convolution matrix
            var r=[], g=[], b=[], a=[];
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
                // var wt = kernel[cy*side+cx];

                r.push(src[srcOff]);
                g.push(src[srcOff+1]);
                b.push(src[srcOff+2]);
                a.push(src[srcOff+3]);

              }
            }

            r = r.sort(function(a, b) { return a - b; });
            g = g.sort(function(a, b) { return a - b; });
            b = b.sort(function(a, b) { return a - b; });
            a = a.sort(function(a, b) { return a - b; });

            dst[dstOff] = r[middle];
            dst[dstOff+1] = g[middle];
            dst[dstOff+2] = b[middle];
            dst[dstOff+3] = a[middle];
          }
        }
        console.log("finishing median");
      // }
      return output;

    },


    sobel: function(pixels, config){
      var strength = config.strength || 1;
      var invert = config.invert || false;
      // we need to find a way to pass in a 'strength' parameter here...

      var grayscale = SIFT.Filter.blackAndWhite(pixels, 1);

      // Note that ImageData values are clamped between 0 and 255, so we need
      // to use a Float32Array for the gradient values because they
      // range between -255 and 255.
      var vertical = SIFT.baseAlgorithms.convolveKernelFloat32(grayscale, SIFT.Kernel.sobel.threeByThree.vertical);
      var horizontal = SIFT.baseAlgorithms.convolveKernelFloat32(grayscale, SIFT.Kernel.sobel.threeByThree.horizontal);

      var final_image = SIFT.tempCTX.createImageData(vertical.width, vertical.height);
      for (var i=0; i<final_image.data.length; i+=4) {

        // make both the vertical and the horizontal the same color:
        var v = Math.abs(vertical.data[i]);
        var h = Math.abs(horizontal.data[i]);

        var edgeFactor = v+h;

        final_image.data[i] = edgeFactor;
        final_image.data[i+1] = edgeFactor;
        final_image.data[i+2] = edgeFactor;
        final_image.data[i+3] = 255; // opaque alpha
      }

      return final_image;

    },

    depthEdges: function(pixels){
      console.log('starting kirsch');
      var grayscale = SIFT.Filter.blackAndWhite(pixels, { level: 1 });

      // We need to use Float32 values here, because the outputs range from negative numbers to positive,
      // and we want to use them for mapping to the 0-255 range.
      var north = SIFT.baseAlgorithms.convolveKernelFloat32(grayscale, SIFT.Kernel.kirsch.north);
        console.log('kirsch North');
      var northEast = SIFT.baseAlgorithms.convolveKernelFloat32(grayscale, SIFT.Kernel.kirsch.northEast);
        console.log('kirsch NorthEast');
      var east = SIFT.baseAlgorithms.convolveKernelFloat32(grayscale, SIFT.Kernel.kirsch.east);
        console.log('kirsch East');
      var southEast = SIFT.baseAlgorithms.convolveKernelFloat32(grayscale, SIFT.Kernel.kirsch.southEast);
        console.log('kirsch SouthEast');
      var south = SIFT.baseAlgorithms.convolveKernelFloat32(grayscale, SIFT.Kernel.kirsch.south);
        console.log('kirsch South');
      var southWest = SIFT.baseAlgorithms.convolveKernelFloat32(grayscale, SIFT.Kernel.kirsch.southWest);
        console.log('kirsch SouthWest');
      var west = SIFT.baseAlgorithms.convolveKernelFloat32(grayscale, SIFT.Kernel.kirsch.west);
        console.log('kirsch West');
      var northWest = SIFT.baseAlgorithms.convolveKernelFloat32(grayscale, SIFT.Kernel.kirsch.northWest);
        console.log('kirsch NorthWest');

      var imageEdges = SIFT.tempCTX.createImageData(grayscale.width, grayscale.height);

      for (var i=0; i<imageEdges.data.length; i+=4) {

        // make the vertical gradient red
        var vWeights = west.data[i] + ( ( northWest.data[i] + southWest.data[i] ) )  - ( ( northEast.data[i] + southEast.data[i] ) );
        // var vWeights = west.data[i] + ( ( northWest.data[i] + southWest.data[i] ) );
        var vertical = ( vWeights + 1020 ) * ( 255 / 2040 );

        imageEdges.data[i] = vertical;


        // make the horizontal gradient green
        var hWeights = north.data[i] + ( ( northEast.data[i] + northWest.data[i] ) ) - ( ( southEast.data[i] + southWest.data[i] ) );
        // var hWeights = north.data[i] + ( ( northEast.data[i] + northWest.data[i] ) );
        var horizontal = ( hWeights + 1020 ) * ( 255 / 2040 );

        imageEdges.data[i+1] = horizontal;

        var direction = (vWeights > hWeights) ? vertical : horizontal;

        // make blue universally 100%
        imageEdges.data[i+2] = 255 - Math.round(direction/2);



        imageEdges.data[i+3] = pixels.data[i+3]; // keep whatever the alpha channel is
      }
      console.log('finishing kirsch');

      return imageEdges;

    },

    //@TODO: allow negative values for reversing the depth values
    depthIntensity: function(pixels, config){
      var intensity = config.intensity || 0.5, // between 0 and 1
      neutralR = 128,
      neutralG = 128,
      neutralB = 255;

      for(var i=0; i<pixels.data.length; i+=4){

        r = pixels.data[i];
        g = pixels.data[i+1];
        b = pixels.data[i+2];
        a = pixels.data[i+3];

        pixels.data[i] = neutralR + ((r-neutralR)*intensity);
        pixels.data[i+1] = neutralG + ((g-neutralG)*intensity);
        pixels.data[i+2] = neutralB - ((neutralB-b)*intensity);
        pixels.data[i+3] = pixels.data[i+3]; //maintain the alpha channel

      }

      return pixels;

    }




};
