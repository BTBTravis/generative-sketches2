#!/bin/bash

# m4_ignore(
echo "This is just a script template, not the script (yet) - pass it to 'argbash' to fix this." >&2
exit 11  #)Created by argbash-init v2.8.1
# ARG_POSITIONAL_SINGLE([command], [new, open, edit])
# ARG_HELP([<The general help message of my script>])
# ARGBASH_GO

# [ <-- needed because of Argbash

# select statment source https://bash.cyberciti.biz/guide/Select_loop
SKETCHES=`ls sketches | ag '^2'`

if [[ "$_arg_command" == "new" ]]; then
    ./node_modules/.bin/canvas-sketch --new --open
elif [[ "$_arg_command" == "open" ]]; then
    PS3="Which file to open?"
    select file in $SKETCHES
    do
        echo "$file selected"
        ./node_modules/.bin/canvas-sketch --open ./sketches/"$file"
        exit 0
    done
elif [[ "$_arg_command" == "edit" ]]; then
    PS3="Which file to edit?"
    select file in $SKETCHES
    do
        echo "$file selected"
        nvim ./sketches/"$file"
        exit 0
    done
fi


# ] <-- needed because of Argbash
dnl vim: filetype=sh
