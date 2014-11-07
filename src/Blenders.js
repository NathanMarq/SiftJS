/*
*
* CANVAS BLENDERS
*
*/

/*******************************************************************************
*
*     Blend Types
*
*******************************************************************************/

  // http://blogs.adobe.com/webplatform/2014/02/24/using-blend-modes-in-html-canvas/
  // http://www.benknowscode.com/2012/10/html-canvas-imagedata-creating-layers_9883.html


SIFT.Blender = {

  combine : function(pixelsArray){
    var count = pixelsArray.length;
    var results = SIFT.tempCTX.createImageData(pixelsArray[0].width, pixelsArray[0].height);
    // results.putImageData(results);

    for(var i=1; i<count; i++){
      var data = pixelsArray[i];

      for(var j=0; j<data.data.length; j+=4){

        results.data[j] += (data.data[j]*1/count);
        results.data[j+1] += (data.data[j+1]*1/count);
        results.data[j+2] += (data.data[j+2]*1/count);
        results.data[j+3] += (data.data[j+3]*1/count);

      }

    }

    return results;

  }


};
