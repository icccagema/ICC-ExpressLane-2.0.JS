module.exports = (function() {
  const fs = require('fs');
  const { EOL } = require('os');
  const { ProductFrameCollection, MFGHeader } = require('../model/PartitionFrame');
  return {
      /**
       * 
       * @param {ProductFrameCollection[]} parFrameCols 
       */
      FrameCollectionsToMFG: function(prodCols) {
        prodCols.forEach(col => {
          
        });
      }
  }
} ());