#/bin/bash

rsync -vhra \
  ./ root@racknerd1:~/nancedb \
  --exclude='/.git' \
  --include='**.gitignore' \
  --include='./src/db_files/' \
  --filter=':- .gitignore' \
  --delete-after
