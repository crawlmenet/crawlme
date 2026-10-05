function doGet(e) {
  var page = (e.parameter && e.parameter.ref) ? e.parameter.ref : 'index';

  try {
    // Basic security check to allow only valid alphanumeric file names
    if (!/^[a-zA-Z0-9._-]+$/.test(page)) {
      return HtmlService.createHtmlOutput('<h1>Invalid Parameter</h1>');
    }

    var htmlTemplate = HtmlService.createTemplateFromFile(page);
    var evaluatedOutput = htmlTemplate.evaluate();
    var htmlContent = evaluatedOutput.getContent();

    // Robust regex to capture <title> even if it has attributes
    var titleMatch = htmlContent.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    var pageTitle = titleMatch ? titleMatch[1].trim() : page;

    // HTML entities or special characters fix
    pageTitle = pageTitle.replace(/&#43;/g, '+')
                         .replace(/&amp;/g, '&')
                         .replace(/&#39;/g, "'")
                         .replace(/&quot;/g, '"');

    var finalOutput = HtmlService.createHtmlOutput(htmlContent)
      .setTitle(pageTitle)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');

    return finalOutput;

  } catch (err) {
    return HtmlService.createHtmlOutput(
      '<h1>Error: "' + escapeHtml(page) + '.html" namer kono file pawa jayni!</h1>'
    );
  }
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}