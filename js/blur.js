(function (imageproc) {
	"use strict";

	/*
	 * Apply blur to the input data
	 */
	imageproc.blur = function (inputData, outputData, kernelSize) {
		console.log("Applying blur...");

		// You are given a 3x3 kernel but you need to create a proper kernel
		// using the given kernel size
		var kernel;
		switch (kernelSize) {
			case 3:
				kernel = [
					[1, 1, 1],
					[1, 1, 1],
					[1, 1, 1],
				];
				break;
			case 5:
				kernel = [
					[1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1],
				];
				break;
			case 7:
				kernel = [
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
				];
				break;
			case 9:
				kernel = [
					[1, 1, 1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1, 1, 1],
				];
				break;
			default:
				break;
		}

		/**
		 * TODO: You need to extend the blur effect to include different
		 * kernel sizes and then apply the kernel to the entire image
		 */

		// Apply the kernel to the whole image
		for (var y = 0; y < inputData.height; y++) {
			for (var x = 0; x < inputData.width; x++) {
				// Use imageproc.getPixel() to get the pixel values
				// over the kernel
				var br = 0;
				var bg = 0;
				var bb = 0;
				var offset = Math.floor(kernelSize / 2);
				for (var j = -1 * offset; j <= offset; j++) {
					for (var i = -1 * offset; i <= offset; i++) {
						var pixel = imageproc.getPixel(inputData, x + i, y + j);
						br += pixel.r * kernel[j + offset][i + offset];
						bg += pixel.g * kernel[j + offset][i + offset];
						bb += pixel.b * kernel[j + offset][i + offset];
					}
				}

				br = Math.round(br / (kernelSize * kernelSize));
				bg = Math.round(bg / (kernelSize * kernelSize));
				bb = Math.round(bb / (kernelSize * kernelSize));

				// Then set the blurred result to the output data
				var i = (x + y * outputData.width) * 4;
				outputData.data[i] = br;
				outputData.data[i + 1] = bg;
				outputData.data[i + 2] = bb;
			}
		}
	};
})((window.imageproc = window.imageproc || {}));
