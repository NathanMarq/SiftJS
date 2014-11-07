# SiftJS #

  An HTML canvas filter library

  This library still has a lot of unfinished components and is not stable.

## Filters ##

  Filters are ways to alter existing canvas image data by altering individual pixel values. This is achieved by either a simple filter (such as blackAndWhite) or via a convolution filter (such as sobel).

  `var results = SIFT.Filter.filterName(canvasImageDataObject);`

  These functions return a filtered canvas image data object.

  Available filters are:

  * SIFT.Filter.blackAndWhite();
  * SIFT.Filter.saturation();
  * SIFT.Filter.brighten();
  * SIFT.Filter.contrast();
  * SIFT.Filter.invert();
  * SIFT.Filter.gamma();
  * SIFT.Filter.threshold();
  * SIFT.Filter.otsuThreshold();
  * SIFT.Filter.detectShadows();
  * SIFT.Filter.sharpen();
  * SIFT.Filter.gaussianBlur();
  * SIFT.Filter.median();
  * SIFT.Filter.sobel();
  * SIFT.Filter.depthChannels();
  * SIFT.Filter.depthEdges();
  * SIFT.Filter.depthIntensity();


## Blenders ##

  Blenders are ways to blend and combine different canvas element data objects.

  `var results = SIFT.Blender.blenderName(arrayOfCanvasImageDataObjects);`

  Blenders will return a canvas image object.

  Available blenders are:

  * SIFT.Blender.combine();

## Kernels ##

 These are the pre-stored kernel matrices for static convolution filters. The available kernels are:

  * Sobel 3x3 Horizontal and Vertical
  * Sobel 5x5 Horizontal and Vertical
  * Kirsch 3x3 North, NorthEast, East, SouthEast, South, SouthWest, West, NorthWest
  * Laplacian Of Gaussian 9x9
  * Prewitt 3x3 Horizontal and Vertical
  * Prewitt 5x5 Horizontal and Vertical
  * Blur (Box Blur) 3x3
  * Blur (Box Blur) 5x5
  * Motion Blur 3x3 (statically NorthWest -> SouthEast direction only)
  * Motion Blur 5x5 (statically NorthWest -> SouthEast direction only)
  * Gaussian Blur 3x3
  * Gaussian Blur 5x5
  * Sharpen 3x3

  Kernels can be accessed via `SIFT.Kernel.kernelName.kernelSize.kernelDirection`

  You can run Kernels over an image by passing the preferred kernel with the canvas ImageData object into one of the convolution functions:
  `var results = SIFT.baseAlgorithms.convolveKernel(canvasImageDataObject, kernelArray, opaqueBool);`
  `var results = SIFT.baseAlgorithms.convolveKernelFloat32(canvasImageDataObject, kernelArray, opaqueBool);`

  If you want more control over your convolution filters, you can run your canvas image data through the vertical and horizontal convolve functions with your custom weight arrays:

  `SIFT.baseAlgorithms.convolveVertical(canvasImageDataObject, weightsArray, opacityBool)`
  `SIFT.baseAlgorithms.convolveHorizontal(canvasImageDataObject, weightsArray, opacityBool)`
