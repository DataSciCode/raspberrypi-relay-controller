# hammerhead-provisioning

This is the repository containing an Ansible playbook for provisioning [TBD]

# Instructions

## Setup Arch Linux ARM on Raspberry Pi

1. Prepare SD Card with [these instructions](https://archlinuxarm.org/platforms/armv6/raspberry-pi) (run sync after `mv root/boot/* boot` and before umount)
2. Insert SD Card into Pi and boot

## Setup DNS/DHCP

1. Setup DDNS domain on freedns.afraid.org
2. In LAN Router (Tomato) at http://192.168.1.1
 - Go to Status > Device List and find device with name `alarmpi`
 - Click `[static]` (redirects to Basic > Static DHCP/ARP/IPT) and configure a static IP of 192.168.1.12
 - Go to Basic > DDNS and setup FreeDNS DDNS update with correct Token for domain
 - Go to Port Forwarding config and map external port 81 to internal 192.168.1.12:3900

## Pre-provisioning

1. `ssh alarm@[IP from device list]` (password: alarm)
2. `su root` (password: root)
3. `mkdir ~/.ssh`
4. `curl -o ~/.ssh/authorized_keys https://github.com/bradyholt.keys`
5. `reboot`

## Provisioning

1. Ensure Ansible 2.2 is installed
2. `provision.sh` (ansible-vault password located in LastPass > Secure Notes > Applications Secrets > "goblin ansible-vault")
3. Manual insync configuration - After provisioning is complete, insync needs to be configured manually since it cannot be automated.
   1. Go to [https://goo.gl/jv797S](https://goo.gl/jv797S), login with the [john.doe@gmail.com] account and get an auth code.
   2. Run `insync add_account -a [auth_token_just_obtained_above] -p '{{insync_sync_directory}}`
   3. Run `insync manage_selective_sync john.doe@gmail.com`
   4. Type `^X` and then selected "Uncheck all".
   5. Navigate down to "Movies" and use the `Space` key to select it.
   6. Use the `Tab` key until "OK" is selected.  Use `Enter` key to save and exit.

To only update the vistaicm-server hooks, you can run `copy-hooks.sh`.
