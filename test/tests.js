/*jshint multistr:true */
// Tests. Mocha/assert style. See
// http://visionmedia.github.com/mocha/
// http://nodejs.org/docs/latest/api/assert.html

var assert = require('assert');
var jsdom = require('jsdom');
var agave = require('../index.js');

var mockObject = {
  foo: 'bar',
  baz: {
    bam:'boo',
    zar:{
      zog:'victory'
    }
  },
  null:{
    'yarr':{
      'parrot':'ahoy'
    }
  }
};

// Set up a global.document with a DOM in the same way a browser has
var setupDOM = function(documentText) {
  var document = jsdom.jsdom(documentText, null, {
    features: {
      QuerySelector: true
    }
  });
  var window = document.createWindow();
  ['Element','NodeList','document'].forEach(function(obj){
    global[obj] = window[obj];
  });
};

var mockHTML = ' \
<html> \
  <body> \
    <article> \
      <heading>Sample document</heading> \
      <author></author> \
      <p>Carles portland banh mi lomo twee.</p> \
      <p>Narwhal bicycle rights keffiyeh beard.</p> \
      <p>Pork belly beard pop-up kale chips.</p> \
    </article> \
  </body> \
</html> \
';

setupDOM(mockHTML);

agave.enable('av');

describe('Array.contains', function(){
  it('fetches the item accurately', function(){
    assert(['one','two','three'].avcontains('two') );
  });
  it('handles missing items accurately', function(){
    assert( ! ['one','two','three'].avcontains('notthere') );
  });
});

describe('Array.extend', function(){
  it('extends the array accurately', function(){
    assert.deepEqual([1,2,3].avextend([4,5]), [1,2,3,4,5] );
  });
});

describe('String.contains', function(){
  it('checks for the substring accurately', function(){
    assert('elephantine'.avcontains('tin') );
  });
  it('handles missing substrings accurately', function(){
    assert( ! 'elephantine'.avcontains('zam') );
  });
});

describe('String.endsWith', function(){
  it('works if the string actually ends with the suffix', function(){
    assert('Hello world'.avendsWith('world'));
  });
  it('handles trying to check if something ends in something larger than itself', function(){
    assert.equal('world'.avendsWith('Hello world'), false);
  });
});

describe('String.startsWith', function(){
  it('works if the string actually starts with the prefix', function(){
    assert('Hello world'.avstartsWith('Hello'));
  });
});

describe('String.repeat', function(){
  it('repeats strings accurately', function(){
    assert.equal('Hello world'.avrepeat(3), 'Hello worldHello worldHello world');
  });
});

describe('String.reverse', function(){
  it('reverses strings accurately', function(){
    assert.equal('Hello world'.avreverse(), 'dlrow olleH');
  });
});

describe('String.leftStrip', function(){
  it('strips from the left accurately', function(){
    assert.equal('Hello world'.avleftStrip('Hle'), 'o world');
  });
});

describe('String.rightStrip', function(){
  it('strips from the right accurately', function(){
    assert.equal('Hello world'.avrightStrip('ldr'), 'Hello wo');
  });
});

describe('String.rightStrip', function(){
  it('strips from the left accurately with a single character', function(){
    assert.equal('a'.avleftStrip('a'), '');
  });
});

describe('String.strip', function(){
  it('strips from the both sides accurately', function(){
    assert.equal('Hello world'.avstrip('Hld'), 'ello wor');
  });
});

describe('Object.getKeys', function(){
  it('fetches keys accurately', function(){
    assert.deepEqual(mockObject.avgetKeys(), ["foo","baz","null"] );
  });
});

describe('Object.getSize', function(){
  it('counts keys accurately', function(){
    assert.equal(mockObject.avgetSize(), 3);
  });
});

describe('Array.findItem', function(){
  it('correctly finds items that match the function', function(){
    assert.equal(['one','two','three'].avfindItem(function(item){
      return (item === 'three');
    }), 'three');
  });
});

describe('Object.getPath', function(){
  it('returns undefined when a value is missing', function(){
    assert.equal(mockObject.avgetPath(['foo','pineapple']), undefined);
  });
  it('returns the value when the provided keys exist', function(){
    assert.equal(mockObject.avgetPath(['baz','zar','zog']), 'victory');
  });
  it('returns the value when the provided keys exist, even if null is on the path', function(){
    assert.equal(mockObject.avgetPath([null,'yarr','parrot']), 'ahoy');
  });
  it('works using Unix-style paths', function(){
    assert.equal(mockObject.avgetPath('/baz/zar/zog'), 'victory');
  });
});

describe('Object.clone', function(){
  var copyObject = mockObject.avclone()
  it('clones objects so that modification to the new object will not affect the original', function(){
    copyObject.baz.bam = 'newvalue'
    assert.equal(copyObject.avgetPath(['baz','bam']), 'newvalue');
    assert.equal(mockObject.avgetPath(['baz','bam']), 'boo');
  });
});

describe('Number.days', function(){
  it('correctly converts a number to days in seconds', function(){
    assert.equal((5).avdays(), 432000000);
  });
});

describe('Number.weeks.before and .after', function(){
  it('correctly converts a number to a period in weeks before a set date', function(){
    var someDate = new Date('Thu Jun 06 2013 22:44:05 GMT+0100 (UTC)')
    var timezoneOffset = someDate.getTimezoneOffset()
    assert.equal((3).avweeks().avbefore(someDate).toLocaleDateString("en-GB", {timeZone:'UTC'}), 'Thursday, May 16, 2013');
  });
  it('correctly converts a number to a period in weeks after a set date', function(){
    var someDate = new Date('Thu Jun 06 2013 22:44:05 GMT+0100 (UTC)')
    var timezoneOffset = someDate.getTimezoneOffset()
    assert.equal((3).avweeks().avafter(someDate).toLocaleDateString("en-GB", {timeZone:'UTC'}), 'Thursday, June 27, 2013');
  });
});

describe('Agave really doesn\'t affect for loops', function(){
  it ('doesn\'t. really', function(){
    for ( var key in mockObject ) {
      assert( ! ['avgetKeys','avgetSize','avgetPath'].avcontains(key) );
    }
  });
});

describe('Element.createChild', function(){
  var sillyText = 'ethical messenger bag';
  var article = document.querySelector('article');
  article.avcreateChild('p',{'id':'testpara'},sillyText);
  it('creates children with the specified attributes', function(){
    var paraCount = document.querySelector('#testpara');
    assert(paraCount);
  });
  it('creates children with the specified text', function(){
    assert(document.querySelector('#testpara').textContent === sillyText );
  });
});

describe('Element.applyStyles', function(){
  it('styles elements', function(){
    var heading = document.querySelector('heading');
    heading.avapplyStyles({'font-size':'18em'})
    assert.equal(heading.style['font-size'], '18em');
  });
});