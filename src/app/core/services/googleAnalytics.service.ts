import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Angulartics2GoogleGlobalSiteTag } from 'angulartics2/gst';
import { environment } from 'src/environments/environment';

declare var gtag: any;
declare var window: any;

@Injectable({
    providedIn: 'root'
})
export class GoogleAnalyticsService {
    constructor(
        private angulartics: Angulartics2GoogleGlobalSiteTag,
        @Inject(DOCUMENT) document: any,
    ) {
        if (environment.googleAnalytics) {
            this.loadGoogleAnalytics();
        }
    }

    loadGoogleAnalytics() {
        // injecting GA main script asynchronously
        const script = document.createElement('script');
        script.src = `https://www.googletagmanager.com/gtag/js?id=${environment.googleAnalytics['id']}`;
       // console.log(script.src);
        script.async = true;
        document.body.appendChild(script);

        // preparing GA API to be usable even before the async script is loaded
        window.dataLayer = window.dataLayer || [];
        window.gtag = () => {
            window.dataLayer.push(arguments);
        };
        gtag('js', new Date());

        // tracking current url at app bootstrap
        gtag('config', `${environment.googleAnalytics['id']}`);
    }

    startTracking() {
        // activate router navigation tracking
        if (environment.googleAnalytics) {
            this.angulartics.startTracking();
        }
    }
}