/*
Copyright (c) 2015, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/
/* jshint multistr:true */

(function() {

var expect = require('expect.js');

exports.test_yd = function (filter, expectedResults) {
    if (!expectedResults || expectedResults.length !== 1)
        throw new Error('must take 1 expected results');

    var str, o;

    o = filter(123);
    expect(o).to.eql('123');

    str = 'foo&<>\'"';
    o = filter(str);
    expect(o).to.eql(expectedResults[0]);
};

exports.test_yc = function (filter, expectedResults) {
    if (!expectedResults || expectedResults.length !== 6)
        throw new Error('must take 6 expected results');

    var str, o;

    o = filter(123);
    expect(o).to.eql('123');

    str = '--> --!> <!--[if IE]><script>alert("yahoo\'s filters")</script>';
    o = filter(str);
    expect(o).to.eql(expectedResults[0]);

    // to prevent componded effect to close comment state with chracters ahead 
    str = 'foo--';
    o = filter(str) + '>';
    expect(o).to.eql(expectedResults[1] + '>');

    str = 'foo--!';
    o = filter(str) + '>';
    expect(o).to.eql(expectedResults[2] +'>');

    str = '[if IE]';
    o = filter(str) + '>';
    expect(o).to.eql(expectedResults[3] + '>');

    str = 'foo-';
    o = filter(str) + '->';
    expect(o).to.eql(expectedResults[4] + '->');

    str = 'foo-';
    o = filter(str) + '-!>';
    expect(o).to.eql(expectedResults[5] + '-!>');
};

exports.test_yav = function (filter, expectedResults) {
    if (!expectedResults || expectedResults.length !== 13)
        throw new Error('must take 13 expected results');

    var str, o;

    o = filter(123);
    expect(o).to.eql('123');

    str = 'foo&<>\'" \t\n\f';
    o = filter(str);
    expect(o).to.eql(expectedResults[0]);

    str = '\f';
    o = filter(str);
    expect(o).to.eql(expectedResults[1]);

    str = '';
    o = filter(str);
    expect(o).to.eql(expectedResults[2]);

    // test if prohibited state change
    o = filter("''");
    expect(o).to.eql(expectedResults[3]);
    o = filter(" ''");
    expect(o).to.eql(expectedResults[4]);
    o = filter("\t''");
    expect(o).to.eql(expectedResults[5]);
    o = filter("\n''");
    expect(o).to.eql(expectedResults[6]);
    o = filter("\f''");
    expect(o).to.eql(expectedResults[7]);

    // test if prohibited state change
    o = filter('""');
    expect(o).to.eql(expectedResults[8]);
    o = filter(' ""');
    expect(o).to.eql(expectedResults[9]);
    o = filter('\t""');
    expect(o).to.eql(expectedResults[10]);
    o = filter('\n""');
    expect(o).to.eql(expectedResults[11]);
    o = filter('\f""');
    expect(o).to.eql(expectedResults[12]);
};


exports.test_yubl = function (filter, expectedResults) {
    var testStrings = [
        '\u0001\u0002\u0003\u0004\u0005\u0006\u0007\u0008\u0009\
\u000A\u000B\u000C\u000D\u000E\u000F\u0010\u0011\u0012\
\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001A\u001B\
\u001C\u001D\u001E\u001F\u0020j\nav&#x61;\rscript\t:',
        '&Tab;&#X0a;&NewLine;j&#x61;&NewLine;&#x76;&#x61&Tab;&Tab;&#115&#99&#114&#105&#112&#116&#x3a;alert(0)',
        'JavascripT:alert(0)',
        'j&#x61;&#x76;&#x61&#115&#99&#114&#105&#112&#116&#x3a;alert(0)',
        'javascript:javascript:alert(0)',

        'vbscript:',
        '&Tab;&#X0a;&NewLine;v&#98scripT:',

        'https://www.yahoo.com',
        'http://www.yahoo.com',
        'ftp://ftp.yahoo.com',
        'data:image/png',
        'data:application/javascript',
        'data:text/css',
        'data:text/html',

        'javajavascript:script:alert(0)',
        'javaXscript:alert(0)',
        'ABCjavascript:alert(0)'
    ];

    var defaultResults = [
        '%01%02%03%04%05%06%07%08%09\
%0A%0B%0C%0D%0E%0F%10%11%12\
%13%14%15%16%17%18%19%1A%1B\
%1C%1D%1E%1F%20j%0Aav&#x61;%0Dscript%09:',
        'x-&Tab;&#X0a;&NewLine;j&#x61;&NewLine;&#x76;&#x61&Tab;&Tab;&#115&#99&#114&#105&#112&#116&#x3a;alert(0)',
        'x-JavascripT:alert(0)',
        'x-j&#x61;&#x76;&#x61&#115&#99&#114&#105&#112&#116&#x3a;alert(0)',
        'x-javascript:javascript:alert(0)',

        'x-vbscript:',
        'x-&Tab;&#X0a;&NewLine;v&#98scripT:',

        'https://www.yahoo.com',
        'http://www.yahoo.com',
        'ftp://ftp.yahoo.com',
        'data:image/png',
        'data:application/javascript',
        'data:text/css',
        'data:text/html',

        'javajavascript:script:alert(0)',
        'javaXscript:alert(0)',
        'ABCjavascript:alert(0)'
    ];

    if (expectedResults && expectedResults.length > testStrings.length)
        throw new Error('must take ' + testStrings.length + ' expected results');

    testStrings.forEach(function (str, i) {
        expect(filter(str)).to.eql(expectedResults && expectedResults[i] ? expectedResults[i] : defaultResults[i]);
    });
};

exports.test_yu = function (filter) {
    var str, o;
    str = 'http://6.6.6.6/?q=[somewhere]';
    o = filter(str);
    expect(o).to.eql(encodeURI(str));

    str = 'http://6.6.6.6/somewhere';
    o = filter(str);
    expect(o).to.eql(encodeURI(str));

    str = '//6.6.6.6/somewhere';
    o = filter(str);
    expect(o).to.eql(encodeURI(str));

    str = 'http://[6.6.6.6]/somewhere';
    o = filter(str);
    expect(o).to.eql(encodeURI(str));

    str = 'http://[2001:0db8:85a3:0000:0000:8a2e:0370:7334]/somewhere';
    o = filter(str);
    expect(o).to.eql(encodeURI(str));

    str = 'http://[2001:0db8:85a3:0000:0000:8a2e:0370:7334]';
    o = filter(str);
    expect(o).to.eql(encodeURI(str));

    str = 'http://[2001:0db8:85a3:0000:0000:8a2e:0370:7334]:80';
    o = filter(str);
    expect(o).to.eql(encodeURI(str));

    str = '[]?&=#/:;';
    o = filter(str);
    expect(o).to.eql(encodeURI(str));

    // an feature indicator of which encodeURI()/encodeURIComponent() is used
    str = 'foo\uD800';
    try {
        o = filter(str);
    } catch (err) {
        expect(err.message).to.eql('URI malformed');
    }
};

exports.test_yufull = function (filter, expectedResults) {
    if (!expectedResults || expectedResults.length !== 1)
        throw new Error('must take 1 expected results');

    var str, o;
    str = 'http://6.6.6.6/?q=[somewhere]';
    o = filter(str);
    expect(o).to.eql('http://6.6.6.6/?q=%5Bsomewhere%5D');

    str = 'http://6.6.6.6/somewhere';
    o = filter(str);
    expect(o).to.eql(encodeURI(str));

    str = '//6.6.6.6/somewhere';
    o = filter(str);
    expect(o).to.eql(encodeURI(str));

    str = 'http://[6.6.6.6]/somewhere';
    o = filter(str);
    expect(o).to.eql(encodeURI(str));

    str = 'http://[2001:0db8:85a3:0000:0000:8a2e:0370:7334]/somewhere';
    o = filter(str);
    expect(o).to.eql(str);

    str = 'http://[2001:0db8:85a3:0000:0000:8a2e:0370:7334]';
    o = filter(str);
    expect(o).to.eql(expectedResults[0]);

    str = 'http://[2001:0db8:85a3:0000:0000:8a2e:0370:7334]:80';
    o = filter(str);
    expect(o).to.eql(str);

    str = '[]?&=#/:;';
    o = filter(str);
    expect(o).to.eql(encodeURI(str));

    // an feature indicator of which encodeURI()/encodeURIComponent() is used
    str = 'foo\uD800';
    try {
        o = filter(str);
    } catch (err) {
        expect(err.message).to.eql('URI malformed');
    }
};

exports.test_yuc = function (filter) {
    var str, o;
    str = 'http://6.6.6.6/?q=[somewhere]';
    o = filter(str);
    expect(o).to.eql(encodeURIComponent(str));

    str = 'http://6.6.6.6/somewhere';
    o = filter(str);
    expect(o).to.eql(encodeURIComponent(str));

    str = '//6.6.6.6/somewhere';
    o = filter(str);
    expect(o).to.eql(encodeURIComponent(str));

    str = 'http://[6.6.6.6]/somewhere';
    o = filter(str);
    expect(o).to.eql(encodeURIComponent(str));

    str = 'http://[2001:0db8:85a3:0000:0000:8a2e:0370:7334]/somewhere';
    o = filter(str);
    expect(o).to.eql(encodeURIComponent(str));

    str = 'http://[2001:0db8:85a3:0000:0000:8a2e:0370:7334]';
    o = filter(str);
    expect(o).to.eql(encodeURIComponent(str));

    str = 'http://[2001:0db8:85a3:0000:0000:8a2e:0370:7334]:80';
    o = filter(str);
    expect(o).to.eql(encodeURIComponent(str));

    str = '[]?&=#/:;';
    o = filter(str);
    expect(o).to.eql(encodeURIComponent(str));

    // an feature indicator of which encodeURI()/encodeURIComponent() is used
    str = 'foo\uD800';
    try {
        o = filter(str);
    } catch (err) {
        expect(err.message).to.eql('URI malformed');
    }
};

})();
