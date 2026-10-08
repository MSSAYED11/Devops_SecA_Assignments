# Kubernetes Basics

This is my practice/documentation for learning the basics of Kubernetes and how it is used to manage containerized applications.

The tutorial mainly focuses on deploying an application, accessing it, scaling it, updating it, and debugging it inside a Kubernetes cluster.

---

## What I Will Learn

By completing this tutorial, I will learn how to:

* Create a Kubernetes cluster
* Deploy a containerized application
* Explore and interact with the deployed application
* Expose the application publicly
* Scale the application
* Update the application with a new version
* Debug the application

---

## Why Kubernetes?

Modern applications are expected to be available almost all the time, and new versions of applications can need to be deployed frequently.

Containers make this easier by packaging an application and everything it needs to run into a single unit.

Kubernetes helps manage these containers by making sure that applications:

* Run where they are supposed to run
* Have the resources they need
* Stay available
* Can be updated without unnecessary downtime
* Can be scaled when the workload increases

Kubernetes is an open-source platform for container orchestration and is designed for running and managing containerized applications.

---

# Kubernetes Basics — Modules

The tutorial is divided into 6 main modules.

## Module 1 — Create a Kubernetes Cluster

Create a Kubernetes cluster that will be used for the rest of the practice.

**Main focus:**

* Creating the cluster
* Understanding the basic cluster setup

---

## Module 2 — Deploy an App

Deploy a containerized application into the Kubernetes cluster.

**Main focus:**

* Creating a deployment
* Running the application inside the cluster

---

## Module 3 — Explore Your App

Explore the application after deploying it and understand how it is running inside Kubernetes.

**Main focus:**

* Checking the deployed application
* Understanding the running resources
* Interacting with the application

---

## Module 4 — Expose Your App Publicly

Make the application accessible from outside the Kubernetes cluster.

**Main focus:**

* Exposing the application
* Understanding how Kubernetes makes applications accessible

---

## Module 5 — Scale Up Your App

Increase the number of running instances of the application.

**Main focus:**

* Scaling the deployment
* Running multiple replicas
* Understanding how Kubernetes handles scaling

---

## Module 6 — Update Your App

Update the application with a new software version.

**Main focus:**

* Updating the deployed application
* Understanding how Kubernetes handles application updates
* Keeping the application available while updating it

---

# Practice Flow

The overall flow of this tutorial is:

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

Each module builds on the previous one, so the modules are meant to be followed in order.

---

## Practice Environment

This tutorial uses **Minikube** to create and run the Kubernetes cluster locally.

Minikube provides a simple way to run a Kubernetes cluster for learning and practice without needing a full production environment.

---

## What's Next?

After completing these basics, I can continue with the Kubernetes learning environment and practice clusters to explore more Kubernetes concepts and work with Kubernetes in a more hands-on way.

**Reference:** Kubernetes Documentation — Learn Kubernetes Basics
