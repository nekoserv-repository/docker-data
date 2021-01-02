/**
 * Return an url using new newSubdomain.
 *
 * @param {newSubdomain} Subdomain to replace
 * @return {string} url with new subdomain
 */
function build_url(newSubdomain) {
  var subDomain = location.hostname.split('.').shift();
  var url = location.hostname.replace(subDomain, newSubdomain);
  var proto = window.location.protocol;
  return proto+'//'+url;
}

/**
 * Update href attribute using parameters.
 *
 * @param {element} target html element
 * @param {subDomain} new subdomain to use
 * @param {suffix} if specified, add suffix to new url
 */
function updateHref(element, subDomain, suffix) {
  if (suffix == undefined || suffix == '') {
    suffix = '/';
  } else {
    suffix = '/'+suffix+'/';
  }
  element.parentElement.parentElement.href = build_url(subDomain)+suffix;
}

/**
 * Observe changes to the DOM in order to change HREF attribute for some links.
 */
var observer = new MutationObserver(function (mutations, me) {
  var elements = ["drone", "gitea"];
  elements.forEach(element => {
    var item = document.getElementsByClassName(element);
    if (item && item[0]) {
      // waiting DRONE_SERVER_PATH to be implemented
      if (element == "drone") {
        element ='';
      }
      updateHref(item[0], 'ci', element);
    }
  });
  me.disconnect(); // stop observing
});

/**
 *start observing
 */
observer.observe(document, {
  childList: true,
  subtree: true
});
