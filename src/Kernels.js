/*
*
* KERNELS
*
* These are the kernels that are used for the various convolution functions.
*
* @TODO Turn these into functions that return arrays, rather than storing them statically
*
*/

SIFT.Kernel = {

  sobel: {

    threeByThree: {

      horizontal: [ -1, -2, -1,
                     0,  0,  0,
                     1,  2,  1 ],

      vertical:   [ -1,  0,  1,
                    -2,  0,  2,
                    -1,  0,  1 ],
      maxVal: 510,
    },

    fiveByFive: {

      horizontal: [ -1, -4, -6,  -4, -1,
                    -2, -8, -12, -8, -2,
                     0,  0,  0,   0,  0,
                     2,  8,  12,  8,  2,
                     1,  4,  6,   4,  1],

      vertical:   [  1,  2,  0,  -2,  -1,
                     4,  8,  0,  -8,  -4,
                     6,  12, 0,  -12, -6,
                     4,  8,  0,  -8,  -4,
                     1,  2,  0,  -2,  -1],
      maxVal: 1020
    }

  },

  kirsch: {

    north:     [  5,  5,  5,
                 -3,  0, -3,
                 -3, -3, -3 ],

    northEast: [ -3,  5,  5,
                 -3,  0,  5,
                 -3, -3, -3 ],

    east:      [ -3, -3,  5,
                 -3,  0,  5,
                 -3, -3,  5 ],

    southEast: [ -3, -3, -3,
                 -3,  0,  5,
                 -3,  5,  5 ],

    south:     [ -3, -3, -3,
                 -3,  0, -3,
                  5,  5,  5 ],

    southWest: [ -3, -3, -3,
                  5,  0, -3,
                  5,  5, -3 ],

    west:      [  5, -3, -3,
                  5,  0, -3,
                  5, -3, -3 ],

    northWest: [  5,  5, -3,
                  5,  0, -3,
                 -3, -3, -3 ]

  },

  laplacianOfGaussian: {

    nineByNine: [  0, 1, 1,  2,   2,   2,  1, 1, 0,
                   1, 2, 4,  5,   5,   5,  4, 2, 1,
                   1, 4, 5,  3,   0,   3,  5, 4, 1,
                   2, 5, 3, -12, -24, -12, 3, 5, 2,
                   2, 5, 0, -24, -40, -24, 0, 5, 2,
                   2, 5, 3, -12, -24, -12, 3, 5, 2,
                   1, 4, 5,  3,   0,   3,  5, 4, 1,
                   1, 2, 4,  5,   5,   5,  4, 2, 1,
                   0, 1, 1,  2,   2,   2,  1, 1, 0,

                ]

  },

  prewitt: {

    threeByThree: {

      horizontal: [ -1, -1, -1,
                     0,  0,  0,
                     1,  1,  1 ],

      vertical:   [ -1,  0,  1,
                    -1,  0,  1,
                    -1,  0,  1 ]
    },

    fiveByFive: {

      horizontal: [ -1, -1, -1,  -1, -1,
                    -2, -2, -2,  -2, -2,
                     0,  0,  0,   0,  0,
                     2,  2,  2,   2,  2,
                     1,  1,  1,   1,  1],

      vertical:   [  -1,  -2,  0,  2,  1,
                     -1,  -2,  0,  2,  1,
                     -1,  -2,  0,  2,  1,
                     -1,  -2,  0,  2,  1,
                     -1,  -2,  0,  2,  1]
    }

  },

  blur: {

    threeByThree: [ 1/9, 1/9, 1/9,
                    1/9, 1/9, 1/9,
                    1/9, 1/9, 1/9 ],

    fiveByFive: [ 1/25, 1/25, 1/25, 1/25, 1/25,
                  1/25, 1/25, 1/25, 1/25, 1/25,
                  1/25, 1/25, 1/25, 1/25, 1/25,
                  1/25, 1/25, 1/25, 1/25, 1/25,
                  1/25, 1/25, 1/25, 1/25, 1/25 ]

  },

  motionBlur: {

    threeByThree: [ 1, 0, 0,
                    0, 1, 0,
                    0, 0, 1 ],

    fiveByFive: [   1, 0, 0, 0, 0,
                    0, 1, 0, 0, 0,
                    0, 0, 1, 0, 0,
                    0, 0, 0, 1, 0,
                    0, 0, 0, 0, 1 ]

  },

  gaussianBlur: {

    threeByThree: [ 1/16, 1/8, 1/16,
                    1/8,  1/4, 1/8,
                    1/16, 1/8, 1/16 ],

    fiveByFive: [   1/64, 1/32, 1/16, 1/32, 1/64,
                    1/32, 1/16, 1/8,  1/16, 1/32,
                    1/16, 1/8,  1/4,  1/8,  1/16,
                    1/32, 1/16, 1/8,  1/16, 1/32,
                    1/64, 1/32, 1/16, 1/32, 1/64, ]

  },

  sharpen: {

    threeByThree: [  0, -1,  0,
                    -1,  5, -1,
                     0, -1,  0 ]
  }

};