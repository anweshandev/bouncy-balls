navigator.serviceWorker.register('../../sw.js', { scope: '/' }).then(function(registration) {
    console.log('Service Worker Registered', registration);
});

navigator.serviceWorker.ready.then(function(registration) {
    console.log('Service Worker Ready', registration);
});

// TODO: Add custom install experience.
// 
// Show prompt after 5 minutes of usage....
// This needs to be 5 minutes of constant usage & which is detected by something

document.addEventListener("DOMContentLoaded", () => {
    // OK...

    const loadExternalScript = (src, loadEvent = 'scriptLoaded') => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = function() {
            document.dispatchEvent(new Event(loadEvent));
        }

        script.onerror = function(){
            console.log(`The script with source ${src} could not be loaded`);
        }

        document.head.appendChild(script);
    }

    const wakeLockSupported = 'wakeLock' in navigator || false;
    let wakeLock = false;
    
    const requestWakeLock = async () => {
        
        wakeLock = await navigator.wakeLock.request('screen');
        
        wakeLock.addEventListener('release', () => {
            wakeLock = false;
            console.log("> Wakelock was released");
        });
    };
    
    const supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;

    let snackBarTimer = null;
    let snackBarDOM = null;
    let snackBarDismissed = false;
    const snackBarTime = 5 * 60 * 1000;
    const snackBarTimerFunction = function(){ window.dispatchEvent(new Event("snackBarReady")) };
    
    let pwaInstalled = false;
    let pwaInstallEvent = true;

    document.addEventListener('visibilitychange', () => {
        if(document.hidden){
            console.log("Visibility Lost");
            if(wakeLockSupported && wakeLock){
                wakeLock.release();
            }
            if(!snackBarDismissed && snackBarTimer){
                window.clearTimeout(snackBarTimer);
            }

        }else{
            console.log("Visibility Retained");
            if(wakeLockSupported && !wakeLock){
                requestWakeLock().then( () => {});
            }
            if(!snackBarTimer && !snackBarDismissed && pwaInstallEvent && !pwaInstalled){
                snackBarTimer = window.setTimeout(snackBarTimerFunction, snackBarTime);
            }
        }
    });

    if(wakeLockSupported && !document.hidden){
        requestWakeLock().then( () => { 
            console.info("Wake lock acquired");
        }).catch( (e) => console.error(e));     
    }

    loadExternalScript(`https://cybrix.in/vendor/SnackBar/snackbar.min.js`, 'snackbarscriptloaded');
});