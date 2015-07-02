/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

;(function($, Mozilla) {
    'use strict';

    function showHelloPanel() {
        // Only open the info panel if tab is visible
        if (document.hidden) {
            return;
        }
        // Make sure loop icon is available before opening Hello panel (bug 1111828)
        Mozilla.UITour.getConfiguration('availableTargets', function (config) {
            if (config.targets && $.inArray('loop', config.targets) !== -1) {
                Mozilla.UITour.showMenu('loop', function() {
                    // hide hello panel on resize
                    $(window).one('resize', handleResize);
                    // hide hello panel on visibility change
                    $(document).one('visibilitychange', handleVisibilityChange);
                });
            }
        });
    }

    // hide and reshow tour highlights on tab visibility
    function handleVisibilityChange() {
        if (document.hidden) {
            Mozilla.UITour.hideMenu('loop');
        }
    }

    // hide and reshow tour highlights on page resize
    function handleResize() {
        Mozilla.UITour.hideMenu('loop');
    }

    // FTE will only run on Firefox Desktop 35 and above
    if (window.isFirefox() && !window.isFirefoxMobile() && window.getFirefoxMasterVersion() >= 35) {
        showHelloPanel();
    }

})(window.jQuery, window.Mozilla);
