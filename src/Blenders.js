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

    for(var i=0; i<count; i++){
      var data = pixelsArray[i].data;

        for(var j=0; j<data.length; j+=4){

          results.data[j] += (data[j]/count);
          results.data[j+1] += (data[j+1]/count);
          results.data[j+2] += (data[j+2]/count);
          results.data[j+3] += (data[j+3]/count);

        }

    }

    return results;

  }


};
