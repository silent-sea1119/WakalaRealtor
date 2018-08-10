module.exports = class HumanReadable {

	static get defaultOptions() {
		return {
			base: 1000,
			output(size, significand, exponent, {base, digits, prefix}) {
				if (0 <= size && size % 1 === 0 && size < base) {
					return `${size}`;
				} else if (exponent < 0) {
					digits = 0;
				}
				return `${significand.toFixed(digits < 0 ? 0 : digits)}${prefix[exponent]}`;
			},
			round: Math.round,
			digits: 1,
			prefix: {
				[-5]: 'f',
				[-4]: 'p',
				[-3]: 'n',
				[-2]: 'μ',
				[-1]: 'm',
				0: '',
				1: 'K',
				2: 'M',
				3: 'G',
				4: 'T',
				5: 'P',
				6: 'E',
				7: 'Z',
				8: 'Y',
			},
		};
	}

	constructor(options = {}) {
		this.options = options;
		return (size, options) => {
			options = this.getOptions(options);
			const {base, digits} = options;
			const logarithm = Math.log(size) / Math.log(base);
			let exponent = Math.floor(logarithm);
			let significand = Math.pow(base, logarithm - exponent);
			if (0 <= digits) {
				const offset = Math.pow(10, digits);
				significand = options.round(significand * offset) / offset;
				while (base <= significand) {
					exponent++;
					significand /= base;
				}
			}
			return options.output(size, significand, exponent, options);
		};
	}

	getOptions(options) {
		return Object.assign(HumanReadable.defaultOptions, this.options, options);
	}

};
