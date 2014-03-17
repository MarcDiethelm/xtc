# Changelog

## develop branch (0.4.0)

-

## 0.3.1 — 2014-03-12
- Stricter type checking: unwrapped src array is not necessarily a string.
- "Done" message (verbose): print `options.bundleName` instead of task 'target' name.

## 0.3.0 — 2014-02-25
- Compatible with glue v0.9+.
- Compatible with specific path for `less` output in glue v0.9.2+.
- Incompatible with glue 0.4-
- Uses `glue --output` to set default out path. You can override it by setting `css` or `less` (glue 0.9.2+) to a path.
- `less` can be a path or a Boolean. (glue 0.9.2+)

## 0.2.0 — 2014-02-22
- Compatible with glue v0.4+. `debug: true` removed.
- Make plugin behave as described. The target name is the default bundle name.
- Much improved `--verbose` logging. Use it when setting up tasks and when encountering problems.

## 0.1.1 — 2014-02-17
- bugfix issue #2: Make sure `[..].taskdata.options` is defined. Thanks appolo for reporting!

## 0.1.0 — 2013-11-15
- bugfix: Only add boolean option if value is true.

## 0.1.0-beta.1 — 2013-11-04
- First version. Awesome.