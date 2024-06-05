(function (imageproc) {
	"use strict";

	/*
	 * Apply negation to the input data
	 */
	imageproc.negation = function (inputData, outputData) {
		console.log("Applying negation...");

		for (var i = 0; i < inputData.data.length; i += 4) {
			outputData.data[i] = 255 - inputData.data[i];
			outputData.data[i + 1] = 255 - inputData.data[i + 1];
			outputData.data[i + 2] = 255 - inputData.data[i + 2];
		}
	};

	/*
	 * Convert the input data to grayscale
	 */
	imageproc.grayscale = function (inputData, outputData) {
		console.log("Applying grayscale...");

		/**
		 * TODO: You need to create the grayscale operation here
		 */

		for (var i = 0; i < inputData.data.length; i += 4) {
			// Find the grayscale value using simple averaging
			let intensity =
				(inputData.data[i] + inputData.data[i + 1] + inputData.data[i + 2]) / 3;

			// Change the RGB components to the resulting value

			outputData.data[i] = intensity;
			outputData.data[i + 1] = intensity;
			outputData.data[i + 2] = intensity;
		}
	};

	/*
	 * Applying brightness to the input data
	 */
	imageproc.brightness = function (inputData, outputData, offset) {
		console.log("Applying brightness...");

		/**
		 * TODO: You need to create the brightness operation here
		 */

		for (var i = 0; i < inputData.data.length; i += 4) {
			// Change the RGB components by adding an offset

			outputData.data[i] = inputData.data[i] + offset;
			outputData.data[i + 1] = inputData.data[i + 1] + offset;
			outputData.data[i + 2] = inputData.data[i + 2] + offset;

			// Handle clipping of the RGB components
			if (outputData.data[i] > 255) {
				outputData.data[i] = 255;
			} else if (outputData.data[i] < 0) {
				outputData.data[i] = 0;
			}

			if (outputData.data[i + 1] > 255) {
				outputData.data[i + 1] = 255;
			} else if (outputData.data[i + 1] < 0) {
				outputData.data[i + 1] = 0;
			}

			if (outputData.data[i + 2] > 255) {
				outputData.data[i + 2] = 255;
			} else if (outputData.data[i + 2] < 0) {
				outputData.data[i + 2] = 0;
			}
		}
	};

	/*
	 * Applying contrast to the input data
	 */
	imageproc.contrast = function (inputData, outputData, factor) {
		console.log("Applying contrast...");

		/**
		 * TODO: You need to create the brightness operation here
		 */

		for (var i = 0; i < inputData.data.length; i += 4) {
			// Change the RGB components by multiplying a factor

			outputData.data[i] = inputData.data[i] * factor;
			outputData.data[i + 1] = inputData.data[i + 1] * factor;
			outputData.data[i + 2] = inputData.data[i + 2] * factor;

			// Handle clipping of the RGB components
			if (outputData.data[i] > 255) {
				outputData.data[i] = 255;
			}
			if (outputData.data[i + 1] > 255) {
				outputData.data[i + 1] = 255;
			}
			if (outputData.data[i + 2] > 255) {
				outputData.data[i + 2] = 255;
			}
		}
	};

	/*
	 * Make a bit mask based on the number of MSB required
	 */
	function makeBitMask(bits) {
		var mask = 0;
		for (var i = 0; i < bits; i++) {
			mask >>= 1;
			mask |= 128;
		}
		return mask;
	}

	/*
	 * Apply posterization to the input data
	 */
	imageproc.posterization = function (
		inputData,
		outputData,
		redBits,
		greenBits,
		blueBits
	) {
		console.log("Applying posterization...");

		/**
		 * TODO: You need to create the posterization operation here
		 */

		// Create the red, green and blue masks
		// A function makeBitMask() is already given
		let redMask = makeBitMask(redBits);
		let greenMask = makeBitMask(greenBits);
		let blueMask = makeBitMask(blueBits);

		for (var i = 0; i < inputData.data.length; i += 4) {
			// Apply the bitmasks onto the RGB channels

			outputData.data[i] = inputData.data[i] & redMask;
			outputData.data[i + 1] = inputData.data[i + 1] & greenMask;
			outputData.data[i + 2] = inputData.data[i + 2] & blueMask;
		}
	};

	/*
	 * Apply threshold to the input data
	 */
	imageproc.threshold = function (inputData, outputData, thresholdValue) {
		console.log("Applying thresholding...");

		/**
		 * TODO: You need to create the thresholding operation here
		 */

		for (var i = 0; i < inputData.data.length; i += 4) {
			// Find the grayscale value using simple averaging
			// You will apply thresholding on the grayscale value
			let intensity =
				(inputData.data[i] + inputData.data[i + 1] + inputData.data[i + 2]) / 3;

			// Change the colour to black or white based on the given threshold
			let outputValue = intensity < thresholdValue ? 0 : 255;

			outputData.data[i] = outputValue;
			outputData.data[i + 1] = outputValue;
			outputData.data[i + 2] = outputValue;
		}
	};

	/*
	 * Build the histogram of the image for a channel
	 */
	function buildHistogram(inputData, channel) {
		var histogram = [];
		for (var i = 0; i < 256; i++) histogram[i] = 0;

		/**
		 * TODO: You need to build the histogram here
		 */

		// Accumulate the histogram based on the input channel
		// The input channel can be:
		// "red"   - building a histogram for the red component
		// "green" - building a histogram for the green component
		// "blue"  - building a histogram for the blue component
		// "gray"  - building a histogram for the intensity
		//           (using simple averaging)

		if (channel == "gray") {
			for (var i = 0; i < inputData.data.length; i += 4) {
				var grayscale_value =
					(inputData.data[i] + inputData.data[i + 1] + inputData.data[i + 2]) /
					3;
				histogram[Math.round(grayscale_value)] += 1;
			}
		}

		if (channel == "red") {
			for (var i = 0; i < inputData.data.length; i += 4) {
				histogram[inputData.data[i]] += 1;
			}
		}

		if (channel == "green") {
			for (var i = 0; i < inputData.data.length; i += 4) {
				histogram[inputData.data[i + 1]] += 1;
			}
		}

		if (channel == "blue") {
			for (var i = 0; i < inputData.data.length; i += 4) {
				histogram[inputData.data[i + 2]] += 1;
			}
		}

		return histogram;
	}

	/*
	 * Find the min and max of the histogram
	 */
	function findMinMax(histogram, pixelsToIgnore) {
		var min = 0,
			max = 255;

		/**
		 * TODO: You need to build the histogram here
		 */

		// Find the minimum in the histogram with non-zero value by
		// ignoring the number of pixels given by pixelsToIgnore
		var countLeft = 0;
		var i = 0;
		for (i = 0; i < 256; i++) {
			countLeft += histogram[i];
			if (countLeft > pixelsToIgnore) {
				break;
			}
		}
		for (min = i; min < 256; min++) {
			if (histogram[min] > 0) {
				break;
			}
		}

		// Find the maximum in the histogram with non-zero value by
		// ignoring the number of pixels given by pixelsToIgnore
		var countRight = 0;
		var j = 255;
		for (j = 255; j >= 0; j--) {
			countRight += histogram[j];
			if (countRight > pixelsToIgnore) {
				break;
			}
		}
		for (max = j; max >= 0; max--) {
			if (histogram[max] > 0) {
				break;
			}
		}

		return { min: min, max: max };
	}

	/*
	 * Apply automatic contrast to the input data
	 */
	imageproc.autoContrast = function (inputData, outputData, type, percentage) {
		console.log("Applying automatic contrast...");

		// Find the number of pixels to ignore from the percentage
		var pixelsToIgnore = (inputData.data.length / 4) * percentage;

		var histogram, minMax;
		if (type == "gray") {
			// Build the grayscale histogram
			histogram = buildHistogram(inputData, "gray");

			// Find the minimum and maximum grayscale values with non-zero pixels
			minMax = findMinMax(histogram, pixelsToIgnore);

			var min = minMax.min,
				max = minMax.max,
				range = max - min;

			/**
			 * TODO: You need to apply the correct adjustment to each pixel
			 */

			for (var i = 0; i < inputData.data.length; i += 4) {
				// Adjust each pixel based on the minimum and maximum values
				outputData.data[i] = ((inputData.data[i] - min) / (max - min)) * 255;
				outputData.data[i + 1] =
					((inputData.data[i + 1] - min) / (max - min)) * 255;
				outputData.data[i + 2] =
					((inputData.data[i + 2] - min) / (max - min)) * 255;

				//handle clipping
				if (outputData.data[i] > 255) {
					outputData.data[i] = 255;
				}
				if (outputData.data[i + 1] > 255) {
					outputData.data[i + 1] = 255;
				}
				if (outputData.data[i + 2] > 255) {
					outputData.data[i + 2] = 255;
				}
			}
		} else {
			/**
			 * TODO: You need to apply the same procedure for each RGB channel
			 *       based on what you have done for the grayscale version
			 */

			// Build the RGB histograms
			var redHistogram = buildHistogram(inputData, "red");
			var greenHistogram = buildHistogram(inputData, "green");
			var blueHistogram = buildHistogram(inputData, "blue");

			// Find the minimum and maximum RGB values with non-zero pixels
			var redMinMax = findMinMax(redHistogram, pixelsToIgnore);
			var greenMinMax = findMinMax(greenHistogram, pixelsToIgnore);
			var blueMinMax = findMinMax(blueHistogram, pixelsToIgnore);

			var redMin = redMinMax.min,
				redMax = redMinMax.max;

			var greenMin = greenMinMax.min,
				greenMax = greenMinMax.max;

			var blueMin = blueMinMax.min,
				blueMax = blueMinMax.max;

			for (var i = 0; i < inputData.data.length; i += 4) {
				// Adjust each channel based on the histogram of each one
				outputData.data[i] =
					((inputData.data[i] - redMin) / (redMax - redMin)) * 255;
				outputData.data[i + 1] =
					((inputData.data[i + 1] - greenMin) / (greenMax - greenMin)) * 255;
				outputData.data[i + 2] =
					((inputData.data[i + 2] - blueMin) / (blueMax - blueMin)) * 255;

				//handle clipping
				if (outputData.data[i] > 255) {
					outputData.data[i] = 255;
				}
				if (outputData.data[i + 1] > 255) {
					outputData.data[i + 1] = 255;
				}
				if (outputData.data[i + 2] > 255) {
					outputData.data[i + 2] = 255;
				}
			}
		}
	};
})((window.imageproc = window.imageproc || {}));
