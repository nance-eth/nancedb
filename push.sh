#/bin/bash

rsync -vhra \
  ./ root@racknerd1:~/nancedb \
  --exclude='/.git' \
  --include='**.gitignore' \
  --include='db_files/*' \
  --filter=':- .gitignore' \
  --delete-after
