tar zcvf dist.tar.gz dist node_modules sample package.json
docker build -t bake-master -f Dockerfile.prod .
rm -rf dist.tar.gz
