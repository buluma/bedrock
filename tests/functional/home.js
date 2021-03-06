/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global casper */
'use strict';

var config = require('../lib/config');
var helpers = require('../lib/helpers');
var path = '/';
var url = config.base() + path;

casper.test.begin('Home page, Elements: ' + url, 12, function suite(test) {

    casper.start(url, function() {
        test.assertHttpStatus(200);
        test.assertExists('.main-header h1', 'Mozilla wordmark exists');
        test.assertElementCount('.download-button', 2, 'Download buttons exist');
        test.assertElementCount('.promo-grid > .promo-large-portrait', 2, '2 large portrait promos');
        test.assertElementCount('.promo-grid > .promo-large-landscape', 2, '2 large landscape promos');
        // small promos can vary in number (e.g. twitter), so we're just testing for the selector here.
        test.assertExists('.promo-grid > .promo-small-landscape', 'Small landscape promos exist');
        test.assertExists('#community .contribute-btn', 'Contribute CTA button exists');
        test.assertExists('#upcoming-events .featured-event', 'Featured event exists');
        test.assertElementCount('#upcoming-events .events-list > li > a', 3, 'Upcoming events exist');
        test.assertExists('#upcoming-events .more-large', 'Events CTA button exists');
        test.assertElementCount('#secondary-links ul > li > a', 3, 'Secondary links exist');
        test.assertExists('.footer-newsletter-form', 'Newsletter form exists');
    });

    casper.run(function() {
        test.done();
        helpers.done();
    });
});

casper.test.begin('Home page, Newsletter submission: ' + url, 1, function suite(test) {

    casper.options.waitTimeout = 10000;

    casper.start(url, function() {
        this.fillSelectors('#mozorg-newsletter-form', {
            '#id_email': 'noreply@mozilla.com',
            '#id_privacy': true
        }, true);
    });

    casper.waitForUrl(/sign-up-for-mozilla/, function() {
        test.assertUrlMatch(/sign-up-for-mozilla/, 'Newsletter submitted successfully');
    });

    casper.run(function() {
        test.done();
        helpers.done();
    });
});
