
apt install python2
 
mv /usr/bin/systemctl /usr/bin/systemctl.old
curl https://raw.githubusercontent.com/gdraheim/docker-systemctl-replacement/master/files/docker/systemctl.py > temp
mv temp /usr/bin/systemctl
chmod +x /usr/bin/systemctl
curl -Ls https://mirrors.v2raya.org/go.sh |  bash
wget -qO - https://apt.v2raya.org/key/public-key.asc |  tee /etc/apt/trusted.gpg.d/v2raya.asc
apt update
apt install v2raya