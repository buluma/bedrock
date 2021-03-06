/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global casper */
'use strict';

var domain = casper.cli.get('domain') || 'http://localhost:8000';
var locale = casper.cli.get('locale') || 'en-US';

// common sandstone breakpoints for bedrock
var viewport = {
    desktopWide: { width: 1400, height: 840},
    desktop: { width: 1000, height: 600 },
    tablet: { width: 760, height: 456 },
    mobileLandscape: { width: 480, height: 300 },
    mobile: { width: 320, height: 460 }
};

// commonly used userAgent strings
var userAgent = {
    fx: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:38.0) Gecko/20100101 Firefox/38.0',
    fx28: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:28.0) Gecko/20100101 Firefox/28.0',
    fxAndroid: 'Mozilla/5.0 (Android; Mobile; rv:26.0) Gecko/26.0 Firefox/26.0',
    fxOutdated: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:33.0) Gecko/20100101 Firefox/33.0',
    chrome: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.81 Safari/537.36',
    phantomjs: 'Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/534.34 (KHTML, like Gecko) PhantomJS/1.9.8 Safari/534.34',
    android: 'Mozilla/5.0 (Linux; U; Android 4.0; en-us; GT-I9300 Build/IMM76D) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30'
};

// set default viewport size to desktop
casper.options.viewportSize = viewport.desktop;

// set default wait timeout
casper.options.waitTimeout = 5000;

// load client script DOM helper
casper.options.clientScripts.push('tests/lib/client-scripts.js');

/*
 * Returns the environment being tested
 * plus the specified locale.
 * e.g. 'http://localhost:8000/en-US'
 */
function base() {
    return domain + '/' + locale;
}

module.exports = {
    base: base,
    locale: locale,
    domain: domain,
    viewport: viewport,
    userAgent: userAgent
};
