#!/bin/bash

set -e  # Exit immediately if any command returns a non-zero status

# Set the necessary environment variables
APP_PREFIX="node-challenge"
DOCKER_REGISTRY="localhost:31111"
KUBE_NAMESPACE="node-challenge-cmion"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
PINK='\033[0;35m'
NC='\033[0m' # No Color

# Step 1: Create docker local registry
echo -e "${YELLOW}Step 1: Creating local docker registry${NC}"
# Check if the Docker container registry already exists
if docker container inspect local-registry >/dev/null 2>&1; then
  echo -e "${PINK}Docker container registry already exists.${NC}"
else
  # Step 1: Create docker local registry
  echo -e "${BLUE}Creating local Docker container registry...${NC}"
  docker run -d -p 31111:5000 --name local-registry registry:2
fi

# Step 2: Build and test the applications
echo -e "${YELLOW}Step 2: Building and testing the applications...${NC}"
# npm install
# npm run test

# Step 3: Build the Docker images
echo -e "${YELLOW}Step 3: Building the Docker images...${NC}"
docker build -t "$APP_PREFIX-api-service" -f ./docker/api-service/Dockerfile .
docker build -t "$APP_PREFIX-stock-service" -f ./docker/stock-service/Dockerfile .


# Step 4: Tag the Docker images for the local registry
echo -e "${YELLOW}Step 4: Tagging the Docker images for the local registry...${NC}"
docker tag "$APP_PREFIX-api-service" "$DOCKER_REGISTRY/$APP_PREFIX-api-service"
docker tag "$APP_PREFIX-stock-service" "$DOCKER_REGISTRY/$APP_PREFIX-stock-service"

# Step 5: Push the Docker images to the local registry
echo -e "${YELLOW}Step 5: Pushing the Docker images to the local registry...${NC}"
docker push "$DOCKER_REGISTRY/$APP_PREFIX-api-service"
docker push "$DOCKER_REGISTRY/$APP_PREFIX-stock-service"

# Step 6: Apply Kubernetes manifest for each application deployment
echo -e "${YELLOW}Step 6: Applying Kubernetes manifests for deployments...${NC}"
# Check if the namespace already exists
if kubectl get namespace $KUBE_NAMESPACE >/dev/null 2>&1; then
  echo -e "${PINK}Namespace $KUBE_NAMESPACE already exists.${NC}"
else
  # Create the namespace
  kubectl create namespace $KUBE_NAMESPACE
  echo -e "${BLUE}Namespace $KUBE_NAMESPACE created.${NC}"
fi

kubectl apply -n $KUBE_NAMESPACE -f ./k8s/rabbitmq-deployment.yml
kubectl apply -n $KUBE_NAMESPACE -f ./k8s/api-service-deployment.yml
kubectl apply -n $KUBE_NAMESPACE -f ./k8s/stock-service-deployment.yml

# Step 7: Wait for the deployments to complete
echo -e "${YELLOW}Step 7: Waiting for the deployments to complete...${NC}"
kubectl rollout status -n $KUBE_NAMESPACE deployment/rabbitmq-deployment
kubectl rollout status -n $KUBE_NAMESPACE deployment/$APP_PREFIX-api-service
kubectl rollout status -n $KUBE_NAMESPACE deployment/$APP_PREFIX-stock-service

# Step 8: Get the IP address and NodePort of the Kubernetes services
echo -e "${YELLOW}Step 8: Getting the IP address and NodePort of the Kubernetes services...${NC}"
#API_SERVICE_IP=$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[?(@.type=="ExternalIP")].address}')

API_SERVICE_NODE_PORT=$(kubectl get svc -n $KUBE_NAMESPACE "$APP_PREFIX-api-service" -o jsonpath='{.spec.ports[0].nodePort}')
# Step 9: Construct the service URLs
API_SERVICE_IP_URL="http://localhost:$API_SERVICE_NODE_PORT"

# Step 10: Echo the service URLs
echo "API Service URL: $API_SERVICE_IP_URL"

echo  -e "${GREEN}Deployment completed successfully!${NC}"
