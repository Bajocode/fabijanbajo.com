# KTHW - hcloud

```python
def knapsack(items, cap):
    m = len(items)
    n = cap

    for r in range(m):
        for c in range(n):
            print(f'hello {c+r}')
```


```go
package main

import (
        "fmt"
        "time"
)

func f(from string) {
        for i := 0; i < 3; i++ {
               fmt.Println(from, ":", i)
        }
}

func main() {
        f("direct")
        go f("goroutine")
        go func(msg string) {
               fmt.Println(msg)
        }("going")

        time.Sleep(time.Second)
        fmt.Println("done")
}

```

## Start

```shell
# create project, copy token, create context, create ssh
hcloud context create kthw && paste token
hcloud ssh-key create \
	--name kthw \
	--public-key-from-file=$HOME/Dropbox/dev/ssh/id_rsa.pub
```



## Provision

### Infrastructure

```shell
# network
{
  hcloud network create \
    --name kthw \
    --ip-range 10.240.0.0/24

	hcloud network add-subnet kthw \
    --network-zone eu-central \
    --ip-range 10.240.0.0/24 \
    --type server
}

# lb
{
  hcloud server create \
    --type cx11 \
    --name master-lb \
    --image ubuntu-16.04 \
    --ssh-key kthw \
    --location nbg1

  hc server attach-to-network masters-lb \
    --network kthw \
    --ip 10.240.0.30
}

# masters
for i in 0 1 2; do
  hcloud server create \
    --type cx11 \
    --name master-${i} \
    --image ubuntu-16.04 \
    --ssh-key kthw \
    --location nbg1
	
	hcloud server attach-to-network master-${i} \
	--network kthw \
	--ip 10.240.0.1${i}
done

# workers
for i in 0 1 2; do
  hcloud server create \
    --type cx21 \
    --name worker-${i} \
    --image ubuntu-16.04 \
    --ssh-key kthw \
    --location nbg1 \
    --label pod-cidr=10.200.${i}.0-24
	
	hcloud server attach-to-network worker-${i} \
	--network kthw \
	--ip 10.240.0.2${i}
done

# update OS for each instance
hc server ssh <all instances>
{
  apt-get update -y
  apt-get dist-upgrade -y
}

reboot
```

Check if you can ping each other

### Secure Access

```shell
# user
{
	adduser kthw
  usermod -aG sudo kthw

	cp -R ~/.ssh /home/kthw/
  chown -R kthw /home/kthw/.ssh
  
  exit
}

# validate
hc server ssh -u kthw <all>
exit

# disable basic auth
hc server ssh <all>
{
	sed -i "s/.*PasswordAuthentication.*/PasswordAuthentication no/g" /etc/ssh/sshd_config
	sed -i "s/.*PermitRootLogin.*/PermitRootLogin no/g" /etc/ssh/sshd_config
	
	systemctl reload ssh.service
}

# validate
hc server ssh master-lb
> root@88.99.226.131: Permission denied (publickey).
hc server ssh -u kthw <all>

```

### Tooling (optional)

```shell
sudo apt-get install wget curl git -y

# vim
{
	sudo apt-get install vim -y
	git clone --depth=1 https://github.com/amix/vimrc.git ~/.vim_runtime
	sh ~/.vim_runtime/install_awesome_vimrc.sh
}

# zsh & presets
{
	sudo apt-get install zsh -y
	
	sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
}

wget https://raw.githubusercontent.com/Bajocode/dot/master/sh -O - | bash && source ~/.bashrc
```



## Provisioning a CA and Generating TLS Certificates and user Accounts

```shell
# root ca
{
cat <<EOF > ca-csr.json
{
  "CN": "kubernetes-ca",
  "key": {
    "algo": "rsa",
    "size": 2048
  },
  "names": [
    {
      "C": "NL",
      "L": "Amsterdam",
      "O": "Kubernetes",
      "ST": "NH"
    }
  ]
}
EOF

cfssl gencert \
	-initca ca-csr.json | cfssljson \
	-bare ca
}

# intermediate ca's
{
cat <<EOF > kubernetes-ca-csr.json
{
  "CN": "kubernetes-ca",
  "key": {
    "algo": "rsa",
    "size": 2048
  },
  "names": [
    {
      "C": "NL",
      "L": "Amsterdam",
      "O": "Kubernetes",
      "ST": "NH"
    }
  ]
}
EOF
cat <<EOF > etcd-ca-csr.json
{
  "CN": "etcd-ca",
  "key": {
    "algo": "rsa",
    "size": 2048
  },
  "names": [
    {
      "C": "NL",
      "L": "Amsterdam",
      "O": "Kubernetes",
      "ST": "NH"
    }
  ]
}
EOF
cat <<EOF > ca-config.json
{
  "signing": {
    "default": { "expiry": "8760h" },
    "profiles": {
    	"kubernetes-ca": {
        "usages": [ "signing", "key encipherment", "server auth", "client auth" ],
        "ca_constraint": { "is_ca": true },
        "expiry": "8760h"
      },
      "etcd-ca": {
        "usages": [ "signing", "key encipherment", "server auth", "client auth" ],
        "ca_constraint": { "is_ca": true },
        "expiry": "8760h"
      }
    }
  }
}
EOF

for i in kubernetes etcd; do
  cfssl genkey \
    -initca ${i}-ca-csr.json | cfssljson \
    -bare ${i}-ca

  cfssl sign \
    -ca=ca.pem \
    -ca-key=ca-key.pem \
    -config=ca-config.json \
    -profile=${i}-ca \
    ${i}-ca.csr | cfssljson -bare ${i}-ca
done
}

# cluster config
cat <<EOF > cluster-config.json
{
  "signing": {
    "default": { "expiry": "8760h" },
    "profiles": {
    	"server": {
        "usages": [ "digital signature", "key encipherment", "server auth" ],
        "expiry": "8760h"
      },
    	"client": {
        "usages": [ "digital signature", "key encipherment", "client auth" ],
        "expiry": "8760h"
      },
    	"peer": {
        "usages": [ "digital signature", "key encipherment", "server auth", "client auth" ],
        "expiry": "8760h"
      }
    }
  }
}
EOF

# admin client: client certificate for cluster admins to authenticate to the API server
{
cat <<EOF > admin-csr.json
{
  "CN": "kubernetes-admin",
  "key": {
    "algo": "rsa",
    "size": 2048
  },
  "names": [
    {
      "C": "NL",
      "L": "Amsterdam",
      "O": "system:masters",
      "ST": "NH"
    }
  ]
}
EOF

cfssl gencert \
  -ca=kubernetes-ca.pem \
  -ca-key=kubernetes-ca-key.pem \
  -config=cluster-config.json \
  -profile=client \
  admin-csr.json | cfssljson -bare admin

kubectl config set-cluster kthw \
  --certificate-authority=kubernetes-ca.pem \
  --embed-certs=true \
  --server=https://127.0.0.1:6443 \
  --kubeconfig=admin.kubeconfig

kubectl config set-credentials admin \
  --client-certificate=admin.pem \
  --client-key=admin-key.pem \
  --embed-certs=true \
  --kubeconfig=admin.kubeconfig

kubectl config set-context default \
  --cluster=kthw \
  --user=admin \
  --kubeconfig=admin.kubeconfig

kubectl config use-context default --kubeconfig=admin.kubeconfig
}

# kubelet client: client certificates for kubelet to authenticate to the API server
for i in worker-0 worker-1 worker-2; do
cat <<EOF > ${i}-csr.json
{
  "CN": "system:node:${i}",
  "key": {
    "algo": "rsa",
    "size": 2048
  },
  "names": [
    {
      "C": "NL",
      "L": "Amsterdam",
      "O": "system:nodes",
      "ST": "NH"
    }
  ]
}
EOF

public_ip=$(hc server describe ${i} -o json | jq --raw-output '.public_net.ipv4.ip')
private_ip=$(hc server describe ${i} -o json | jq --raw-output '.private_net[0].ip')

cfssl gencert \
  -ca=kubernetes-ca.pem \
  -ca-key=kubernetes-ca-key.pem \
  -config=cluster-config.json \
  -profile=client \
  -hostname=${i},${public_ip},${private_ip} \
  ${i}-csr.json | cfssljson -bare ${i}
  
kubectl config set-cluster kthw \
  --certificate-authority=kubernetes-ca.pem \
  --embed-certs=true \
  --server=https://${public_ip}:6443 \
  --kubeconfig=${i}.kubeconfig

kubectl config set-credentials system:node:${i} \
  --client-certificate=${i}.pem \
  --client-key=${i}-key.pem \
  --embed-certs=true \
  --kubeconfig=${i}.kubeconfig

kubectl config set-context default \
  --cluster=kthw \
  --user=system:node:${i} \
  --kubeconfig=${i}.kubeconfig

kubectl config use-context default --kubeconfig=${i}.kubeconfig
done

# kube-controller-manager: client certificate/kubeconfig for the controller manager to talk to API server
{
cat <<EOF > kube-controller-manager-csr.json
{
  "CN": "system:kube-controller-manager",
  "key": {
    "algo": "rsa",
    "size": 2048
  },
  "names": [
    {
      "C": "NL",
      "L": "Amsterdam",
      "O": "system:kube-controller-manager",
      "ST": "NH"
    }
  ]
}
EOF

cfssl gencert \
  -ca=kubernetes-ca.pem \
  -ca-key=kubernetes-ca-key.pem \
  -config=cluster-config.json \
  -profile=client \
  kube-controller-manager-csr.json | cfssljson -bare kube-controller-manager
  
kubectl config set-cluster kthw \
  --certificate-authority=kubernetes-ca.pem \
  --embed-certs=true \
  --server=https://127.0.0.1:6443 \
  --kubeconfig=kube-controller-manager.kubeconfig

kubectl config set-credentials system:kube-controller-manager \
  --client-certificate=kube-controller-manager.pem \
  --client-key=kube-controller-manager-key.pem \
  --embed-certs=true \
  --kubeconfig=kube-controller-manager.kubeconfig

kubectl config set-context default \
  --cluster=kthw \
  --user=system:kube-controller-manager \
  --kubeconfig=kube-controller-manager.kubeconfig

kubectl config use-context default --kubeconfig=kube-controller-manager.kubeconfig
}

# kube-proxy: client certificate/kubeconfig for the kube proxy to talk to API server
{
api_public_ip=$(hc server describe master-lb -o json | jq --raw-output .public_net.ipv4.ip)

cat <<EOF > kube-proxy-csr.json
{
  "CN": "system:kube-proxy",
  "key": {
    "algo": "rsa",
    "size": 2048
  },
  "names": [
    {
      "C": "NL",
      "L": "Amsterdam",
      "O": "system:node-proxier",
      "ST": "NH"
    }
  ]
}
EOF

cfssl gencert \
  -ca=kubernetes-ca.pem \
  -ca-key=kubernetes-ca-key.pem \
  -config=cluster-config.json \
  -profile=client \
  kube-proxy-csr.json | cfssljson -bare kube-proxy
  
kubectl config set-cluster kthw \
  --certificate-authority=kubernetes-ca.pem \
  --embed-certs=true \
  --server=https://${api_public_ip}:6443 \
  --kubeconfig=kube-proxy.kubeconfig

kubectl config set-credentials system:kube-proxy \
  --client-certificate=kube-proxy.pem \
  --client-key=kube-proxy-key.pem \
  --embed-certs=true \
  --kubeconfig=kube-proxy.kubeconfig

kubectl config set-context default \
  --cluster=kthw \
  --user=system:kube-proxy \
  --kubeconfig=kube-proxy.kubeconfig

  kubectl config use-context default --kubeconfig=kube-proxy.kubeconfig
}

# kube-scheduler: client certificate/kubeconfig for the scheduler to talk to apiserver
{
cat <<EOF > kube-scheduler-csr.json
{
  "CN": "system:kube-scheduler",
  "key": {
    "algo": "rsa",
    "size": 2048
  },
  "names": [
    {
      "C": "NL",
      "L": "Amsterdam",
      "O": "system:kube-scheduler",
      "ST": "NH"
    }
  ]
}
EOF

cfssl gencert \
  -ca=kubernetes-ca.pem \
  -ca-key=kubernetes-ca-key.pem \
  -config=cluster-config.json \
  -profile=client \
  kube-scheduler-csr.json | cfssljson -bare kube-scheduler

kubectl config set-cluster kthw \
  --certificate-authority=kubernetes-ca.pem \
  --embed-certs=true \
  --server=https://127.0.0.1:6443 \
  --kubeconfig=kube-scheduler.kubeconfig

kubectl config set-credentials system:kube-scheduler \
  --client-certificate=kube-scheduler.pem \
  --client-key=kube-scheduler-key.pem \
  --embed-certs=true \
  --kubeconfig=kube-scheduler.kubeconfig

kubectl config set-context default \
  --cluster=kthw \
  --user=system:kube-scheduler \
  --kubeconfig=kube-scheduler.kubeconfig

kubectl config use-context default --kubeconfig=kube-scheduler.kubeconfig
}

# apiserver: server certificate for the API server endpoint
{
api_public_ip=$(hc server describe master-lb -o json | jq --raw-output .public_net.ipv4.ip)
hostnames=kubernetes,kubernetes.default,kubernetes.default.svc,kubernetes.default.svc.cluster,kubernetes.svc.cluster.local

cat <<EOF > kube-apiserver-csr.json
{
  "CN": "kube-apiserver",
  "key": {
    "algo": "rsa",
    "size": 2048
  },
  "names": [
    {
      "C": "NL",
      "L": "Amsterdam",
      "O": "Kubernetes",
      "ST": "NH"
    }
  ]
}
EOF

cfssl gencert \
  -ca=kubernetes-ca.pem \
  -ca-key=kubernetes-ca-key.pem \
  -config=cluster-config.json \
  -profile=server \
  -hostname=10.32.0.1,10.240.0.10,10.240.0.11,10.240.0.12,${api_public_ip},127.0.0.1,${hostnames} \
  kube-apiserver-csr.json | cfssljson -bare kube-apiserver
}

# kube-apiserver: client certificate for the API server to talk to kubelets
{
cat <<EOF > kube-apiserver-kubelet-client-csr.json
{
  "CN": "kube-apiserver-kubelet-client",
  "key": {
    "algo": "rsa",
    "size": 2048
  },
  "names": [
    {
      "C": "NL",
      "L": "Amsterdam",
      "O": "system:masters",
      "ST": "NH"
    }
  ]
}
EOF

cfssl gencert \
  -ca=kubernetes-ca.pem \
  -ca-key=kubernetes-ca-key.pem \
  -config=cluster-config.json \
  -profile=client \
  kube-apiserver-kubelet-client-csr.json | cfssljson -bare kube-apiserver-kubelet-client
}

# kube-etcd-peer: client certificate for the API server to talk to etcd
{
cat <<EOF > kube-apiserver-etcd-client-csr.json
{
  "CN": "kube-apiserver-etcd-client",
  "key": {
    "algo": "rsa",
    "size": 2048
  },
  "names": [
    {
      "C": "NL",
      "L": "Amsterdam",
      "O": "system:masters",
      "ST": "NH"
    }
  ]
}
EOF

cfssl gencert \
  -ca=etcd-ca.pem \
  -ca-key=etcd-ca-key.pem \
  -config=cluster-config.json \
  -profile=client \
  kube-apiserver-etcd-client-csr.json | cfssljson -bare kube-apiserver-etcd-client
}

# sa: public/private key pair for service account management
{
cat <<EOF > sa-csr.json
{
  "CN": "service-accounts",
  "key": {
    "algo": "rsa",
    "size": 2048
  },
  "names": [
    {
      "C": "NL",
      "L": "Amsterdam",
      "O": "Kubernetes",
      "ST": "NH"
    }
  ]
}
EOF

cfssl gencert \
  -ca=kubernetes-ca.pem \
  -ca-key=kubernetes-ca-key.pem \
  -config=cluster-config.json \
  -profile=peer \
  sa-csr.json | cfssljson -bare sa
}

# etcd server: server certificate for the etcd server endpoint
cat <<EOF > etcd-server-csr.json
{
  "CN": "kube-etcd",
  "key": {
    "algo": "rsa",
    "size": 2048
  },
  "names": [
    {
      "C": "NL",
      "L": "Amsterdam",
      "O": "Kubernetes",
      "ST": "NH"
    }
  ]
}
EOF

cfssl gencert \
  -ca=etcd-ca.pem \
  -ca-key=etcd-ca-key.pem \
  -config=cluster-config.json \
  -profile=peer \
  -hostname=localhost,127.0.0.1,10.240.0.10,10.240.0.11,10.240.0.12 \
  etcd-server-csr.json | cfssljson -bare etcd-server
}

# etcd peer: peer (server to server) certificate for the etcd server endpoint
{
cat <<EOF > etcd-peer-csr.json
{
  "CN": "kube-etcd-peer",
  "key": {
    "algo": "rsa",
    "size": 2048
  },
  "names": [
    {
      "C": "NL",
      "L": "Amsterdam",
      "O": "Kubernetes",
      "ST": "NH"
    }
  ]
}
EOF

cfssl gencert \
  -ca=etcd-ca.pem \
  -ca-key=etcd-ca-key.pem \
  -config=cluster-config.json \
  -profile=peer \
 	-hostname=localhost,127.0.0.1,10.240.0.10,10.240.0.11,10.240.0.12 \
  etcd-peer-csr.json | cfssljson -bare etcd-peer
}
```

```shell
# distribute pki to masters 
for i in master-0 master-1 master-2; do
  public_ip=$(hc server describe ${i} -o json | jq --raw-output '.public_net.ipv4.ip')
  scp \
    kubernetes-ca.pem kubernetes-ca-key.pem \
    kube-apiserver-key.pem kube-apiserver.pem \
    sa-key.pem sa.pem \
    kube-apiserver-kubelet-client.pem kube-apiserver-kubelet-client-key.pem \
    kube-apiserver-etcd-client.pem kube-apiserver-etcd-client-key.pem \
    etcd-ca.pem etcd-ca-key.pem \
    etcd-server.pem etcd-server-key.pem \
    etcd-peer.pem etcd-peer-key.pem \
    admin.kubeconfig \
    kube-controller-manager.kubeconfig \
    kube-scheduler.kubeconfig \
    kthw@${public_ip}:~/
done

# distribute pki to workers
for i in worker-0 worker-1 worker-2; do
  	public_ip=$(hc server describe ${i} -o json | jq --raw-output '.public_net.ipv4.ip')
  	scp \
  		kubernetes-ca.pem kubernetes-ca-key.pem \
  		${i}.pem ${i}-key.pem \
      kube-proxy.kubeconfig \
      ${i}.kubeconfig \
    	kthw@${public_ip}:~/
	done
```



## Generating the Data Encryption Config and Key

```shell
{
encryption_key=$(head -c 32 /dev/urandom | base64)

cat <<EOF > encryption-config.yaml
kind: EncryptionConfig
apiVersion: v1
resources:
- resources:
    - secrets
  providers:
  - aescbc:
      keys:
      - name: key1
        secret: ${encryption_key}
  - identity: {}
EOF

for i in master-0 master-1 master-2; do
  public_ip=$(hc server describe ${i} -o json | jq --raw-output '.public_net.ipv4.ip')
  scp encryption-config.yaml kthw@${public_ip}:~/
done
}
```



## Bootstrapping the etcd Cluster

```shell
# binary
{
	wget -q --show-progress --https-only --timestamping \
  "https://github.com/etcd-io/etcd/releases/download/v3.4.0/etcd-v3.4.0-linux-amd64.tar.gz"
  tar -xvf etcd-v3.4.0-linux-amd64.tar.gz
  sudo mv etcd-v3.4.0-linux-amd64/etcd* /usr/local/bin/
  rm -rf etcd-v3.4.0-linux-amd64*
}

# pki
{
  sudo mkdir -p /etc/kubernetes/pki/etcd
  sudo mv etcd*pem /etc/kubernetes/pki/etcd
}

# current master
{
	etcd_name=$HOST
	private_ip=$(hostname -I | awk '{print $2}')
}

# service
{
cat <<EOF | sudo tee /etc/systemd/system/etcd.service
[Unit]
Description=etcd
Documentation=https://github.com/coreos

[Service]
Type=notify
ExecStart=/usr/local/bin/etcd \\
  --name ${etcd_name} \\
  --cert-file=/etc/kubernetes/pki/etcd/etcd-server.pem \\
  --key-file=/etc/kubernetes/pki/etcd/etcd-server-key.pem \\
  --peer-cert-file=/etc/kubernetes/pki/etcd/etcd-peer.pem \\
  --peer-key-file=/etc/kubernetes/pki/etcd/etcd-peer-key.pem \\
  --trusted-ca-file=/etc/kubernetes/pki/etcd/etcd-ca.pem \\
  --peer-trusted-ca-file=/etc/kubernetes/pki/etcd/etcd-ca.pem \\
  --peer-client-cert-auth \\
  --client-cert-auth \\
  --initial-advertise-peer-urls https://${private_ip}:2380 \\
  --listen-peer-urls https://${private_ip}:2380 \\
  --listen-client-urls https://${private_ip}:2379,https://127.0.0.1:2379 \\
  --advertise-client-urls https://${private_ip}:2379 \\
  --initial-cluster-token etcd-cluster-0 \\
  --initial-cluster master-0=https://10.240.0.10:2380,master-1=https://10.240.0.11:2380,master-2=https://10.240.0.12:2380 \\
  --initial-cluster-state new \\
  --data-dir=/var/lib/etcd
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
}

# start
{
	sudo systemctl daemon-reload
	sudo systemctl enable etcd
	sudo systemctl start etcd
}
```



## Control Plane

```shell
# kube-apiserver
cat <<EOF | sudo tee /etc/systemd/system/kube-apiserver.service
[Unit]
Description=Kubernetes API Server
Documentation=https://github.com/kubernetes/kubernetes

[Service]
ExecStart=/usr/local/bin/kube-apiserver \\
  --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname \\ 
  --advertise-address=${INTERNAL_IP} \\
  --allow-privileged=true \\
  --apiserver-count=3 \\
  --audit-log-maxage=30 \\
  --audit-log-maxbackup=3 \\
  --audit-log-maxsize=100 \\
  --audit-log-path=/var/log/audit.log \\
  --authorization-mode=Node,RBAC \\
  --bind-address=0.0.0.0 \\
  --client-ca-file=/var/lib/kubernetes/ca.pem \\
  --enable-admission-plugins=NamespaceLifecycle,NodeRestriction,LimitRanger,ServiceAccount,DefaultStorageClass,ResourceQuota \\
  --etcd-cafile=/var/lib/kubernetes/ca.pem \\
  --etcd-certfile=/var/lib/kubernetes/kubernetes.pem \\
  --etcd-keyfile=/var/lib/kubernetes/kubernetes-key.pem \\
  --etcd-servers=https://10.240.0.10:2379,https://10.240.0.11:2379,https://10.240.0.12:2379 \\
  --event-ttl=1h \\
  --encryption-provider-config=/var/lib/kubernetes/encryption-config.yaml \\
  --kubelet-certificate-authority=/var/lib/kubernetes/ca.pem \\
  --kubelet-client-certificate=/var/lib/kubernetes/kubernetes.pem \\
  --kubelet-client-key=/var/lib/kubernetes/kubernetes-key.pem \\
  --kubelet-https=true \\
  --runtime-config=api/all \\
  --service-account-key-file=/var/lib/kubernetes/service-account.pem \\
  --service-cluster-ip-range=10.32.0.0/24 \\
  --service-node-port-range=30000-32767 \\
  --tls-cert-file=/var/lib/kubernetes/kubernetes.pem \\
  --tls-private-key-file=/var/lib/kubernetes/kubernetes-key.pem \\
  --v=2
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# Frontend Load Balancer
{
  sudo add-apt-repository ppa:vbernat/haproxy-1.8
  sudo apt-get update
  sudo apt-get install haproxy
}
{
cat << EOF >> /etc/haproxy/haproxy.cfg
frontend lb
    bind 88.99.226.131:6443
    option tcplog
    mode tcp
    default_backend masters

backend masters
    mode tcp
    balance roundrobin
    option tcp-check
    server master0 10.240.0.10:6443 check
    server master1 10.240.0.11:6443 check
    server master2 10.240.0.12:6443 check
EOF

	haproxy -c -f /etc/haproxy/haproxy.cfg
}
{
  systemctl daemon-reload
  systemctl start haproxy.service
  systemctl enable haproxy.service
}
```



## Bootstrapping the Kubernetes Worker Nodes

- ```shell
  # swapoff
  sudo swapoff -a`
  
  # forward traffic between the nodes and pods
  {
    cat <<EOF | tee sudo > /etc/sysctl.d/k8s.conf
    net.bridge.bridge-nf-call-ip6tables = 1
    net.bridge.bridge-nf-call-iptables = 1
    net.ipv4.ip_forward = 1
    EOF
    
    sysctl --system
  }
  ```

- https://github.com/kelseyhightower/kubernetes-the-hard-way/blob/master/docs/09-bootstrapping-kubernetes-workers.md



## Kubectl Remote Access

https://github.com/kelseyhightower/kubernetes-the-hard-way/blob/master/docs/10-configuring-kubectl.md



## Provisioning Pod Network Routes

https://github.com/kelseyhightower/kubernetes-the-hard-way/blob/master/docs/11-pod-network-routes.md

```shell
{
  for i in 0 1 2; do
    hc network add-route kthw --gateway 10.240.0.2${i} --destination 10.200.${i}.0/24
  done
}
```



## Fire Walls

```shell
# lb
{
	ufw allow 22/tcp
	ufw allow 6443/tcp
	ufw default deny incoming
	ufw enable
}
# master
{
	ufw allow 22/tcp
	ufw allow 6443/tcp from 10.240.0.0/24
	ufw allow in on ens10 from 10.240.0.0/24
	ufw default deny incoming
	ufw enable
}
# worker
{
  ufw allow 22/tcp
  ufw allow in on cnio0 from 10.200.0.0/16
  ufw default deny incoming
  ufw enable
}
```



## DNS

https://github.com/kelseyhightower/kubernetes-the-hard-way/blob/master/docs/12-dns-addon.md



## Smoke Test

https://github.com/kelseyhightower/kubernetes-the-hard-way/blob/master/docs/13-smoke-test.md



## Cleaning up

Remove the project online
