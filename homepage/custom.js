/**
 * Return an url using new newSubdomain.
 *
 * @param {newSubdomain} Subdomain to replace
 * @return {string} url with new subdomain
 */
function build_url(newSubdomain) {
  let subDomain = location.hostname.split('.').shift();
  let url = location.hostname.replace(subDomain, newSubdomain);
  let proto = window.location.protocol;
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
 * MutationObserver function : for specific node to be added.
 */
function waitForAddedNode(params) {
    new MutationObserver(function(mutations) {
        // when possible, use document.getElementsById()
        let r = document.getElementsByClassName(params.name);
        if (r && r[0]) {
            this.disconnect();
            params.done(params.name, r[0]);
        }
    }).observe(params.parent || document, {
        subtree: !!params.recursive || !params.parent,
        childList: true,
    });
}

/**
 * Wrapper for updateHref().
 */
function updateHrefWrapper(name, foundElement) {
    // waiting DRONE_SERVER_PATH to be implemented
    if (name == "drone") {
        name = '';
    }
    updateHref(foundElement, 'ci', name);
}

/**
 * Observe changes to the DOM in order to change HREF attribute for some links.
 */
const elements = ["drone", "gitea", "registry-mngr"];
elements.forEach(element => {
    waitForAddedNode({
        name: element,
        parent: document.getElementById('app'),
        recursive: false,
        done: function(name, foundElement) {
            updateHrefWrapper(name, foundElement)
        }
    });
});
