/*
How to test:

1. Quit Firefox

2. Create a new profile for testing:

    https://support.mozilla.org/kb/profile-manager-create-and-remove-firefox-profiles

3. In the new profile folder, create a new file named "user.js", paste in the
contents of the following gist, and save:

    https://gist.github.com/jpetto/c850ed3f63328b85b9f1

4. Start Firefox using the new profile you created in step 2

5. Verify FxA settings have been updated:

    i: Navigate to about:config
    ii: Enter "identity.fxaccounts" into the search form - you should see the
        values specified in user.js listed. Here is a screenshot:

        https://cloudup.com/cNOziFzhTC4

6. Navigate to the first run page and sign up:

    /firefox/40.0/firstrun/
*/

;(function($, Mozilla) {
    'use strict';

    var $document;

    var hasVideo = $('#video').length > 0;
    var $ctaSignup = $('#cta-signup');
    var $videoFrame = $('#video-frame');
    var $videoTitle = $('#video-title');
    var $video = $('#firstrun-video');
    var funnelcakeId = parseInt($('#intro').data('funnelcake'), 10);
    var $fxaFrame = $('#fxa');
    var fxaFrameTarget = document.querySelector('#fxa').contentWindow;

    var ctaDirect;
    var videoOnLoad = false;

    // 37 sends user to sync in hamburger menu
    if (funnelcakeId === 37) {
        ctaDirect = false;
    // 38 and 39 send user directly to signup form
    } else if (funnelcakeId === 38 || funnelcakeId === 39) {
        ctaDirect = true;
    // anything else sends user to signup form
    } else {
        ctaDirect = true;
    }

    window.addEventListener('message', function (e) {
        console.log('received a message: ', e.origin);
        console.log('data: ', e.data);

        if (e.origin === 'https://stomlinson.dev.lcip.org') {
            var data = JSON.parse(e.data);
            switch (data.command) {
                case 'ping':
                    fxaFrameTarget.postMessage(e.data, 'https://stomlinson.dev.lcip.org');
                    break;
                case 'resize':
                    // TODO: do we need to do a postMessage back to fxaFrameTarget here?
                    $fxaFrame.css('height', data.data.height + 'px');
                    break;
                // guessing at these command names - should be enabled later
                case 'accountverified':
                    break;
                case 'signin':
                    break;
            }
        }
    }, true);

    // if locale has video, do A/B test
    if (hasVideo) {
        videoOnLoad = (Math.random() >= 0.5);

        // manual override to test videos
        if (window.location.href.indexOf('v=') !== -1) {
            var variation = window.location.href.split('v=')[1];

            videoOnLoad = (variation === '1') ? true : false;
        }

        window.dataLayer.push({
            'event': 'dataLayer-initialized',
            'page': {
                'category': 'firstrun-38.0.5',
                'variation': (videoOnLoad) ? '1' : '2'
            }
        });

        $video.on('play', function() {
            // GA track video play
            window.dataLayer.push({
                'event': 'firstrun-38.0.5-video',
                'interaction': 'start',
                'videoTitle': 'When its Personal Campaign Video'
            });
        }).on('ended', function() {
            // GA track video finish
            window.dataLayer.push({
                'event': 'firstrun-38.0.5-video',
                'interaction': 'finish',
                'videoTitle': 'When its Personal Campaign Video'
            });

            // take a little breath before closing modal
            setTimeout(function() {
                Mozilla.Modal.closeModal();
            }, 500);
        });
    }

    // display appropriate copy
    if (!ctaDirect) {
        $('.ctaMenu').addClass('visible');
    } else {
        $('.ctaDirect').addClass('visible');
    }

    var showVideo = function(origin, autoplay) {
        var opts = {
            title: $videoTitle.text()
        };

        if (autoplay) {
            opts.onCreate = function() {
                // slight pause after modal opens
                setTimeout(function() {
                    $video[0].play();
                }, 250);
            };
        }

        Mozilla.Modal.createModal(origin, $videoFrame, opts);
    };

    // to be safe, make sure user is on desktop firefox version 38 or higher
    if (window.isFirefox() && !window.isFirefoxMobile() && window.getFirefoxMasterVersion() >= 38) {
        // if primary CTA should highlight Sync in settings
        if (!ctaDirect) {
            // Query if the UITour API is working before we start the tour
            Mozilla.UITour.getConfiguration('sync', function() {
                $document = $(document);

                $ctaSignup.on('click', function(e) {
                    e.preventDefault();

                    // call twice two correctly position highlight
                    // https://bugzilla.mozilla.org/show_bug.cgi?id=1049130
                    Mozilla.UITour.showHighlight('accountStatus', 'wobble');
                    Mozilla.UITour.showHighlight('accountStatus', 'wobble');

                    // allow clicking anywhere in page to hide menu
                    // behind a timeout so event isn't captured with *this* click
                    setTimeout(function() {
                        $document.one('click.hideHighlight', function() {
                            Mozilla.UITour.hideHighlight();
                        });
                    }, 50);
                });

                $document.on('visibilitychange', function() {
                    if (document.hidden) {
                        $document.off('click.hideHighlight');
                        Mozilla.UITour.hideHighlight();
                    }
                });
            });
        } else {
            // make sure UITour is working before binding the click handler
            Mozilla.UITour.ping(function() {
                $ctaSignup.on('click', function(e) {

                    e.preventDefault();

                    Mozilla.UITour.showFirefoxAccounts();
                });
            });
        }

        // if showing video on page load, hide video copy/CTA and show video
        if (videoOnLoad) {
            $('#video').addClass('hidden');
            showVideo(document.documentElement, false);
        // if not showing video on page load, attach click listener to video CTA
        } else if (hasVideo) {
            $('#cta-video').on('click', function(e) {
                e.preventDefault();
                showVideo(this, true);
            });
        }
    }
})(window.jQuery, window.Mozilla);
