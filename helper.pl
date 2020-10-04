#!/usr/bin/env perl
use strict;
use warnings;

my $num_args = $#ARGV + 1;

if ($num_args != 1) {
    print "Usage: ./helper.pl new/open/edit \n";
    exit 1;
}

my $command = $ARGV[0];


if ($command eq 'new') {
    system('./node_modules/.bin/canvas-sketch --new --open');
    exit 0;
}

my $existing_sketches = qx(ls sketches | rg '^2');
print $existing_sketches;

die("Usage: ./helper.pl new/open/edit");




#if [[ "$_arg_command" == "new" ]]; then
#elif [[ "$_arg_command" == "open" ]]; then
    #PS3="Which file to open?"
    #select file in $SKETCHES
    #do
        #echo "$file selected"
        #./node_modules/.bin/canvas-sketch --open ./sketches/"$file"
        #exit 0
    #done
#elif [[ "$_arg_command" == "edit" ]]; then
    #PS3="Which file to edit?"
    #select file in $SKETCHES
    #do
        #echo "$file selected"
        #nvim ./sketches/"$file"
        #exit 0
    #done
#fi

