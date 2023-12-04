function footnote_tooltip() {
  document.addEventListener('DOMContentLoaded', function() {
    var footnotes = document.querySelectorAll('li[id^="fn"]');

    footnotes.forEach(function(footnote) {
      var fnId = footnote.id;
      var refId = 'fnref' + fnId.substring(2);
      var refLink = document.getElementById(refId);

      if(refLink) {
        // Create a new container for the tooltip content
        var tooltipContainer = document.createElement('span');
        tooltipContainer.className = 'custom-tooltip';

        // Extract and set the inner HTML of the footnote into the tooltip container
        tooltipContainer.innerHTML = footnote.innerHTML;

        // Insert the tooltip container into the reference link
        refLink.insertBefore(tooltipContainer, refLink.firstChild);
      }
    });
  });
}

footnote_tooltip();