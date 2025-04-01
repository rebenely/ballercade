# temp key file
echo "$SSH_KEY" > /tmp/temp_key.pem
chmod 600 /tmp/temp_key.pem

# put deployment replacement code
sed -i "s|<!-- deployment code here -->|$ADDITIONAL_CODE|g" ./dist/index.html

echo 'Updated index.html'

ssh -i /tmp/temp_key.pem $AWS_INSTANCE -o StrictHostKeyChecking=no 'rm -r /home/ubuntu/projects/ballercade'

echo 'Deleted existing folder'

scp -i /tmp/temp_key.pem -o StrictHostKeyChecking=no -r ./dist ${AWS_INSTANCE}:/home/ubuntu/projects/ballercade

echo 'Deployment successful'

rm /tmp/temp_key.pem