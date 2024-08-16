echo "Switching to branch master"
git checkout master

echo "Pulling latest changes"
git pull

echo "Building the project"
npm run build

echo "Deploying the project"
scp -r .next/* conrad@clay:/var/www/resume/

echo "Done"