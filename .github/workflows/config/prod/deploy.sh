echo $CR_PAT | docker login ghcr.io -u subbusura --password-stdin

cp ./.github/workflows/config/prod/next.config.js ./next.config.js

echo $tag_name

arrIN=(${tag_name//ka/ })

docker build -t ghcr.io/subbusura/kwic-admin-v2:${arrIN[0]} .

docker push ghcr.io/subbusura/kwic-admin-v2:${arrIN[0]}