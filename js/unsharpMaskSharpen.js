(function (imageproc) {
	"use strict";

	/*
	 * Apply Unsharp Mask Sharpening to the input data
	 */
	imageproc.unsharpMaskSharpen = function (
		inputData,
		outputData,
		grayscaleOnly,
		showHighpassOutput,
		radiusMode,
		amount,
		threshold
	) {
		console.log("Applying Unsharp Mask Sharpening...");

		// create blur kernel
		var sigma;
		var blurKernelSize;
		switch (radiusMode) {
			case "default":
				// Get the gaussian blur radius
				var radius = parseInt($("#radius").val());

				// calculate the gaussian blur sigma (standard deviation) value from radius
				sigma = (radius + 1) / Math.sqrt(2 * Math.log(255));

				// calculate the gaussian blur kernel size from radius
				blurKernelSize = 2 * radius + 1;
				break;

			case "customized":
				// Get gaussian blur sigma (standard deviation) value
				sigma = parseFloat($("#gaussian-sigma").val());

				// Get gaussian blur kernel size
				blurKernelSize = parseInt($("#ums-blur-kernel-size").val());
				break;
		}

		// Create a blurKernelSize x blurKernelSize matrix , fill up with 0.0
		var kernel = Array.from({ length: blurKernelSize }, () => {
			return new Array(blurKernelSize).fill(0.0);
		});

		// Set up sum for later normalization
		var sum = 0.0;

		// Set the kernel with gaussian distribution values
		var offset = Math.floor(blurKernelSize / 2);
		for (var i = -1 * offset; i <= offset; i++) {
			for (var j = -1 * offset; j <= offset; j++) {
				var exponent = parseFloat(
					parseFloat(-(i * i + j * j)) / parseFloat(2 * sigma * sigma)
				);
				var value =
					Math.pow(Math.E, exponent) / parseFloat(2 * Math.PI * sigma * sigma);

				kernel[i + offset][j + offset] = value;
				sum += value;
			}
		}

		// Normalize the kernel so that all values in the kernel sum to 1
		for (var i = 0; i < blurKernelSize; i++) {
			for (var j = 0; j < blurKernelSize; j++) {
				kernel[i][j] /= sum;
			}
		}

		if (grayscaleOnly) {
			// Apply the created gaussian blur kernel to the grayscale image only
			console.log(
				`Applying gaussian blur with sigma:${sigma} and kernel size:${blurKernelSize} to grayscale image...`
			);

			// store grayscale image data in temporary buffer
			var grayscaleData = imageproc.createBuffer(outputData);
			imageproc.grayscale(inputData, grayscaleData);

			// create temporary buffer for blurred grayscale image data
			var blurredGrayscaleData = imageproc.createBuffer(outputData);
			for (var y = 0; y < inputData.height; y++) {
				for (var x = 0; x < inputData.width; x++) {
					// Use imageproc.getPixel() to get the pixel values over the kernel
					var grayscaleValue = 0;
					var offset = Math.floor(blurKernelSize / 2);
					for (var j = -1 * offset; j <= offset; j++) {
						for (var i = -1 * offset; i <= offset; i++) {
							var pixel = imageproc.getPixel(grayscaleData, x + i, y + j);
							grayscaleValue += pixel.r * kernel[j + offset][i + offset];
						}
					}

					// Then set the blurred grayscale result to the temporary buffer
					var i = (x + y * blurredGrayscaleData.width) * 4;
					blurredGrayscaleData.data[i] =
						blurredGrayscaleData.data[i + 1] =
						blurredGrayscaleData.data[i + 2] =
							grayscaleValue;
				}
			}

			// Apply Unsharp Mask Sharpening on blurred grayscale image
			console.log(
				`Applying sharpening with amount:${amount} and threshold:${threshold} to grayscale image...`
			);

			//loop through and set each pixel of output image
			for (var i = 0; i < blurredGrayscaleData.data.length; i += 4) {
				// calculate differences between grayscale image and blurred grayscale image
				var diff = grayscaleData.data[i] - blurredGrayscaleData.data[i];

				// define result grayscale value
				var result;

				if (showHighpassOutput) {
					//show highpass details only
					Math.abs(diff) > threshold
						? (result = (amount / 100) * Math.abs(diff))
						: (result = 0);
				} else {
					// set result grayscale value with threshold checking
					// adding mutiplied differences to original grayscale value if > threshold
					Math.abs(diff) > threshold
						? (result = grayscaleData.data[i] + (amount / 100) * diff)
						: (result = grayscaleData.data[i]);
				}

				// handle clipping for grayscale value
				// and set output value
				result > 255
					? (outputData.data[i] =
							outputData.data[i + 1] =
							outputData.data[i + 2] =
								255)
					: (outputData.data[i] =
							outputData.data[i + 1] =
							outputData.data[i + 2] =
								result);
				result < 0
					? (outputData.data[i] =
							outputData.data[i + 1] =
							outputData.data[i + 2] =
								0)
					: (outputData.data[i] =
							outputData.data[i + 1] =
							outputData.data[i + 2] =
								result);
			}
		} else {
			// Apply the created gaussian blur kernel to the whole image through all color channels
			console.log(
				`Applying gaussian blur with sigma:${sigma} and kernel size:${blurKernelSize} to all color channels...`
			);
			// create temporary buffer for blurred image data
			var blurredData = imageproc.createBuffer(outputData);
			for (var y = 0; y < inputData.height; y++) {
				for (var x = 0; x < inputData.width; x++) {
					// Use imageproc.getPixel() to get the pixel values over the kernel
					var br = 0;
					var bg = 0;
					var bb = 0;
					var offset = Math.floor(blurKernelSize / 2);
					for (var j = -1 * offset; j <= offset; j++) {
						for (var i = -1 * offset; i <= offset; i++) {
							var pixel = imageproc.getPixel(inputData, x + i, y + j);
							br += pixel.r * kernel[j + offset][i + offset];
							bg += pixel.g * kernel[j + offset][i + offset];
							bb += pixel.b * kernel[j + offset][i + offset];
						}
					}

					// Then set the blurred result to the temporary data
					var i = (x + y * blurredData.width) * 4;
					blurredData.data[i] = br;
					blurredData.data[i + 1] = bg;
					blurredData.data[i + 2] = bb;
				}
			}

			// Apply Unsharp Mask Sharpening on blurred image
			console.log(
				`Applying sharpening with amount:${amount} and threshold:${threshold}...`
			);

			//loop through and set each pixel of output image
			for (var i = 0; i < blurredData.data.length; i += 4) {
				// calculate differences between original image and blurred image
				var diffR = inputData.data[i] - blurredData.data[i];
				var diffG = inputData.data[i + 1] - blurredData.data[i + 1];
				var diffB = inputData.data[i + 2] - blurredData.data[i + 2];

				// define result rgb values
				var resultR;
				var resultG;
				var resultB;

				if (showHighpassOutput) {
					// show highpass details only
					Math.abs(diffR) > threshold
						? (resultR = (amount / 100) * Math.abs(diffR))
						: (resultR = 0);

					Math.abs(diffG) > threshold
						? (resultG = (amount / 100) * Math.abs(diffG))
						: (resultG = 0);

					Math.abs(diffB) > threshold
						? (resultB = (amount / 100) * Math.abs(diffB))
						: (resultB = 0);
				} else {
					// set result rgb values with threshold checking
					// adding mutiplied differences to original rgb values if > threshold
					Math.abs(diffR) > threshold
						? (resultR = inputData.data[i] + (amount / 100) * diffR)
						: (resultR = inputData.data[i]);

					Math.abs(diffG) > threshold
						? (resultG = inputData.data[i + 1] + (amount / 100) * diffG)
						: (resultG = inputData.data[i + 1]);

					Math.abs(diffB) > threshold
						? (resultB = inputData.data[i + 2] + (amount / 100) * diffB)
						: (resultB = inputData.data[i + 2]);
				}

				// handle clipping for red channel
				// and set output value
				resultR > 255
					? (outputData.data[i] = 255)
					: (outputData.data[i] = resultR);
				resultR < 0 ? (outputData.data[i] = 0) : (outputData.data[i] = resultR);

				// handle clipping for green channel
				// and set output value
				resultG > 255
					? (outputData.data[i + 1] = 255)
					: (outputData.data[i + 1] = resultG);
				resultG < 0
					? (outputData.data[i + 1] = 0)
					: (outputData.data[i + 1] = resultG);

				// handle clipping for blue channel
				// and set output value
				resultB > 255
					? (outputData.data[i + 2] = 255)
					: (outputData.data[i + 2] = resultB);
				resultB < 0
					? (outputData.data[i + 2] = 0)
					: (outputData.data[i + 2] = resultB);
			}
		}
	};
})((window.imageproc = window.imageproc || {}));
