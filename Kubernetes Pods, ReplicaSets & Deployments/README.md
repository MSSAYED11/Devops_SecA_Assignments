<img width="1351" height="1141" alt="image" src="https://github.com/user-attachments/assets/e130deb8-5014-4a23-8e81-de8baf76ec8f" />In this session, I practiced different Kubernetes deployment strategies and checked how each one behaves while updating or replacing an application.

The four strategies covered are:

* Rolling Update
* Blue-Green Deployment
* Canary Deployment
* Recreate Deployment

---

## 10.1 Rolling Update

A Rolling Update replaces the old version of an application gradually instead of stopping everything at once.

I used this strategy to update the application while keeping the existing version available during the update. Kubernetes slowly creates pods with the new version and removes the old ones.

### Terminal Execution

<img width="1360" height="1026" alt="image" src="https://github.com/user-attachments/assets/aed4c32f-40c3-4192-999b-19ea89e8ddcc" />
<img width="2294" height="341" alt="image" src="https://github.com/user-attachments/assets/d7ba4721-0409-4e3a-8652-6a979aa5244e" />


### Browser Output

<img width="1009" height="481" alt="image" src="https://github.com/user-attachments/assets/019364c0-2cad-4e8e-ac1c-9cb98a1b6962" />
<img width="946" height="376" alt="image" src="https://github.com/user-attachments/assets/9ced34f6-7977-4f4e-a623-89c941c61ffd" />


---

## 10.2 Blue-Green Deployment

In a Blue-Green deployment, two versions of the application are kept separately.

The **Blue** version represents the current/old version, while the **Green** version is the new version. The service can then be switched from Blue to Green when the new version is ready.

This makes it easier to test the new version before directing traffic to it.

### Terminal Execution

<img width="1391" height="1175" alt="image" src="https://github.com/user-attachments/assets/631c8c86-23dd-451c-93ab-36713fbccd44" />


### Browser Output

<img width="908" height="298" alt="image" src="https://github.com/user-attachments/assets/b981db8e-2715-4ba9-b067-c965958ff164" />



---

## 10.3 Canary Deployment

A Canary deployment releases the new version to only a small portion of users or traffic first.

Instead of immediately moving everyone to the new version, I can check how the new version behaves with limited traffic. If everything works properly, the new version can gradually receive more traffic.

### Terminal Execution
<img width="1391" height="1175" alt="image" src="https://github.com/user-attachments/assets/ff278716-f8b1-469b-9cac-d7bc7a23265a" />

<img width="1429" height="683" alt="image" src="https://github.com/user-attachments/assets/abd61342-32c8-4cd1-a26c-b9c143266331" />



## 10.4 Recreate Deployment

The Recreate strategy works differently from Rolling Update.

Here, the existing pods are stopped first, and only after that the new version is started. This means there can be a short period where the application is not available.

I used this strategy to see how Kubernetes handles a complete replacement of the existing deployment.

### Terminal Execution

<img width="2102" height="1168" alt="image" src="https://github.com/user-attachments/assets/97f36856-d231-47b1-9da1-a68f67407eef" />
<img width="2261" height="379" alt="image" src="https://github.com/user-attachments/assets/44bf1128-62fc-4121-8e08-0cf1172235af" />




## Conclusion

Through these four deployments, I got to see how Kubernetes can handle application updates in different ways.

Each strategy has a different approach to replacing the existing version, controlling traffic, and maintaining application availability.

