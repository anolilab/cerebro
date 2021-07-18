#!/bin/bash
#
#   Add package.json files to commonjs/esm subtrees
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

