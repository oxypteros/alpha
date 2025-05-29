{{- /*
  Secondary JavaScript entry point for the Alpha theme.

  This script is reserved for core JavaScript functionalities of the Alpha theme
  that need to be loaded right before the closing </body> tag AND require
  processing by Hugo Pipes (e.g., for i18n, conditional logic based on
  site parameters, or bundling with other theme-specific modules).
 
  INTENDED USE:
  - For future enhancements or new features integral to the Alpha theme.
  - Not for site-specific custom JavaScript. For that, please use:
    `assets/js/custom-tail.js` (for general custom scripts loaded at the tail)
    or other custom script files as needed by your project.
 
  CONDITIONAL LOADING:
  To optimize performance, this `alpha-tail.js` file and its corresponding
  <script> tag will NOT be included in the HTML output if it remains in this 
  placeholder state or empty.
  
  Delete this comment and add code below to enable the script.
*/ -}}
