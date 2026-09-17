# Kubernetes Basics

This is a small tutorial/project to learn the basics of **Kubernetes** and how it is used to manage containerized applications.

I made this while learning Kubernetes, so the main focus here is on understanding the basic concepts and actually trying them out instead of just reading about them.

## What is Kubernetes?

When applications become bigger, managing all the containers manually can get difficult. We need to make sure the application is running properly, scale it when there is more traffic, update it when a new version is released, etc.

Kubernetes helps with this.

It is an open-source platform used for managing and running containerized applications. It can handle things like deploying applications, scaling them, updating them and also helping with debugging when something goes wrong.

## What you'll learn

In this tutorial, we will go through the basic Kubernetes workflow:

* Create a Kubernetes cluster
* Deploy a containerized application
* Check and explore the application
* Make the application accessible outside the cluster
* Scale the application
* Update the application to a new version
* Debug the application if something goes wrong

## Tutorial Modules

### 1. Create a Kubernetes Cluster

First, we create a Kubernetes cluster which will be used for the rest of the tutorial.

We will be using **Minikube** to run Kubernetes locally.

### 2. Deploy an App

Once the cluster is ready, we deploy a containerized application into it and see how Kubernetes manages it.

### 3. Explore the App

After deploying the app, we can check what's actually running inside the cluster and interact with our application.

### 4. Expose the App

An application running inside the cluster isn't automatically available from outside.

Here we learn how to expose the application so that we can access it.

### 5. Scale the App

What happens when our application starts getting more traffic?

We can run multiple instances of the application. In this section, we'll learn how Kubernetes can scale the application up or down.

### 6. Update the App

Applications keep changing, so we also need a way to release newer versions.

Here we'll update our application and see how Kubernetes handles the new version.

## Basic flow

```text
Create Cluster
      ↓
Deploy App
      ↓
Explore App
      ↓
Expose App
      ↓
Scale App
      ↓
Update App
```

## Why learn Kubernetes?

Kubernetes is mainly useful when we have multiple containers and need a better way to manage them.

Some things Kubernetes helps with are:

* Running applications reliably
* Scaling applications when needed
* Deploying new versions
* Managing containers across a cluster
* Helping services communicate with each other
* Finding and debugging problems

## Using Minikube

For this tutorial, **Minikube** can be used to run a Kubernetes cluster on your own computer.

It's pretty useful for learning because you don't need an actual production cluster just to practice the basics.

## What's next?

After getting comfortable with these basics, some good topics to learn next are:

* Pods
* Deployments
* Services
* ConfigMaps
* Secrets
* Volumes
* Ingress
* Networking
* Stateful applications
* Cluster management
* Kubernetes security

The main goal of this tutorial is just to get comfortable with the Kubernetes basics and understand how the different parts fit together.
