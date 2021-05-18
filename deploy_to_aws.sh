rm -r build
npm run build
echo 'uploading code to AWS...'
scp -i most-popular-movies-1.pem -r ./build/* ec2-user@ec2-34-207-182-11.compute-1.amazonaws.com:/var/www/html
echo 'done...'