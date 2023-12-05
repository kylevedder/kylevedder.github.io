function footnote_tooltip() {
    document.addEventListener('DOMContentLoaded', function () {
        var footnotes = document.querySelectorAll('li[id^="fn"]');

        footnotes.forEach(function (footnote) {
            var fnId = footnote.id;
            var refId = 'fnref' + fnId.substring(2);
            var refLink = document.getElementById(refId);

            if (refLink) {
                // Create a new container for the tooltip content
                var tooltipContainer = document.createElement('span');
                tooltipContainer.className = 'custom-tooltip';

                // Check if there's a <p> tag and use its innerHTML, otherwise use the footnote's innerHTML
                var pTag = footnote.querySelector('p');
                tooltipContainer.innerHTML = pTag ? pTag.innerHTML : footnote.innerHTML;

                // Insert the tooltip container into the reference link
                refLink.insertBefore(tooltipContainer, refLink.firstChild);
            }
        });
    });
}

function adjust_tooltip_size() {

    function adjustTooltipPosition() {
        // Select all custom tooltips
        var tooltips = document.querySelectorAll('.custom-tooltip');

        tooltips.forEach(function (tooltip) {
            // Reset any previously set styles
            tooltip.style.left = '';
            tooltip.style.right = '';

            // Calculate the distance from the right side of the tooltip to the right side of the viewport
            var tooltipRect = tooltip.getBoundingClientRect();
            var rightOffset = window.innerWidth - tooltipRect.right;

            // Calculate the padding of the tooltip
            var computedStyle = window.getComputedStyle(tooltip);
            var paddingLeft = parseInt(computedStyle.paddingLeft, 10);
            var paddingRight = parseInt(computedStyle.paddingRight, 10);
            var borderLeft = parseInt(computedStyle.borderLeftWidth, 10);
            var borderRight = parseInt(computedStyle.borderRightWidth, 10);
            var totalHorizontalSpace = paddingLeft + paddingRight + borderLeft + borderRight;

            // If the tooltip overflows the viewport on the right, adjust its left position
            if (rightOffset < 0) {

                // tooltip.style.left = (rightOffset + totalHorizontalSpace) + 'px'; // Slide to the left
                // Subtract the total padding and border width
                tooltip.style.left = `calc(100% - ${tooltipRect.width + rightOffset - totalHorizontalSpace}px)`;
            }
        });
    }

    // Invoke the function initially and on each window resize
    window.addEventListener('resize', adjustTooltipPosition);
    window.addEventListener('load', adjustTooltipPosition); // Ensure tooltips are adjusted on page load

    // Adjust the tooltip position on hover
    document.querySelectorAll('.footnote-ref').forEach(function (ref) {
        ref.addEventListener('mouseover', adjustTooltipPosition);
    });
}


footnote_tooltip();
adjust_tooltip_size();