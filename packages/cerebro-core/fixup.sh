#!/bin/bash
#
#   Add package.json files to cjs/mjs subtrees
#

cat >commonjs/package.json <<!EOF
{
    "type": "commonjs"
}
!EOF

cat >esm/package.json <<!EOF
{
    "type": "module"
}
!EOF

