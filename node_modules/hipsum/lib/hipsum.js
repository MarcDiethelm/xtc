/** 
 * @module hipsum
 */

var  path = require('path')
	,handlebars = require('handlebars')
	,handlebarsHelper
	,Hipsum
;

/**
 * Hipsum
 * @param options
 * @constructor
 */
Hipsum = function(options) {
	
	this.options = options;
	this.getDictionary();
	
	switch(this.options.textType) {
		case 'lorem-ipsum':
			this.makeText();
			break;
		case 'hamlet':
			this.makeText();
			break;
	}
};

/**
 * 
 * @type {{aText: Array, string: string, getDictionary: Function, makeLorem: Function, outputString: Function}}
 */
Hipsum.prototype = {
	
	aText: []
	,string: ''
	
	,getDictionary: function() {
		
		this.aText = require( './dictionaries/' + this.options.textType+'.json').wordList;
	}
	
	,makeText: function() {
		
		var  wordCount = this.options.wordCount
			,repeatCount = 0
			,remainder = 0
			,i = 1
			,aText = ''
		;
		
		if (wordCount < this.aText.length) {
			aText = this.getWordListSlice(this.options.wordCount).join(' ');
		}
		else if (wordCount > this.aText.length) {
			repeatCount = Math.floor(wordCount / this.aText.length);
			remainder = wordCount % this.aText.length;
			
			aText = this.aText.join(' ');
			for (i; i<repeatCount; i++) {
				aText = aText + aText;
			}
			aText = aText + this.getWordListSlice(remainder+1).join(' ');
		}
		else {
			aText = this.aText.join(' ');
		}
		
		this.string = aText;
	}
	
	,outputString: function() {
		return new handlebars.SafeString(this.string);
	}

	/**
	 * Return a subset of the word list. Will always end with proper punctuation.
	 * @param wordCount
	 * @returns {String[]}
	 */
	,getWordListSlice: function(wordCount) {
		var  slice = this.aText.slice(0, wordCount)
			,lastWord = slice[slice.length-1]
			,lastChar = lastWord[lastWord.length-1]
		;

		// Replace mid-sentence punctuation if present at end.
		if ( /:|;|,/i.test(lastChar) ) {
			lastWord = lastWord.substr(0, lastWord.length-1) + '.';
		}
		// If no full stop or ellipsis is present add a full stop.
		else if (lastChar != '.' || lastChar != '…') {
			 lastWord = lastWord +'.';
		}

		slice[slice.length-1] = lastWord;
		return slice;
	}
	
};

/**
 * @desc The function that's called when the helper is used in a Handlebars template
 * @returns {{string: string, hipsum: object}}
 */
handlebarsHelper = function() {
	
	var  hipsum 
		,options
		,output
	;

	options = {
		// The requested number of words. Default is 69, the length of the first paragraph of Lorem ipsum.
		 wordCount          : arguments[0] || 69
		
		// The requested text type. Default is Lorem ipsum (for now anyway)
		,textType           : arguments.length >= 3 ? arguments[1] : 'lorem-ipsum'
	};
	
	hipsum = new Hipsum(options);
	output = hipsum.outputString();
	
	// Attach the hipsum instance for testing
	process.env.NODE_ENV != 'production' && (output.hipsum = hipsum);
	return output;
};

/**
 * Entry point
 * @param {Object} [hbs]
 * @returns {Function}
 */
module.exports = function(hbs) {
	
	hbs && hbs.registerHelper('filler', handlebarsHelper);
	
	// If the user doesn't pass Handlebars she must register the helper herself.
	return handlebarsHelper;
};