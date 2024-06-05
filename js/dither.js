(function (imageproc) {
	"use strict";

	/*
	 * Apply ordered dithering to the input data
	 */
	imageproc.dither = function (inputData, outputData, matrixType) {
		console.log("Applying dithering...");

		/*
		 * TODO: You need to extend the dithering processing technique
		 * to include multiple matrix types
		 */

		var matrix, levels;
		var dim;

		switch (matrixType) {
			case "bayer2":
				matrix = [
					[1, 3],
					[4, 2],
				];
				levels = 5;
				dim = 2;
				break;
			case "bayer4":
				matrix = [
					[1, 9, 3, 11],
					[13, 5, 15, 7],
					[4, 12, 2, 10],
					[16, 8, 14, 6],
				];
				levels = 17;
				dim = 4;
				break;
			case "line":
				matrix = [
					[15, 15, 15, 25],
					[15, 15, 25, 15],
					[15, 25, 15, 15],
					[25, 15, 15, 15],
				];
				levels = 100;
				dim = 4;
				break;
			case "diamond":
				matrix = [
					[25, 15, 25, 15],
					[15, 25, 15, 15],
					[25, 15, 25, 15],
					[15, 15, 15, 25],
				];
				levels = 100;
				dim = 4;
				break;
		}

		for (var y = 0; y < inputData.height; y++) {
			for (var x = 0; x < inputData.width; x++) {
				var pixel = imageproc.getPixel(inputData, x, y);

				// Change the colour to grayscale and normalize it
				var value = (pixel.r + pixel.g + pixel.b) / 3;
				value = (value / 255) * levels;

				// Get the corresponding threshold of the pixel
				var threshold = matrix[y % dim][x % dim];

				// Set the colour to black or white based on threshold
				var i = (x + y * outputData.width) * 4;
				outputData.data[i] =
					outputData.data[i + 1] =
					outputData.data[i + 2] =
						value < threshold ? 0 : 255;
			}
		}
	};
})((window.imageproc = window.imageproc || {}));
