# Networking Commands Practice & Analysis

**Author:** M S Sayed  
**Environment:** Ubuntu (WSL)

---

## 1. Checking Connectivity (`ping`)

### Command

```bash
ping -c 4 google.com
```

### Output

```text
PING google.com (172.217.24.14) 56(84) bytes of data.
64 bytes from lcmaaa-an-in-f14.1e100.net (172.217.24.14): icmp_seq=1 ttl=116 time=23.8 ms
64 bytes from lcmaaa-an-in-f14.1e100.net (172.217.24.14): icmp_seq=2 ttl=116 time=24.9 ms
64 bytes from lcmaaa-an-in-f14.1e100.net (172.217.24.14): icmp_seq=3 ttl=116 time=23.9 ms
64 bytes from lcmaaa-an-in-f14.1e100.net (172.217.24.14): icmp_seq=4 ttl=116 time=23.3 ms

--- google.com ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3004ms
rtt min/avg/max/mdev = 23.280/23.939/24.868/0.578 ms
```

### My understanding

I used `ping` to check if my system could reach Google's server. It sends ICMP packets and waits for a reply. In my result, all 4 packets were recieved and there was 0% packet loss. The average response time was around 23.9 ms, so the connection was working fine.

---

## 2. Basic DNS Resolution (`nslookup`)

### Command

```bash
nslookup github.com
```

### Output

```text
Server:         10.255.255.254
Address:        10.255.255.254#53

Non-authoritative answer:
Name:   github.com
Address: 20.207.73.82
```

### My understanding

Here I used `nslookup` to find the IP address of `github.com`. It contacted the DNS server `10.255.255.254` and returned `20.207.73.82` as the IPv4 address of GitHub.

Basically, DNS converts a domain name that we can easily remember into an IP address that computers use.

---

## 3. Network Path Tracing (`traceroute`)

### Command

```bash
traceroute google.com
```

### Output

```text
traceroute to google.com (172.217.24.14), 30 hops max, 60 byte packets
 1  MS_Lap.mshome.net (172.20.32.1)  0.486 ms  0.384 ms  0.375 ms
 2  192.168.1.1 (192.168.1.1)  4.632 ms  2.776 ms  4.617 ms
 3  10.240.8.50 (10.240.8.50)  15.455 ms  18.096 ms  18.089 ms
 4  * * *
 5  125.20.202.37 (125.20.202.37)  31.067 ms 125.20.202.33 (125.20.202.33)  18.103 ms  18.093 ms
...
10  lcmaaa-an-in-f14.1e100.net (172.217.24.14)  22.821 ms
```

### My understanding

I used `traceroute` to see the path taken by the packets from my system to Google. The first hop was my WSL virtual interface and the second one was my local router (`192.168.1.1`).

After that, the packets went through other network/ISP routers before reaching Google's network. One of the hops showed `* * *`, which means there was no response from that hop.

---

## 4. HTTP Header Inspection (`curl`)

### Command

```bash
curl -I https://github.com
```

### Output

```text
HTTP/2 200
date: Fri, 04 Sep 2026 16:08:28 GMT
content-type: text/html; charset=utf-8
server: github.com
strict-transport-security: max-age=31536000; includeSubdomains; preload
...
x-github-edge-region: centralindia
```

### My understanding

The `-I` option makes `curl` show only the HTTP headers instead of downloading the complete webpage.

I got an `HTTP/2 200` response, which means the request was successful. I could also see some other information like the content type, security headers and the GitHub edge region.

---

## 5. SSH Client Verification (`ssh`)

### Command

```bash
ssh -V
```

### Output

```text
OpenSSH_10.2p1 Ubuntu-2ubuntu3.2, OpenSSL 3.5.5 27 Jan 2026
```

### My understanding

I used this command to check which version of SSH is installed on my Ubuntu system.

It showed that I have `OpenSSH_10.2p1`. SSH is commonly used to connect securely to remote Linux machines and servers.

---

## 6. Network Interface Configuration (`ip a`)

### Command

```bash
ip a
```

### Output

```text
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    inet 127.0.0.1/8 scope host lo
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1480 qdisc mq state UP group default qlen 1000
    inet 172.20.40.24/20 brd 172.20.47.255 scope global eth0
```

### My understanding

`ip a` shows the network interfaces available on my system along with their IP addresses.

Here, `lo` is the loopback interface and has the address `127.0.0.1`. The `eth0` interface is the active virtual network interface in my WSL setup, and its IP address is `172.20.40.24`.

---

## 7. Internal IP Address Retrieval (`hostname -I`)

### Command

```bash
hostname -I
```

### Output

```text
172.20.40.24
```

### My understanding

This command gives the IP address assigned to my machine. In my case, it returned `172.20.40.24`.

It's a quick way to check the current network address without getting all the extra information that `ip a` shows.

---

## 8. Routing Table Inspection (`ip route`)

### Command

```bash
ip route
```

### Output

```text
default via 172.20.32.1 dev eth0 proto kernel
172.20.32.0/20 dev eth0 proto kernel scope link src 172.20.40.24
```

### My understanding

I used `ip route` to see how network traffic is being routed from my system.

The default gateway shown here is `172.20.32.1`, and the traffic goes through the `eth0` interface. So when my system needs to send traffic outside its local network, it uses this default route.

---

## 9. Advanced DNS Lookup (`dig`)

### Command

```bash
dig github.com
```

### Output

```text
;; ANSWER SECTION:
github.com.             36      IN      A       20.207.73.82

;; Query time: 27 msec
;; SERVER: 10.255.255.254#53(UDP)
```

### My understanding

`dig` gives more detailed information about DNS compared to `nslookup`.

From the output, I can see that `github.com` has an `A` record pointing to `20.207.73.82`. The DNS query took 27 ms and was handled by the DNS server at `10.255.255.254`.

---

## 10. Active Socket Connections (`ss -tuln`)

### Command

```bash
ss -tuln
```

### Output

```text
Netid   State    Recv-Q   Send-Q   Local Address:Port   Peer Address:Port
udp     UNCONN   0        0        127.0.0.54:53        0.0.0.0:*
tcp     LISTEN   0        4096     127.0.0.53%lo:53     0.0.0.0:*
```

### My understanding

I used `ss -tuln` to check the network sockets that are currently listening.

The options mean:
- `-t` = TCP
- `-u` = UDP
- `-l` = listening
- `-n` = show numeric addresses

In my output, I can see DNS-related services listening on port `53`.

---

## 11. Legacy Socket Statistics (`netstat -tuln`)

### Command

```bash
netstat -tuln
```

### Output

```text
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        0      0 127.0.0.53:53           0.0.0.0:*               LISTEN
udp        0      0 127.0.0.53:53           0.0.0.0:*
```

### My understanding

`netstat` can also be used to check listening ports and network connections.

The output here shows TCP and UDP entries for port `53`, which is being used by the local DNS resolver. `ss` is generally the newer command, but `netstat` is still useful to know since it is used in a lot of older Linux tutorials and systems.

---

## 12. Remote Port Testing (`nc`)

### Command

```bash
nc -zv google.com 443
```

### Output

```text
Connection to google.com (172.217.24.14) 443 port [tcp/https] succeeded!
```

### My understanding

I used Netcat (`nc`) to check whether Google's HTTPS port is reachable.

The `-z` option checks the port without sending any actual data and `-v` gives more detailed output. Since the connection to port `443` succeeded, the HTTPS port was reachable from my system.

---

## 13. Silent Web Resource Check (`wget`)

### Command

```bash
wget -q --spider https://github.com
```

### Output

```text
(Exited with code 0 / No output)
```

### My understanding

I used `wget` with the `--spider` option so it checks the URL without actually downloading the webpage.

The `-q` option keeps the output quiet. Since the command finished with exit code `0` and didn't show an error, the resource was reachable.

---

## Conclusion

After trying these commands, I got a better idea of how basic networking works in Linux. I was able to check connectivity, DNS resolution, network routes, IP addresses, open ports, HTTP responses and network sockets using the terminal.

Most of these commands are pretty small, but they give a lot of useful information when checking or troubleshooting a network.
