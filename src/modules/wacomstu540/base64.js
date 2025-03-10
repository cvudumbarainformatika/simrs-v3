﻿/* eslint-disable no-var */
/*
Copyright (c) 2008 Fred Palmer fred.palmer_at_gmail.com

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/
// cross-browser library useful for dealing with base64, downloaded from:
// https://code.google.com/p/javascriptbase64/source/browse/trunk/base64.js
// with modification to properly deal with utf8
function StringBuffer () {
  this.buffer = []
}

StringBuffer.prototype.append = function append (string) {
  this.buffer.push(string)
  return this
}

StringBuffer.prototype.toString = function toString () {
  return this.buffer.join('')
}

var Base64 =
{
  codex: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

  encode: function (input) {
    const output = new StringBuffer()

    const enumerator = new Utf8EncodeEnumerator(input)
    while (enumerator.moveNext()) {
      const chr1 = enumerator.current

      enumerator.moveNext()
      const chr2 = enumerator.current

      enumerator.moveNext()
      const chr3 = enumerator.current

      const enc1 = chr1 >> 2
      const enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
      let enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
      let enc4 = chr3 & 63

      if (isNaN(chr2)) {
        enc3 = enc4 = 64
      }
      else if (isNaN(chr3)) {
        enc4 = 64
      }

      output.append(this.codex.charAt(enc1) + this.codex.charAt(enc2) + this.codex.charAt(enc3) + this.codex.charAt(enc4))
    }

    return output.toString()
  },

  decode: function (input) {
    const output = new StringBuffer()

    const enumerator = new Base64DecodeEnumerator(input)
    while (enumerator.moveNext()) {
      const charCode = enumerator.current

      if (charCode < 128) { output.append(String.fromCharCode(charCode)) }
      else if ((charCode > 191) && (charCode < 224)) {
        enumerator.moveNext()
        var charCode2 = enumerator.current

        output.append(String.fromCharCode(((charCode & 31) << 6) | (charCode2 & 63)))
      }
      else {
        enumerator.moveNext()
        // eslint-disable-next-line no-redeclare
        var charCode2 = enumerator.current

        enumerator.moveNext()
        const charCode3 = enumerator.current

        output.append(String.fromCharCode(((charCode & 15) << 12) | ((charCode2 & 63) << 6) | (charCode3 & 63)))
      }
    }

    return output.toString()
  },

  utf8_encode: function (str) {
    return Base64.encode(unescape(encodeURIComponent(str)))
  },

  utf8_decode: function (str) {
    return decodeURIComponent(escape(Base64.decode(str)))
  }
}

function Utf8EncodeEnumerator (input) {
  this._input = input
  this._index = -1
  this._buffer = []
}

Utf8EncodeEnumerator.prototype =
{
  current: Number.NaN,

  moveNext: function () {
    if (this._buffer.length > 0) {
      this.current = this._buffer.shift()
      return true
    }
    else if (this._index >= (this._input.length - 1)) {
      this.current = Number.NaN
      return false
    }
    else {
      let charCode = this._input.charCodeAt(++this._index)

      // "\r\n" -> "\n"
      //
      if ((charCode === 13) && (this._input.charCodeAt(this._index + 1) === 10)) {
        charCode = 10
        this._index += 2
      }

      if (charCode < 128) {
        this.current = charCode
      }
      else if ((charCode > 127) && (charCode < 2048)) {
        this.current = (charCode >> 6) | 192
        this._buffer.push((charCode & 63) | 128)
      }
      else {
        this.current = (charCode >> 12) | 224
        this._buffer.push(((charCode >> 6) & 63) | 128)
        this._buffer.push((charCode & 63) | 128)
      }

      return true
    }
  }
}

function Base64DecodeEnumerator (input) {
  this._input = input
  this._index = -1
  this._buffer = []
}

Base64DecodeEnumerator.prototype =
{
  current: 64,

  moveNext: function () {
    if (this._buffer.length > 0) {
      this.current = this._buffer.shift()
      return true
    }
    else if (this._index >= (this._input.length - 1)) {
      this.current = 64
      return false
    }
    else {
      const enc1 = Base64.codex.indexOf(this._input.charAt(++this._index))
      const enc2 = Base64.codex.indexOf(this._input.charAt(++this._index))
      const enc3 = Base64.codex.indexOf(this._input.charAt(++this._index))
      const enc4 = Base64.codex.indexOf(this._input.charAt(++this._index))

      const chr1 = (enc1 << 2) | (enc2 >> 4)
      const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
      const chr3 = ((enc3 & 3) << 6) | enc4

      this.current = chr1

      if (enc3 !== 64) { this._buffer.push(chr2) }

      if (enc4 !== 64) { this._buffer.push(chr3) }

      return true
    }
  }
}
