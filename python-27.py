# -*- coding: utf-8 -*-
#! /usr/bin/env python
"""
A skeleton python script which reads from an input file,
writes to an output file and parses command line arguments.
"""
from __future__ import print_function
import argparse


def main():
    parser = argparse.ArgumentParser(description=__doc__)

    parser.add_argument(
        "infile", nargs="?", default="-",
        metavar="INPUT_FILE", type=argparse.FileType("r"),
        help="path to the input file (read from stdin if omitted)")

    parser.add_argument(
        "outfile", nargs="?", default="-",
        metavar="OUTPUT_FILE", type=argparse.FileType("w"),
        help="path to the output file (write to stdout if omitted)")

    args = parser.parse_args()

    for line in args.infile:
        print(line.strip(), file=args.outfile)


if __name__ == "__main__":
    main()
