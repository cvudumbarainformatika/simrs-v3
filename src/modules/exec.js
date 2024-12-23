// const parms = [{
//   cmd: 'aCommandName',
//   desc: 'A DOMString representing the name of the command'
// }, {
//   cmd: 'aShowDefaultUI',
//   desc: 'A Boolean indicating whether the default user interface should be shown. This is not implemented in Mozilla.'
// }, {
//   cmd: 'aValueArgument',
//   desc: "A DOMString representing some commands (such as insertimage) require an extra value argument (the image's url). Pass an argument of null if no argument is needed."
// }]
// const commands = [{
//   cmd: 'backColor',
//   val: 'red',
//   desc: 'Changes the document background color. In styleWithCss mode, it affects the background color of the containing block instead. This requires a color value string to be passed in as a value argument. (Internet Explorer uses this to set text background color.)'
// }, {
//   cmd: 'bold',
//   icon: 'bold',
//   desc: 'Toggles bold on/off for the selection or at the insertion point. (Internet Explorer uses the STRONG tag instead of B.)'
// }, {
//   cmd: 'contentReadOnly',
//   desc: 'Makes the content document either read-only or editable. This requires a boolean true/false to be passed in as a value argument. (Not supported by Internet Explorer.)'
// }, {
//   cmd: 'copy',
//   icon: 'clipboard',
//   desc: 'Copies the current selection to the clipboard. Clipboard capability must be enabled in the user.js preference file. See'
// }, {
//   cmd: 'createLink',
//   val: 'https://twitter.com/netsi1964',
//   icon: 'link',
//   desc: 'Creates an anchor link from the selection, only if there is a selection. This requires the HREF URI string to be passed in as a value argument. The URI must contain at least a single character, which may be a white space. (Internet Explorer will create a link with a null URI value.)'
// }, {
//   cmd: 'cut',
//   icon: 'scissors',
//   desc: 'Cuts the current selection and copies it to the clipboard. Clipboard capability must be enabled in the user.js preference file. See'
// }, {
//   cmd: 'decreaseFontSize',
//   desc: 'Adds a SMALL tag around the selection or at the insertion point. (Not supported by Internet Explorer.)'
// }, {
//   cmd: 'delete',
//   icon: 'scissors',
//   desc: 'Deletes the current selection.'
// }, {
//   cmd: 'enableInlineTableEditing',
//   desc: 'Enables or disables the table row and column insertion and deletion controls. (Not supported by Internet Explorer.)'
// }, {
//   cmd: 'enableObjectResizing',
//   desc: 'Enables or disables the resize handles on images and other resizable objects. (Not supported by Internet Explorer.)'
// }, {
//   cmd: 'fontName',
//   val: "'Inconsolata', monospace",
//   desc: 'Changes the font name for the selection or at the insertion point. This requires a font name string ("Arial" for example) to be passed in as a value argument.'
// }, {
//   cmd: 'fontSize',
//   val: '1-7',
//   icon: 'text-height',
//   desc: 'Changes the font size for the selection or at the insertion point. This requires an HTML font size (1-7) to be passed in as a value argument.'
// }, {
//   cmd: 'foreColor',
//   val: 'rgba(0,0,0,.5)',
//   desc: 'Changes a font color for the selection or at the insertion point. This requires a color value string to be passed in as a value argument.'
// }, {
//   cmd: 'formatBlock',
//   val: '<blockquote>',
//   desc: 'Adds an HTML block-style tag around the line containing the current selection, replacing the block element containing the line if one exists (in Firefox, BLOCKQUOTE is the exception - it will wrap any containing block element). Requires a tag-name string to be passed in as a value argument. Virtually all block style tags can be used (eg. "H1", "P", "DL", "BLOCKQUOTE"). (Internet Explorer supports only heading tags H1 - H6, ADDRESS, and PRE, which must also include the tag delimiters &lt; &gt;, such as "&lt;H1&gt;".)'
// }, {
//   cmd: 'forwardDelete',
//   desc: "Deletes the character ahead of the cursor's position.  It is the same as hitting the delete key."
// }, {
//   cmd: 'heading',
//   val: 'h3',
//   icon: 'header',
//   desc: 'Adds a heading tag around a selection or insertion point line. Requires the tag-name string to be passed in as a value argument (i.e. "H1", "H6"). (Not supported by Internet Explorer and Safari.)'
// }, {
//   cmd: 'hiliteColor',
//   val: 'Orange',
//   desc: 'Changes the background color for the selection or at the insertion point. Requires a color value string to be passed in as a value argument. UseCSS must be turned on for this to function. (Not supported by Internet Explorer.)'
// }, {
//   cmd: 'increaseFontSize',
//   desc: 'Adds a BIG tag around the selection or at the insertion point. (Not supported by Internet Explorer.)'
// }, {
//   cmd: 'indent',
//   icon: 'indent',
//   desc: 'Indents the line containing the selection or insertion point. In Firefox, if the selection spans multiple lines at different levels of indentation, only the least indented lines in the selection will be indented.'
// }, {
//   cmd: 'insertBrOnReturn',
//   desc: 'Controls whether the Enter key inserts a br tag or splits the current block element into two. (Not supported by Internet Explorer.)'
// }, {
//   cmd: 'insertHorizontalRule',
//   desc: 'Inserts a horizontal rule at the insertion point (deletes selection).'
// }, {
//   cmd: 'insertHTML',
//   val: '&lt;h3&gt;Life is great!&lt;/h3&gt;',
//   icon: 'code',
//   desc: 'Inserts an HTML string at the insertion point (deletes selection). Requires a valid HTML string to be passed in as a value argument. (Not supported by Internet Explorer.)'
// }, {
//   cmd: 'insertImage',
//   val: 'http://dummyimage.com/160x90',
//   icon: 'picture-o',
//   desc: 'Inserts an image at the insertion point (deletes selection). Requires the image SRC URI string to be passed in as a value argument. The URI must contain at least a single character, which may be a white space. (Internet Explorer will create a link with a null URI value.)'
// }, {
//   cmd: 'insertOrderedList',
//   icon: 'list-ol',
//   desc: 'Creates a numbered ordered list for the selection or at the insertion point.'
// }, {
//   cmd: 'insertUnorderedList',
//   icon: 'list-ul',
//   desc: 'Creates a bulleted unordered list for the selection or at the insertion point.'
// }, {
//   cmd: 'insertParagraph',
//   icon: 'paragraph',
//   desc: 'Inserts a paragraph around the selection or the current line. (Internet Explorer inserts a paragraph at the insertion point and deletes the selection.)'
// }, {
//   cmd: 'insertText',
//   val: new Date(),
//   icon: 'file-text-o',
//   desc: 'Inserts the given plain text at the insertion point (deletes selection).'
// }, {
//   cmd: 'italic',
//   icon: 'italic',
//   desc: 'Toggles italics on/off for the selection or at the insertion point. (Internet Explorer uses the EM tag instead of I.)'
// }, {
//   cmd: 'justifyCenter',
//   icon: 'align-center',
//   desc: 'Centers the selection or insertion point.'
// }, {
//   cmd: 'justifyFull',
//   icon: 'align-justify',
//   desc: 'Justifies the selection or insertion point.'
// }, {
//   cmd: 'justifyLeft',
//   icon: 'align-left',
//   desc: 'Justifies the selection or insertion point to the left.'
// }, {
//   cmd: 'justifyRight',
//   icon: 'align-right',
//   desc: 'Right-justifies the selection or the insertion point.'
// }, {
//   cmd: 'outdent',
//   icon: 'outdent',
//   desc: 'Outdents the line containing the selection or insertion point.'
// }, {
//   cmd: 'paste',
//   icon: 'clipboard',
//   desc: 'Pastes the clipboard contents at the insertion point (replaces current selection). Clipboard capability must be enabled in the user.js preference file. See'
// }, {
//   cmd: 'redo',
//   icon: 'repeat',
//   desc: 'Redoes the previous undo command.'
// }, {
//   cmd: 'removeFormat',
//   desc: 'Removes all formatting from the current selection.'
// }, {
//   cmd: 'selectAll',
//   desc: 'Selects all of the content of the editable region.'
// }, {
//   cmd: 'strikeThrough',
//   icon: 'strikethrough',
//   desc: 'Toggles strikethrough on/off for the selection or at the insertion point.'
// }, {
//   cmd: 'subscript',
//   icon: 'subscript',
//   desc: 'Toggles subscript on/off for the selection or at the insertion point.'
// }, {
//   cmd: 'superscript',
//   icon: 'superscript',
//   desc: 'Toggles superscript on/off for the selection or at the insertion point.'
// }, {
//   cmd: 'underline',
//   icon: 'underline',
//   desc: 'Toggles underline on/off for the selection or at the insertion point.'
// }, {
//   cmd: 'undo',
//   icon: 'undo',
//   desc: 'Undoes the last executed command.'
// }, {
//   cmd: 'unlink',
//   icon: 'chain-broken',
//   desc: 'Removes the anchor tag from a selected anchor link.'
// }, {
//   cmd: 'useCSS ',
//   desc: 'Toggles the use of HTML tags or CSS for the generated markup. Requires a boolean true/false as a value argument. NOTE: This argument is logically backwards (i.e. use false to use CSS, true to use HTML). (Not supported by Internet Explorer.) This has been deprecated; use the styleWithCSS command instead.'
// }, {
//   cmd: 'styleWithCSS',
//   desc: 'Replaces the useCSS command; argument works as expected, i.e. true modifies/generates style attributes in markup, false generates formatting elements.'
// }]

// const commandRelation = {}

// function supported(cmd) {
//   const css = document.queryCommandSupported(cmd.cmd) ? 'btn-succes' : 'btn-error'
//   return css
// };

// function icon(cmd) {
//   return (typeof cmd.icon !== 'undefined') ? 'fa fa-' + cmd.icon : ''
// };

// function doCommand(cmdKey) {
//   const cmd = commandRelation[cmdKey]
//   if (supported(cmd) === 'btn-error') {
//     alert('execCommand(“' + cmd.cmd + '”)\nis not supported in your browser')
//     return
//   }
//   val = (typeof cmd.val !== 'undefined') ? prompt('Value for ' + cmd.cmd + '?', cmd.val) : ''
//   document.execCommand(cmd.cmd, false, (val || '')) // Thanks to https://codepen.io/bluestreak for finding this bug
// }

// function init() {
//   let html = '',
//     template = '<span><code class="btn btn-xs %btnClass%" title="%desc%" onmousedown="event.preventDefault();" onclick="doCommand(\'%cmd%\')"><i class="%iconClass%"></i> %cmd%</code></span>'
//   commands.map(function(command, i) {
//     commandRelation[command.cmd] = command
//     let temp = template
//     temp = temp.replace(/%iconClass%/gi, icon(command))
//     temp = temp.replace(/%desc%/gi, command.desc)
//     temp = temp.replace(/%btnClass%/gi, supported(command))
//     temp = temp.replace(/%cmd%/gi, command.cmd)
//     html += temp
//   })
//   document.querySelector('.buttons').innerHTML = html
// }

// init();
