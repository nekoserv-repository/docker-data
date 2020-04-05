function checkCredentials() {
	// check if cookie is present
	if (/(^|;\s?)stimeout=/.test(document.cookie)) {
		var timeout = new Date(getCookie("stimeout"));
		var now = new Date();
		if (timeout < now) {
			logout();
			return;
		}
	} else {
		//alert("no cookie ? set new!!");
		// cookie no present, setting expiration date for 5 minutes
		var expirationDate = new Date();
		expirationDate.setTime(expirationDate.getTime()+(300*1000));
		document.cookie = "stimeout="+expirationDate.toGMTString();
	}
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

function resumeNavigation() {
    var currentApp = parent.location.hash.replace('#', '');
    var currentPath = '/' + currentApp + '/';
    if (currentApp != null && currentApp != undefined && currentApp != "") {
        loadApp(currentPath);
    }
}

function logout() {
    if (window.ActiveXObject) {
        document.execCommand("ClearAuthenticationCache");
    } else {
        var xmlhttp = createXMLObject();
        if (xmlhttp == false) {
            return false;
        }
        xmlhttp.open("GET", "/logout", true, "logout", "logout");
        xmlhttp.send("");
        xmlhttp.abort();
    }
}

function createXMLObject() {
    xmlhttp = false;
    try {
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
    } catch (e) {
        return false;
    }
    return xmlhttp;
}

function loadApp(path) {
    if (isMobile()) {
        if (path === '/sabnzbd') {
            path += '/m';
        }
        window.open(path);
        return;
    }
    var appName = path.replace(new RegExp('/', 'g'), '');
    //parent.location.hash = '#'+appName;
    if (history.pushState) {
        history.pushState(null, null, '#' + appName);
    } else {
        location.hash = '#!' + appName;
    }
    var appFrame = document.getElementById('appFrame');
    appFrame.style.visibility = "visible";
    appFrame.data = path;
    hideMenu();
}

function checkHideMenu() {
    if (!isMobile()) {
        hideMenu();
    }
}

function checkShowMenu() {
    if (!isMobile()) {
        showMenu();
    }
}

function showMenu() {
    var appMenu = document.getElementById('appMenu');
    appMenu.style.display = "";
    appMenu.parentElement.style.height = "466px"; //+48 px
}

function hideMenu() {
    var appMenu = document.getElementById('appMenu');
    appMenu.style.display = "none";
    appMenu.parentElement.style.height = "40px";
}

function toggleMenu() {
    var appMenu = document.getElementById('appMenu');
    var display = appMenu.style.display;
    if (display == "") {
        hideMenu();
    } else {
        showMenu();
    }
}

function isMobile() {
    /*if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true;
    }
    return false;*/
    return 'ontouchstart' in window || navigator.maxTouchPoints;
}
