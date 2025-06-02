#!/bin/bash
cd /home/kavia/workspace/code-generation/youthsync-suite-27133-5a74e437/youthsync_suite
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

