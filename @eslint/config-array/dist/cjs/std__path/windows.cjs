'use strict';

// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// Copyright the Browserify authors. MIT License.
function assertPath(path) {
  if (typeof path !== "string") {
    throw new TypeError(`Path must be a string, received "${JSON.stringify(path)}"`);
  }
}

// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
function stripSuffix(name, suffix) {
  if (suffix.length >= name.length) {
    return name;
  }
  const lenDiff = name.length - suffix.length;
  for(let i = suffix.length - 1; i >= 0; --i){
    if (name.charCodeAt(lenDiff + i) !== suffix.charCodeAt(i)) {
      return name;
    }
  }
  return name.slice(0, -suffix.length);
}
function lastPathSegment(path, isSep, start = 0) {
  let matchedNonSeparator = false;
  let end = path.length;
  for(let i = path.length - 1; i >= start; --i){
    if (isSep(path.charCodeAt(i))) {
      if (matchedNonSeparator) {
        start = i + 1;
        break;
      }
    } else if (!matchedNonSeparator) {
      matchedNonSeparator = true;
      end = i + 1;
    }
  }
  return path.slice(start, end);
}
function assertArgs$1(path, suffix) {
  assertPath(path);
  if (path.length === 0) return path;
  if (typeof suffix !== "string") {
    throw new TypeError(`Suffix must be a string, received "${JSON.stringify(suffix)}"`);
  }
}

// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
// This module is browser compatible.
// Alphabet chars.
const CHAR_UPPERCASE_A = 65; /* A */ 
const CHAR_LOWERCASE_A = 97; /* a */ 
const CHAR_UPPERCASE_Z = 90; /* Z */ 
const CHAR_LOWERCASE_Z = 122; /* z */ 
// Non-alphabetic chars.
const CHAR_DOT = 46; /* . */ 
const CHAR_FORWARD_SLASH = 47; /* / */ 
const CHAR_BACKWARD_SLASH = 92; /* \ */ 
const CHAR_COLON = 58; /* : */ 
const CHAR_QUESTION_MARK = 63; /* ? */

// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
// This module is browser compatible.
function stripTrailingSeparators(segment, isSep) {
  if (segment.length <= 1) {
    return segment;
  }
  let end = segment.length;
  for(let i = segment.length - 1; i > 0; i--){
    if (isSep(segment.charCodeAt(i))) {
      end = i;
    } else {
      break;
    }
  }
  return segment.slice(0, end);
}

// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
// This module is browser compatible.
function isPosixPathSeparator(code) {
  return code === CHAR_FORWARD_SLASH;
}
function isPathSeparator(code) {
  return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
}
function isWindowsDeviceRoot(code) {
  return code >= CHAR_LOWERCASE_A && code <= CHAR_LOWERCASE_Z || code >= CHAR_UPPERCASE_A && code <= CHAR_UPPERCASE_Z;
}

// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
/**
 * Return the last portion of a `path`.
 * Trailing directory separators are ignored, and optional suffix is removed.
 *
 * @example Usage
 * ```ts
 * import { basename } from "@std/path/windows/basename";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(basename("C:\\user\\Documents\\"), "Documents");
 * assertEquals(basename("C:\\user\\Documents\\image.png"), "image.png");
 * assertEquals(basename("C:\\user\\Documents\\image.png", ".png"), "image");
 * ```
 *
 * Note: If you are working with file URLs,
 * use the new version of `basename` from `@std/path/windows/unstable-basename`.
 *
 * @param path The path to extract the name from.
 * @param suffix The suffix to remove from extracted name.
 * @returns The extracted name.
 */ function basename(path, suffix = "") {
  assertArgs$1(path, suffix);
  // Check for a drive letter prefix so as not to mistake the following
  // path separator as an extra separator at the end of the path that can be
  // disregarded
  let start = 0;
  if (path.length >= 2) {
    const drive = path.charCodeAt(0);
    if (isWindowsDeviceRoot(drive)) {
      if (path.charCodeAt(1) === CHAR_COLON) start = 2;
    }
  }
  const lastSegment = lastPathSegment(path, isPathSeparator, start);
  const strippedSegment = stripTrailingSeparators(lastSegment, isPathSeparator);
  return suffix ? stripSuffix(strippedSegment, suffix) : strippedSegment;
}

// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
/**
 * The character used to separate entries in the PATH environment variable.
 */ const DELIMITER = ";";
/**
 * The character used to separate components of a file path.
 */ const SEPARATOR = "\\";
/**
 * A regular expression that matches one or more path separators.
 */ const SEPARATOR_PATTERN = /[\\/]+/;

// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
function assertArg$3(path) {
  assertPath(path);
  if (path.length === 0) return ".";
}

// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
/**
 * Return the directory path of a `path`.
 *
 * @example Usage
 * ```ts
 * import { dirname } from "@std/path/windows/dirname";
 * import { assertEquals } from "@std/assert";
 *
 * const dir = dirname("C:\\foo\\bar\\baz.ext");
 * assertEquals(dir, "C:\\foo\\bar");
 * ```
 *
 * Note: If you are working with file URLs,
 * use the new version of `dirname` from `@std/path/windows/unstable-dirname`.
 *
 * @param path The path to get the directory from.
 * @returns The directory path.
 */ function dirname(path) {
  assertArg$3(path);
  const len = path.length;
  let rootEnd = -1;
  let end = -1;
  let matchedSlash = true;
  let offset = 0;
  const code = path.charCodeAt(0);
  // Try to match a root
  if (len > 1) {
    if (isPathSeparator(code)) {
      // Possible UNC root
      rootEnd = offset = 1;
      if (isPathSeparator(path.charCodeAt(1))) {
        // Matched double path separator at beginning
        let j = 2;
        let last = j;
        // Match 1 or more non-path separators
        for(; j < len; ++j){
          if (isPathSeparator(path.charCodeAt(j))) break;
        }
        if (j < len && j !== last) {
          // Matched!
          last = j;
          // Match 1 or more path separators
          for(; j < len; ++j){
            if (!isPathSeparator(path.charCodeAt(j))) break;
          }
          if (j < len && j !== last) {
            // Matched!
            last = j;
            // Match 1 or more non-path separators
            for(; j < len; ++j){
              if (isPathSeparator(path.charCodeAt(j))) break;
            }
            if (j === len) {
              // We matched a UNC root only
              return path;
            }
            if (j !== last) {
              // We matched a UNC root with leftovers
              // Offset by 1 to include the separator after the UNC root to
              // treat it as a "normal root" on top of a (UNC) root
              rootEnd = offset = j + 1;
            }
          }
        }
      }
    } else if (isWindowsDeviceRoot(code)) {
      // Possible device root
      if (path.charCodeAt(1) === CHAR_COLON) {
        rootEnd = offset = 2;
        if (len > 2) {
          if (isPathSeparator(path.charCodeAt(2))) rootEnd = offset = 3;
        }
      }
    }
  } else if (isPathSeparator(code)) {
    // `path` contains just a path separator, exit early to avoid
    // unnecessary work
    return path;
  }
  for(let i = len - 1; i >= offset; --i){
    if (isPathSeparator(path.charCodeAt(i))) {
      if (!matchedSlash) {
        end = i;
        break;
      }
    } else {
      // We saw the first non-path separator
      matchedSlash = false;
    }
  }
  if (end === -1) {
    if (rootEnd === -1) return ".";
    else end = rootEnd;
  }
  return stripTrailingSeparators(path.slice(0, end), isPosixPathSeparator);
}

// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
/**
 * Return the extension of the `path` with leading period.
 *
 * @example Usage
 * ```ts
 * import { extname } from "@std/path/windows/extname";
 * import { assertEquals } from "@std/assert";
 *
 * const ext = extname("file.ts");
 * assertEquals(ext, ".ts");
 * ```
 *
 * Note: If you are working with file URLs,
 * use the new version of `extname` from `@std/path/windows/unstable-extname`.
 *
 * @param path The path to get the extension from.
 * @returns The extension of the `path`.
 */ function extname(path) {
  assertPath(path);
  let start = 0;
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  let preDotState = 0;
  // Check for a drive letter prefix so as not to mistake the following
  // path separator as an extra separator at the end of the path that can be
  // disregarded
  if (path.length >= 2 && path.charCodeAt(1) === CHAR_COLON && isWindowsDeviceRoot(path.charCodeAt(0))) {
    start = startPart = 2;
  }
  for(let i = path.length - 1; i >= start; --i){
    const code = path.charCodeAt(i);
    if (isPathSeparator(code)) {
      // If we reached a path separator that was not part of a set of path
      // separators at the end of the string, stop now
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }
    if (code === CHAR_DOT) {
      // If this is our first dot, mark it as the start of our extension
      if (startDot === -1) startDot = i;
      else if (preDotState !== 1) preDotState = 1;
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return "";
  }
  return path.slice(startDot, end);
}

// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
function _format(sep, pathObject) {
  const dir = pathObject.dir || pathObject.root;
  const base = pathObject.base || (pathObject.name ?? "") + (pathObject.ext ?? "");
  if (!dir) return base;
  if (base === sep) return dir;
  if (dir === pathObject.root) return dir + base;
  return dir + sep + base;
}
function assertArg$2(pathObject) {
  if (pathObject === null || typeof pathObject !== "object") {
    throw new TypeError(`The "pathObject" argument must be of type Object, received type "${typeof pathObject}"`);
  }
}

// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
/**
 * Generate a path from `ParsedPath` object.
 *
 * @example Usage
 * ```ts
 * import { format } from "@std/path/windows/format";
 * import { assertEquals } from "@std/assert";
 *
 * const path = format({
 *   root: "C:\\",
 *   dir: "C:\\path\\dir",
 *   base: "file.txt",
 *   ext: ".txt",
 *   name: "file"
 * });
 * assertEquals(path, "C:\\path\\dir\\file.txt");
 * ```
 *
 * @param pathObject The path object to format.
 * @returns The formatted path.
 */ function format(pathObject) {
  assertArg$2(pathObject);
  return _format("\\", pathObject);
}

// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
function assertArg$1(url) {
  url = url instanceof URL ? url : new URL(url);
  if (url.protocol !== "file:") {
    throw new TypeError(`URL must be a file URL: received "${url.protocol}"`);
  }
  return url;
}

// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
/**
 * Converts a file URL to a path string.
 *
 * @example Usage
 * ```ts
 * import { fromFileUrl } from "@std/path/windows/from-file-url";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(fromFileUrl("file:///home/foo"), "\\home\\foo");
 * assertEquals(fromFileUrl("file:///C:/Users/foo"), "C:\\Users\\foo");
 * assertEquals(fromFileUrl("file://localhost/home/foo"), "\\home\\foo");
 * ```
 *
 * @param url The file URL to convert.
 * @returns The path string.
 */ function fromFileUrl(url) {
  url = assertArg$1(url);
  let path = decodeURIComponent(url.pathname.replace(/\//g, "\\").replace(/%(?![0-9A-Fa-f]{2})/g, "%25")).replace(/^\\*([A-Za-z]:)(\\|$)/, "$1\\");
  if (url.hostname !== "") {
    // Note: The `URL` implementation guarantees that the drive letter and
    // hostname are mutually exclusive. Otherwise it would not have been valid
    // to append the hostname and path like this.
    path = `\\\\${url.hostname}${path}`;
  }
  return path;
}

// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
/**
 * Verifies whether provided path is absolute.
 *
 * @example Usage
 * ```ts
 * import { isAbsolute } from "@std/path/windows/is-absolute";
 * import { assert, assertFalse } from "@std/assert";
 *
 * assert(isAbsolute("C:\\foo\\bar"));
 * assertFalse(isAbsolute("..\\baz"));
 * ```
 *
 * @param path The path to verify.
 * @returns `true` if the path is absolute, `false` otherwise.
 */ function isAbsolute(path) {
  assertPath(path);
  const len = path.length;
  if (len === 0) return false;
  const code = path.charCodeAt(0);
  if (isPathSeparator(code)) {
    return true;
  } else if (isWindowsDeviceRoot(code)) {
    // Possible device root
    if (len > 2 && path.charCodeAt(1) === CHAR_COLON) {
      if (isPathSeparator(path.charCodeAt(2))) return true;
    }
  }
  return false;
}

// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
function assertArg(path) {
  assertPath(path);
  if (path.length === 0) return ".";
}

// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
// This module is browser compatible.
// Resolves . and .. elements in a path with directory names
function normalizeString(path, allowAboveRoot, separator, isPathSeparator) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let code;
  for(let i = 0; i <= path.length; ++i){
    if (i < path.length) code = path.charCodeAt(i);
    else if (isPathSeparator(code)) break;
    else code = CHAR_FORWARD_SLASH;
    if (isPathSeparator(code)) {
      if (lastSlash === i - 1 || dots === 1) ; else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== CHAR_DOT || res.charCodeAt(res.length - 2) !== CHAR_DOT) {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf(separator);
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
            }
            lastSlash = i;
            dots = 0;
            continue;
          } else if (res.length === 2 || res.length === 1) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0) res += `${separator}..`;
          else res = "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) res += separator + path.slice(lastSlash + 1, i);
        else res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === CHAR_DOT && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
/**
 * Normalize the `path`, resolving `'..'` and `'.'` segments.
 * Note that resolving these segments does not necessarily mean that all will be eliminated.
 * A `'..'` at the top-level will be preserved, and an empty path is canonically `'.'`.
 *
 * @example Usage
 * ```ts
 * import { normalize } from "@std/path/windows/normalize";
 * import { assertEquals } from "@std/assert";
 *
 * const normalized = normalize("C:\\foo\\..\\bar");
 * assertEquals(normalized, "C:\\bar");
 * ```
 *
 * Note: If you are working with file URLs,
 * use the new version of `normalize` from `@std/path/windows/unstable-normalize`.
 *
 * @param path The path to normalize
 * @returns The normalized path
 */ function normalize(path) {
  assertArg(path);
  const len = path.length;
  let rootEnd = 0;
  let device;
  let isAbsolute = false;
  const code = path.charCodeAt(0);
  // Try to match a root
  if (len > 1) {
    if (isPathSeparator(code)) {
      // Possible UNC root
      // If we started with a separator, we know we at least have an absolute
      // path of some kind (UNC or otherwise)
      isAbsolute = true;
      if (isPathSeparator(path.charCodeAt(1))) {
        // Matched double path separator at beginning
        let j = 2;
        let last = j;
        // Match 1 or more non-path separators
        for(; j < len; ++j){
          if (isPathSeparator(path.charCodeAt(j))) break;
        }
        if (j < len && j !== last) {
          const firstPart = path.slice(last, j);
          // Matched!
          last = j;
          // Match 1 or more path separators
          for(; j < len; ++j){
            if (!isPathSeparator(path.charCodeAt(j))) break;
          }
          if (j < len && j !== last) {
            // Matched!
            last = j;
            // Match 1 or more non-path separators
            for(; j < len; ++j){
              if (isPathSeparator(path.charCodeAt(j))) break;
            }
            if (j === len) {
              // We matched a UNC root only
              // Return the normalized version of the UNC root since there
              // is nothing left to process
              return `\\\\${firstPart}\\${path.slice(last)}\\`;
            } else if (j !== last) {
              // We matched a UNC root with leftovers
              device = `\\\\${firstPart}\\${path.slice(last, j)}`;
              rootEnd = j;
            }
          }
        }
      } else {
        rootEnd = 1;
      }
    } else if (isWindowsDeviceRoot(code)) {
      // Possible device root
      if (path.charCodeAt(1) === CHAR_COLON) {
        device = path.slice(0, 2);
        rootEnd = 2;
        if (len > 2) {
          if (isPathSeparator(path.charCodeAt(2))) {
            // Treat separator following drive name as an absolute path
            // indicator
            isAbsolute = true;
            rootEnd = 3;
          }
        }
      }
    }
  } else if (isPathSeparator(code)) {
    // `path` contains just a path separator, exit early to avoid unnecessary
    // work
    return "\\";
  }
  let tail;
  if (rootEnd < len) {
    tail = normalizeString(path.slice(rootEnd), !isAbsolute, "\\", isPathSeparator);
  } else {
    tail = "";
  }
  if (tail.length === 0 && !isAbsolute) tail = ".";
  if (tail.length > 0 && isPathSeparator(path.charCodeAt(len - 1))) {
    tail += "\\";
  }
  if (device === undefined) {
    if (isAbsolute) {
      if (tail.length > 0) return `\\${tail}`;
      else return "\\";
    }
    return tail;
  } else if (isAbsolute) {
    if (tail.length > 0) return `${device}\\${tail}`;
    else return `${device}\\`;
  }
  return device + tail;
}

// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
/**
 * Join all given a sequence of `paths`,then normalizes the resulting path.
 *
 * @example Usage
 * ```ts
 * import { join } from "@std/path/windows/join";
 * import { assertEquals } from "@std/assert";
 *
 * const joined = join("C:\\foo", "bar", "baz\\..");
 * assertEquals(joined, "C:\\foo\\bar");
 * ```
 *
 * Note: If you are working with file URLs,
 * use the new version of `join` from `@std/path/windows/unstable-join`.
 *
 * @param paths The paths to join.
 * @returns The joined path.
 */ function join(...paths) {
  paths.forEach((path)=>assertPath(path));
  paths = paths.filter((path)=>path.length > 0);
  if (paths.length === 0) return ".";
  // Make sure that the joined path doesn't start with two slashes, because
  // normalize() will mistake it for an UNC path then.
  //
  // This step is skipped when it is very clear that the user actually
  // intended to point at an UNC path. This is assumed when the first
  // non-empty string arguments starts with exactly two slashes followed by
  // at least one more non-slash character.
  //
  // Note that for normalize() to treat a path as an UNC path it needs to
  // have at least 2 components, so we don't filter for that here.
  // This means that the user can use join to construct UNC paths from
  // a server name and a share name; for example:
  //   path.join('//server', 'share') -> '\\\\server\\share\\'
  let needsReplace = true;
  let slashCount = 0;
  const firstPart = paths[0];
  if (isPathSeparator(firstPart.charCodeAt(0))) {
    ++slashCount;
    const firstLen = firstPart.length;
    if (firstLen > 1) {
      if (isPathSeparator(firstPart.charCodeAt(1))) {
        ++slashCount;
        if (firstLen > 2) {
          if (isPathSeparator(firstPart.charCodeAt(2))) ++slashCount;
          else {
            // We matched a UNC path in the first part
            needsReplace = false;
          }
        }
      }
    }
  }
  let joined = paths.join("\\");
  if (needsReplace) {
    // Find any more consecutive slashes we need to replace
    for(; slashCount < joined.length; ++slashCount){
      if (!isPathSeparator(joined.charCodeAt(slashCount))) break;
    }
    // Replace the slashes if needed
    if (slashCount >= 2) joined = `\\${joined.slice(slashCount)}`;
  }
  return normalize(joined);
}

// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
/**
 * Return a `ParsedPath` object of the `path`.
 *
 * @example Usage
 * ```ts
 * import { parse } from "@std/path/windows/parse";
 * import { assertEquals } from "@std/assert";
 *
 * const parsed = parse("C:\\foo\\bar\\baz.ext");
 * assertEquals(parsed, {
 *   root: "C:\\",
 *   dir: "C:\\foo\\bar",
 *   base: "baz.ext",
 *   ext: ".ext",
 *   name: "baz",
 * });
 * ```
 *
 * @param path The path to parse.
 * @returns The `ParsedPath` object.
 */ function parse(path) {
  assertPath(path);
  const ret = {
    root: "",
    dir: "",
    base: "",
    ext: "",
    name: ""
  };
  const len = path.length;
  if (len === 0) return ret;
  let rootEnd = 0;
  let code = path.charCodeAt(0);
  // Try to match a root
  if (len > 1) {
    if (isPathSeparator(code)) {
      // Possible UNC root
      rootEnd = 1;
      if (isPathSeparator(path.charCodeAt(1))) {
        // Matched double path separator at beginning
        let j = 2;
        let last = j;
        // Match 1 or more non-path separators
        for(; j < len; ++j){
          if (isPathSeparator(path.charCodeAt(j))) break;
        }
        if (j < len && j !== last) {
          // Matched!
          last = j;
          // Match 1 or more path separators
          for(; j < len; ++j){
            if (!isPathSeparator(path.charCodeAt(j))) break;
          }
          if (j < len && j !== last) {
            // Matched!
            last = j;
            // Match 1 or more non-path separators
            for(; j < len; ++j){
              if (isPathSeparator(path.charCodeAt(j))) break;
            }
            if (j === len) {
              // We matched a UNC root only
              rootEnd = j;
            } else if (j !== last) {
              // We matched a UNC root with leftovers
              rootEnd = j + 1;
            }
          }
        }
      }
    } else if (isWindowsDeviceRoot(code)) {
      // Possible device root
      if (path.charCodeAt(1) === CHAR_COLON) {
        rootEnd = 2;
        if (len > 2) {
          if (isPathSeparator(path.charCodeAt(2))) {
            if (len === 3) {
              // `path` contains just a drive root, exit early to avoid
              // unnecessary work
              ret.root = ret.dir = path;
              ret.base = "\\";
              return ret;
            }
            rootEnd = 3;
          }
        } else {
          // `path` contains just a relative drive root, exit early to avoid
          // unnecessary work
          ret.root = ret.dir = path;
          return ret;
        }
      }
    }
  } else if (isPathSeparator(code)) {
    // `path` contains just a path separator, exit early to avoid
    // unnecessary work
    ret.root = ret.dir = path;
    ret.base = "\\";
    return ret;
  }
  if (rootEnd > 0) ret.root = path.slice(0, rootEnd);
  let startDot = -1;
  let startPart = rootEnd;
  let end = -1;
  let matchedSlash = true;
  let i = path.length - 1;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  let preDotState = 0;
  // Get non-dir info
  for(; i >= rootEnd; --i){
    code = path.charCodeAt(i);
    if (isPathSeparator(code)) {
      // If we reached a path separator that was not part of a set of path
      // separators at the end of the string, stop now
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }
    if (code === CHAR_DOT) {
      // If this is our first dot, mark it as the start of our extension
      if (startDot === -1) startDot = i;
      else if (preDotState !== 1) preDotState = 1;
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    if (end !== -1) {
      ret.base = ret.name = path.slice(startPart, end);
    }
  } else {
    ret.name = path.slice(startPart, startDot);
    ret.base = path.slice(startPart, end);
    ret.ext = path.slice(startDot, end);
  }
  // Fallback to '\' in case there is no basename
  ret.base = ret.base || "\\";
  // If the directory is the root, use the entire root as the `dir` including
  // the trailing slash if any (`C:\abc` -> `C:\`). Otherwise, strip out the
  // trailing slash (`C:\abc\def` -> `C:\abc`).
  if (startPart > 0 && startPart !== rootEnd) {
    ret.dir = path.slice(0, startPart - 1);
  } else ret.dir = ret.root;
  return ret;
}

// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
/**
 * Resolves path segments into a `path`.
 *
 * @example Usage
 * ```ts
 * import { resolve } from "@std/path/windows/resolve";
 * import { assertEquals } from "@std/assert";
 *
 * const resolved = resolve("C:\\foo\\bar", "..\\baz");
 * assertEquals(resolved, "C:\\foo\\baz");
 * ```
 *
 * @param pathSegments The path segments to process to path
 * @returns The resolved path
 */ function resolve(...pathSegments) {
  let resolvedDevice = "";
  let resolvedTail = "";
  let resolvedAbsolute = false;
  for(let i = pathSegments.length - 1; i >= -1; i--){
    let path;
    // deno-lint-ignore no-explicit-any
    const { Deno } = globalThis;
    if (i >= 0) {
      path = pathSegments[i];
    } else if (!resolvedDevice) {
      if (typeof Deno?.cwd !== "function") {
        throw new TypeError("Resolved a drive-letter-less path without a current working directory (CWD)");
      }
      path = Deno.cwd();
    } else {
      if (typeof Deno?.env?.get !== "function" || typeof Deno?.cwd !== "function") {
        throw new TypeError("Resolved a relative path without a current working directory (CWD)");
      }
      path = Deno.cwd();
      // Verify that a cwd was found and that it actually points
      // to our drive. If not, default to the drive's root.
      if (path === undefined || path.slice(0, 3).toLowerCase() !== `${resolvedDevice.toLowerCase()}\\`) {
        path = `${resolvedDevice}\\`;
      }
    }
    assertPath(path);
    const len = path.length;
    // Skip empty entries
    if (len === 0) continue;
    let rootEnd = 0;
    let device = "";
    let isAbsolute = false;
    const code = path.charCodeAt(0);
    // Try to match a root
    if (len > 1) {
      if (isPathSeparator(code)) {
        // Possible UNC root
        // If we started with a separator, we know we at least have an
        // absolute path of some kind (UNC or otherwise)
        isAbsolute = true;
        if (isPathSeparator(path.charCodeAt(1))) {
          // Matched double path separator at beginning
          let j = 2;
          let last = j;
          // Match 1 or more non-path separators
          for(; j < len; ++j){
            if (isPathSeparator(path.charCodeAt(j))) break;
          }
          if (j < len && j !== last) {
            const firstPart = path.slice(last, j);
            // Matched!
            last = j;
            // Match 1 or more path separators
            for(; j < len; ++j){
              if (!isPathSeparator(path.charCodeAt(j))) break;
            }
            if (j < len && j !== last) {
              // Matched!
              last = j;
              // Match 1 or more non-path separators
              for(; j < len; ++j){
                if (isPathSeparator(path.charCodeAt(j))) break;
              }
              if (j === len) {
                // We matched a UNC root only
                device = `\\\\${firstPart}\\${path.slice(last)}`;
                rootEnd = j;
              } else if (j !== last) {
                // We matched a UNC root with leftovers
                device = `\\\\${firstPart}\\${path.slice(last, j)}`;
                rootEnd = j;
              }
            }
          }
        } else {
          rootEnd = 1;
        }
      } else if (isWindowsDeviceRoot(code)) {
        // Possible device root
        if (path.charCodeAt(1) === CHAR_COLON) {
          device = path.slice(0, 2);
          rootEnd = 2;
          if (len > 2) {
            if (isPathSeparator(path.charCodeAt(2))) {
              // Treat separator following drive name as an absolute path
              // indicator
              isAbsolute = true;
              rootEnd = 3;
            }
          }
        }
      }
    } else if (isPathSeparator(code)) {
      // `path` contains just a path separator
      rootEnd = 1;
      isAbsolute = true;
    }
    if (device.length > 0 && resolvedDevice.length > 0 && device.toLowerCase() !== resolvedDevice.toLowerCase()) {
      continue;
    }
    if (resolvedDevice.length === 0 && device.length > 0) {
      resolvedDevice = device;
    }
    if (!resolvedAbsolute) {
      resolvedTail = `${path.slice(rootEnd)}\\${resolvedTail}`;
      resolvedAbsolute = isAbsolute;
    }
    if (resolvedAbsolute && resolvedDevice.length > 0) break;
  }
  // At this point the path should be resolved to a full absolute path,
  // but handle relative paths to be safe (might happen when Deno.cwd()
  // fails)
  // Normalize the tail path
  resolvedTail = normalizeString(resolvedTail, !resolvedAbsolute, "\\", isPathSeparator);
  return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail || ".";
}

// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
function assertArgs(from, to) {
  assertPath(from);
  assertPath(to);
  if (from === to) return "";
}

// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
/**
 * Return the relative path from `from` to `to` based on current working directory.
 *
 * An example in windws, for instance:
 *  from = 'C:\\orandea\\test\\aaa'
 *  to = 'C:\\orandea\\impl\\bbb'
 * The output of the function should be: '..\\..\\impl\\bbb'
 *
 * @example Usage
 * ```ts
 * import { relative } from "@std/path/windows/relative";
 * import { assertEquals } from "@std/assert";
 *
 * const relativePath = relative("C:\\foobar\\test\\aaa", "C:\\foobar\\impl\\bbb");
 * assertEquals(relativePath, "..\\..\\impl\\bbb");
 * ```
 *
 * @param from The path from which to calculate the relative path
 * @param to The path to which to calculate the relative path
 * @returns The relative path from `from` to `to`
 */ function relative(from, to) {
  assertArgs(from, to);
  const fromOrig = resolve(from);
  const toOrig = resolve(to);
  if (fromOrig === toOrig) return "";
  from = fromOrig.toLowerCase();
  to = toOrig.toLowerCase();
  if (from === to) return "";
  // Trim any leading backslashes
  let fromStart = 0;
  let fromEnd = from.length;
  for(; fromStart < fromEnd; ++fromStart){
    if (from.charCodeAt(fromStart) !== CHAR_BACKWARD_SLASH) break;
  }
  // Trim trailing backslashes (applicable to UNC paths only)
  for(; fromEnd - 1 > fromStart; --fromEnd){
    if (from.charCodeAt(fromEnd - 1) !== CHAR_BACKWARD_SLASH) break;
  }
  const fromLen = fromEnd - fromStart;
  // Trim any leading backslashes
  let toStart = 0;
  let toEnd = to.length;
  for(; toStart < toEnd; ++toStart){
    if (to.charCodeAt(toStart) !== CHAR_BACKWARD_SLASH) break;
  }
  // Trim trailing backslashes (applicable to UNC paths only)
  for(; toEnd - 1 > toStart; --toEnd){
    if (to.charCodeAt(toEnd - 1) !== CHAR_BACKWARD_SLASH) break;
  }
  const toLen = toEnd - toStart;
  // Compare paths to find the longest common path from root
  const length = fromLen < toLen ? fromLen : toLen;
  let lastCommonSep = -1;
  let i = 0;
  for(; i <= length; ++i){
    if (i === length) {
      if (toLen > length) {
        if (to.charCodeAt(toStart + i) === CHAR_BACKWARD_SLASH) {
          // We get here if `from` is the exact base path for `to`.
          // For example: from='C:\\foo\\bar'; to='C:\\foo\\bar\\baz'
          return toOrig.slice(toStart + i + 1);
        } else if (i === 2) {
          // We get here if `from` is the device root.
          // For example: from='C:\\'; to='C:\\foo'
          return toOrig.slice(toStart + i);
        }
      }
      if (fromLen > length) {
        if (from.charCodeAt(fromStart + i) === CHAR_BACKWARD_SLASH) {
          // We get here if `to` is the exact base path for `from`.
          // For example: from='C:\\foo\\bar'; to='C:\\foo'
          lastCommonSep = i;
        } else if (i === 2) {
          // We get here if `to` is the device root.
          // For example: from='C:\\foo\\bar'; to='C:\\'
          lastCommonSep = 3;
        }
      }
      break;
    }
    const fromCode = from.charCodeAt(fromStart + i);
    const toCode = to.charCodeAt(toStart + i);
    if (fromCode !== toCode) break;
    else if (fromCode === CHAR_BACKWARD_SLASH) lastCommonSep = i;
  }
  // We found a mismatch before the first common path separator was seen, so
  // return the original `to`.
  if (i !== length && lastCommonSep === -1) {
    return toOrig;
  }
  let out = "";
  if (lastCommonSep === -1) lastCommonSep = 0;
  // Generate the relative path based on the path difference between `to` and
  // `from`
  for(i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i){
    if (i === fromEnd || from.charCodeAt(i) === CHAR_BACKWARD_SLASH) {
      if (out.length === 0) out += "..";
      else out += "\\..";
    }
  }
  // Lastly, append the rest of the destination (`to`) path that comes after
  // the common path parts
  if (out.length > 0) {
    return out + toOrig.slice(toStart + lastCommonSep, toEnd);
  } else {
    toStart += lastCommonSep;
    if (toOrig.charCodeAt(toStart) === CHAR_BACKWARD_SLASH) ++toStart;
    return toOrig.slice(toStart, toEnd);
  }
}

// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
const WHITESPACE_ENCODINGS = {
  "\u0009": "%09",
  "\u000A": "%0A",
  "\u000B": "%0B",
  "\u000C": "%0C",
  "\u000D": "%0D",
  "\u0020": "%20"
};
function encodeWhitespace(string) {
  return string.replaceAll(/[\s]/g, (c)=>{
    return WHITESPACE_ENCODINGS[c] ?? c;
  });
}

// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
/**
 * Converts a path string to a file URL.
 *
 * @example Usage
 * ```ts
 * import { toFileUrl } from "@std/path/windows/to-file-url";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(toFileUrl("\\home\\foo"), new URL("file:///home/foo"));
 * assertEquals(toFileUrl("C:\\Users\\foo"), new URL("file:///C:/Users/foo"));
 * assertEquals(toFileUrl("\\\\127.0.0.1\\home\\foo"), new URL("file://127.0.0.1/home/foo"));
 * ```
 * @param path The path to convert.
 * @returns The file URL.
 */ function toFileUrl(path) {
  if (!isAbsolute(path)) {
    throw new TypeError(`Path must be absolute: received "${path}"`);
  }
  const [, hostname, pathname] = path.match(/^(?:[/\\]{2}([^/\\]+)(?=[/\\](?:[^/\\]|$)))?(.*)/);
  const url = new URL("file:///");
  url.pathname = encodeWhitespace(pathname.replace(/%/g, "%25"));
  if (hostname !== undefined && hostname !== "localhost") {
    url.hostname = hostname;
    if (!url.hostname) {
      throw new TypeError(`Invalid hostname: "${url.hostname}"`);
    }
  }
  return url;
}

// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
/**
 * Resolves path to a namespace path
 *
 * @example Usage
 * ```ts
 * import { toNamespacedPath } from "@std/path/windows/to-namespaced-path";
 * import { assertEquals } from "@std/assert";
 *
 * const namespaced = toNamespacedPath("C:\\foo\\bar");
 * assertEquals(namespaced, "\\\\?\\C:\\foo\\bar");
 * ```
 *
 * @param path The path to resolve to namespaced path
 * @returns The resolved namespaced path
 */ function toNamespacedPath(path) {
  // Note: this will *probably* throw somewhere.
  if (typeof path !== "string") return path;
  if (path.length === 0) return "";
  const resolvedPath = resolve(path);
  if (resolvedPath.length >= 3) {
    if (resolvedPath.charCodeAt(0) === CHAR_BACKWARD_SLASH) {
      // Possible UNC root
      if (resolvedPath.charCodeAt(1) === CHAR_BACKWARD_SLASH) {
        const code = resolvedPath.charCodeAt(2);
        if (code !== CHAR_QUESTION_MARK && code !== CHAR_DOT) {
          // Matched non-long UNC root, convert the path to a long UNC path
          return `\\\\?\\UNC\\${resolvedPath.slice(2)}`;
        }
      }
    } else if (isWindowsDeviceRoot(resolvedPath.charCodeAt(0))) {
      // Possible device root
      if (resolvedPath.charCodeAt(1) === CHAR_COLON && resolvedPath.charCodeAt(2) === CHAR_BACKWARD_SLASH) {
        // Matched device root, convert the path to a long UNC path
        return `\\\\?\\${resolvedPath}`;
      }
    }
  }
  return path;
}

// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
function common$1(paths, sep) {
  const [first = "", ...remaining] = paths;
  const parts = first.split(sep);
  let endOfPrefix = parts.length;
  let append = "";
  for (const path of remaining){
    const compare = path.split(sep);
    if (compare.length <= endOfPrefix) {
      endOfPrefix = compare.length;
      append = "";
    }
    for(let i = 0; i < endOfPrefix; i++){
      if (compare[i] !== parts[i]) {
        endOfPrefix = i;
        append = i === 0 ? "" : sep;
        break;
      }
    }
  }
  return parts.slice(0, endOfPrefix).join(sep) + append;
}

// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
/**
 * Determines the common path from a set of paths for Windows systems.
 *
 * @example Usage
 * ```ts
 * import { common } from "@std/path/windows/common";
 * import { assertEquals } from "@std/assert";
 *
 * const path = common([
 *   "C:\\foo\\bar",
 *   "C:\\foo\\baz",
 * ]);
 * assertEquals(path, "C:\\foo\\");
 * ```
 *
 * @param paths The paths to compare.
 * @returns The common path.
 */ function common(paths) {
  return common$1(paths, SEPARATOR);
}

// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
/**
 * Options for {@linkcode globToRegExp}, {@linkcode joinGlobs},
 * {@linkcode normalizeGlob} and {@linkcode expandGlob}.
 */ const REG_EXP_ESCAPE_CHARS = [
  "!",
  "$",
  "(",
  ")",
  "*",
  "+",
  ".",
  "=",
  "?",
  "[",
  "\\",
  "^",
  "{",
  "|"
];
const RANGE_ESCAPE_CHARS = [
  "-",
  "\\",
  "]"
];
function _globToRegExp(c, glob, { extended = true, globstar: globstarOption = true, // os = osType,
caseInsensitive = false } = {}) {
  if (glob === "") {
    return /(?!)/;
  }
  // Remove trailing separators.
  let newLength = glob.length;
  for(; newLength > 1 && c.seps.includes(glob[newLength - 1]); newLength--);
  glob = glob.slice(0, newLength);
  let regExpString = "";
  // Terminates correctly. Trust that `j` is incremented every iteration.
  for(let j = 0; j < glob.length;){
    let segment = "";
    const groupStack = [];
    let inRange = false;
    let inEscape = false;
    let endsWithSep = false;
    let i = j;
    // Terminates with `i` at the non-inclusive end of the current segment.
    for(; i < glob.length && !c.seps.includes(glob[i]); i++){
      if (inEscape) {
        inEscape = false;
        const escapeChars = inRange ? RANGE_ESCAPE_CHARS : REG_EXP_ESCAPE_CHARS;
        segment += escapeChars.includes(glob[i]) ? `\\${glob[i]}` : glob[i];
        continue;
      }
      if (glob[i] === c.escapePrefix) {
        inEscape = true;
        continue;
      }
      if (glob[i] === "[") {
        if (!inRange) {
          inRange = true;
          segment += "[";
          if (glob[i + 1] === "!") {
            i++;
            segment += "^";
          } else if (glob[i + 1] === "^") {
            i++;
            segment += "\\^";
          }
          continue;
        } else if (glob[i + 1] === ":") {
          let k = i + 1;
          let value = "";
          while(glob[k + 1] !== undefined && glob[k + 1] !== ":"){
            value += glob[k + 1];
            k++;
          }
          if (glob[k + 1] === ":" && glob[k + 2] === "]") {
            i = k + 2;
            if (value === "alnum") segment += "\\dA-Za-z";
            else if (value === "alpha") segment += "A-Za-z";
            else if (value === "ascii") segment += "\x00-\x7F";
            else if (value === "blank") segment += "\t ";
            else if (value === "cntrl") segment += "\x00-\x1F\x7F";
            else if (value === "digit") segment += "\\d";
            else if (value === "graph") segment += "\x21-\x7E";
            else if (value === "lower") segment += "a-z";
            else if (value === "print") segment += "\x20-\x7E";
            else if (value === "punct") {
              segment += "!\"#$%&'()*+,\\-./:;<=>?@[\\\\\\]^_‘{|}~";
            } else if (value === "space") segment += "\\s\v";
            else if (value === "upper") segment += "A-Z";
            else if (value === "word") segment += "\\w";
            else if (value === "xdigit") segment += "\\dA-Fa-f";
            continue;
          }
        }
      }
      if (glob[i] === "]" && inRange) {
        inRange = false;
        segment += "]";
        continue;
      }
      if (inRange) {
        segment += glob[i];
        continue;
      }
      if (glob[i] === ")" && groupStack.length > 0 && groupStack[groupStack.length - 1] !== "BRACE") {
        segment += ")";
        const type = groupStack.pop();
        if (type === "!") {
          segment += c.wildcard;
        } else if (type !== "@") {
          segment += type;
        }
        continue;
      }
      if (glob[i] === "|" && groupStack.length > 0 && groupStack[groupStack.length - 1] !== "BRACE") {
        segment += "|";
        continue;
      }
      if (glob[i] === "+" && extended && glob[i + 1] === "(") {
        i++;
        groupStack.push("+");
        segment += "(?:";
        continue;
      }
      if (glob[i] === "@" && extended && glob[i + 1] === "(") {
        i++;
        groupStack.push("@");
        segment += "(?:";
        continue;
      }
      if (glob[i] === "?") {
        if (extended && glob[i + 1] === "(") {
          i++;
          groupStack.push("?");
          segment += "(?:";
        } else {
          segment += ".";
        }
        continue;
      }
      if (glob[i] === "!" && extended && glob[i + 1] === "(") {
        i++;
        groupStack.push("!");
        segment += "(?!";
        continue;
      }
      if (glob[i] === "{") {
        groupStack.push("BRACE");
        segment += "(?:";
        continue;
      }
      if (glob[i] === "}" && groupStack[groupStack.length - 1] === "BRACE") {
        groupStack.pop();
        segment += ")";
        continue;
      }
      if (glob[i] === "," && groupStack[groupStack.length - 1] === "BRACE") {
        segment += "|";
        continue;
      }
      if (glob[i] === "*") {
        if (extended && glob[i + 1] === "(") {
          i++;
          groupStack.push("*");
          segment += "(?:";
        } else {
          const prevChar = glob[i - 1];
          let numStars = 1;
          while(glob[i + 1] === "*"){
            i++;
            numStars++;
          }
          const nextChar = glob[i + 1];
          if (globstarOption && numStars === 2 && [
            ...c.seps,
            undefined
          ].includes(prevChar) && [
            ...c.seps,
            undefined
          ].includes(nextChar)) {
            segment += c.globstar;
            endsWithSep = true;
          } else {
            segment += c.wildcard;
          }
        }
        continue;
      }
      segment += REG_EXP_ESCAPE_CHARS.includes(glob[i]) ? `\\${glob[i]}` : glob[i];
    }
    // Check for unclosed groups or a dangling backslash.
    if (groupStack.length > 0 || inRange || inEscape) {
      // Parse failure. Take all characters from this segment literally.
      segment = "";
      for (const c of glob.slice(j, i)){
        segment += REG_EXP_ESCAPE_CHARS.includes(c) ? `\\${c}` : c;
        endsWithSep = false;
      }
    }
    regExpString += segment;
    if (!endsWithSep) {
      regExpString += i < glob.length ? c.sep : c.sepMaybe;
      endsWithSep = true;
    }
    // Terminates with `i` at the start of the next segment.
    while(c.seps.includes(glob[i]))i++;
    j = i;
  }
  regExpString = `^${regExpString}$`;
  return new RegExp(regExpString, caseInsensitive ? "i" : "");
}

// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
const constants = {
  sep: "(?:\\\\|/)+",
  sepMaybe: "(?:\\\\|/)*",
  seps: [
    "\\",
    "/"
  ],
  globstar: "(?:[^\\\\/]*(?:\\\\|/|$)+)*",
  wildcard: "[^\\\\/]*",
  escapePrefix: "`"
};
/** Convert a glob string to a regular expression.
 *
 * Tries to match bash glob expansion as closely as possible.
 *
 * Basic glob syntax:
 * - `*` - Matches everything without leaving the path segment.
 * - `?` - Matches any single character.
 * - `{foo,bar}` - Matches `foo` or `bar`.
 * - `[abcd]` - Matches `a`, `b`, `c` or `d`.
 * - `[a-d]` - Matches `a`, `b`, `c` or `d`.
 * - `[!abcd]` - Matches any single character besides `a`, `b`, `c` or `d`.
 * - `[[:<class>:]]` - Matches any character belonging to `<class>`.
 *     - `[[:alnum:]]` - Matches any digit or letter.
 *     - `[[:digit:]abc]` - Matches any digit, `a`, `b` or `c`.
 *     - See https://facelessuser.github.io/wcmatch/glob/#posix-character-classes
 *       for a complete list of supported character classes.
 * - `\` - Escapes the next character for an `os` other than `"windows"`.
 * - \` - Escapes the next character for `os` set to `"windows"`.
 * - `/` - Path separator.
 * - `\` - Additional path separator only for `os` set to `"windows"`.
 *
 * Extended syntax:
 * - Requires `{ extended: true }`.
 * - `?(foo|bar)` - Matches 0 or 1 instance of `{foo,bar}`.
 * - `@(foo|bar)` - Matches 1 instance of `{foo,bar}`. They behave the same.
 * - `*(foo|bar)` - Matches _n_ instances of `{foo,bar}`.
 * - `+(foo|bar)` - Matches _n > 0_ instances of `{foo,bar}`.
 * - `!(foo|bar)` - Matches anything other than `{foo,bar}`.
 * - See https://www.linuxjournal.com/content/bash-extended-globbing.
 *
 * Globstar syntax:
 * - Requires `{ globstar: true }`.
 * - `**` - Matches any number of any path segments.
 *     - Must comprise its entire path segment in the provided glob.
 * - See https://www.linuxjournal.com/content/globstar-new-bash-globbing-option.
 *
 * Note the following properties:
 * - The generated `RegExp` is anchored at both start and end.
 * - Repeating and trailing separators are tolerated. Trailing separators in the
 *   provided glob have no meaning and are discarded.
 * - Absolute globs will only match absolute paths, etc.
 * - Empty globs will match nothing.
 * - Any special glob syntax must be contained to one path segment. For example,
 *   `?(foo|bar/baz)` is invalid. The separator will take precedence and the
 *   first segment ends with an unclosed group.
 * - If a path segment ends with unclosed groups or a dangling escape prefix, a
 *   parse error has occurred. Every character for that segment is taken
 *   literally in this event.
 *
 * Limitations:
 * - A negative group like `!(foo|bar)` will wrongly be converted to a negative
 *   look-ahead followed by a wildcard. This means that `!(foo).js` will wrongly
 *   fail to match `foobar.js`, even though `foobar` is not `foo`. Effectively,
 *   `!(foo|bar)` is treated like `!(@(foo|bar)*)`. This will work correctly if
 *   the group occurs not nested at the end of the segment.
 *
 * @example Usage
 * ```ts
 * import { globToRegExp } from "@std/path/windows/glob-to-regexp";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(globToRegExp("*.js"), /^[^\\/]*\.js(?:\\|\/)*$/);
 * ```
 *
 * @param glob Glob string to convert.
 * @param options Conversion options.
 * @returns The regular expression equivalent to the glob.
 */ function globToRegExp(glob, options = {}) {
  return _globToRegExp(constants, glob, options);
}

// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
/**
 * Test whether the given string is a glob.
 *
 * @example Usage
 * ```ts
 * import { isGlob } from "@std/path/is-glob";
 * import { assert } from "@std/assert";
 *
 * assert(!isGlob("foo/bar/../baz"));
 * assert(isGlob("foo/*ar/../baz"));
 * ```
 *
 * @param str String to test.
 * @returns `true` if the given string is a glob, otherwise `false`
 */ function isGlob(str) {
  const chars = {
    "{": "}",
    "(": ")",
    "[": "]"
  };
  const regex = /\\(.)|(^!|\*|\?|[\].+)]\?|\[[^\\\]]+\]|\{[^\\}]+\}|\(\?[:!=][^\\)]+\)|\([^|]+\|[^\\)]+\))/;
  if (str === "") {
    return false;
  }
  let match;
  while(match = regex.exec(str)){
    if (match[2]) return true;
    let idx = match.index + match[0].length;
    // if an open bracket/brace/paren is escaped,
    // set the index to the next closing character
    const open = match[1];
    const close = open ? chars[open] : null;
    if (open && close) {
      const n = str.indexOf(close, idx);
      if (n !== -1) {
        idx = n + 1;
      }
    }
    str = str.slice(idx);
  }
  return false;
}

// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
/**
 * Like normalize(), but doesn't collapse "**\/.." when `globstar` is true.
 *
 * @example Usage
 * ```ts
 * import { normalizeGlob } from "@std/path/windows/normalize-glob";
 * import { assertEquals } from "@std/assert";
 *
 * const normalized = normalizeGlob("**\\foo\\..\\bar", { globstar: true });
 * assertEquals(normalized, "**\\bar");
 * ```
 *
 * @param glob The glob pattern to normalize.
 * @param options The options for glob pattern.
 * @returns The normalized glob pattern.
 */ function normalizeGlob(glob, { globstar = false } = {}) {
  if (glob.match(/\0/g)) {
    throw new Error(`Glob contains invalid characters: "${glob}"`);
  }
  if (!globstar) {
    return normalize(glob);
  }
  const s = SEPARATOR_PATTERN.source;
  const badParentPattern = new RegExp(`(?<=(${s}|^)\\*\\*${s})\\.\\.(?=${s}|$)`, "g");
  return normalize(glob.replace(badParentPattern, "\0")).replace(/\0/g, "..");
}

// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
/**
 * Like join(), but doesn't collapse "**\/.." when `globstar` is true.
 *
 * @example Usage
 *
 * ```ts
 * import { joinGlobs } from "@std/path/windows/join-globs";
 * import { assertEquals } from "@std/assert";
 *
 * const joined = joinGlobs(["foo", "**", "bar"], { globstar: true });
 * assertEquals(joined, "foo\\**\\bar");
 * ```
 *
 * @param globs The globs to join.
 * @param options The options for glob pattern.
 * @returns The joined glob pattern.
 */ function joinGlobs(globs, { extended = true, globstar = false } = {}) {
  if (!globstar || globs.length === 0) {
    return join(...globs);
  }
  let joined;
  for (const glob of globs){
    const path = glob;
    if (path.length > 0) {
      if (!joined) joined = path;
      else joined += `${SEPARATOR}${path}`;
    }
  }
  if (!joined) return ".";
  return normalizeGlob(joined, {
    extended,
    globstar
  });
}

exports.DELIMITER = DELIMITER;
exports.SEPARATOR = SEPARATOR;
exports.SEPARATOR_PATTERN = SEPARATOR_PATTERN;
exports.basename = basename;
exports.common = common;
exports.dirname = dirname;
exports.extname = extname;
exports.format = format;
exports.fromFileUrl = fromFileUrl;
exports.globToRegExp = globToRegExp;
exports.isAbsolute = isAbsolute;
exports.isGlob = isGlob;
exports.join = join;
exports.joinGlobs = joinGlobs;
exports.normalize = normalize;
exports.normalizeGlob = normalizeGlob;
exports.parse = parse;
exports.relative = relative;
exports.resolve = resolve;
exports.toFileUrl = toFileUrl;
exports.toNamespacedPath = toNamespacedPath;