docker build -t "madome-debug:latest" .

if [ $? -ne 0 ]; then
    exit 1
fi

kubectl apply -f k8s.yml

if [ $? -ne 0 ]; then
    exit 1
fi

kubectl rollout restart deployment/madome-debug
