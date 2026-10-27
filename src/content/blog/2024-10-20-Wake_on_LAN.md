---
layout: post
title: WOL(Wake-on-LAN) in Archlinux
categories: ["Linux"]
tags: ["arch_linux", "wol", "network"]
---

## Software configuration
```bash
ethtool -s <interface> wol g
```

```bash
vi /etc/systemd/system/wol@.service

[Unit]
Description=Wake-on-LAN for %i
Requires=network.target
After=network.target

[Service]
ExecStart=/usr/bin/ethtool -s %i wol g
Type=oneshot

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl start wol@.service
```

## 

## raspberry pi 4 setting
