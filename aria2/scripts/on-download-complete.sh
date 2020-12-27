#!/bin/sh

# $1 is gid.
# $2 is the number of files.
# $3 is the path of the first file.

DOWNLOAD=/home/aria2/dl # no trailing slash!
COMPLETE=/home/aria2/complete # no trailing slash!
LOG=/tmp/on-download-complete.log
SRC=$3

if [ "$2" == "0" ]; then
  echo `date` "INFO - no file to move for" "$1". >> "$LOG"
  exit 0
fi

while true; do
  DIR=`dirname "$SRC"`
  if [ "$DIR" == "$DOWNLOAD" ]; then
	echo `date` "INFO - " "$3" copied as "$SRC". >> "$LOG"
	cp -a "$SRC" "$COMPLETE" >> "$LOG" 2>&1
	exit $?
  elif [ "$DIR" == "/" -o "$DIR" == "." ]; then
	echo `date` ERROR - "$3" not under "$DOWNLOAD". >> "$LOG"
	exit 1
  else
	SRC=$DIR
  fi
done

