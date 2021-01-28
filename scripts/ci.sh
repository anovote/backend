#! /bin/sh
# Test script which is identical to CI action - used on local development.

echo "\n\n=======  🛠  FORMAT CHEK 🛠  ========\n"
deno fmt --check ./src ./tests

echo "\n\n=======  🙏 TESTING CHEK 🙏  ======== \n"
deno test --allow-none